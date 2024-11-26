// import React, { useState, useRef, useEffect } from "react";
// import { useAuth } from "../hooks/useAuth";
// import TransactionPage from "./transactionPage";
// import Dashboard from "./dashboard";
// import Button from '@mui/material/Button';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

// const HomePage = () => {
//   const { logout } = useAuth();
//   const [startingDate, setStartingDate] = useState();
//   const [endingDate, setEndingDate] = useState();
//   const transactionPageRef = useRef(null);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [databaseUpdate,setDatabaseUpdate] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const { userId } = useAuth();
//   const { userName } = useAuth();


//   const handleLogout = async e => {
//     e.preventDefault();
//     await logout();
//   };

//   const handleScrollToTransactionPage = () => {

//     if (transactionPageRef.current) {
//       transactionPageRef.current.scrollIntoView({
//         behavior: 'smooth', // for smooth scrolling
//         block: 'start'      // scroll to the top of the element
//       });
//     }
//   };

//   const handleDatabaseUpdate = () => {
//     //setDatabaseUpdate(prevState => !prevState);
//     setDatabaseUpdate(prevState => !prevState);
//     console.log("HomaPage transactionadd:", databaseUpdate);
//   };

//   return (
//     <>
//       <div className="flex flex-col w-full h-full bg-white mb-2 pb-2">
//         <div className="w-[100%] lg:w-[70%] self-end relative rounded-l-full end-0 px-5 py-3 flex items-center justify-between mt-3 mb-2 bg-expenseBC">
//           <div className="flex ">
//             <img src="/logo2.png" alt="" className=" md:h-16 left-0 h-12 " />
//           </div>
//           <div className="flex gap-2">
//             <button onClick={handleScrollToTransactionPage} className="md:flex justify-center rounded items-center hidden  w-full h-8 text-white text-lg p-2 focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_#BDCDCC,0_4px_18px_0_#B5C6C5] transition duration-150 ease-in-out "
//             >
//               Add Transactions 
//             </button> 
//             <div className="flex relative items-center">
//               {/* <div className=" w-full text-md text-gray-50">Hello {userName}!</div>
//               <button
//               onClick={handleLogout}
//               className="flex justify-center rounded items-center w-36 h-8 text-white focus:outline focus:shadow-incomeBC p-3 focus:test-gray-500 bg-transparent border border-solid border-golden focus:border-white focus:bg-gray-transparent shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-incomeBC focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out "
//               >
//                 logout
//               </button> */}
//                <PopupState variant="popover" popupId="demo-popup-menu">
//                   {(popupState) => (
//                     <React.Fragment>
//                       <Button variant="contained"  {...bindTrigger(popupState)} sx={{backgroundColor: '#00DDA2', color: '#FFFFF', '&:hover': {backgroundColor: '#00E7B1', }, boxShadow: "#B5C6C5", padding:{sm:"2px 5px", md:"4px 15px"}, fontWeight:"bold", textTransform: "none" }}>
//                         Hello!&nbsp;<span className="text-[#334050]">{' '} {userName}</span>
//                       </Button>
//                       <Menu {...bindMenu(popupState)}>
//                         <MenuItem onClick={handleScrollToTransactionPage}>Transactions</MenuItem>
//                         <MenuItem onClick={popupState.close}>Themes</MenuItem>
//                         <MenuItem onClick={handleLogout}>Logout</MenuItem>
//                       </Menu>
//                     </React.Fragment>
//                   )}
//                 </PopupState>
//             </div>
//           </div>
//         </div>
//         <Dashboard setLocalStartingDate={setStartingDate} setLocalEndingDate={setEndingDate} databaseUpdate = {handleDatabaseUpdate}/>
//       </div>
//       <div className="bg-white" id="transactionPage" ref={transactionPageRef}>
//         <TransactionPage  startingDate={startingDate} endingDate={endingDate} databaseUpdate={handleDatabaseUpdate}/>
//       </div>
//     </>
    
//   );
// };
// export default HomePage;

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import TransactionPage from "./transactionPage";
import Dashboard from "./dashboard";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import TransactionForm from "./common/transactionForm";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import  "./../index.css";
import { Flex } from "antd";
import { endOfYesterday, format, isYesterday } from "date-fns";
import { BorderColor } from "@mui/icons-material";
import { FaXmark } from "react-icons/fa6";

const HomePage = () => {
  const { logout } = useAuth();
  const [startingDate, setStartingDate] = useState(null);
  const [endingDate, setEndingDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const transactionPageRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [databaseUpdate,setDatabaseUpdate] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { userId } = useAuth();
  const { userName } = useAuth();
  const [isPopupWindowOpened,setIsPopupWindowOpened]= useState(false);
  const [isDatabaseUpdated,setIsDatabaseUpdated] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupSelection, setPopupSelection] = useState();
  const leftElementRef = useRef(null);
  const rightElementRef = useRef(null);
  const [isMaximized, setIsMaximized] = useState(false); 
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [displayText, setDisplayText] = useState("");
  const text = "Select a Date Range & get more Information"; // Your desired text

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(interval);
      }
    }, 350); // Adjust typing speed by changing the interval value (in milliseconds)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);


  const handleLogout = async e => {
    e.preventDefault();
    await logout();
  };

  const handleScrollToTransactionPage = () => {

    if (transactionPageRef.current) {
      transactionPageRef.current.scrollIntoView({
        behavior: 'smooth', // for smooth scrolling
        block: 'start'      // scroll to the top of the element
      });
    }
  };

  const handleDatabaseUpdate = () => {
    //setDatabaseUpdate(prevState => !prevState);
    if(isDatabaseUpdated){
      setDatabaseUpdate(prevState => !prevState);
    };
    isDatabaseUpdated(false);
    console.log("HomaPage transactionadd:", databaseUpdate);
  };

  const handleIncomeCard = () => {
    setIsPopupWindowOpened(true);
    setPopupType("Income");
    //navigate("/Form", { state: { type: "Income" } });
  };

  const handleExpenseCard = () => {
    setIsPopupWindowOpened(true);
    setPopupType("Expense");
    //navigate("/Form", { state: { type: "Expense" } });
  };
  const closePopupWindow = () => {
    setIsPopupWindowOpened(false);
    setPopupSelection(null);
  };
  const handleTransactionAddEdit = async () => {
    setIsDatabaseUpdated(true);
    console.log("transactionAdded:transactionpage: ", isDatabaseUpdated);
    // const updatedTransactions = await getTransactions(userId, { startingDate, endingDate });
    // dispatch({ type: "Transactions_Loaded", payload: updatedTransactions });
  };
  const handlePopupSelection = (e) => {
    setPopupSelection(e);
    setIsPopupWindowOpened(true);
  };

  const handleStartingDate = e => {
    setStartingDate(e.target.value);
  };
  const handleEndingDate = e => {
    setEndingDate(e.target.value);
  };

  const handleMaximizeToggle = () => {
    setIsMaximized(!isMaximized);
    console.log("homeToggle:",isMaximized);
  };
  // useEffect(() => {
  //   if (isDatabaseUpdated) {
  //     databaseUpdate();
  //     // Reset istransactionAddEdit after operation
  //   }
  //   console.log("transactionPage added1:", isDatabaseUpdated);
  //   setIsDatabaseUpdated(false);
  // }, [isMaximized]);
  const handleDateRange = (e) =>{
    const selectedRage = e.target.value;
    setSelectedRange(selectedRage);
    let startingDate = null;
    let endingDate = null;
    const today = new Date();
    switch(selectedRage){
      case "anyTime":{
        startingDate = null;
        endingDate= null;
        break;
      }
      case "today":{
        startingDate =new Date();
        endingDate= new Date();
        break;
      };
      case "yesterday":{
        // Set both startDate and endDate to yesterday
        startingDate = new Date(today);
        startingDate.setDate(today.getDate() - 1);
        endingDate = new Date(startingDate);
        break;
      };
      case "lastWeek":{
        startingDate = new Date(today);
        startingDate.setDate(today.getDate() - today.getDay());

        // Set end date to the last day of the current week (e.g., Saturday)
        endingDate = new Date(today);
        endingDate.setDate(today.getDate() + (6 - today.getDay()));
        break;};
      case "lastMonth":{
        // Set start date to the first day of the current month
        startingDate = new Date(today.getFullYear(), today.getMonth(), 1);

        // Set end date to the last day of the current month
        endingDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      };
      case "lastSixMonths":{
        startingDate = new Date(today);
        startingDate.setMonth(today.getMonth() - 6);

        // End date: today
        endingDate = new Date(today);
        break;
      };
      case "lastYear":{
        // Set start date to the first day of the current year
        startingDate = new Date(today.getFullYear(), 0, 1);

        // Set end date to the last day of the current year
        endingDate = new Date(today.getFullYear(), 11, 31);
        break;
      };
      case "custom":{
        setIsCustomSelected(true);
        break;
      };
      default:
            console.error("Invalid range type provided!");
            return;
    }
    setStartingDate(startingDate);
    setEndingDate(endingDate);
  }

  return (
    <div className="bg-back min-h-screen w-full bg-cover">
  <div className="flex flex-col lg:flex-row lg:h-full w-full">
    {/* Sidebar */}
    <div className="lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-1/5 bg-expenseBC flex flex-col items-center py-5">
      {/* Logo and User Section */}
      <div className=" justify-start items-start flex flex-col px-2 py-1">
        <img src="/logo2.png" alt="Logo" className="flex text-md w-full h-14 md:h-16" />
        <PopupState variant="popover" popupId="demo-menu-popup">
          {(popupState) => (
            <>
              <Button
                variant="contained"
                {...bindTrigger(popupState)}
                style={{
                  backgroundColor: 'black',
                  color: '#FFFFF',
                  boxShadow: "#B5C6C5",
                  fontWeight: "bold",
                  textTransform: "none",
                  padding:"2px",
                  font:"10px"
                }}
                className="bg-[#00DDA2] text-white text-xs font-bold px-1 inline-block w-full "
              >
                Hello | <span className="text-[#00DDA2] ml-1">{userName}</span>
              </Button>
              <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={popupState.close}>Themes</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </PopupState>
      </div>

      {/*Date picker for mobile sizes */}
      {/* Date Picker Section */}
<div className="flex flex-col items-center mt-2 px-5 w-full lg:hidden">
  <div className="relative rounded-3xl bg-transparent gap-1 px-5 w-full">
    <p className="text-md font-semibold text-white">Select range</p>
    {!isCustomSelected ? (
      <div className="w-full">
        {/* Dropdown for Mobile Date Range Selection */}
        <select 
          value={selectedRange} 
          onChange={handleDateRange} 
          className="w-full bg-transparent border border-gray-300 rounded-lg text-black text-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option value="anyTime">Any time</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="lastWeek">Last week</option>
          <option value="lastMonth">Last month</option>
          <option value="lastSixMonths">Last six months</option>
          <option value="lastYear">Last year</option>
          <option value="custom">Custom</option>
        </select>
      </div>
    ) : (
        <div className="fixed z-50 flex flex-col items-center gap-1 justify-center p-5 rounded-3xl bg-black ">
        <button className="flex items-end justify-end w-full px-3 py-2 text-white text-md underline" onClick={() => setIsCustomSelected(false)}>
          <FaXmark/>
        </button>
        <div className="w-full items-center justify-center flex ">
          {
            <p className="text-white text-lg font-semibold mb-2">
              {startingDate ? format(startingDate.toLocaleDateString(), "yyyy MMM dd") : "Start Date"} - {endingDate ? format(endingDate.toLocaleDateString(), "yyyy MMM dd") : "End Date"}
            </p>
          }
        </div>
        <DatePicker
          selected={startingDate}
          onChange={(update) => {
            const [start, end] = update;
            setStartingDate(start);
            setEndingDate(end);
          }}
          startDate={startingDate}
          endDate={endingDate}
          selectsRange
          inline
          placeholderText="Select a date range"
          dayClassName={(date) => {
            if (startingDate && endingDate && date >= startingDate && date <= endingDate) {
              return "custom-day custom-day--in-range";
            }
            if (date === startingDate || date === endingDate) {
              return "custom-day custom-day--selected";
            }
            return "custom-day";
          }}
          className="custom-calendar bg-expenseBC"
          popperClassName="custom-popper "
        />
        </div>
    )}
  </div>
</div>


      <div className="lg:hidden pt-2 w-full flex">
        <Dashboard
          startingDate={startingDate}
          endingDate={endingDate}
          databaseUpdate={handleDatabaseUpdate}
        />
      </div>

      {/* Income and Expense Buttons */}
      <div className="lg:flex hidden flex-col items-center justify-center w-full mt-10 space-y-3 px-5">
        <button
          onClick={handleIncomeCard}
          className="w-full h-20 bg-incomeBC text-2xl text-center text-white rounded-lg shadow-md hover:bg-incomeHover transition"
        >
          Income
        </button>
        <button
          onClick={handleExpenseCard}
          className="w-full h-20 bg-[black] text-2xl text-center text-white rounded-lg shadow-md hover:bg-[#151515] transition"
        >
          Expense
        </button>
      </div>

      {/* Date Picker Section */}

{/* For Desktop Sizes */}
<div className="hidden lg:flex flex-col items-center mt-5 px-5 w-full">
  <div className="relative rounded-3xl bg-transparent p-3 w-full border border-black">
    <p className="text-md font-semibold text-white px-2 pb-2">Select range</p>
    {!isCustomSelected ? (
      <div className="flex flex-col gap-3 w-full justify-center pl-5" onChange={handleDateRange}>
        {/* Radio Buttons for Date Range Selection */}
        <div className="flex gap-2 items-center">
          <input type="radio" id="range1" value="anyTime" checked={selectedRange === "anyTime"} className="text-sm font-semibold cursor-pointer appearance-none w-4 h-4 border border-gray-300 hover:border-white rounded-full checked:bg-green-200 checked:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
          <label htmlFor="range1" className="text-white">Any time</label>
        </div>
        <div className="flex gap-2 items-center">
          <input type="radio" id="range2" value="today" checked={selectedRange === "today"} className="text-sm font-semibold cursor-pointer appearance-none w-4 h-4 border border-gray-300 hover:border-white rounded-full checked:bg-green-200 checked:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
          <label htmlFor="range2" className="text-white">Today</label>
        </div>
        <div className="flex gap-2 items-center">
        <input type="radio" id="range3" value="yesterday" checked={selectedRange === "yesterday"} className="text-sm font-semibold cursor-pointer appearance-none w-4 h-4 border border-gray-300 hover:border-white rounded-full checked:bg-green-200 checked:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
        <label htmlFor="range3" className="text-white">Yesterday</label>
      </div>
      <div className="flex gap-2 items-center">
        <input type="radio" id="range4" value="lastWeek" checked={selectedRange === "lastWeek"} className="text-sm font-semibold cursor-pointer appearance-none w-4 h-4 border border-gray-300 hover:border-white rounded-full checked:bg-green-200 checked:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
        <label htmlFor="range4" className="text-white">Last week</label>
      </div>
      <div className="flex gap-2 items-center">
        <input type="radio" id="range5" value="lastMonth" checked={selectedRange === "lastMonth"} className="text-sm font-semibold cursor-pointer appearance-none w-4 h-4 border border-gray-300 hover:border-white rounded-full checked:bg-green-200 checked:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
        <label htmlFor="range5" className="text-white">Last month</label>
      </div>
      <div className="flex gap-2 items-center">
        <input type="radio" id="range6" value="lastSixMonths" checked={selectedRange === "lastSixMonths"} className="text-sm font-semibold cursor-pointer appearance-none w-4 h-4 border border-gray-300 hover:border-white rounded-full checked:bg-green-200 checked:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
        <label htmlFor="range6" className="text-white">Last six months</label>
      </div>
      <div className="flex gap-2 items-center">
        <input type="radio" id="range7" value="lastYear" checked={selectedRange === "lastYear"} className="text-sm font-semibold cursor-pointer appearance-none w-4 h-4 border border-gray-300 hover:border-white rounded-full checked:bg-green-200 checked:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
        <label htmlFor="range7" className="text-white">Last year</label>
      </div>
      <div className="flex gap-2 items-center">
        <input type="radio" id="range8" value="custom" checked={selectedRange === "custom"} onChange={() => setIsCustomSelected(true)} className="text-sm font-semibold cursor-pointer appearance-none w-4 h-4 border border-gray-300 hover:border-white rounded-full checked:bg-green-200 checked:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500" />
        <label htmlFor="range8" className="text-white">Custom</label>
      </div>
        {/* More radio buttons for different date ranges */}
      </div>
    ) : (
      <div className="relative">
        <div className="w-full items-center justify-center flex">
          {(
            <p className="text-white text-lg font-semibold mb-2">
              {startingDate ? format(startingDate.toLocaleDateString(), "yyyy MMM dd") : "Start Date"} - {endingDate ? format(endingDate.toLocaleDateString(), "yyyy MMM dd") : "End Date"}
            </p>
          )}
        </div>
        <DatePicker
          selected={startingDate}
          onChange={(update) => {
            const [start, end] = update;
            setStartingDate(start);
            setEndingDate(end);
          }}
          startDate={startingDate}
          endDate={endingDate}
          selectsRange
          inline
          placeholderText="Select a date range"
          dayClassName={(date) => {
            if (startingDate && endingDate && date >= startingDate && date <= endingDate) {
              return "custom-day custom-day--in-range";
            }
            if (date === startingDate || date === endingDate) {
              return "custom-day custom-day--selected";
            }
            return "custom-day";
          }}
          className="custom-calendar"
          popperClassName="custom-popper "
        />
        <button className="flex items-end justify-end w-full px-3 text-white text-sm underline" onClick={() => setIsCustomSelected(false)}>
          Close
        </button>
      </div>
    )}
  </div>
</div>
</div>


    {/* Main Content */}
    <div className="lg:ml-[20%] flex-1 px-5 py-5 ">
      {/* Dashboard */}
      <div className="hidden lg:block pb-5">
        <Dashboard startingDate={startingDate} endingDate={endingDate} databaseUpdate={handleDatabaseUpdate} />
      </div>
       {/* Income and Expense Buttons */}
       <div className="flex lg:hidden flex-col items-center justify-center w-full mt-10 space-y-3 px-5">
        <button
          onClick={handleIncomeCard}
          className="w-full h-20 bg-incomeBC text-2xl text-center text-white rounded-lg shadow-md hover:bg-incomeHover transition"
        >
          Income
        </button>
        <button
          onClick={handleExpenseCard}
          className="w-full h-20 bg-expenseBC text-2xl text-center text-white rounded-lg shadow-md hover:bg-[#151515] transition"
        >
          Expense
        </button>
      </div>
      <div id="transactionPage" ref={transactionPageRef}>
        <TransactionPage  startingDate={startingDate} endingDate={endingDate} databaseUpdate={handleDatabaseUpdate} 
        popupSelection={handlePopupSelection} onMaximizeToggle={handleMaximizeToggle} maxStatus={isMaximized}/>
      </div>
      
      {/* Popup Transaction Page */}
      {isPopupWindowOpened && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
          <div className="bg-white rounded-lg p-5 shadow-lg w-1/3">
            <TransactionForm
              type={popupType}
              Selection={popupSelection}
              onClose={closePopupWindow}
              onAddEdit={handleTransactionAddEdit}
            />
          </div>
        </div>
      )}
      
      {/* Maximized Transaction Page */}
      {isMaximized && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
          <div className=" w-11/12 h-[90%] ">
            <TransactionPage
              startingDate={startingDate}
              endingDate={endingDate}
              databaseUpdate={handleDatabaseUpdate}
              popupSelection={handlePopupSelection}
              onMaximizeToggle={handleMaximizeToggle}
              maxStatus={isMaximized}
            />
          </div>
        </div>
      )}
    </div>
  </div>
</div>

    
  );
};
export default HomePage;
