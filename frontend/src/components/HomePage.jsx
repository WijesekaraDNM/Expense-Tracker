import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import TransactionPage from "./transactionPage";
import Dashboard from "./dashboard";

const HomePage = () => {
  const { logout } = useAuth();
  const [startingDate, setStartingDate] = useState();
  const [endingDate, setEndingDate] = useState();
  const transactionPageRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [databaseUpdate,setDatabaseUpdate] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  const handleLogout = async e => {
    e.preventDefault();
    await logout();
  };

  const handleScrollToTransactionPage = () => {
    if (transactionPageRef.current) {
      transactionPageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDatabaseUpdate = () => {
    //setDatabaseUpdate(prevState => !prevState);
    setDatabaseUpdate(prevState => !prevState);
    console.log("HomaPage transactionadd:", databaseUpdate);
  };

  return (
    <>
      <div className="flex flex-col w-full h-full bg-white mb-2 pb-2">
        <div className="w-[100%] lg:w-[70%] self-end relative rounded-l-full end-0 px-5 py-3 flex items-center justify-between mt-3 mb-2 bg-expenseBC">
          <div className="flex ">
            <img src="/logo2.png" alt="" className=" h-16 left-0" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleScrollToTransactionPage} className="flex justify-center rounded items-center w-full h-8 text-white text-2xl p-2 focus:outline focus:shadow-incomeBC focus:test-gray-500 bg-transparent focus:border-white focus:bg-gray-transparent hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-incomeBC focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out "
            >
              Add Transactions 
            </button> 
            <div className="flex relative items-center">
              <div className=" w-full text-md text-gray-50">Hello {userName}!</div>
              <button
              onClick={handleLogout}
              className="flex justify-center rounded items-center w-36 h-8 text-white focus:outline focus:shadow-incomeBC p-3 focus:test-gray-500 bg-transparent border border-solid border-golden focus:border-white focus:bg-gray-transparent shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-incomeBC focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out "
              >
                logout
              </button>
            </div>
          </div>
        </div>
        <Dashboard setLocalStartingDate={setStartingDate} setLocalEndingDate={setEndingDate} databaseUpdate = {handleDatabaseUpdate}/>
      </div>
      <div className="bg-white">
        <TransactionPage ref={transactionPageRef} startingDate={startingDate} endingDate={endingDate} databaseUpdate={handleDatabaseUpdate}/>
      </div>
    </>
    
  );
};
export default HomePage;
