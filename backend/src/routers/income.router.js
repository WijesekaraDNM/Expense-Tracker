import React, { useEffect, useState } from "react";
import { message } from "antd";
import { addTransaction, updateTransaction } from "../../Services/transactionService";
import { useLocation } from "react-router-dom";

const TransactionForm = ({selection}) => {
  const location = useLocation();
  const { type } = location.state || { type: "" };
  
  const [formData, setFormData] = useState({
    transactionId: "",
    name: "",
    date: "",
    category: "",
    amount: 0,
    note: "",
    type:type
  });

  const backgroundColor = type === "Income" ? "bg-incomeBC" : "bg-expenseBC";
  const backgroundColor2 = type === "Income" ? "bg-blurBC" : "bg-goldenHover";
  const borderColor = type === "Income" ? "border-incomeBC" : "border-expenseBC";
  const textColor = type === "Income" ? "text-[black]" : "text-[white]";

  useEffect(
    () => {
      if (selection) {
        setFormData({
          transactionId: selection.transactionId || "",
          type: selection.type || type,
          name: selection.name || "",
          date: selection.date || "",
          category: selection.category || "",
          amount: selection.amount || 0,
          note: selection.note || ""
        });
      }else if (type) {
        setFormData(prevData => ({
          ...prevData,
          type: type
        }));
      }
      console.log("selection type:", formData.type);
    },
    [selection,type]
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
    if (!formData.name || !formData.date || !formData.amount || !formData.category) {
      message.error("Missing required fields");
      return;
    } else {
      try {
        const response = addTransaction({...formData});
        console.log("Form submitted succedded: ", response.data);
        message.success("Transaction is added!");
        setFormData({
          name: "",
          date: "",
          category: "",
          amount: 0,
          note: "",
          type:""
        });
        
      } catch (error) {
        console.error("Error submitting form:", error);
        message.error("Failed to add transaction!");
      }
    }
  };
  const handleEdit = async e => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.amount || !formData.category) {
      message.error("Missing required fields");
      return;
    } else {
      try {
        const response = updateTransaction( formData.transactionId,
          {
            name: formData.name,
            date: formData.date,
            category: formData.category,
            amount: formData.amount,
            note: formData.note,
            type: formData.type
          }
        );
        console.log("Form update succeeded: ", response.data);
        setFormData({
          ...formData
        });
        message.success("Transaction is updated!");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error("Error updating form:", error);
        message.error("Failed to update the transaction!");
      }
    }
  };

  const handleTag = tag => {
    console.log("Tag clicked:", tag);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="flex border-[2px] border-[black] rounded">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
         
        >
          &times;
        </button>
          <form className={`${backgroundColor2} border-[3px] border-golden shadow-lg rounded-[20px] m-5 text-gray-900 font-semibold text-base`}>
            <div className="flex flex-col p-5">
              <div className=" flex w-full h-72 shadow-md justify-end rounded-t-[20px] opacity-100 items-end bg-credit-card bg-cover bg-center">
                <h1 className={`flex shadow-md ${backgroundColor} ${textColor} justify-between font-bold px-5 py-3 w-full`} >
                  <span className="text-2xl bg-transparent md:text-2xl w-full ">
                    Enter Your {formData.type}
                  </span>
                  <button className=" py-1  px-5 border-[2px] border-golden shadow-sm hover:shadow-golden hover:shadow-md rounded" onClick={selection? handleEdit: handleSubmit}>
                     {selection? "Update": "Insert"}
                  </button>
                </h1>
              </div>
              <div className="flex flex-col gap-2  m-5 mt-5">
                <div className="flex relative flex-row items-center justify-start  px-3">
                  <label htmlFor="name" className="block mx-1 my-2 w-[20%] ">
                    Transaction Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block p-2.5 mx-3 w-[60%] text-gray-600 bg-gray-100 focus:bg-white focus:border-[#C4896F] hover:bg-white text-sm rounded-lg border-b-4 ${borderColor} border-[1px]`}
                  />
                </div>
                <div className="flex relative flex-row items-center justify-start px-3">
                  <label htmlFor="date" className="block mx-1 w-[20%] my-2 ">Date</label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`block p-2.5 w-[40%] mx-3 border-b-4 text-sm text-gray-600 bg-gray-100 focus:bg-white ${borderColor} hover:bg-white rounded-lg border-[1px]`}
                  />
                </div>
                <div className="flex relative flex-row items-center justify-start px-3">
                  <label htmlFor="amount" className="block mx-1 w-[20%] my-2 ">Amount</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className={`block p-2.5 w-[40%] mx-3 border-b-4  text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg ${borderColor} border-[1px]`}
                  />
                </div>
                <div className="flex relative flex-row items-center justify-start px-3">
                  <label htmlFor="category" className="block mx-1 my-2 w-[20%]">Category</label>
                  <select 
                    value={formData.category} 
                    id="category"
                    name="category"
                    onChange={handleChange}
                    className={`block p-2.5 mx-3 border-b-4 w-[60%] text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg ${borderColor} border-[1px]`}>
                    <option>None</option>
                    <option>Salary</option>
                    <option>Freelance</option>
                    <option>Bonus and Commissions</option>
                    <option>Business Investments</option>
                  </select>
                </div>
                <div className="flex relative flex-row items-center justify-start px-3">
                  <label htmlFor="note" className="block mx-1 my-2 w-[20%]">Note</label>
                  <textarea
                    type="textarea"
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    className={`block p-2.5 w-[60%] mx-3 border-b-4 text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg ${borderColor} border-[1px]`}
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
