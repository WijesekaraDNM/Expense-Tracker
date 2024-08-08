import React, { useEffect, useState, useReducer } from "react";

const Income = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 bg-black ">
      <div className=" bg-incomeBC" >
        <div className="px-16 pt-10">
          {/* {<BackButton href={"/controller/volunteering"} header={"Back"} />} */}
        </div>
        <div className="px-5">
          <form className="bg-green-50 border-[3px] border-golden shadow-lg rounded-[20px] m-10 text-gray-900 font-semibold text-base">
            <div className="flex flex-col p-5">
                <div className=" flex w-full h-80 shadow-md justify-end rounded-t-[20px] opacity-90 items-end bg-voucher bg-cover bg-center">
                    <h1 className="flex shadow-md bg-incomeBC font-bold px-5 py-3 w-full ">
                        <span className="text-2xl md:text-2xl text-black  ">
                            Enter Your Expenses
                        </span>
                    </h1>
                </div>
                <div className="flex flex-col gap-2  m-5 mt-10">
                  <div className="flex relative flex-row items-center justify-start  px-3">
                    <label className="block mx-1 my-2 w-[20%] ">
                      Income Name
                    </label>
                    <input
                      type="text"
                      id="incomeName"
                      className="block p-2.5 mx-3 w-[60%] text-gray-600 bg-gray-100 focus:bg-white focus:border-[#C4896F] hover:bg-white text-sm rounded-lg border-b-4 border-incomeBC border-[1px]"
                    >
                      {/* {incomeName} */}
                    </input>
                  </div>
                  <div className="flex relative flex-row items-center justify-start px-3">
                    <label className="block mx-1 w-[20%] my-2 ">Date</label>
                    <input
                      type="date"
                      id="date"
                      className="block p-2.5 w-[40%] mx-3 border-b-4 text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg border-incomeBC border-[1px]"
                    >
                      {/* {" "}{date} */}
                    </input>
                  </div>
                  <div className="flex relative flex-row items-center justify-start px-3">
                    <label className="block mx-1 w-[20%] my-2 ">Amount</label>
                    <input
                      type="number"
                      id="amount"
                      className="block p-2.5 w-[40%] mx-3 border-b-4  text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg border-incomeBC border-[1px]"
                    >
                      {/* {" "}{amount} */}
                    </input>
                  </div>
                  <div className="flex relative flex-row items-center justify-start px-3">
                    <label className="block mx-1 my-2 w-[20%]">Category</label>
                    <select className="block p-2.5 mx-3 border-b-4 w-[60%] text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg border-incomeBC border-[1px]">
                        <option>None</option>
                      <option>Salary</option>
                      <option>Freelance</option>
                      <option>Bonus and Commissions</option>
                      <option>Business Investments</option>
                    </select>

                    {/* {" "}{category} */}
                  </div>
                  <div className="flex relative flex-row items-center justify-start px-3">
                    <label className="block mx-1 my-2 w-[20%]">Note</label>
                    <textarea
                      type="textarea"
                      id="Note"
                      className="block p-2.5 w-[60%] mx-3 border-b-4 text-sm text-gray-600 bg-gray-100 focus:bg-white hover:bg-white rounded-lg border-incomeBC border-[1px]"
                    >
                      {/* {" "}{note} */}
                    </textarea>
                  </div>
                </div>
                
              </div>
          </form>
        </div>
      </div>
      <div>
        <div className=" w-full h-full ">Display</div>
      </div>
    </div>
  );
};

export default Income;
