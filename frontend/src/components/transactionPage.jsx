import React, { useEffect, useState, useReducer, useRef } from "react";
import { Tag, Select } from "antd";
import  ExpenseCard  from "./common/ExpenseCard";
import { useNavigate } from "react-router-dom";
import { FaXmark, FaBars } from "react-icons/fa6";
import { getCategories, getTransactions } from "../Services/transactionService";
import { useAuth } from "../hooks/useAuth";
import TransactionForm from "./common/transactionForm";

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

const TransactionPage = ({ startingDate, endingDate, databaseUpdate }) => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [isIncomeCardPressed, setIsIncomeCardPressed] = useState(false);
  // const { transactionItems } = state;
  // const [isExpenseCardPressed, setIsExpenseCardPressed] = useState(false);
  // const [isPopupMenuOpened, setIsPopupMenuOpened] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isPopupWindowOpened,setIsPopupWindowOpened]= useState(false);
  const [isDatabaseUpdated,setIsDatabaseUpdated] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupSelection, setPopupSelection] = useState();
  const leftElementRef = useRef(null);
  const rightElementRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const loadTransactions = getTransactions(userId, { startingDate, endingDate});
    console.log("starting Date(tpage):", startingDate);
    const loadCategories = getCategories(userId);
    loadCategories.then(categoriesData => {
      //setCategories(categoriesData);
      setIncomeCategories(categoriesData.income);
      setExpenseCategories(categoriesData.expense);
    });
    loadTransactions.then(transactionItems => {
      dispatch({ type: "Transactions_Loaded", payload: transactionItems });
    });

  }, [userId, startingDate, endingDate]);

  useEffect(() => {
    const observerOptions = {
      root: null, // Uses the viewport as the root
      threshold: 0.1, // Trigger the callback when 10% of the element is visible
    };
  
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('has-animated')) {
          if (entry.target.classList.contains('left')) {
            entry.target.classList.add('animate-left', 'has-animated');
          } else if (entry.target.classList.contains('right')) {
            entry.target.classList.add('animate-right', 'has-animated');
          }
          observer.unobserve(entry.target); // Stop observing the element after the animation is triggered
        }
      });
    };
  
    const observer = new IntersectionObserver(observerCallback, observerOptions);
  
    if (leftElementRef.current) observer.observe(leftElementRef.current);
    if (rightElementRef.current) observer.observe(rightElementRef.current);
  
    return () => {
      if (leftElementRef.current) observer.unobserve(leftElementRef.current);
      if (rightElementRef.current) observer.unobserve(rightElementRef.current);
    };
  }, []);

  // useEffect(() => {
  //   if (isDatabaseUpdated) {
  //     if (databaseUpdate) {
  //       databaseUpdate();
  //     }
  //     // Reset istransactionAddEdit after operation
  //     setIsDatabaseUpdated(false);
  //   }
  //   console.log("transactionPage added1:", isDatabaseUpdated);
    
  // }, [isDatabaseUpdated, databaseUpdate]);

  useEffect(
    () => {
      const filterItems = () => {
        let items = state.transactionItems;

        if (selectedTag === "Income") {
          items = items.filter(item => item.type === "Income");
        } else if (selectedTag === "Expense") {
          items = items.filter(item => item.type === "Expense");
        }

        if (selectedCategory !== "All") {
          items = items.filter(item => item.category === selectedCategory);
        }

        setFilteredItems(items);
      };

      filterItems();
    },
    [state.transactionItems, selectedTag, selectedCategory]
  );

  useEffect(() => {
    if (isDatabaseUpdated) {
      if(databaseUpdate){
        databaseUpdate();
      }
    }
    console.log("transactionPage added1:", isDatabaseUpdated);
    setIsDatabaseUpdated(false);
  }, [isDatabaseUpdated,databaseUpdate]);

  const handleTagClick = tag => {
    setSelectedTag(tag);
  };

  const handleIncomeCategoryChange = value => {
    console.log("refunds:", value);
    setSelectedCategory(value);

  };

  const handleExpenseCategoryChange = value => {
    setSelectedCategory(value);
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
  };

  const handleTag = tag => {
    setSelectedTag(tag);
  };
  const toggleButton = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleTransactionDelete = (transactionId) => {
    setIsDatabaseUpdated(!isDatabaseUpdated);
    console.log("transactionDelete:transactionpage: ", isDatabaseUpdated);
    dispatch({ type: "Transaction_Deleted", payload: transactionId });
  };
  const handleTransactionAddEdit = async () => {
    setIsDatabaseUpdated(!isDatabaseUpdated);
    console.log("transactionAdded:transactionpage: ", isDatabaseUpdated);
    const updatedTransactions = await getTransactions(userId, { startingDate, endingDate });
    dispatch({ type: "Transactions_Loaded", payload: updatedTransactions });
  };
  const handleUpdateSelection = (selection) => {
    setPopupSelection(selection);
    setIsPopupWindowOpened(true);
  }

  return (
    <div className="grid rounded bg-gray-300 py-10 px-3 m-3 mt-20 mb-20 grid-cols-1 lg:grid-cols-3 gap-3 ">
      <div className="flex items-center lg:col-span-1 h-full ">
        <div className=" w-full rounded-lg gap-3 runded-xl">
          <div className="flex flex-col p-10 gap-3 ">
            <div  ref={leftElementRef}
              className="flex left w-full h-40 justify-center cursor-pointer items-center rounded-lg text-[2rem] opacity-100 text-center hover:bg-incomeHover focus:bg-focusColor focus:test-gray-500 shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out "
              onClick={e => handleIncomeCard()}
            >
              Income
            </div>
            <div ref={rightElementRef}
              className=" flex right w-full h-40 cursor-pointer rounded-lg text-[2rem] text-white opacity-100 text-center justify-center items-center hover:bg-expenseHover focus:test-gray-500 focus:bg-gray-transparent shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out "
              onClick={e => handleExpenseCard()}
            >
              Expense
            </div>
          </div>
        </div>
      </div>
      <div className="  lg:col-span-2  rounded-lg">
        <div className=" w-full h-full bg-blurBC backdrop:blur-3xl rounded-lg border-[1px] border-incomeBC ">
          <div className="md:flex hidden flex-row justify-center items-center my-6 mx-10 text-black font-semibold">
            <Tag
              className={`w-full h-8 ${selectedTag === "All"
                ? "bg-gradient-to-r from-incomeHover to-expenseHover text-white"
                : "bg-gray-400"} hover:bg-goldenHover text-[1rem] text-center m-1 p-1 shadow-md cursor-pointer`}
              onClick={() => handleTagClick("All")}
            >
              All
            </Tag>
            
            <Tag
              className={`w-full h-8 ${selectedTag === "Income"
                ? "bg-incomeBC text-white"
                : "bg-gray-400"} hover:bg-incomeHover focus:bg-focusColor text-[1rem] text-center m-1 p-1 shadow-md cursor-pointer`}
              onClick={() => handleTagClick("Income")}
            >
              Income
              {selectedTag === "Income" &&
                <Select
                  className="flex w-full shadow-sm z-50"
                  value={selectedCategory}
                  onChange={handleIncomeCategoryChange}
                >
                  <Option value="All">All Incomes</Option>
                  {incomeCategories.map((category, index) =>
                    <Option key={index} value={category}>
                      {category}
                    </Option>
                  )}
                </Select>}
            </Tag>
            <Tag
              className={`w-full h-8 ${selectedTag === "Expense"
                ? "bg-expenseBC text-white"
                : "bg-gray-400"} hover:bg-expenseHover hover:text-white focus:bg-focusColor text-[1rem] text-center m-1 p-1 shadow cursor-pointer`}
              onClick={() => handleTagClick("Expense")}
            >
              Expense
              {selectedTag === "Expense" &&
                <Select
                  className="flex w-full shadow-sm z-50"
                  value={selectedCategory}
                  onChange={handleExpenseCategoryChange}
                >
                  <Option value="All">All Expenses</Option>
                  {expenseCategories.map((category, index) =>
                    <Option key={index} value={category}>
                      {category}
                    </Option>
                  )}
                </Select>}
            </Tag>
          </div>
          <div className="flex md:hidden w-full items-center justify-end  ">
            <button
              className="text-black focus:outline-none justify-end m-4 focus:test-gray-500  "
              onClick={toggleButton}
            >
              {isMenuOpen
                ? <FaXmark className="h-6 w-6 " />
                : <FaBars className="h-6 w-6 " />}
            </button>
          </div>
          <div
            className={`absolute space-y-2 z-30  right-10 w-[200px] mb-2 rounded-l-lg justify-end items-center py-3 transition-all duration-500000 ease-in-out  bg-primary bg-opacity-10  shadow-lg border-[3px] border-golden border-opacity-50 ${isMenuOpen
              ? " h-auto w-48 block justify-center items-center hover:transition-transform hovet:text-opacity-100  hover:duration-50000 hover:ease-in-out text-opacity-0 text-subText hover:text-opacity-100 hover:bg-white hover:border-opacity-100 mb-10"
              : "hidden"}`}
          >
            <ul className=" flex gap-1 relative w-full !mt-[8.00px] !text-[12px] cursor-pointer px-1 ![font-family:'Inter',Helvetica]  items-start">
              <li key="1" className=" w-full">
                <p
                  className="flex relative transform items-center hover:bg-goldenHover hover:shadow-golden h-8 pl-5 shadow-sm transition-transform w-full hover:font-bold bg-transparent  hover:text-[black]"
                  onClick={() => handleTag("All")}
                >
                  {" "}All{" "}
                </p>
                <p
                  className="flex justify-start pl-5 items-center h-8 !text-[12px] hover:bg-goldenHover hover:shadow-golden shadow-sm relative transform transition-transform w-full hover:font-bold bg-transparent  hover:text-[black]"
                  onClick={() => handleTag("Income")}
                >
                  {" "}Income{" "}
                  {selectedTag === "Income" &&
                    <Select
                      className="flex !text-[12px] w-full shadow-sm "
                      value={selectedCategory}
                      onChange={handleIncomeCategoryChange}
                    >
                      <Option className="!text-[12px] hover:bg-goldenHover hover:shadow-golden " value="All">All Incomes</Option>
                      {incomeCategories.map((category, index) =>
                        <Option className="!text-[12px] bg-golden hover:bg-goldenHover hover:shadow-golden" key={index} value={category}>
                          {category}
                        </Option>
                      )}
                    </Select>}
                </p>
                <p
                  className="flex relative items-center !text-[12px] h-8 transform pl-5 hover:bg-goldenHover hover:shadow-golden shadow-sm transition-transform w-full hover:font-bold bg-transparent  hover:text-[black]"
                  onClick={() => handleTag("Expense")}
                >
                  {" "}Expense{" "}
                  {selectedTag === "Expense" &&
                    <Select
                      className="flex !text-[12px] w-full mr-10 shadow-sm "
                      value={selectedCategory}
                      onChange={handleExpenseCategoryChange}
                    >
                      <Option className="!text-[12px]" value="All">All Expenses</Option>
                      {expenseCategories.map((category, index) =>
                        <Option className="!text-[12px]" key={index} value={category}>
                          {category}
                        </Option>
                      )}
                    </Select>}
                </p>
              </li>
            </ul>
          </div>
          <div className="backdrop-blur-md bg-white/90 p-2 m-3 border-[2px] rounded border-golden overflow-x-auto">
            <div className=" py-1.3 ">
              <table className=" table-auto w-full h-[400px]">
                <thead className=" w-full sm:no z-50 text-[0.8rem] md:text-[1rem] text-[black] font-semibold bg-goldenHover">
                  <tr key="index" className="flex w-full ">
                    <th className="flex w-[40%] border-[1px] pl-3 border-gray-500 justify-start items-center ">
                      About Income
                    </th>
                    <th className="flex w-[15%] justify-start items-center pl-3 border-[1px] border-gray-500 ">
                      Category
                    </th>
                    <th className="flex  w-[15%] justify-sart items-center pl-3 border-[1px] border-gray-500">
                      Date
                    </th>
                    <th className="flex  w-[15%] justify-start items-center pl-3 border-[1px] border-gray-500">
                      Amount
                    </th>
                    <th className="flex  w-[15%] justify-start items-center pl-3 border-[1px] border-gray-500" />
                  </tr>
                </thead>
                <tbody className="flex justify-center items-center max-h-[400px] shadow-md backdrop-blur-sm w-full text-white flex-wrap cursor-pointer">
                  {/*{filteredItems.map((element, index) =>
                    <ExpenseCard
                      key={index}
                      selection={element}
                      // id={element.transactionId}
                      // type={element.type}
                      // name={element.name}
                      // note={element.note}
                      // date={element.date}
                      // amount={element.amount}
                      // category={element.category}
                    />
                  )} */}
                  {filteredItems.map(item => (
                  <ExpenseCard key={item.transactionId} selection={item} onDelete={handleTransactionDelete} onOpen={handleUpdateSelection} />
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isPopupWindowOpened && (
        <div className="fixed cursor-pointer z-50 top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-80">
          <div className=" h-[95%] rounded-lg shadow-lg w-2/5 relative">
            <div className="relative flex">
              <TransactionForm type={popupType} Selection={popupSelection} onClose={closePopupWindow} onAddEdit={handleTransactionAddEdit} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
