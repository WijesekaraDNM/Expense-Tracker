
import React, { useState, useRef, useEffect, useReducer } from "react";
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
import { message } from "antd";
import { format } from "date-fns";
import { FaXmark } from "react-icons/fa6";
import { deleteTransaction } from "../Services/transactionService";
import { GiPayMoney } from "react-icons/gi";
import { GiReceiveMoney } from "react-icons/gi";

const initialState = { transactionItems: [] };
const reducer = (state, action) => {
  switch (action.type) {
    case "Transactions_Loaded":
      return { ...state, transactionItems: action.payload };
    case "Filter_Transactions":
      return { ...state, transactionItems: action.payload };
    case "Transaction_Deleted":
      return {
        ...state,
        transactionItems: state.transactionItems.filter(item => item.transactionId !== action.payload),
      };
    default:
      return state;
  }
};

const HomePage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {transactionItems} = state
  const { logout } = useAuth();
  const [startingDate, setStartingDate] = useState(null);
  const [endingDate, setEndingDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const transactionPageRef = useRef(null);
  const [setDatabaseUpdate] = useState(false);
  const { userName } = useAuth();
  const [isPopupWindowOpened,setIsPopupWindowOpened]= useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTransactionId, setDeletingTransactionId] = useState();
  const [isDatabaseUpdated,setIsDatabaseUpdated] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupSelection, setPopupSelection] = useState();
  const [isMaximized, setIsMaximized] = useState(false); 
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  //const [ setDisplayText] = useState("");
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [bocAccounts] = useState();
  //const text = "Select a Date Range & get more Information"; // Your desired text

  useEffect(() => {
    // const fetchAccounts = async () => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     console.log("Token :", token);
    //     const response = await getBOCAccounts(token);
    //     console.log("Account response in home :", response);
    //     setBocAccounts(response.data.accounts); // Adjust as per your response structure
    //   } catch (error) {
    //     console.error("Error fetching BOC accounts:", error);
    //   }
    // };
  
    // fetchAccounts();
    // let index = 0;
    // const interval = setInterval(() => {
    //   setDisplayText((prev) => prev + text[index]);
    //   index++;
    //   if (index === text.length) {
    //     clearInterval(interval);
    //   }
    // }, 350); // Adjust typing speed by changing the interval value (in milliseconds)

    // return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);


  const handleLogout = async e => {
    e.preventDefault();
    await logout();
  };

  // const handleScrollToTransactionPage = () => {

  //   if (transactionPageRef.current) {
  //     transactionPageRef.current.scrollIntoView({
  //       behavior: 'smooth', // for smooth scrolling
  //       block: 'start'      // scroll to the top of the element
  //     });
  //   }
  // };

  const handleDatabaseUpdate = () => {
    if(isDatabaseUpdated){
      setDatabaseUpdate(prevState => !prevState);
    };
    isDatabaseUpdated(false);
    //console.log("HomaPage transactionadd:", databaseUpdate);
  };

  const handleIncomeCard = () => {
    setIsPopupWindowOpened(true);
    setPopupType("Income");
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
  };
  const handlePopupSelection = (e) => {
    setPopupSelection(e);
    setIsPopupWindowOpened(true);
  };

  const handleDeleteModelSelection = (e) => {
    setDeletingTransactionId(e);
    setShowDeleteModal(true);
  }

   const confirmDelete = async() => {
      try {
        await deleteTransaction(deletingTransactionId);
        //console.log("deleted", setDeletingTransactionId);
        dispatch({
          type: "Transactions_Loaded",
          payload: transactionItems.filter((item) => item.transactionId !== deletingTransactionId),
          
        });
        // if (onDelete) onDelete(deletingTransactionId);
        message.success("Successfully deleted the transaction!")
  
        setIsDatabaseUpdated(!isDatabaseUpdated);
       // console.log("transactionDelete:transactionpage: ", isDatabaseUpdated);
        dispatch({ type: "Transaction_Deleted", payload: deletingTransactionId});
        
      } catch (error) {
        //console.error("Error deleting transaction:", error);
        message.error("Deletion failed!")
      }
      setShowDeleteModal(false);
    };

  // const handleStartingDate = e => {
  //   setStartingDate(e.target.value);
  // };
  // const handleEndingDate = e => {
  //   setEndingDate(e.target.value);
  // };

  const handleMaximizeToggle = () => {
    setIsMaximized(!isMaximized);
    //console.log("homeToggle:",isMaximized);
  };

  const handleDateRange = (e) => {
    const selectedRange = e.target.value;
    setSelectedRange(selectedRange);
  
    let startingDate = null;
    let endingDate = null;
    const today = new Date();
  
    switch (selectedRange) {
      case "anyTime": {
        startingDate = null;
        endingDate = null;
        setIsChartVisible(false);
        break;
      }
      case "today": {
        startingDate = new Date();
        startingDate.setHours(0, 0, 0, 0); // Start of today
        endingDate = new Date();
        endingDate.setHours(23, 59, 59, 999); // End of today
        setIsChartVisible(true);
        break;
      }
      case "yesterday": {
        startingDate = new Date(today);
        startingDate.setDate(today.getDate() - 1);
        startingDate.setHours(0, 0, 0, 0); // Start of yesterday
  
        endingDate = new Date(startingDate);
        endingDate.setHours(23, 59, 59, 999); // End of yesterday
        setIsChartVisible(true);
        break;
      }
      case "lastWeek": {
        // Start date: last week's Monday
        const firstDayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
        startingDate = new Date(today);
        startingDate.setDate(today.getDate() - firstDayOfWeek - 7); // Previous week's Monday
        startingDate.setHours(0, 0, 0, 0);
  
        // End date: last week's Sunday
        endingDate = new Date(startingDate);
        endingDate.setDate(startingDate.getDate() + 6); // Sunday of the same week
        endingDate.setHours(23, 59, 59, 999);
        setIsChartVisible(true);
        break;
      }
      case "lastMonth": {
        // Start date: first day of the previous month
        startingDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  
        // End date: last day of the previous month
        endingDate = new Date(today.getFullYear(), today.getMonth(), 0);
        endingDate.setHours(23, 59, 59, 999);
        setIsChartVisible(true);
        break;
      }
      case "lastSixMonths": {
        startingDate = new Date(today);
        startingDate.setMonth(today.getMonth() - 6);
        startingDate.setHours(0, 0, 0, 0);
  
        endingDate = new Date(today);
        endingDate.setHours(23, 59, 59, 999);
        setIsChartVisible(true);
        break;
      }
      case "lastYear": {
        startingDate = new Date(today.getFullYear() - 1, 0, 1); // Jan 1 of the previous year
        startingDate.setHours(0, 0, 0, 0);
  
        endingDate = new Date(today.getFullYear() - 1, 11, 31); // Dec 31 of the previous year
        endingDate.setHours(23, 59, 59, 999);
        setIsChartVisible(true);
        break;
      }
      case "custom": {
        setIsCustomSelected(true);
        setIsChartVisible(true);
        break;
      }
      default: {
        console.error("Invalid range type provided!");
        return;
      }
    }
  
    setStartingDate(startingDate);
    setEndingDate(endingDate);
  };

  return (
    <div className="bg-back min-h-screen w-full bg-cover">
    <div className="flex flex-col lg:flex-row lg:h-full w-full">
    {/* Sidebar */}
    <div className="lg:fixed lg:left-0 lg:top-0 lg:h-full lg:pb-10 lg:w-1/5 bg-[#F6F8FE] lg:bg-white flex flex-col items-center py-5">
      {/* Logo and User Section */}
      <div className=" justify-start h- items-start flex flex-col px-2 py-1">
        <img src="/logoNew3.png" alt="logoNew3" className="flex text-md w-full h-14 md:h-16 pb-1" />
        <PopupState variant="popover" popupId="demo-menu-popup">
          {(popupState) => (
            <>
              <Button
                variant="contained"
                {...bindTrigger(popupState)} 
                style={{
                  backgroundColor: '#4B71F0',
                  color: '#FFFF',
                  boxShadow: "#B5C6C5",
                  fontWeight: "bold",
                  textTransform: "none",
                  padding:"2px",
                  font:"10px",
                  
                }}
                className="bg-[white] text-white text-xs font-bold px-1 inline-block w-full "
              >
                Hello | <span className="text-[white] ml-1">{userName}</span>
              </Button>
              <Menu {...bindMenu(popupState)} 
                 style={{
                  display: "flex", // Flexbox container for alignment
                  flexDirection: "column", // Align items vertically
                  justifyContent: "center", // Center align items horizontally
                  alignItems: "center", // Center align items vertically
                  padding: "10px 0", // Optional padding for spacing
                }}>
                <MenuItem onClick={popupState.close} 
                style={{
                  color: "#4B71F0", // Dynamic color on hover
                  textAlign: "center", // Center-align text
                  width: "100%", // Occupy full width for better alignment
                }}
                  >Themes</MenuItem>
                 <MenuItem onClick={handleLogout}
                 style={{
                  color: "#4B71F0", // Dynamic color on hover
                  textAlign: "center", // Center-align text
                  width: "100%", // Occupy full width for better alignment
                }}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </PopupState>
      </div>

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
          <option value="">Select an option</option>
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
        <div className="fixed z-50 flex flex-col items-center gap-1 justify-center p-5 border border-[#4B71F0] rounded-3xl bg-white ">
        <button className="flex items-end justify-end w-full px-3 py-2 text-black text-md underline" onClick={() => setIsCustomSelected(false)}>
          <FaXmark/>
        </button>
        <div className="w-full items-center justify-center flex ">
          {
            <p className="text-[#BAB9E0] text-lg font-semibold mb-2">
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
          isCustomChart = {isChartVisible}
          selectedRange = {selectedRange}
        />
      </div>

      {/* Income and Expense Buttons */}
      <div className="lg:flex hidden flex-col items-center justify-center w-full mt-10 space-y-3 px-5">
        <button
          onClick={handleIncomeCard}
          className=" flex flex-row justify-center items-center gap-4 w-full h-20 bg-[#00d0c2] text-2xl text-center text-white rounded-lg shadow-md hover:bg-[#14bbb0] transition"
        >
          <GiReceiveMoney /> Income
        </button>
        <button
          onClick={handleExpenseCard}
          className=" flex flex-row justify-center items-center gap-4 w-full h-20 bg-[#EF854B] text-2xl text-center text-white rounded-lg shadow-md hover:bg-[#ee712e] transition"
        >
         <GiPayMoney /> Expense
        </button>
      </div>

      {/* Date Picker Section */}

{/* For Desktop Sizes */}
<div className="hidden lg:flex flex-col items-center mt-5 px-5 w-full">
  <div className="relative rounded-3xl bg-transparent p-3 w-full border border-[#4B71F0]">
    <p className="text-md font-semibold text-[#4B71F0] px-2 pb-2">Select range</p>
    {!isCustomSelected ? (
      <div className="flex flex-col gap-3 w-full justify-center pl-5" onChange={handleDateRange}>
        {/* Radio Buttons for Date Range Selection */}
        <div className="flex gap-2 items-center">
          <input type="radio" id="range1" value="anyTime" checked={selectedRange === "anyTime"} className="peer text-sm font-semibold  cursor-pointer appearance-none w-4 h-4 border border-[#D5D6EE] hover:border-[#4B71F0] rounded-full checked:bg-[#D5D6EE] checked:border-[#4B71F0] focus:outline-none focus:ring-2 focus:ring-[#4B71F0]" />
          <label htmlFor="range1" className="text-[#BAB9E0] peer-checked:text-[#4B71F0] focus:text-[#4B71F0]">Any time</label>
        </div>
        <div className="flex gap-2 items-center">
          <input type="radio" id="range2" value="today" checked={selectedRange === "today"} className="peer text-sm font-semibold checked:text-[#4B71F0] cursor-pointer appearance-none w-4 h-4 border border-[#D5D6EE] hover:border-[#4B71F0] rounded-full checked:bg-[#D5D6EE] checked:border-[#4B71F0] focus:outline-none focus:ring-2 focus:ring-[#4B71F0]" />
          <label htmlFor="range2" className="text-[#BAB9E0] peer-checked:text-[#4B71F0] focus:text-[#4B71F0]">Today</label>
        </div>
        <div className="flex gap-2 items-center">
        <input type="radio" id="range3" value="yesterday" checked={selectedRange === "yesterday"} className=" peer text-sm font-semibold focus:text-[#4B71F0] cursor-pointer appearance-none w-4 h-4 border border-[#D5D6EE] hover:border-[#4B71F0] rounded-full checked:bg-[#D5D6EE] checked:border-[#4B71F0] focus:outline-none focus:ring-2 focus:ring-[#4B71F0]" />
        <label htmlFor="range3" className="text-[#BAB9E0] peer-checked:text-[#4B71F0] focus:text-[#4B71F0]">Yesterday</label>
      </div>
      <div className="flex gap-2 items-center">
        <input type="radio" id="range4" value="lastWeek" checked={selectedRange === "lastWeek"} className="peer text-sm font-semibold focus:text-[#4B71F0] cursor-pointer appearance-none w-4 h-4 border border-[#D5D6EE] hover:border-[#4B71F0] rounded-full checked:bg-[#D5D6EE] checked:border-[#4B71F0] focus:outline-none focus:ring-2 focus:ring-[#4B71F0]" />
        <label htmlFor="range4" className="text-[#BAB9E0] peer-checked:text-[#4B71F0] focus:text-[#4B71F0]">Last week</label>
      </div>
      <div className="flex gap-2 items-center">
        <input type="radio" id="range5" value="lastMonth" checked={selectedRange === "lastMonth"} className="peer text-sm font-semibold cursor-pointer appearance-none w-4 h-4 border border-[#D5D6EE] hover:border-[#4B71F0] rounded-full checked:bg-[#D5D6EE] checked:border-[#4B71F0] focus:outline-none focus:ring-2 focus:ring-[#4B71F0]" />
        <label htmlFor="range5" className="text-[#BAB9E0] peer-checked:text-[#4B71F0] focus:text-[#4B71F0]">Last month</label>
      </div>
      <div className="flex gap-2 items-center">
        <input type="radio" id="range6" value="lastSixMonths" checked={selectedRange === "lastSixMonths"} className="peer text-sm font-semibold cursor-pointer appearance-none w-4 h-4 border border-[#D5D6EE] hover:border-[#4B71F0] rounded-full checked:bg-[#D5D6EE] checked:border-[#4B71F0] focus:outline-none focus:ring-2 focus:ring-[#4B71F0]" />
        <label htmlFor="range6" className="text-[#BAB9E0] peer-checked:text-[#4B71F0] focus:text-[#4B71F0]">Last six months</label>
      </div>
      <div className="flex gap-2 items-center">
        <input type="radio" id="range7" value="lastYear" checked={selectedRange === "lastYear"} className="peer text-sm font-semibold cursor-pointer appearance-none w-4 h-4 border border-[#D5D6EE] hover:border-[#4B71F0] rounded-full checked:bg-[#D5D6EE] checked:border-[#4B71F0] focus:outline-none focus:ring-2 focus:ring-[#4B71F0]" />
        <label htmlFor="range7" className="text-[#BAB9E0] peer-checked:text-[#4B71F0] focus:text-[#4B71F0]">Last year</label>
      </div>
      <div className="flex gap-2 items-center">
        <input type="radio" id="range8" value="custom" checked={selectedRange === "custom"} onChange={() => setIsCustomSelected(true)} className="peer text-sm font-semibold cursor-pointer appearance-none w-4 h-4 border border-[#D5D6EE] hover:border-[#4B71F0] rounded-full checked:bg-[#D5D6EE] checked:border-[#4B71F0] focus:outline-none focus:ring-2 focus:ring-[#4B71F0]" />
        <label htmlFor="range8" className="text-[#BAB9E0] peer-checked:text-[#4B71F0] focus:text-[#4B71F0]">Custom</label>
      </div>
        {/* More radio buttons for different date ranges */}
      </div>
    ) : (
      <div className="relative flex flex-col justify-center items-center">
        <div className="w-full items-center justify-center flex">
          {(
            <p className="text-[#BAB9E0] text-lg font-semibold mb-2">
              {startingDate ? format(startingDate.toLocaleDateString(), "yyyy MMM dd") : "Start Date"} - {endingDate ? format(endingDate.toLocaleDateString(), "yyyy MMM dd") : "End Date"}
            </p>
          )}
        </div>
        <div>
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
          <button className="flex items-end justify-end w-full px-3 text-[#BAB9E0] text-sm underline" onClick={() => setIsCustomSelected(false)}>
            Close
          </button>
        </div>  
      </div>
    )}
  </div>
</div>
</div>


    {/* Main Content */}
    <div className="lg:ml-[20%] flex-1 py-5 bg-[#F6F8FE] ">
      {/* Dashboard */}
      <div className="hidden lg:block pb-5">
        <Dashboard startingDate={startingDate} endingDate={endingDate} databaseUpdate={handleDatabaseUpdate} isCustomChart = {isChartVisible} selectedRange = {selectedRange}/>
      </div>
       {/* Income and Expense Buttons */}
       <div className="flex lg:hidden flex-col items-center justify-center w-full mt-10 space-y-3 px-5 pb-5">
        <button
          onClick={handleIncomeCard}
          className="flex justify-center items-center gap-4 w-full h-20 bg-[#00d0c2] text-2xl text-center text-white rounded-lg shadow-md hover:bg-[#14bbb0] transition"
        >
          <GiReceiveMoney /> Income
        </button>
        <button
          onClick={handleExpenseCard}
          className="flex justify-center items-center gap-4 w-full h-20 bg-[#EF854B] text-2xl text-center text-black rounded-lg shadow-md hover:bg-[#ee712e] transition"
        >
         <GiPayMoney /> Expense
        </button>
      </div>
      <div id="transactionPage" ref={transactionPageRef}>
        <TransactionPage  startingDate={startingDate} endingDate={endingDate} databaseUpdate={handleDatabaseUpdate} 
        popupSelection={handlePopupSelection} onMaximizeToggle={handleMaximizeToggle} maxStatus={isMaximized}  deletemodelSelection={handleDeleteModelSelection}/>
      </div>
      <div>
        {bocAccounts}
      </div>
      
      {/* Popup Transaction Page */}
      {isPopupWindowOpened && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
       
            <TransactionForm
              type={popupType}
              Selection={popupSelection}
              onClose={closePopupWindow}
              onAddEdit={handleTransactionAddEdit}
            />
         
        </div>
      )}
      
      {/* Maximized Transaction Page */}
      {isMaximized && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-40">
          <div className=" w-11/12 h-[90%] ">
            <TransactionPage
              startingDate={startingDate}
              endingDate={endingDate}
              databaseUpdate={handleDatabaseUpdate}
              popupSelection={handlePopupSelection}
              deletemodelSelection={handleDeleteModelSelection}
              onMaximizeToggle={handleMaximizeToggle}
              maxStatus={isMaximized}
            />
          </div>
        </div>
      )}

      {/*Delete model*/}
      {showDeleteModal &&
      <div className="fixed inset-0 flex justify-center items-center p-5 z-50 bg-black bg-opacity-80">
        <div className={`bg-white rounded-xl shadow-lg lg:p-8 p-5`}>
          <h3 className="text-lg font-bold mb-4 text-[black]">Confirm Deletion</h3>
          <p className="text-[black] text-sm mb-4">Are you sure you want to delete this transaction?</p>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Confirm
            </button>
          </div>
        </div>
    </div>} 
    </div>
  </div>
</div>
  );
};
export default HomePage;
