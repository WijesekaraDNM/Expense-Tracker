import React, { useEffect, useState } from "react";
import { message } from "antd";
import {
  addTransaction,
  getCategories,
  updateTransaction
} from "../../Services/transactionService";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FaXmark } from "react-icons/fa6";
import "./../../index.css";
import { categoryIcons } from "./CategoricalIcons";
import { CATEGORIES } from "./CategoricalIcons";
import { FaEllipsisH, FaPlus } from "react-icons/fa";

const TransactionForm = ({ Selection, type, onClose, onAddEdit }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [categories, setCategories] = useState();
  const [filteredCategories, setFilteredCategories] = useState();
  const [isPopupMenuOpened, setIsPopupMenuOpened] = useState(true);
  const [istransactionAddEdit, setIstransactionAddEdit] = useState(false);
  const [isIncomeCardPressed, setIsIncomeCardPressed] = useState(false);
  const [isExpenseCardPressed, setIsExpenseCardPressed] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const handleCategorySelect = category => {
    setSelectedCategory(category);
    setFormData(prev => ({ ...prev, category }));
  };
  const [formData, setFormData] = useState({
    transactionId: "",
    user: userId,
    name: "",
    date: "",
    category: "",
    amount: 0,
    note: "",
    type: type || Selection.type
  });

  const backgroundColor =
    formData.type === "Income" ? "bg-[#00d0c2]" : "bg-[#EF854B]";
  const backgroundColor2 = formData.type === "Income" ? "bg-white" : "bg-white";
  const borderColor =
    formData.type === "Income" ? "border-[#00d0c2]" : "border-[#EF854B]";
  const textColor =
    formData.type === "Income" ? "text-[white]" : "text-[white]";
  const shadow =
    formData.type === "Income"
      ? "focus:shadow-neutral-500"
      : "focus:shadow-neutral-500";
  const focusBorder =
    formData.type === "Income"
      ? "focus:border-[#00d0c2]"
      : "focus:border-[#EF854B]";

  useEffect(
    () => {
      if (Selection) {
        setFormData({
          transactionId: Selection.transactionId || "",
          user: Selection.user || userId,
          type: Selection.type || "",
          name: Selection.name || "",
          date: Selection.date || "",
          category: Selection.category || "",
          amount: Selection.amount || 0,
          note: Selection.note || ""
        });
        setSelectedCategory(Selection.category);
      } else if (type) {
        setFormData(prevData => ({
          ...prevData,
          type: type
        }));
      }
      const loadCategories = getCategories(userId);
      loadCategories.then(categoriesData => {
        setIncomeCategories(categoriesData.income);
        setExpenseCategories(categoriesData.expense);
      });
      if (formData.type === "Income") {
        setCategories([...CATEGORIES.income, ...CATEGORIES.other]);
      } else if (formData.type === "Expense") {
        setCategories([...CATEGORIES.expense, ...CATEGORIES.other]);
      }
    },
    [Selection, type, userId]
  );

  useEffect(
    () => {
      if (istransactionAddEdit) {
        onAddEdit();
        // Reset istransactionAddEdit after operation
        setIstransactionAddEdit(false);
      }
    },
    [istransactionAddEdit]
  );

  const handleChange = e => {
    const { name, value, id } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    // Validate the field
    const fieldError = validateForm(id, value);

    setErrors(prev => {
      // If no error for this field, remove it from the errors object
      if (!fieldError[id]) {
        const { [id]: _, ...rest } = prev; // Exclude the current field's error
        return rest;
      }
      // Otherwise, update the error for this field
      return { ...prev, ...fieldError };
    });
  };

  const validateForm = (name, value) => {
    const errors = {};
    switch (name) {
      case "name":
        if (!value.trim()) {
          errors.name = "Name is required.";
        } else if (value.length < 3 || value.length > 50) {
          errors.name = "Name must be between 3 and 50 characters.";
        }
        break;

      case "date":
        if (!value.trim()) {
          errors.date = "Date is required.";
        } else if (isNaN(new Date(value).getTime())) {
          errors.date = "Invalid date format.";
        } else if (new Date(value) > new Date()) {
          errors.date = "Date cannot be in the future.";
        }
        break;

      case "category":
        if (!value.trim()) {
          errors.category = "Select the category or add new one.";
        }
        break;

      case "amount":
        if (!value) {
          errors.amount = "Amount is required.";
        } else if (isNaN(value)) {
          errors.amount = "Amount must be a valid number.";
        }
        break;

      case "note":
        if (value.length > 200) {
          errors.note = "Note cannot exceed 200 characters.";
        }
        break;

      default:
        break;
    }
    return errors;
  };

  const validateFormData = formData => {
    const errors = {};

    Object.keys(formData).forEach(field => {
      const fieldErrors = validateForm(field, formData[field]);
      if (fieldErrors[field]) {
        errors[field] = fieldErrors[field];
      }
    });

    return errors;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const errors = validateFormData(formData);
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      message.error("Please correct the highlighted errors.");
      return;
    }

    if (
      !formData.name ||
      !formData.date ||
      !formData.amount ||
      !formData.category
    ) {
      message.error("Missing required fields");
      return;
    } else {
      try {
        const response = await addTransaction({ ...formData });
        setFormData({
          name: "",
          date: "",
          category: "",
          amount: 0,
          note: "",
          type: type || Selection.type
        });
        setTimeout(() => {
          setIstransactionAddEdit(true);
          message.success("Transaction is added!");
          onClose();
        }, 500);
      } catch (error) {
        message.error("Failed to add transaction!");
      }
    }
  };

  const handleEdit = async e => {
    e.preventDefault();

    const errors = validateFormData(formData);
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      message.error("Please correct the highlighted errors.");
      return;
    }

    if (
      !formData.name ||
      !formData.date ||
      !formData.amount ||
      !formData.category
    ) {
      message.error("Missing required fields");
      return;
    } else {
      try {
        await updateTransaction(formData.transactionId, {
          user: formData.user,
          name: formData.name,
          date: formData.date,
          category: formData.category,
          amount: formData.amount,
          note: formData.note,
          type: formData.type
        });
        setFormData({
          name: "",
          date: "",
          category: "",
          amount: 0,
          note: "",
          type: Selection.type
        });
        setTimeout(() => {
          setIstransactionAddEdit(true);
          message.success("Transaction is updated!");
          onClose();
        }, 500);
      } catch (error) {
        //console.error("Error updating form:", error);
        message.error("Failed to update the transaction!");
      }
    }
  };

  const closePopup = () => {
    setIsPopupMenuOpened(false);
    setIsIncomeCardPressed(false);
    setIsExpenseCardPressed(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const updatedCategories =
      formData.type === "Income"
        ? [...incomeCategories, newCategoryName]
        : [...expenseCategories, newCategoryName];
    if (formData.type === "Income") setIncomeCategories(updatedCategories);
    else setExpenseCategories(updatedCategories);
    setNewCategoryName("");
    setFilteredCategories();
    setIsFilterOpened(false);
    setShowAddCategoryModal(false);
  };

  const handleNewCategoyAddModelClose = () => {
    setShowAddCategoryModal(false);
    setNewCategoryName("");
    setFilteredCategories();
    setIsFilterOpened(false);
  };

  const handleCategoryNaming = e => {
    const { value } = e.target;
    setNewCategoryName(value);
    setIsFilterOpened(true);
    if (value.trim() === "") {
      setFilteredCategories(categories); // Reset to original categories if input is empty
    } else {
      const filtered = categories.filter(category =>
        category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
    //console.log("Filtered categories :", categories);
  };
  useEffect(
    () => {
      // Reset filteredCategories when the categories list changes
      if (categories) setCategories(categories);
    },
    [categories]
  );

  return (
    <div className="fixed inset-0 z-50 overflow-auto py-5 flex items-center bg-transparent justify-center">
      <div className="flex w-[90%] md:w-[35%] rounded-2xl">
        <form
          className={`${backgroundColor2} border-[3px] w-full border-golden shadow-lg rounded-3xl pb-5 text-gray-900 font-semibold text-base`}
        >
          <div className="flex items-end justify-end w-full">
            <button
              onClick={onClose}
              className=" w-10 h-10 text-gray-600 hover:text-[#4B71F0]"
            >
              <FaXmark />
            </button>
          </div>
          <div className="flex flex-col px-5">
            <div className=" flex w-full justify-between rounded-t-[20px] opacity-100 items-end ">
              <h1
                className={`flex shadow-md ${backgroundColor} ${textColor} justify-between rounded-3xl font-bold px-5 py-3 w-full`}
              >
                <span className="lg:text-lg bg-transparent text-md w-full ">
                  Enter {formData.type}
                </span>
                <button
                  className="flex text-sm lg:text-md  border-[2px] p-2 h-8 text-center border-white shadow-sm items-center hover:shadow-white hover:shadow rounded-xl"
                  onClick={Selection ? handleEdit : handleSubmit}
                >
                  {Selection ? "Update" : "Insert"}
                </button>
              </h1>
            </div>
            <div className="flex flex-col text-sm lg:text-md gap-2 m-2 mt-5">
              <label htmlFor="name" className=" text-black">
                Select category
              </label>
              <div className="grid grid-cols-4 gap-4 mt-4 ">
                {(formData.type === "Income"
                  ? incomeCategories
                  : expenseCategories).map((category, index) =>
                  <div
                    key={index}
                    onClick={() => handleCategorySelect(category)}
                    className={`flex flex-col items-center cursor-pointer p-2 rounded-lg ${selectedCategory ===
                    category
                      ? "bg-blue-200"
                      : "bg-gray-100"} hover:bg-blue-100`}
                  >
                    {categoryIcons[category] ||
                      <FaEllipsisH
                        style={{ color: "#999", width: 24, height: 24 }}
                      />}
                    <span className="text-xs mt-2 text-wrap text-center">
                      {category}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="flex flex-col items-center justify-center cursor-pointer p-2 rounded-lg bg-gray-100 hover:bg-blue-100"
                >
                  <FaPlus style={{ color: "#999", width: 24, height: 24 }} />
                  <span className="text-xs mt-2">Add New</span>
                </button>
              </div>
              {errors.category &&
                <p className="text-red-500 text-xs mt-1 mb-2">
                  {errors.category}
                </p>}
              <div className="relative my-1">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={"Name of the transaction"}
                  className={`peer m-0 block h-[58px] border ${shadow} ${errors.name
                    ? "border-red-500"
                    : "border-golden"} border-solid  w-full rounded-xl bg-transparent bg-clip-padding px-3 py-4 text-base font-normal text-neutral-700 placeholder:text-transparent ${focusBorder} focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                />
                `}
                />
                <label
                  htmlFor="name"
                  className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
                >
                  Transaction Name
                </label>
                {errors.name &&
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name}
                  </p>}
              </div>
              <div className="flex md:flex-row flex-col justify-between gap-2 ">
                <div className="relative my-1 w-full">
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    placeholder="Add the date"
                    required
                    className={`peer m-0 block h-[58px] border ${shadow} ${errors.date
                      ? "border-red-500"
                      : "border-golden"} border-solid ${focusBorder}  w-full rounded-xl bg-transparent bg-clip-padding px-3 py-4 text-base font-normal text-neutral-700 placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                   `}
                  />
                  <label
                    htmlFor="date"
                    className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
                  >
                    Date
                  </label>
                  {errors.date &&
                    <p className="text-red-500 text-xs mt-1">
                      {errors.date}
                    </p>}
                </div>
                <div className="relative my-1 w-full">
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    min={0}
                    onInput={e => {
                      let value = e.target.value;
                      if (value < 0) value = 0; // Ensure minimum value is 0
                      e.target.value = value;
                      handleChange(e); // Update the form data
                    }}
                    required
                    onChange={handleChange}
                    placeholder="Amount of transaction"
                    className={`peer m-0 block h-[58px] border ${shadow} ${errors.amount
                      ? "border-red-500"
                      : "border-golden"} border-solid ${focusBorder} w-full rounded-xl bg-transparent bg-clip-padding px-3 py-4 text-base font-normal text-neutral-700 placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                  `}
                  />
                  <label
                    htmlFor="amount"
                    className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
                  >
                    Amount (Rs.)
                  </label>
                  {errors.amount &&
                    <p className="text-red-500 text-xs mt-1">
                      {errors.amount}
                    </p>}
                </div>
              </div>

              <div className="relative my-1">
                <textarea
                  type="textarea"
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Note"
                  className={`peer m-0 block h-[58px] border ${shadow} ${errors.note
                    ? "border-red-500"
                    : "border-golden"} border-solid ${focusBorder} w-full rounded-xl bg-transparent bg-clip-padding px-3 py-4 text-base font-normal text-neutral-700 placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                `}
                />
                <label
                  htmlFor="note"
                  className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none  "
                >
                  Note
                </label>
                {errors.note &&
                  <p className="text-red-500 text-xs mt-1">
                    {errors.note}
                  </p>}
              </div>
            </div>
          </div>
        </form>
      </div>
      {showAddCategoryModal &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-3">Add New Category</h3>
            <input
              type="text"
              className="border p-2 w-full rounded"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={handleCategoryNaming}
            />
            {isFilterOpened &&
              <div
                onClick={e => setNewCategoryName(e.target.value)}
                className="bg-gray-100 inset-0 z-50 overflow-auto h-60 text-[black]"
              >
                {filteredCategories.map((category, index) =>
                  <option
                    key={index}
                    className="text-black cursor-pointer hover:bg-gray-200 focus:bg-gray-200"
                  >
                    {category}
                  </option>
                )}
              </div>}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleNewCategoyAddModelClose}
                className="mr-3 text-red-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>}
    </div>
  );
};

export default TransactionForm;
