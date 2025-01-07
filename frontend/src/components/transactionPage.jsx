// import React, { useEffect, useState, useReducer, useRef } from "react";
// import { Tag, Select } from "antd";
// import  ExpenseCard  from "./common/ExpenseCard";
// import { useNavigate } from "react-router-dom";
// import { FaXmark, FaBars } from "react-icons/fa6";
// import { getCategories, getTransactions } from "../Services/transactionService";
// import { useAuth } from "../hooks/useAuth";
// import TransactionForm from "./common/transactionForm";


// const { Option } = Select;

// const initialState = { transactionItems: [] };
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "Transactions_Loaded":
//       return { ...state, transactionItems: action.payload };
//     case "Filter_Transactions":
//       return { ...state, transactionItems: action.payload };
//     case "Transaction_Deleted":
//       return {
//         ...state,
//         transactionItems: state.transactionItems.filter(item => item.transactionId !== action.payload),
//       };
//     default:
//       return state;
//   }
// };

// const TransactionPage = ({ startingDate, endingDate, databaseUpdate }) => {
//   const navigate = useNavigate();
//   const { userId } = useAuth();
//   const [state, dispatch] = useReducer(reducer, initialState);
//   // const [isIncomeCardPressed, setIsIncomeCardPressed] = useState(false);
//   // const { transactionItems } = state;
//   // const [isExpenseCardPressed, setIsExpenseCardPressed] = useState(false);
//   // const [isPopupMenuOpened, setIsPopupMenuOpened] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [categories, setCategories] = useState({ income: [], expense: [] });
//   const [incomeCategories, setIncomeCategories] = useState([]);
//   const [expenseCategories, setExpenseCategories] = useState([]);
//   const [selectedTag, setSelectedTag] = useState("All");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [isPopupWindowOpened,setIsPopupWindowOpened]= useState(false);
//   const [isDatabaseUpdated,setIsDatabaseUpdated] = useState(false);
//   const [popupType, setPopupType] = useState("");
//   const [popupSelection, setPopupSelection] = useState();
//   const leftElementRef = useRef(null);
//   const rightElementRef = useRef(null);
//   const tableRef = useRef(null);
//   const tag1Ref = useRef(null);
//   const tag2Ref = useRef(null);
//   const tag3Ref = useRef(null);

//   useEffect(() => {
//     const loadTransactions = getTransactions(userId, { startingDate, endingDate});
//     console.log("starting Date(tpage):", startingDate);
//     const loadCategories = getCategories(userId);
//     loadCategories.then(categoriesData => {
//       //setCategories(categoriesData);
//       setIncomeCategories(categoriesData.income);
//       setExpenseCategories(categoriesData.expense);
//     });
//     loadTransactions.then(transactionItems => {
//       dispatch({ type: "Transactions_Loaded", payload: transactionItems });
//     });

//   }, [userId, startingDate, endingDate, isDatabaseUpdated]);

//   useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           console.log("Element in view:", entry.target); // Should log when the element is in view
//           if (entry.target === leftElementRef.current) {
//             console.log('Left Element in view');
//             entry.target.classList.add('left');
//           } else if (entry.target === rightElementRef.current) {
//             console.log('Right Element in view');
//             entry.target.classList.add('right');
//           } else if (entry.target === tableRef.current){
//             console.log('table in view'); 
//             entry.target.classList.add('table');
//           } else if (entry.target === tag1Ref.current || entry.target === tag2Ref.current || entry.target === tag3Ref.current){
//             console.log('tags in view');
//             entry.target.classList.add('tag');
//           }
//           observer.unobserve(entry.target); // Stop observing once the animation is triggered
//         }
//       });
//     }, { threshold: 0.5 });
  
//     if (leftElementRef.current) observer.observe(leftElementRef.current);
//     if (rightElementRef.current) observer.observe(rightElementRef.current);
//     if (tableRef.current) observer.observe(tableRef.current);
//     if (tag1Ref.current) observer.observe(tag1Ref.current);
//     if (tag2Ref.current) observer.observe(tag2Ref.current);
//     if (tag3Ref.current) observer.observe(tag3Ref.current);
//     return () => observer.disconnect();
//   }, []);
  

//   useEffect(() => {
//     if (isDatabaseUpdated) {
//       databaseUpdate();
//       // Reset istransactionAddEdit after operation
//     }
//     console.log("transactionPage added1:", isDatabaseUpdated);
//     setIsDatabaseUpdated(false);
//   }, [isDatabaseUpdated, databaseUpdate]);

//   useEffect(
//     () => {
//       const filterItems = () => {
//         let items = state.transactionItems;

//         if (selectedTag === "Income") {
//           items = items.filter(item => item.type === "Income");
//         } else if (selectedTag === "Expense") {
//           items = items.filter(item => item.type === "Expense");
//         }

//         if (selectedCategory !== "All") {
//           items = items.filter(item => item.category === selectedCategory);
//         }

//         setFilteredItems(items);
//       };

//       filterItems();
//     },
//     [state.transactionItems, selectedTag, selectedCategory]
//   );

//   const handleTagClick = tag => {
//     setSelectedTag(tag);
//   };

//   const handleIncomeCategoryChange = value => {
//     console.log("refunds:", value);
//     setSelectedCategory(value);

//   };

//   const handleExpenseCategoryChange = value => {
//     setSelectedCategory(value);
//   };

//   const handleIncomeCard = () => {
//     setIsPopupWindowOpened(true);
//     setPopupType("Income");
//     //navigate("/Form", { state: { type: "Income" } });
//   };

//   const handleExpenseCard = () => {
//     setIsPopupWindowOpened(true);
//     setPopupType("Expense");
//     //navigate("/Form", { state: { type: "Expense" } });
//   };

//   const closePopupWindow = () => {
//     setIsPopupWindowOpened(false);
//     setPopupSelection(null);
//   };

//   const handleTag = tag => {
//     setSelectedTag(tag);
//   };
//   const toggleButton = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };
//   const handleTransactionDelete = (transactionId) => {
//     setIsDatabaseUpdated(!isDatabaseUpdated);
//     console.log("transactionDelete:transactionpage: ", isDatabaseUpdated);
//     dispatch({ type: "Transaction_Deleted", payload: transactionId });
//   };
//   const handleTransactionAddEdit = async () => {
//     setIsDatabaseUpdated(true);
//     console.log("transactionAdded:transactionpage: ", isDatabaseUpdated);
//     // const updatedTransactions = await getTransactions(userId, { startingDate, endingDate });
//     // dispatch({ type: "Transactions_Loaded", payload: updatedTransactions });
//   };
//   const handleUpdateSelection = (selection) => {
//     setPopupSelection(selection);
//     setIsPopupWindowOpened(true);
//   }

//   return (
//     <div className="grid rounded bg-gray-100 backdrop-blur-lg back py-10 px-3 m-3 mt-20 mb-20 grid-cols-1 lg:grid-cols-5 gap-3 ">
//       <div className="flex items-center lg:col-span-1 h-full ">
//         <div className=" w-full rounded-lg gap-3 runded-xl">
//           <div className="md:flex md:flex-col grid grid-cols-2 md:p-10 md:gap-3 px-10 py-5 gap-2 items-center justify-center ">
//             <div  ref={leftElementRef} data-animation = "left"
//               className="flex opacity-0 transform-translateX(0%) w-full md:h-40 justify-center p-5 cursor-pointer items-center rounded-lg text-[2rem] text-center hover:bg-incomeHover focus:bg-focusColor focus:test-gray-500 shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out "
//               onClick={e => handleIncomeCard()}
//             >
//               Income
//             </div>
//             <div ref={rightElementRef} data-animation = "right"
//               className=" flex opacity-0 transform-translateX(0%) w-full md:h-40 cursor-pointer p-5 rounded-lg text-[2rem] text-white text-center justify-center items-center hover:bg-expenseHover focus:test-gray-500 focus:bg-gray-transparent shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out "
//               onClick={e => handleExpenseCard()}
//             >
//               Expense
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="  lg:col-span-4  rounded-lg" style={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(192, 192, 192, 0.2)", boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", border: "1px solid rgba(255, 255, 255, 0.3)" }}>
//         <div className=" w-full h-full backdrop-blur-lg rounded-lg border-[1px] ">
//           <div className="md:flex hidden flex-row justify-center items-center my-6 mx-10 text-black font-semibold">
//             <Tag ref={tag1Ref} data-animation = "tag"
//               className={`w-60 h-8 ${selectedTag === "All"
//                 ? "bg-[gray]"
//                 : "bg-transparent"} hover:bg-goldenHover rounded-xl text-[1rem] text-center m-1 p-1 shadow-md border-[#a2a2a2] border cursor-pointer`}
//               onClick={() => handleTagClick("All")}
//             >
//               All
//             </Tag>
            
//             <Tag ref={tag2Ref} data-animation = "tag"
//               className={`w-60 h-8 ${selectedTag === "Income"
//                 ? "bg-incomeBC text-white"
//                 : "bg-transparent"} hover:bg-incomeHover focus:bg-focusColor rounded-xl text-[1rem] border-[#a2a2a2] border text-center m-1 p-1 shadow-md cursor-pointer`}
//               onClick={() => handleTagClick("Income")}
//             >
//               Income
//               {selectedTag === "Income" &&
//                 <Select
//                   className="flex shadow-sm w-60 z-50"
//                   value={selectedCategory}
//                   onChange={handleIncomeCategoryChange}
//                 >
//                   <Option value="All">All Incomes</Option>
//                   {incomeCategories.map((category, index) =>
//                     <Option key={index} value={category}>
//                       {category}
//                     </Option>
//                   )}
//                 </Select>}
//             </Tag>
//             <Tag ref={tag3Ref} data-animation = "tag"
//               className={` w-60 h-8 ${selectedTag === "Expense"
//                 ? "bg-expenseBC text-white"
//                 : "bg-transparent"} hover:bg-expenseHover hover:text-white rounded-xl focus:bg-focusColor border-[#a2a2a2] border text-[1rem] text-center m-1 p-1 shadow cursor-pointer`}
//               onClick={() => handleTagClick("Expense")}
//             >
//               Expense
//               {selectedTag === "Expense" &&
//                 <Select
//                   className="flex w-60 shadow-sm z-50"
//                   value={selectedCategory}
//                   onChange={handleExpenseCategoryChange}
//                 >
//                   <Option value="All">All Expenses</Option>
//                   {expenseCategories.map((category, index) =>
//                     <Option key={index} value={category}>
//                       {category}
//                     </Option>
//                   )}
//                 </Select>}
//             </Tag>
//           </div>
//           <div className="flex md:hidden w-full items-center justify-end  ">
//             <button
//               className="text-black focus:outline-none justify-end m-4 focus:test-gray-500  "
//               onClick={toggleButton}
//             >
//               {isMenuOpen
//                 ? <FaXmark className="h-6 w-6 " />
//                 : <FaBars className="h-6 w-6 " />}
//             </button>
//           </div>
//           <div  
//             className={`absolute space-y-2 z-30  right-10 w-[200px] mb-2 rounded-l-lg justify-end items-center py-3 transition-all duration-500000 ease-in-out  bg-primary bg-opacity-10  shadow-lg border-[3px] border-golden border-opacity-50 ${isMenuOpen
//               ? " h-auto w-48 block justify-center items-center hover:transition-transform hovet:text-opacity-100  hover:duration-50000 hover:ease-in-out text-subText hover:text-opacity-100 hover:bg-white hover:border-opacity-100 mb-10"
//               : "hidden"}`}
//           >
//             <ul className=" flex gap-1 relative w-full !mt-[8.00px] !text-[12px] cursor-pointer px-1 ![font-family:'Inter',Helvetica]  items-start">
//               <li key="1" className=" w-full">
//                 <p
//                   className="flex relative transform items-center hover:bg-goldenHover hover:shadow-golden h-8 pl-5 shadow-sm transition-transform w-full hover:font-bold bg-transparent  hover:text-[black]"
//                   onClick={() => handleTag("All")}
//                 >
//                   {" "}All{" "}
//                 </p>
//                 <p
//                   className="flex justify-start pl-5 items-center h-8 !text-[12px] hover:bg-goldenHover hover:shadow-golden shadow-sm relative transform transition-transform w-full hover:font-bold bg-transparent  hover:text-[black]"
//                   onClick={() => handleTag("Income")}
//                 >
//                   {" "}Income{" "}
//                   {selectedTag === "Income" &&
//                     <Select
//                       className="flex !text-[12px] w-full shadow-sm "
//                       value={selectedCategory}
//                       onChange={handleIncomeCategoryChange}
//                     >
//                       <Option className="!text-[12px] hover:bg-goldenHover hover:shadow-golden " value="All">All Incomes</Option>
//                       {incomeCategories.map((category, index) =>
//                         <Option className="!text-[12px] bg-golden hover:bg-goldenHover hover:shadow-golden" key={index} value={category}>
//                           {category}
//                         </Option>
//                       )}
//                     </Select>}
//                 </p>
//                 <p
//                   className="flex relative items-center !text-[12px] h-8 transform pl-5 hover:bg-goldenHover hover:shadow-golden shadow-sm transition-transform w-full hover:font-bold bg-transparent  hover:text-[black]"
//                   onClick={() => handleTag("Expense")}
//                 >
//                   {" "}Expense{" "}
//                   {selectedTag === "Expense" &&
//                     <Select
//                       className="flex !text-[12px] w-full mr-10 shadow-sm "
//                       value={selectedCategory}
//                       onChange={handleExpenseCategoryChange}
//                     >
//                       <Option className="!text-[12px]" value="All">All Expenses</Option>
//                       {expenseCategories.map((category, index) =>
//                         <Option className="!text-[12px]" key={index} value={category}>
//                           {category}
//                         </Option>
//                       )}
//                     </Select>}
//                 </p>
//               </li>
//             </ul>
//           </div>
//           <div className="backdrop-blur-md  bg-white/90 p-2 m-3 rounded overflow-hidden hover:overflow-auto ">
//             <div className=" py-1.3 ">
//               <table ref={tableRef} data-animation = "table" className=" table-auto w-full h-[400px] rounded-2xl">
//                 <thead className="flex w-full sm:no z-50 text-[0.8rem] md:text-[1rem] text-[black] font-semibold h-12 bg-gray-expenseBC rounded-2xl ">
//                   <tr key="index" className="flex w-full items-center content-center bg-golden rounded-lg">
//                     <th className="flex w-[35%] pl-6 border-gray-500 justify-start items-center ">
//                       About Transaction
//                     </th>
//                     <th className="flex w-[20%] justify-start items-center pl-3 border-gray-500 ">
//                       Category
//                     </th>
//                     <th className="flex  w-[15%] justify-sart items-center pl-3 border-gray-500">
//                       Date
//                     </th>
//                     <th className="flex  w-[15%] justify-start items-center pl-3 border-gray-500">
//                       Amount
//                     </th>
//                     <th className="flex  w-[15%] justify-start items-center pl-3 border-gray-500" />
//                   </tr>
//                 </thead>
//                 <tbody className="flex justify-center gap-2 items-center max-h-[400px] backdrop-blur-sm w-full text-white flex-wrap cursor-pointer overflow-y-hidden hover:overflow-y-auto">
//                   {/*{filteredItems.map((element, index) =>
//                     <ExpenseCard
//                       key={index}
//                       selection={element}
//                       // id={element.transactionId}
//                       // type={element.type}
//                       // name={element.name}
//                       // note={element.note}
//                       // date={element.date}
//                       // amount={element.amount}
//                       // category={element.category}
//                     />
//                   )} */}
//                   {filteredItems.map(item => (
//                   <ExpenseCard key={item.transactionId} selection={item} onDelete={handleTransactionDelete} onOpen={handleUpdateSelection} />
//                 ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//       {isPopupWindowOpened && (
//         <div className="fixed cursor-pointer z-50 top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-80">
//           <div className=" h-[95%] rounded-lg shadow-lg w-2/5 relative">
//             <div className="relative flex">
//               <TransactionForm type={popupType} Selection={popupSelection} onClose={closePopupWindow} onAddEdit={() =>{handleTransactionAddEdit()}} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TransactionPage;


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

  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         console.log("Element in view:", entry.target); // Should log when the element is in view
  //         if (entry.target === leftElementRef.current) {
  //           console.log('Left Element in view');
  //           entry.target.classList.add('left');
  //         } else if (entry.target === rightElementRef.current) {
  //           console.log('Right Element in view');
  //           entry.target.classList.add('right');
  //         } else if (entry.target === tableRef.current){
  //           console.log('table in view'); 
  //           entry.target.classList.add('table');
  //         } else if (entry.target === tag1Ref.current || entry.target === tag2Ref.current || entry.target === tag3Ref.current){
  //           console.log('tags in view');
  //           entry.target.classList.add('tag');
  //         }
  //         observer.unobserve(entry.target); // Stop observing once the animation is triggered
  //       }
  //     });
  //   }, { threshold: 0.5 });
  
  //   if (leftElementRef.current) observer.observe(leftElementRef.current);
  //   if (rightElementRef.current) observer.observe(rightElementRef.current);
  //   if (tableRef.current) observer.observe(tableRef.current);
  //   if (tag1Ref.current) observer.observe(tag1Ref.current);
  //   if (tag2Ref.current) observer.observe(tag2Ref.current);
  //   if (tag3Ref.current) observer.observe(tag3Ref.current);
  //   return () => observer.disconnect();
  // }, []);

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
  // const handleTransactionDelete = (transactionId) => {
  //   setIsDatabaseUpdated(!isDatabaseUpdated);
  //   console.log("transactionDelete:transactionpage: ", isDatabaseUpdated);
  //   dispatch({ type: "Transaction_Deleted", payload: transactionId});
  // };

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
