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
import './../../index.css';


const TransactionForm = ({ Selection, type, onClose, onAddEdit }) => {
  const location = useLocation();
  // const [state,dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const { userId } = useAuth();
  // const { type } = location.state || { type: "" };
  // const { Selection } = location.state || { Selection: "" };
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [categories, setCategories] = useState();
  const [isPopupMenuOpened, setIsPopupMenuOpened] = useState(true);
  const [istransactionAddEdit, setIstransactionAddEdit] = useState(false);
  const [isIncomeCardPressed, setIsIncomeCardPressed] = useState(false);
  const [isExpenseCardPressed, setIsExpenseCardPressed] = useState(false);

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
    formData.type === "Income" ? "bg-incomeBC" : "bg-expenseBC";
  const backgroundColor2 =
    formData.type === "Income" ? "bg-white" : "bg-white";
  const borderColor =
    formData.type === "Income" ? "border-incomeBC" : "border-expenseBC";
  const textColor =
    formData.type === "Income" ? "text-[black]" : "text-[white]";
    const shadow =
    formData.type === "Income" ? "focus:shadow-incomeBC" : "focus:shadow-expenseBC";

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
      } else if (type) {
        setFormData(prevData => ({
          ...prevData,
          type: type
        }));
      }
      console.log("userId in transactionForm:", userId);
      const loadCategories = getCategories(userId);
      loadCategories.then(categoriesData => {
        setIncomeCategories(categoriesData.income);
        setExpenseCategories(categoriesData.expense);
        console.log("category", categoriesData);
      });
    },
    [Selection, type, userId]
  );

  useEffect(
    () => {
      if (istransactionAddEdit) {
        if (onAddEdit) {
          onAddEdit();
        }
        // Reset istransactionAddEdit after operation
        setIstransactionAddEdit(false);
      }
    },
    [istransactionAddEdit, onAddEdit]
  );

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
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
        const response = addTransaction({ ...formData });
        console.log("Form submitted succedded: ", response.data);
        message.success("Transaction is added!");

        setIstransactionAddEdit(!`istransactionAddEdit`);    
        setTimeout(() => {
          //window.location.reload();
          setFormData({
            name: "",
            date: "",
            category: "",
            amount: 0,
            note: "",
            type: type || Selection.type
          });
          onClose();
          // onTransactionComplete();
        }, 5000);
        //window.location.reload();
      } catch (error) {
        console.error("Error submitting form:", error);
        message.error("Failed to add transaction!");
      }
    }
  };
  const handleEdit = async e => {
    e.preventDefault();
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
        updateTransaction(formData.transactionId, {
          user: formData.user,
          name: formData.name,
          date: formData.date,
          category: formData.category,
          amount: formData.amount,
          note: formData.note,
          type: formData.type
        });
        console.log("Form update succeeded: ", formData.note);
        // setFormData({
        //   ...formData
        // });
        message.success("Transaction is updated!");
        setIstransactionAddEdit(!istransactionAddEdit);
        setTimeout(() => {
          // onTransactionComplete();
          setFormData({
            name: "",
            date: "",
            category: "",
            amount: 0,
            note: "",
            type: type || Selection.type
          });
          onClose();
        }, 5000);
        //window.location.reload();
      } catch (error) {
        console.error("Error updating form:", error);
        message.error("Failed to update the transaction!");
      }
    }
  };

  const closePopup = () => {
    setIsPopupMenuOpened(false);
    setIsIncomeCardPressed(false);
    setIsExpenseCardPressed(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center bg-transparent justify-center">
      <div className="flex w-[90%] md:w-[60%] rounded-2xl">
        <button
          onClick={onClose}
          className="absolute w-10 h-10 top-2 right-2 text-blurBC hover:text-white"
        >
          <FaXmark />
        </button>

        <form className={`${backgroundColor2} grid lg:grid-cols-2 grid-cols-1 border-[3px] w-full border-golden shadow-lg rounded-lg m-5 text-gray-900 font-semibold text-base`}
        >
          <div className={`${backgroundColor} h-full hidden rounded-l lg:flex flex-col gap-2 justify-center items-center p-10`}>
            <img src="./incomeBC.png" alt=""/>
            <p className={` font-sans text-sm ${textColor}`}>Add the detailed information of your transaction...</p>
          </div>
          <div className="flex flex-col p-5">
            <div className=" flex w-full shadow-md justify-between rounded-t-[20px] opacity-100 items-end= ">
              <h1
                className={`flex shadow-md ${backgroundColor} ${textColor} justify-between font-bold px-5 py-3 w-full`}
              >
                <span className="lg:text-lg bg-transparent text-md w-full ">
                  Enter {formData.type}
                </span>
                <button
                  className="flex text-sm lg:text-md  border-[2px] p-2 h-8 text-center border-white shadow-sm items-center hover:shadow-white hover:shadow-md rounded"
                  onClick={Selection ? handleEdit : handleSubmit}
                >
                  {Selection ? "Update" : "Insert"}
                </button>
              </h1>
            </div>
            <div className="flex flex-col text-sm lg:text-md gap-2 m-2 mt-5">
              <div className="relative my-1">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={"Name of the transaction"}
                  className={`peer m-0 block h-[58px] border-[1px] focus:shadow-md ${shadow} border-solid border-golden w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-expenseBC focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                />
                `}
                />
                <label
                  htmlFor="name"
                  className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
                >
                  Transaction Name
                </label>
              </div>
             
              <div className="relative my-1">
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="Add the date"
                  className={`peer m-0 block h-[58px] border-[1px] focus:shadow-md ${shadow} border-solid border-golden w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-expenseBC focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                   `}
                />
                <label
                  htmlFor="date"
                  className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
                >
                  Date
                </label>
              </div>
              <div className="relative my-1">
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Amount of transaction"
                  className={`peer m-0 block h-[58px] border-[1px] focus:shadow-md ${shadow} border-solid border-golden w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-expenseBC focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                  `}
                />
                <label
                  htmlFor="amount"
                  className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
                >
                  Amount (Rs.)
                </label>
              </div>

              <div className="relative my-1">
                <input
                  list="categories"
                  value={formData.category}
                  id="category"
                  name="category"
                  onChange={handleChange}
                  placeholder="Select or type a category"
                  className={`peer m-0 block h-[58px] border-[1px] focus:shadow-md ${shadow} border-solid border-golden w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-expenseBC focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                `}
                />
                <datalist id="categories">
                  {formData.type === "Income"
                    ? incomeCategories.map((element, index) =>
                        <option key={index} value={element}>
                          {element}
                        </option>
                      )
                    : expenseCategories.map((element, index) =>
                        <option key={index} value={element}>
                          {element}
                        </option>
                      )}
                </datalist>
                <label
                  htmlFor="category"
                  className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
                >
                  Category
                </label>
              </div>
              <div className="relative my-1">
                <textarea
                  type="textarea"
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Note"
                  className={`peer m-0 block h-[58px] border-[1px] focus:shadow-md ${shadow} border-solid border-golden w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-expenseBC focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]
                `}
                />
                <label
                  htmlFor="note"
                  className="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
                >
                  Note
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
