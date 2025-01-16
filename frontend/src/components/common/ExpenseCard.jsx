import React, { useReducer, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { message } from "antd";
import { MdDateRange } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import { FaMinus } from "react-icons/fa";
import { deleteTransaction } from "../../Services/transactionService";
import { useNavigate } from "react-router-dom";
import { categoryIcons } from "./CategoricalIcons";
import { FaEllipsisH } from "react-icons/fa";

const initialState = { transactionItems: [] };
const reducer = (state, action) => {
  switch (action.type) {
    case "Transactions_Loaded":
      return { ...state, transactionItems: action.payload };
    default:
      return state;
  }
};

const ExpenseCard = ({selection, onOpen, deleteModelOpened, deletingTransactionId}) => {

  const [state,dispatch] = useReducer(reducer,initialState);
  const {transactionItems} = state
  const [selectedTransactionDelete, setSelectedTransactionDelete] = useState();
  const navigate = useNavigate();
  const handleDelete = async (transactionID) => {
    deleteModelOpened(transactionID);
  };
  

  const handleEdit = async () => {
    onOpen(selection);
  };

  return (
    <>
    <tr className="flex md:w-full w-[600px] bg-white border-y-[1px] p-2 shadow-[0_4px_9px_-4px_#9e9e9e] border-gray-200 text-black rounded-xl">
      <td className="flex flex-col w-[35%] pl-1 bg-white backdrop-blur-sm rounded-l justify-start items-start ">
        <div className="font-bold text-center text-wrap text-[12px] md:text-[16px]">{selection.name}</div>
        <div className="font-semibold text-center text-wrap text-[10px] md:text-[14px] text-subText">{selection.note}</div>
      </td>
      <td className="flex w-[20%]  bg-white justify-start text-wrap items-center pl-1 font-semibold text-center text-[10px] md:text-[14px]">
        {categoryIcons[selection.category] || <FaEllipsisH className={`${selection.type === "Income"? " text-[#00d0c2]": " text-[#EF854B]"} `}/>}&nbsp; {selection.category}
      </td>
      <td className="flex w-[15%] bg-white justify-start pl-0.5 md:p-1 gap-0.5 md:gap-1 items-center font-semibold text-center text-[8px] md:text-[14px]">
        <MdDateRange />{selection.date}
      </td>
      <td  className={`flex w-[15%] ${(selection.type === "Income")?"text-[#00d0c2]": "text-[#EF854B]"} bg-white justify-start pl-1 gap-1 items-center font-bold text-center text-[10px] md:text-[14px]`} >
      {selection.type === "Income"? <TiPlus />: <FaMinus />} Rs.{selection.amount}
      </td>
      <td className="flex w-[15%]  gap-0.5 md:gap-2 bg-white justify-center rounded-r items-center font-semibold text-center text-[0.8rem]">
        <button type="submit" className="bg-transparent items-center rounded-full justify-center focus:ring-4 focus:outline-none hover:shadow-md focus:bg-slate-600 p-1 md:p-2 text-white font-extrabold text-sm md:text-xl"
          onClick={() => handleDelete(selection.transactionId)}
          >
          <FaXmark style={{ color: '#ff0000cf' }}/>
        </button>
        <button type="submit" className=" items-center justify-center rounded-full focus:ring-4 focus:outline-none hover:shadow-md focus:bg-slate-600 p-1 md:p-2 text-white font-extrabold text-sm md:text-xl"
         onClick={handleEdit}
        >
          <FaEdit style={{ color: '#334050' }}/>
        </button>
      </td>
    </tr>
    </>
  );
};
export default ExpenseCard;