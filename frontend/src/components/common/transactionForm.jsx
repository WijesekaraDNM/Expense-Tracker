import React, { useEffect, useState } from "react";
import { message } from "antd";
import {
  addTransaction,
  getCategories,
  updateTransaction
} from "../../Services/transactionService";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// const initialState = { transactionItems: [] };
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "Transactions_Loaded":
//       return { ...state, transactionItems: action.payload };
//     case 'Transactions_Added':
//       return {...state, transactionItems: [...state.transactionItems, action.payload]};
//     case 'Transactions_Updated':
//         return {...state, transactionItems:  action.payload};
//     default:
//       return state;
//   }
// };

const TransactionForm = ({ selection }) => {
  const location = useLocation();
  // const [state,dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { type } = location.state || { type: "" };
  const { Selection } = location.state || { Selection: "" };
  const [categories, setCategories] = useState({ income: [], expense: [] });

  const [formData, setFormData] = useState({
    transactionId: "",
    user:userId,
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
    formData.type === "Income" ? "bg-blurBC" : "bg-goldenHover";
  const borderColor =
    formData.type === "Income" ? "border-incomeBC" : "border-expenseBC";
  const textColor =
    formData.type === "Income" ? "text-[black]" : "text-[white]";

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
      const loadCategories = getCategories();
      loadCategories.then(categoriesData => {
        setCategories(categoriesData);
      });
      // dispatch({
      //   type: "Contacts_Loaded",
      //   payload: selection,
      // });
    },
    [Selection, type, userId]
  );

  // useEffect(() => {
  //   const loadAllTransactions = getTransactions();

  //   loadAllTransactions.then(contactItems => {
  //     dispatch({ type: 'Contacts_Loaded', payload: contactItems })
  //   })
  // },
  //   [selectedDepartment]
  // );

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

        // if(type){
        //   dispatch({
        //     type: "Transactions_Added",
        //     payload: response.data,
        //   });
        // }else{
        //   window.location.reload();
        // }
        setFormData({
          name: "",
          date: "",
          category: "",
          amount: 0,
          note: "",
          type: ""
        });
        message.success("Transaction is added!");
        setTimeout(() => {
          navigate(-1);
          //window.location.reload();
        }, 1000);
        
        
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
          name: formData.name,
          date: formData.date,
          category: formData.category,
          amount: formData.amount,
          note: formData.note,
          type: formData.type
        });
        console.log("Form update succeeded: ", formData.note);
        // if(Selection){
        //   dispatch({
        //     type: "Transactions_Updated",
        //     payload: response.data,
        //   });
        // }else{
        //   window.location.reload();
        // }
        setFormData({
          ...formData
        });
        message.success("Transaction is updated!");
        setTimeout(() => {
          //window.location.reload();
          navigate(-1);
        }, 1000);
      } catch (error) {
        console.error("Error updating form:", error);
        message.error("Failed to update the transaction!");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center bg-[#ababab] justify-center">
      <div className="flex w-[40%] backdrop:blur-3xl bg-white2/3 shadow-2xl rounded-2xl">
        <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          &times;
        </button>
        <form
          className={`${backgroundColor2} border-[3px] w-full border-golden shadow-lg rounded-2xl m-5 text-gray-900 font-semibold text-base`}
        >
          <div className="flex flex-col p-5">
            <div className=" flex w-full h-72 shadow-md justify-end rounded-t-[20px] opacity-100 items-end bg-credit-card bg-cover bg-center">
              <h1
                className={`flex shadow-md ${backgroundColor} ${textColor} justify-between font-bold px-5 py-3 w-full`}
              >
                <span className="text-2xl bg-transparent md:text-2xl w-full ">
                  Enter Your {formData.type}
                </span>
                <button
                  className=" py-1  px-5 border-[2px] border-white shadow-sm hover:shadow-white hover:shadow-md rounded"
                  onClick={Selection ? handleEdit : handleSubmit}
                >
                  {Selection ? "Update" : "Insert"}
                </button>
              </h1>
            </div>
            <div className="flex flex-col gap-2 m-2 mt-5">
              <div className="flex relative flex-row items-center justify-start px-3">
                <label htmlFor="name" className="block mx-1 my-2 w-[30%] ">
                  Transaction Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block p-2 mx-3 w-[60%] h-10 text-gray-600 bg-gray-100 focus:bg-white focus:border-[#C4896F] hover:bg-white text-sm rounded-lg border-b-4 ${borderColor} border-[1px]`}
                />
              </div>
              <div className="flex relative flex-row items-center justify-start px-3">
                <label htmlFor="date" className="block mx-1 w-[30%] my-2 ">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`block p-2 w-[30%] mx-3 border-b-4 text-sm h-10 text-gray-600 bg-gray-100 focus:bg-white ${borderColor} hover:bg-white rounded-lg border-[1px]`}
                />
              </div>
              <div className="flex relative flex-row items-center justify-start px-3">
                <label htmlFor="amount" className="block mx-1 w-[30%] my-2 ">
                  Amount (Rs.)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`block p-2 w-[40%] mx-3 border-b-4 h-10 text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg ${borderColor} border-[1px]`}
                />
              </div>
              <div className="flex relative flex-row items-center justify-start px-3">
                <label htmlFor="category" className="block mx-1 my-2 w-[30%]">
                  Category
                </label>
                <select
                  value={formData.category}
                  id="category"
                  name="category"
                  onChange={handleChange}
                  className={`block p-2 mx-3 border-b-4 w-[40%] h-10 text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg ${borderColor} border-[1px]`}
                >
                  <option value="" disabled>
                    None
                  </option>
                  {formData.type === "Income"
                    ? categories.income.map((element, index) =>
                        <option key={index} value={element}>
                          {element}
                        </option>
                      )
                    : categories.expense.map((element, index) =>
                        <option
                          className="focus:bg-goldenHover text-sm md:text-md"
                          key={index}
                          value={element}
                        >
                          {element}
                        </option>
                      )}
                </select>
              </div>
              <div className="flex relative flex-row items-center justify-start px-3">
                <label htmlFor="note" className="block mx-1 my-2 w-[30%]">
                  Note
                </label>
                <textarea
                  type="textarea"
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  className={`block p-2 w-[60%] mx-3 border-b-4 text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg ${borderColor} border-[1px]`}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
