import React from "react";
import { FaXmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

export const ExpenseCard = ({name, note, date, amount, category}) => {
  return (
    <tr className="flex w-full bg-gray-400 border-[1px] border-slate-400 text-black">
      <td className="flex flex-col w-[40%] p-2 m-[1px] pl-3 bg-red-50 rounded justify-start items-start ">
        <div className="font-bold text-center text-[0.9rem]">{name}</div>
        <div className="font-semibold text-center text-[0.8rem] text-subText">{note}</div>
      </td>
      <td className="flex w-[15%] p-2 m-[1px] bg-red-50 justify-start rounded items-center font-semibold text-center text-[0.8rem]">
        {category}
      </td>
      <td className="flex w-[15%] p-2 m-[1px] bg-red-50 justify-start rounded items-center font-semibold text-center text-[0.8rem]">
        {date}
      </td>
      <td className="flex w-[15%] p-2 m-[1px] bg-red-50 justify-start rounded items-center font-semibold text-center text-[0.8rem]">
        {amount}
      </td>
      <td className="flex w-[15%] p-2 m-[1px] gap-2  bg-red-50 justify-center rounded items-center font-semibold text-center text-[0.8rem]">
        <button type="submit" className="bg-red-600 shadow-[gray] shadow-md rounded-lg items-center justify-center focus:ring-4 focus:outline-none hover:bg-[red] focus:bg-slate-600 p-2 text-white font-semibold text-sm md:text-xl">
          <FaXmark/>
        </button>
        <button type="submit" className="bg-golden shadow-[gray] shadow-md rounded-lg items-center justify-center focus:ring-4 focus:outline-none hover:bg-yellow-600 focus:bg-slate-600 p-2 text-white font-semibold text-sm md:text-xl">
          <FaEdit/>
        </button>
      </td>
    </tr>
  );
};
