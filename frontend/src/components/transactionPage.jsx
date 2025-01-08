
import React, { useEffect, useState, useReducer, useRef } from "react";
import { Tag, Select, message } from "antd";
import  ExpenseCard  from "./common/ExpenseCard";
import { useNavigate } from "react-router-dom";
import { FaXmark, FaBars } from "react-icons/fa6";
import { getCategories, getTransactions } from "../Services/transactionService";
import { useAuth } from "../hooks/useAuth";
import TransactionForm from "./common/transactionForm";
import { FiMinimize } from "react-icons/fi";
import { FiMaximize } from "react-icons/fi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";


const { Option } = Select;

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

const TransactionPage = ({ startingDate, endingDate, databaseUpdate, popupSelection, deletemodelSelection, onMaximizeToggle, maxStatus }) => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {transactionItems} = state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [deleteTransactionId, setDeleteTransactionId] = useState();
  const [isDatabaseUpdated,setIsDatabaseUpdated] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const leftElementRef = useRef(null);
  const rightElementRef = useRef(null);
  const tableRef = useRef(null);
  const tag1Ref = useRef(null);
  const tag2Ref = useRef(null);
  const tag3Ref = useRef(null);

  useEffect(() => {
    const loadTransactions = getTransactions(userId, { startingDate, endingDate});
    console.log("starting Date(tpage):", startingDate);
    const loadCategories = getCategories(userId);
    loadCategories.then(categoriesData => {
      //setCategories(categoriesData);
      setIncomeCategories(categoriesData.income);
      setExpenseCategories(categoriesData.expense);
    });
    loadTransactions.then((transactionItems) => {
      // Sort transactions by date in descending order (most recent first)
      const sortedTransactions = transactionItems.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // Most recent first
      });
      dispatch({ type: "Transactions_Loaded", payload: sortedTransactions });
    });

  }, [userId, startingDate, endingDate, isDatabaseUpdated, databaseUpdate]);

  useEffect(
    () => {
      const filterItems = () => {
        let items = state.transactionItems;

        if (selectedTag === "All"){
          setFilteredItems(items);
        }else if(selectedTag === "Income") {
          items = items.filter(item => item.type === "Income");
          if(selectedCategory === "All"){
            setFilteredItems(items);
          }else if(selectedCategory !== "All"){
            items = items.filter(item => item.category === selectedCategory);
            setFilteredItems(items);
          }
        } else if (selectedTag === "Expense") {
          items = items.filter(item => item.type === "Expense");
          if(selectedCategory === "All"){
            setFilteredItems(items);
          } else if (selectedCategory !== "All") {
            items = items.filter(item => item.category === selectedCategory);
            setFilteredItems(items);
          }
        }  

        
      };

      filterItems();
    },
    [state.transactionItems, selectedTag, selectedCategory]
  );

  const handleTagClick = tag => {
    setSelectedTag(tag);
    setSelectedCategory("All");
  };

  const handleIncomeCategoryChange = value => {
    console.log("refunds:", value);
    setSelectedCategory(value);

  };

  const handleExpenseCategoryChange = value => {
    setSelectedCategory(value);
  };

  const handleTag = tag => {
    setSelectedCategory("All");
    setSelectedTag(tag);
    
  };
  const toggleButton = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleUpdateSelection = (selection) => {
    popupSelection(selection);
    // setIsPopupWindowOpened(true);
  };

  const handleDeleteTransaction = (transactionId) => {
    deletemodelSelection(transactionId);
  }
 
  const handleMaximizeToggle = async(e) => {
    e.preventDefault();
    const status = onMaximizeToggle();
    setIsMaximized(status);
  };

  return (
    <>
      <div className=" h-full md:mx-5 mx-2 my-2 rounded-lg backdrop-blur-lg" >
        <div className=" w-full h-full ">
          <div className="flex lg:hidden w-full items-center justify-start  ">
            <button
              className="text-black focus:outline-none justify-start m-2 focus:test-gray-500  "
              onClick={toggleButton}
            >
              {isMenuOpen
                ? <FaXmark className="h-4 w-4 " />
                : <FaBars className="h-4 w-4 " />}
            </button>
          </div>
          <div  
            className={`absolute space-y-2 z-30  left-5 w-[200px] mb-2 rounded-l-lg justify-end items-center py-3 transition-all duration-500000 ease-in-out  bg-primary shadow-lg border-[3px] border-golden border-opacity-50 ${isMenuOpen
              ? " h-auto w-48 block justify-center items-center hover:transition-transform hovet:text-opacity-100  hover:duration-50000 hover:ease-in-out text-subText hover:text-opacity-100 bg-white hover:border-opacity-100 mb-10"
              : "hidden"}`}
          >
            <ul className=" flex gap-1 relative w-full !mt-[8.00px] !text-[12px] cursor-pointer px-1 ![font-family:'Inter',Helvetica]  items-start">
              <li key="1" className=" w-full">
                <p
                  className="flex relative transform items-center bg-white hover:bg-gray-200 hover:bg-opacity-30 hover:shadow-golden h-8 pl-5 shadow-sm transition-transform w-full hover:font-bold hover:text-[black]"
                  onClick={() => handleTag("All")}
                >
                  {" "}All{" "}
                </p>
                <p
                  className="flex justify-start pl-5 items-center h-8 !text-[12px] bg-white hover:bg-gray-200 hover:bg-opacity-30 hover:shadow-golden shadow-sm relative transform transition-transform w-full hover:font-bold hover:text-[black]"
                  onClick={() => handleTag("Income")}
                >
                  {" "}Income{" "}
                </p>
                <p
                  className="flex relative items-center !text-[12px] h-8 transform pl-5 bg-white hover:bg-gray-200 hover:bg-opacity-30 hover:shadow-golden shadow-sm transition-transform w-full hover:font-bold hover:text-[black]"
                  onClick={() => handleTag("Expense")}
                >
                  {" "}Expense{" "}
                </p> 
              </li> 
            </ul> 
          </div> 
          <div className="hidden lg:flex flex-row justify-center items-center mx-5 text-black font-semibold">
            <div className=" flex justify-center w-full">
            <Tag ref={tag1Ref} data-animation = "tag"
              className={`w-40 h-6 ${selectedTag === "All"
                ? "bg-[#4B71F0] text-white"
                : "bg-white"} hover:bg-[#D5D6EE] hover:text-[black] rounded-xl text-md text-center shadow-md border-[#a2a2a2] border cursor-pointer`}
              onClick={() => handleTagClick("All")}
            >
              All
            </Tag>
            
            <Tag ref={tag2Ref} data-animation = "tag"
              className={`w-40 h-6 ${selectedTag === "Income"
                ? "bg-[#4B71F0] text-white"
                : "bg-white"} hover:bg-[#D5D6EE] hover:text-[black] focus:bg-focusColor rounded-xl text-md border-[#a2a2a2] border text-center shadow-md cursor-pointer`}
              onClick={() => handleTagClick("Income")}
            >
              Income
            </Tag>
            <Tag ref={tag3Ref} data-animation = "tag"
              className={` w-40 h-6 ${selectedTag === "Expense"
                ? "bg-[#4B71F0] text-white"
                : "bg-white"} hover:bg-[#D5D6EE] hover:text-[black] rounded-xl focus:bg-focusColor border-[#a2a2a2] border text-md text-center shadow cursor-pointer`}
              onClick={() => handleTagClick("Expense")}
            >
              Expense
            </Tag>
            </div>
            
            <div className="lg:flex hidden items-center justify-end  ">
                  <button
                    className=" focus:outline-none text-xl font-extrabold justify-end m-4 focus:test-gray-500  "
                    onClick={handleMaximizeToggle}
                  >
                    {
                      maxStatus?
                      <FiMinimize className=" text-white" />:<FiMaximize className=" text-black"/>
                    }  
                  </button>
               
            </div>
          </div>
          <div className="backdrop-blur-md md:mx-5 mx-3 mb-5 bg-white/90 md:p-5 p-2  rounded-xl overflow-hidden hover:overflow-auto ">
            <div className=" py-2 ">
              <table ref={tableRef} data-animation = "table" className={`table-auto w-full ${maxStatus?'lg:h-[70vh]':'lg:h-[60vh]'} h-full rounded-2xl`}>
                <thead className="flex w-full sm:no z-50 text-[0.8rem] md:text-[1rem] text-[white] font-semibold h-12 bg-gray-expenseBC rounded-2xl ">
                  <tr key="index" className="flex w-full items-center content-center bg-[#4B71F0] rounded-lg">
                    <th className="flex w-[35%] pl-6 border-gray-500 justify-start items-center ">
                      About Transaction
                    </th>
                    <th className=" w-[20%] relative justify-start items-center pl-3 border-gray-500 ">
                      Category
                      <button onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="ml-2">
                          {selectedTag !== "All" && (showCategoryDropdown?<FaChevronUp />:<FaChevronDown />)}
                      </button>
                      {showCategoryDropdown && (
                        selectedTag === "Income"? (
                        <div className="absolute hover:overflow-auto custom-scrollbar overflow-hidden bg-white border rounded shadow-lg z-50">
                          <button onClick={() => handleIncomeCategoryChange("All")} className="block px-4 py-2 w-full text-start text-sm text-gray-700 hover:bg-gray-200">
                            All Incomes
                          </button>
                          {incomeCategories.map((category, index) => (
                            <button
                              key={index}
                              onClick={() => handleIncomeCategoryChange(category)}
                              className="block px-4 py-2 w-full text-start text-sm text-gray-700 hover:bg-gray-200"
                            >
                              {category}
                            </button>
                          ))}
                        </div>):(
                        selectedTag === "Expense"? (
                        <div className="absolute hover:overflow-auto custom-scrollbar overflow-hidden bg-white border rounded shadow-lg z-50">
                          <button onClick={() => handleExpenseCategoryChange("All")} className="block px-4 py-2 w-full text-start text-sm text-gray-700 hover:bg-gray-200">
                            All Expenses
                          </button>
                          {expenseCategories.map((category, index) => (
                            <button
                              key={index}
                              onClick={() => handleExpenseCategoryChange(category)}
                              className="block px-4 py-2 w-full text-start text-sm text-gray-700 hover:bg-gray-200"
                            >
                              {category}
                            </button>
                          ))}
                        </div>):(<div className="absolute hover:overflow-auto custom-scrollbar overflow-hidden bg-white border rounded shadow-lg z-50">
                          <button onClick={() => handleIncomeCategoryChange("All")} className="block px-4 py-2 w-full text-start text-sm text-gray-700 hover:bg-gray-200">
                            All Incomes
                          </button>
                          {incomeCategories.map((category, index) => (
                            <button
                              key={index}
                              onClick={() => handleIncomeCategoryChange(category)}
                              className="block px-4 py-2 w-full text-start text-sm text-gray-700 hover:bg-gray-200"
                            >
                              {category}
                            </button>
                          ))}
                        </div>))
                      )}
                    </th>
                    <th className="flex  w-[15%] justify-sart items-center pl-3 border-gray-500">
                      Date
                    </th>
                    <th className="flex  w-[15%] justify-start items-center pl-3 border-gray-500">
                      Amount
                    </th>
                    <th className="flex  w-[15%] justify-start items-center pl-3 border-gray-500" />
                  </tr>
                </thead>
                <tbody className={`flex justify-center gap-1 pb-5 items-center ${maxStatus?'lg:max-h-[60vh]':'lg:max-h-[60vh]'} max-h-[300px] backdrop-blur-sm w-full text-white flex-wrap cursor-pointer overflow-y-hidden hover:overflow-y-auto`}>
                 
                  {filteredItems.map(item => (
                  <ExpenseCard key={item.transactionId} selection={item}  onOpen={handleUpdateSelection} deleteModelOpened={handleDeleteTransaction}/>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionPage;
