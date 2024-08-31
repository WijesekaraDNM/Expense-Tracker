import React, { useReducer } from "react";
import { FaXmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { message } from "antd";
import { MdDateRange } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import { FaMinus } from "react-icons/fa";
import { deleteTransaction } from "../../Services/transactionService";
import { useNavigate } from "react-router-dom";

const initialState = { transactionItems: [] };
const reducer = (state, action) => {
  switch (action.type) {
    case "Transactions_Loaded":
      return { ...state, transactionItems: action.payload };
    default:
      return state;
  }
};

const ExpenseCard = ({selection, onDelete, onOpen}) => {

  const [state,dispatch] = useReducer(reducer,initialState);
  const {transactionItems} = state
  const navigate = useNavigate();


  // useEffect(() =>{
  //   dispatch({
  //     type: "Transactions_Loaded",
  //     payload: selection,
  //   });
  // },[selection]);

  const handleDelete = async (transactionID) => {
    try {
      await deleteTransaction(transactionID);
      console.log("deleted", transactionID);
      dispatch({
        type: "Transactions_Loaded",
        payload: transactionItems.filter((item) => item.transactionId !== transactionID),
        
      });
      if (onDelete) onDelete(transactionID);
      message.success("Successfully deleted the transaction!")
      setTimeout(() => {
        
      }, 1000);
      //window.location.reload();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      message.error("Deletion failed!")
    }
  };
  const handleEdit = async () => {
    // navigate("/Form", { state:{Selection:selection}})
    // console.log("Update selection:", selection)
    onOpen(selection);
  };

  return (
    <tr className="flex md:w-full w-[600px] bg-gray-300 border-[1px] p-1 border-slate-400 text-black">
      <td className="flex flex-col w-[40%] pl-1 bg-white backdrop-blur-sm rounded-l justify-start items-start ">
        <div className="font-bold text-center text-wrap text-[12px] md:text-[16px]">{selection.name}</div>
        <div className="font-semibold text-center text-wrap text-[10px] md:text-[14px] text-subText">{selection.note}</div>
      </td>
      <td className="flex w-[15%]  bg-white justify-start text-wrap items-center pl-1 font-semibold text-center text-[10px] md:text-[14px]">
        {selection.category}
      </td>
      <td className="flex w-[15%] bg-white justify-start pl-0.5 md:p-1 gap-0.5 md:gap-1 items-center font-semibold text-center text-[8px] md:text-[14px]">
        <MdDateRange />{selection.date}
      </td>
      <td  className={`flex w-[15%] ${(selection.type === "Income")?"text-incomeAmount": "text-expenseAmount"} bg-white justify-start pl-1 gap-1 items-center font-bold text-center text-[10px] md:text-[14px]`} >
      {selection.type === "Income"? <TiPlus />: <FaMinus />} Rs.{selection.amount}
      </td>
      <td className="flex w-[15%]  gap-0.5 md:gap-2 bg-white justify-center rounded-r items-center font-semibold text-center text-[0.8rem]">
        <button type="submit" className="bg-red-600 shadow-[gray] shadow-md rounded-lg items-center justify-center focus:ring-4 focus:outline-none hover:bg-[red] focus:bg-slate-600 p-1 md:p-2 text-white font-semibold text-sm md:text-xl"
          onClick={() => handleDelete(selection.transactionId)}
          >
          <FaXmark/>
        </button>
        <button type="submit" className="bg-expenseBC shadow-[gray] shadow-md rounded-lg items-center justify-center focus:ring-4 focus:outline-none hover:bg-expenseHover focus:bg-slate-600 p-1 md:p-2 text-white font-semibold text-sm md:text-xl"
         onClick={handleEdit}
        >
          <FaEdit/>
        </button>
      </td>
    </tr>
  );
};
export default ExpenseCard;