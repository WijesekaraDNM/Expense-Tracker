// import React, { useEffect, useState, useRef } from "react";
// import { useAuth } from "../hooks/useAuth";
// import { PieChart } from "@mui/x-charts";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Line, ComposedChart, Legend } from 'recharts';
// //import { BarChart } from '@mui/x-charts/BarChart';
// import { axisClasses } from '@mui/x-charts/ChartsAxis';
// import { useMediaQuery } from '@mui/material';
// import {
//   calculateCategoricalAmounts,
//   calculateTransactions,
//   dailyForcastOfIncomeExpense
// } from "../Services/transactionService";
// import './../index.css';

// const Dashboard = ({ setLocalStartingDate, setLocalEndingDate, databaseUpdate }) => {
//   const [calculations, setCalculations] = useState({});
//   const [categoricalCalculations, setCategoricalCalculations] = useState({
//     income: [],
//     expense: []
//   });

//   const { userId } = useAuth();
//   const [data, setData] = useState([]);
//   const [dData, setDData] = useState([]);
//   const [mData, setMData] = useState([]);
//   const [yData, setYData] = useState([]);
//   const [selectedIncomeCategory, setSelectedIncomeCategory] = useState(null);
//   const [selectedExpenseCategory, setSelectedExpenseCategory] = useState(null);
//     const [currentSlide, setCurrentSlide] = useState(0);
//   const slides = ["daily", "monthly", "annually"];
//   const [showNetIncomeCard, setShowNetIncomeCard] = useState(false);
//   const [startingDate, setStartingDate] = useState();
//   const [endingDate, setEndingDate] = useState();
//   const bottom1ElementRef = useRef(null);
//   const bottom2ElementRef = useRef(null);

//   const isSmallScreen = useMediaQuery('(max-width:600px)'); // Phones
//   const isMediumScreen = useMediaQuery('(max-width:960px)'); // Tablets
//   const isLargeScreen = useMediaQuery('(min-width:961px)'); // Laptops and larger devices

//   // Define responsive properties
//   const chartHeight = isSmallScreen ? 200 : isMediumScreen ? 250 : 300;
//   const barSize = isSmallScreen ? 30 : isMediumScreen ? 50 : 60;

//   // Responsive font sizes
//   const fontSizeAxis = isSmallScreen ? '0.7rem' : isMediumScreen ? '0.85rem' : '1rem';
//   const fontSizeLabel = isSmallScreen ? '0.8rem' : isMediumScreen ? '1rem' : '1.2rem';

//   const marginRight = isSmallScreen ? 5 : isMediumScreen ? 10 : 20;
//   const marginLeft = isSmallScreen ? 20 : isMediumScreen ? 30 : 50;
//   const dxYAxis = isSmallScreen ? -20 : isMediumScreen ? -30 : -40;

//   useEffect(() => {

//       console.log("Local Starting Date(dash): ", startingDate);
//       console.log("Local Ending Date(dash): ", endingDate);
//       const loadCalculations = calculateTransactions(userId,{startingDate,endingDate});
//       const loadCategoricalAmounts = calculateCategoricalAmounts(userId,{startingDate, endingDate});
//       const loadForecastData = dailyForcastOfIncomeExpense(userId);
//       loadCalculations.then(fetchedData => {
//         setCalculations(fetchedData);
//         console.log("load calculations:", fetchedData);
//       });
//       loadCategoricalAmounts.then(fetchData => {
//         setCategoricalCalculations(fetchData);
//       });
//       loadForecastData.then(fetchData => {
//         setDData(fetchData.daily.slice(-7));
//         setMData(fetchData.monthly.slice(-7));
//         setYData(fetchData.annually.slice(-7));
//       });

//       // Set up interval for automatic slide change
//       const interval = setInterval(() => {
//         setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
//       }, 10000); // Change slide every minute

//       // Clean up interval on component unmount
//       return () => clearInterval(interval);
//     },
//     [userId, startingDate, endingDate,databaseUpdate ]
//   );

//   useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           console.log("Element in view:", entry.target); // Should log when the element is in view
//           if (entry.target === bottom1ElementRef.current) {
//             console.log('Bottom1 Element in view');
//             entry.target.classList.add('bottom1');
//           } else if (entry.target === bottom2ElementRef.current) {
//             console.log('Bottom2 Element in view');
//             entry.target.classList.add('bottom2');
//           }
//           observer.unobserve(entry.target); // Stop observing once the animation is triggered
//         }
//       });
//     }, { threshold: 0.5 });

//     if (bottom1ElementRef.current) observer.observe(bottom1ElementRef.current);
//     if (bottom2ElementRef.current) observer.observe(bottom2ElementRef.current);

//     return () => observer.disconnect();
//   }, []);

//   const handleStartingDate = (e) => {
//     setLocalStartingDate(e.target.value);
//     setStartingDate(e.target.value);
//   };
//   const handleEndingDate = (e) => {
//     setLocalEndingDate(e.target.value);
//     setEndingDate(e.target.value);
//   };

//   const incomeData = categoricalCalculations.income.map(item => ({
//     id: item.category,
//     label: item.category,
//     value: item.amount
//   }));
//   const expenseData = categoricalCalculations.expense.map(item => ({
//     id: item.category,
//     label: item.category,
//     value: item.amount
//   }));

//   const getDataForSlide = () => {
//     switch (currentSlide) {
//       case 0: return dData;
//       case 1: return mData;
//       case 2: return yData;
//       default: return [];
//     }
//   };

//   const dataForChart = getDataForSlide().map(item => ({
//     date: item.date,
//     totalIncome: item.totalIncome,
//     totalExpense: item.totalExpense,
//     netIncome: item.netIncome,
//     title: item.title
//   }));

//   const incomeColorPalette = [
//     "#228B22", // Forest Green
//     "#87CEEB", // Sky Blue
//     "#2E8B57", // Sea Green
//     "#4682B4", // Steel Blue
//     "#90EE90", // Light Green
//     "#40E0D0", // Turquoise
//     "#6A5ACD", // Slate Blue
//     "#98FF98", // Pale Green
//     "#00FF7F", // Spring Green
//     "#20B2AA", // Light Sea Green
//     "#32CD32", // Lime Green
//     "#3CB371", // Medium Sea Green
//     "#7FFF00", // Chartreuse
//     "#00FA9A", // Medium Spring Green
//     "#8FBC8F", // Dark Sea Green
//     "#00FF00", // Lime
//     "#ADFF2F", // Green Yellow
//     "#00FF00", // Lime (duplicate)
//     "#9ACD32", // Yellow Green
//     "#66CDAA"  // Medium Aquamarine
//   ];
//   const expenseColorPalette = [
//     "#DC143C", // Crimson
//     "#333333", // Dark Gray
//     "#B22222", // Firebrick
//     "#708090", // Slate Gray
//     "#F08080", // Light Coral
//     "#B2BEB5", // Ash Gray
//     "#8B0000", // Dark Red
//     "#C0C0C0", // Silver
//     "#FF6347", // Tomato
//     "#A52A2A", // Brown
//     "#CD5C5C", // Indian Red
//     "#D2691E", // Chocolate
//     "#FF4500", // Orange Red
//     "#FF0000", // Red
//     "#F5DEB3", // Wheat
//     "#FF8C00", // Dark Orange
//     "#B8860B", // Dark Goldenrod
//     "#D3D3D3", // Light Gray
//     "#C71585", // Medium Violet Red
//     "#E9967A"  // Dark Salmon
//   ];

//   const handleIncomeSliceClick = (event,index) => {
//     const categoryIndex = typeof index === 'object' && index !== null ? index.dataIndex : index;
//     const category = incomeData[categoryIndex]?.id;
//     setSelectedIncomeCategory(category);
//     console.log('Selected Category:', category);
//   };
//   const handleExpenseSliceClick = (event,index) => {
//     const categoryIndex = typeof index === 'object' && index !== null ? index.dataIndex : index;
//     const category = expenseData[categoryIndex]?.id;
//     setSelectedExpenseCategory(category);
//     console.log('Selected Category:', category);
//   };
//   const selectedIncomeAmount = incomeData.find(item => item.id === selectedIncomeCategory)?.value;
//   const selectedExpenseAmount = expenseData.find(item => item.id === selectedExpenseCategory)?.value;

//   const formatAmount = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     }).format(amount);
//   };

//  const chartSetting = {
//   yAxis: [
//     {
//       label: 'Amount',
//       axisLabel: {
//         fontSize: 20,
//         color: '#333',
//       },

//       tick: {
//         fontSize: 12,
//         color: '#666',
//       },
//     },
//   ],
//   width: 800,
//   height: 350,
//   sx: {
//     [`.${axisClasses.left} .${axisClasses.label}`]: {
//       transform: 'translate(-20px, 0)',
//     },
//   },
// };

// const valueFormatter = (value) => `$${value}`;

//   return (
//   <>
//     <div className="flex inset-0 transition-transform duration-2000 ease-in-out w-full flex-col backdrop:blur-lg mb-2 justify-center px-5 items-center">

//     <div className="grid grid-cols-1 lg:grid-cols-8 justify-center w-full gap-10">
//       <div className=" relative lg:flex hidden  lg:col-span-2 ">
//         <div className="absolute end left-2 h-60 hover:z-50 w-60 border-[2rem] border-solid rounded-full items-center flex justify-center focus:bg-white hover:bg-white shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-incomeBC focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out" >
//           <div className="m-2 relative">
//             <input
//               type="date"
//               className="peer m-0 block h-[58px] focus:shadow-md focus:shadow-incomeBC w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black transition duration-200 ease-linear placeholder:text-transparent focus:border-white focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
//               id="floatingDate"
//               onChange={handleEndingDate}
//             />
//             <label
//               htmlFor="floatingDate"
//               className="pointer-events-none absolute font-bold left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-black transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
//             >
//               Ending Date
//             </label>
//           </div>
//         </div>
//         <div className="absolute start top-32 hover:z-50 left-32 h-60 w-60 border-[2rem] border-solid rounded-full items-center flex justify-center focus:bg-white hover:bg-white shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-expenseBC focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out" >
//           <div className="relative m-2">
//               <input
//                 type="date"
//                 className="peer m-0 block h-[58px] focus:shadow-md focus:shadow-incomeBC w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black transition duration-200 ease-linear placeholder:text-transparent focus:border-white focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
//                 id="floatingDate"
//                 onChange={handleStartingDate}
//               />
//               <label
//                 htmlFor="floatingDate"
//                 className="pointer-events-none absolute font-bold left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-black transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
//               >
//                 Starting Date
//               </label>
//             </div>
//           </div>
//         </div>
//         <div className=" lg:col-span-6 w-full rounded-2xl " style={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(192, 192, 192, 0.2)", boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", border: "1px solid rgba(255, 255, 255, 0.3)" }}>
//             <div className="flex justify-center">
//               <h1 className=" self-center p-3 mt-1 md:text-2xl text-xl font-bold">{dataForChart.length > 0 ? dataForChart[0].title : "Default Title"}</h1>
//             </div>
//             <ResponsiveContainer width="90%" height={300} margin={10} >
//               <ComposedChart
//                 data={dataForChart}
//                 margin={{ top: 20, right: marginRight, left: marginLeft, bottom: 5 }}
//                 barSize={barSize}
//               >
//               <defs>
//                 <linearGradient id="incomeGradient" x1="1" y1="0" x2="0" y2="0">
//                 <stop offset="0%" stopColor="#00DDA2" />
//                 <stop offset="50%" stopColor="#00E7B1" />
//                 </linearGradient>
//                 <linearGradient id="expenseGradient" x1="1" y1="0" x2="0" y2="0">
//                   <stop offset="0%" stopColor="#334050" />
//                   <stop offset="100%" stopColor="#28323e" />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid horizontal={true} vertical={false} stroke="#626262"/>

//                 <XAxis
//                   dataKey="date"
//                   tick={{ fontSize: fontSizeAxis, fill: '#000', fontWeight:'bold' }}
//                   label={{ value: 'Date', fontSize: fontSizeAxis, fill: '#CC0909', position:'insideBottoRight', fontWeight:'bold', offset: 10, dy:14 }}
//                   stroke="#334050" // Axis line color
//                   strokeWidth={3}
//                 />
//                 <YAxis
//                   tick={{ fontSize: fontSizeAxis, fill: '#000', fontWeight:'bold'  }}
//                   label={{ value: 'Amount', angle: -90, position: 'outsideLeft', fontSize: fontSizeAxis, fill: '#CC0909', fontWeight:'bold', offset: 10, dx:dxYAxis }}
//                   stroke="#334050" // Axis line color
//                   strokeWidth={3}
//                 />
//                 <Tooltip />
//                 <Legend/>
//                 <Bar dataKey="totalIncome" fill="url(#incomeGradient)" radius={[5, 5, 0, 0]} width={10}/>
//                 <Bar dataKey="totalExpense" fill="url(#expenseGradient)" radius={[5, 5, 0, 0]}/>
//                 <Line type="monotone" dataKey="netIncome" stroke="#FF0000" strokeWidth={2} />
//               </ComposedChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     <div className="lg:hidden flex justify-center items-center">
//     <div className=" relative  lg:hidden flex py-5 lg:col-span-2 ">
//       <div ref={bottom1ElementRef} className="left-triangle-clip p-3 pr-0 opacity-0 h-20 rounded-l bottom1 items-center flex justify-center focus:bg-white hover:bg-white shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-incomeBC
//       focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out
//        " >
//         <div className="relative m-2">
//           <input
//             type="date"
//             className="peer m-0 block h-[50px] focus:shadow-md focus:shadow-incomeBC w-36 rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black transition duration-200 ease-linear placeholder:text-transparent focus:border-white focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
//             id="floatingDate"
//             onChange={handleStartingDate}
//           />
//           <label
//             htmlFor="floatingDate"
//             className="pointer-events-none absolute font-bold left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-black transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
//           >
//             Starting Date
//           </label>
//         </div>
//       </div>
//       <div ref={bottom2ElementRef} className=" right-triangle-clip opacity-0 p-3 pl-0 w-full h-20 rounded-r items-center bottom2 flex justify-center focus:bg-white hover:bg-white shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-expenseBC focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out">
//         <div className="m-2 relative">
//           <input
//             type="date"
//             className="peer m-0 block h-[50px] focus:shadow-md focus:shadow-incomeBC w-36 rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black transition duration-200 ease-linear placeholder:text-transparent focus:border-white focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
//             id="floatingDate"
//             onChange={handleEndingDate}
//           />
//           <label
//             htmlFor="floatingDate"
//             className="pointer-events-none absolute font-bold left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-black transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
//           >
//             Ending Date
//           </label>
//         </div>
//       </div>
//       </div>
//     </div>
//     <div className="flex mx-2 lg:hidden items-center justify-center net-income-card_sm">
//       <div className={` flex flex-col items-center justify-center ${calculations.rest < 0 ? "bg-expenseBC expense text-white": "bg-incomeBC text-black income"} text-lg p-5 rounded-lg shadow-2xl shadow-expenseBC`}>
//         <h3 className="text-[#9d2828] font-bold">Net Income</h3>
//         <p className=" font-bold text-2xl">Rs. {formatAmount(calculations.rest)}</p>
//       </div>
//     </div>
//     <div className={`flex ${calculations.rest < 0 ? "pipe-border2": " pipe-border1"}  mx-2 lg:mt-4`}></div>
//     <div className="grid lg:grid-cols-2 grid-cols-1 px-2 gap-3 ">
//       <div className={`flex ${calculations.rest < 0 ? "bg-incomeBC": " bg-expenseBC"} rounded-r justify-center lg:justify-start flex-row-reverse lg:flex-row`}>
//         <div className="flex justify-center items-center bg-gray-200 rounded-full  relative m-2 mx-0 lg:m-3 p-2">
//           <PieChart
//             series={[
//               {
//                 //arcLabel: (item) => `${item.id}`,
//                 data: incomeData,
//                 outerRadius:90,
//                 innerRadius: 70,
//                 paddingAngle: 0.5,
//                 cornerRadius: 5,
//                 startAngle: 0,
//                 endAngle: 360,
//                 cx: 85,
//                 cy: 85,

//               }
//             ]}
//             colors={incomeColorPalette}
//             onItemClick={handleIncomeSliceClick}
//             width={180}
//             height={180}
//             slotProps={{ legend: { hidden: true } }}
//             className="responsive-chart"

//           />
//            <div style={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               textAlign: "center",
//               fontSize: "sm",
//               fontWeight: "bold",
//               pointerEvents: "none"
//             }}>
//            {(selectedIncomeCategory !== null)? (
//             <div>
//                   <span className=" text-[10px] font-bold lg:text-md text-expenseBC font-serif">{selectedIncomeCategory}</span>
//                   <br /><span className=" text-md lg:text-lg text-incomeAmount font-mono">  Rs.{selectedIncomeAmount}</span>
//             </div>
//             ):(<span className=" text-lg lg:text-xl text-expenseBC font-serif"><img src="/money_Increase.png" alt="" className=" bg-cover w-16 h-16"/></span>)}
//             </div>
//         </div>
//         <div className="flex flex-col h-32 sm:h-auto lg:col-start-1 lg:row-start-1 p-3 my-3 mx-2 md:m-3 rounded-lg border-incomeBC bg-white text-center justify-center items-center w-[60%]">
//           <p className=" text-black font-bold text-2xl md:text-4xl font-sans p-3">
//             Total Income
//           </p>
//           <p className=" text-incomeAmount font-semibold font-mono text-2xl md:text-3xl">
//            <span>Rs</span>{formatAmount(calculations.totalIncome)}
//           </p>
//         </div>
//       </div>
//       <div className={`flex ${calculations.rest < 0 ? "bg-incomeBC": " bg-expenseBC"} rounded-l justify-center lg:justify-end`}>
//         <div className="flex flex-col p-3 h-32 sm:h-auto my-3 mx-2 md:m-3 bg-white justify-center text-center items-center rounded-lg w-[60%]">
//           <p className="flex text-gray-800 text-2xl md:text-4xl font-bold font-sans p-3">Total Expense</p>
//           <p className="flex text-expenseAmount font-semibold font-mono md:text-3xl text-2xl">
//             Rs{formatAmount(calculations.totalExpense)}
//           </p>
//         </div>
//         <div className="flex justify-center items-center bg-gray-200 rounded-full relative m-2 mx-0  p-2 lg:m-3">
//           <PieChart
//             series={[
//               {
//                 data: expenseData,
//                 outerRadius: 90,
//                 innerRadius: 70,
//                 paddingAngle: 0.5,
//                 cornerRadius: 5,
//                 startAngle: 0,
//                 endAngle: 360,
//                 cx: 85,
//                 cy: 85,

//               }
//             ]}
//             colors={expenseColorPalette}
//             onItemClick={handleExpenseSliceClick}
//             width={180}
//             height={180}
//             slotProps={{ legend: { hidden: true } }}
//             className="responsive-chart"

//           />
//            <div style={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               textAlign: "center",
//               fontSize: "lg",
//               fontWeight: "bold",
//               pointerEvents: "none"
//             }}>
//            {(selectedExpenseCategory !== null)? (
//             <div>
//                   <span className=" text-[10px] font-bold lg:text-md text-expenseBC font-serif">{selectedExpenseCategory}</span>
//                   <br /><span className=" text-md lg:text-lg  text-expenseAmount font-mono">  Rs.{selectedExpenseAmount}</span>
//             </div>
//             ):(<span className=" text-xl text-expenseBC font-serif"><img src="/money_Decrease.png" alt="" className=" bg-cover w-16 h-16"/></span>)}
//             </div>
//         </div>
//         <div className="net-income-card hidden lg:flex">
//           <div className={` flex flex-col items-center justify-center ${calculations.rest < 0 ? "bg-expenseBC text-white": " bg-incomeBC text-black"} text-lg p-5 rounded-lg shadow-2xl shadow-expenseBC`}>
//             <h3 className={` ${calculations.rest < 0 ? "text-[#f93838]": "text-[#ad2525]"} font-bold text-xl`}>Net Income</h3>
//             <p className=" font-bold text-2xl">Rs. {formatAmount(calculations.rest)}</p>
//           </div>
//       </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { PieChart } from "@mui/x-charts";
import {
  BarChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Legend
} from "recharts";
//import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { useMediaQuery } from "@mui/material";
import {
  calculateCategoricalAmounts,
  calculateTransactions,
  dailyForcastOfIncomeExpense
} from "../Services/transactionService";
import "./../index.css";

const Dashboard = ({
  startingDate,
  endingDate,
  databaseUpdate
}) => {
  const [calculations, setCalculations] = useState({});
  const [categoricalCalculations, setCategoricalCalculations] = useState({
    income: [],
    expense: []
  });

  const { userId } = useAuth();
  const [data, setData] = useState([]);
  const [dData, setDData] = useState([]);
  const [mData, setMData] = useState([]);
  const [yData, setYData] = useState([]);
  const [selectedIncomeCategory, setSelectedIncomeCategory] = useState(null);
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ["daily", "monthly", "annually"];
  const [showNetIncomeCard, setShowNetIncomeCard] = useState(false);
  const bottom1ElementRef = useRef(null);
  const bottom2ElementRef = useRef(null);

  const isSmallScreen = useMediaQuery("(max-width:600px)"); // Phones
  const isMediumScreen = useMediaQuery("(max-width:960px)"); // Tablets
  const isLargeScreen = useMediaQuery("(min-width:961px)"); // Laptops and larger devices

  // Define responsive properties
  const chartHeight = isSmallScreen ? 200 : isMediumScreen ? 250 : 300;
  const barSize = isSmallScreen ? 30 : isMediumScreen ? 50 : 60;

  // Responsive font sizes
  const fontSizeAxis = isSmallScreen
    ? "0.6rem"
    : isMediumScreen ? "0.7rem" : "0.85rem";
  const fontSizeLabel = isSmallScreen
    ? "0.85rem"
    : isMediumScreen ? "0.9rem" : "1rem";

  const marginRight = isSmallScreen ? 5 : isMediumScreen ? 10 : 20;
  const marginLeft = isSmallScreen ? 0 : isMediumScreen ? 10 : 30;
  const dxYAxis = isSmallScreen ? -20 : isMediumScreen ? -30 : -40;

  useEffect(
    () => {
      console.log("Local Starting Date(dash): ", startingDate);
      console.log("Local Ending Date(dash): ", endingDate);
      const loadCalculations = calculateTransactions(userId, {
        startingDate,
        endingDate
      });
      const loadCategoricalAmounts = calculateCategoricalAmounts(userId, {
        startingDate,
        endingDate
      });
      const loadForecastData = dailyForcastOfIncomeExpense(userId);
      loadCalculations.then(fetchedData => {
        setCalculations(fetchedData);
        console.log("load calculations:", fetchedData);
      });
      loadCategoricalAmounts.then(fetchData => {
        setCategoricalCalculations(fetchData);
      });
      loadForecastData.then(fetchData => {
        setDData(fetchData.daily.slice(-7));
        setMData(fetchData.monthly.slice(-7));
        setYData(fetchData.annually.slice(-7));
      });

      // Set up interval for automatic slide change
      const interval = setInterval(() => {
        setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
      }, 10000); // Change slide every minute

      // Clean up interval on component unmount
      return () => clearInterval(interval);
    },
    [userId, startingDate, endingDate, databaseUpdate]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log("Element in view:", entry.target); // Should log when the element is in view
            if (entry.target === bottom1ElementRef.current) {
              console.log("Bottom1 Element in view");
              entry.target.classList.add("bottom1");
            } else if (entry.target === bottom2ElementRef.current) {
              console.log("Bottom2 Element in view");
              entry.target.classList.add("bottom2");
            }
            observer.unobserve(entry.target); // Stop observing once the animation is triggered
          }
        });
      },
      { threshold: 0.5 }
    );

    if (bottom1ElementRef.current) observer.observe(bottom1ElementRef.current);
    if (bottom2ElementRef.current) observer.observe(bottom2ElementRef.current);

    return () => observer.disconnect();
  }, []);

  const incomeData = categoricalCalculations.income.map(item => ({
    id: item.category,
    label: item.category,
    value: item.amount
  }));
  const expenseData = categoricalCalculations.expense.map(item => ({
    id: item.category,
    label: item.category,
    value: item.amount
  }));

  const getDataForSlide = () => {
    switch (currentSlide) {
      case 0:
        return dData;
      case 1:
        return mData;
      case 2:
        return yData;
      default:
        return [];
    }
  };

  const dataForChart = getDataForSlide().map(item => ({
    date: item.date,
    totalIncome: item.totalIncome,
    totalExpense: item.totalExpense,
    netIncome: item.netIncome,
    title: item.title
  }));

  const incomeColorPalette = [
    "#228B22", // Forest Green
    "#87CEEB", // Sky Blue
    "#2E8B57", // Sea Green
    "#4682B4", // Steel Blue
    "#90EE90", // Light Green
    "#40E0D0", // Turquoise
    "#6A5ACD", // Slate Blue
    "#98FF98", // Pale Green
    "#00FF7F", // Spring Green
    "#20B2AA", // Light Sea Green
    "#32CD32", // Lime Green
    "#3CB371", // Medium Sea Green
    "#7FFF00", // Chartreuse
    "#00FA9A", // Medium Spring Green
    "#8FBC8F", // Dark Sea Green
    "#00FF00", // Lime
    "#ADFF2F", // Green Yellow
    "#00FF00", // Lime (duplicate)
    "#9ACD32", // Yellow Green
    "#66CDAA" // Medium Aquamarine
  ];
  const expenseColorPalette = [
    "#DC143C", // Crimson
    "#333333", // Dark Gray
    "#B22222", // Firebrick
    "#708090", // Slate Gray
    "#F08080", // Light Coral
    "#B2BEB5", // Ash Gray
    "#8B0000", // Dark Red
    "#C0C0C0", // Silver
    "#FF6347", // Tomato
    "#A52A2A", // Brown
    "#CD5C5C", // Indian Red
    "#D2691E", // Chocolate
    "#FF4500", // Orange Red
    "#FF0000", // Red
    "#F5DEB3", // Wheat
    "#FF8C00", // Dark Orange
    "#B8860B", // Dark Goldenrod
    "#D3D3D3", // Light Gray
    "#C71585", // Medium Violet Red
    "#E9967A" // Dark Salmon
  ];

  const handleIncomeSliceClick = (event,index) => {
    const categoryIndex = typeof index === 'object' && index !== null ? index.dataIndex : index;
    const category = incomeData[categoryIndex]?.id;
    setSelectedIncomeCategory(category);
    console.log('Selected Category:', category);
  };
  const handleExpenseSliceClick = (event,index) => {
    const categoryIndex = typeof index === 'object' && index !== null ? index.dataIndex : index;
    const category = expenseData[categoryIndex]?.id;
    setSelectedExpenseCategory(category);
    console.log('Selected Category:', category);
  };
  const selectedIncomeAmount = incomeData.find(item => item.id === selectedIncomeCategory)?.value;
  const selectedExpenseAmount = expenseData.find(item => item.id === selectedExpenseCategory)?.value;

  const formatAmount = amount => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const chartSetting = {
    yAxis: [
      {
        label: "Amount",
        axisLabel: {
          fontSize: 20,
          color: "#333"
        },

        tick: {
          fontSize: 12,
          color: "#666"
        }
      }
    ],
    width: 800,
    height: 350,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)"
      }
    }
  };

  const valueFormatter = value => `$${value}`;

  return (
    <>
      <div className="flex inset-0 transition-transform duration-2000 ease-in-out w-full backdrop:blur-lg justify-center items-center">
        <div className=" justify-center w-[95%] lg:gap-10">
          {/* <div className=" relative lg:flex hidden  lg:col-span-2 ">
            <div className="absolute end left-2 h-60 hover:z-50 w-60 border-[2rem] border-solid rounded-full items-center flex justify-center focus:bg-white hover:bg-white shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-incomeBC focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out">
              <div className="m-2 relative">
                <input
                  type="date"
                  className="peer m-0 block h-[58px] focus:shadow-md focus:shadow-incomeBC w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black transition duration-200 ease-linear placeholder:text-transparent focus:border-white focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                  id="floatingDate"
                  onChange={handleEndingDate}
                />
                <label
                  htmlFor="floatingDate"
                  className="pointer-events-none absolute font-bold left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-black transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
                >
                  Ending Date
                </label>
              </div>
            </div>
            <div className="absolute start top-32 hover:z-50 left-32 h-60 w-60 border-[2rem] border-solid rounded-full items-center flex justify-center focus:bg-white hover:bg-white shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-expenseBC focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out">
              <div className="relative m-2">
                <input
                  type="date"
                  className="peer m-0 block h-[58px] focus:shadow-md focus:shadow-incomeBC w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black transition duration-200 ease-linear placeholder:text-transparent focus:border-white focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                  id="floatingDate"
                  onChange={handleStartingDate}
                />
                <label
                  htmlFor="floatingDate"
                  className="pointer-events-none absolute font-bold left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-black transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
                >
                  Starting Date
                </label>
              </div>
            </div>
          </div> */}
          <div
            className=" w-full rounded-md md:p-3 p-1 gap-5 flex flex-col justify-center items-center"
            style={{ backdropFilter: "blur(10px)", backgroundColor: "black", boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", border: "1px solid rgba(255, 255, 255, 0.3)" }}
          >
              <div className="lg:col-span-7 w-full h-[60vh] items-center flex flex-col bg-white justify-center rounded-lg" 
                  style={{
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.5)"
                  }}>
                <h1 className=" self-center mt-1 md:text-xl text-lg font-bold">
                  {dataForChart.length > 0
                    ? dataForChart[0].title
                    : "Default Title"}
                </h1>
                <ResponsiveContainer
                  width="100%"
                  height="80%"
                  style={{ padding:"2px"}}
                >
                  <ComposedChart
                    data={dataForChart}
                    margin={{
                      top: 20,
                      right: marginRight,
                      left: marginLeft,
                      bottom: 5
                    }}
                    barSize={barSize}
                  >
                    <defs>
                      <linearGradient
                        id="incomeGradient"
                        x1="1"
                        y1="0"
                        x2="0"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#00DDA2" />
                        <stop offset="50%" stopColor="#00E7B1" />
                      </linearGradient>
                      <linearGradient
                        id="expenseGradient"
                        x1="1"
                        y1="0"
                        x2="0"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#b85f1fc7" />
                        <stop offset="100%" stopColor="#b85f1fc7" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      horizontal={true}
                      vertical={false}
                      stroke="#B5C6C5"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{
                        fontSize: fontSizeAxis,
                        fill: "#334050",
                        fontWeight: "semibold",
                        
                      }}
                      label={{
                        value: "Date",
                        fontSize: fontSizeLabel,
                        fill: "#048320",
                        position: "insideBottoRight",
                        fontWeight: "bold",
                        offset: 10,
                        dy: 14
                      }}
                      stroke="#334050" // Axis line color
                      strokeWidth={2}
                    />
                    <YAxis
                      tick={{
                        fontSize: fontSizeAxis,
                        fill: "#334050",
                        fontWeight: "bold"
                      }}
                      label={{
                        value: "Amount",
                        angle: -90,
                        position: "outsideLeft",
                        fontSize: fontSizeLabel,
                        fill: "#048320",
                        fontWeight: "bold",
                        offset: 10,
                        dx: dxYAxis
                      }}
                      stroke="#334050" // Axis line color
                      strokeWidth={2}
                    />
                    <Tooltip   formatter={(value, label) => [`Rs ${value}`, label]} 
                               />
                    <Legend />
                    <Bar
                      dataKey="totalIncome"
                      fill="url(#incomeGradient)"
                      radius={[5, 5, 0, 0]}
                      width={10}
                    />
                    <Bar
                      dataKey="totalExpense"
                      fill="url(#expenseGradient)"
                      radius={[5, 5, 0, 0]}
                    />
                    {/* <Line
                      type="monotone"
                      dataKey="netIncome"
                      stroke="#FF0000"
                      strokeWidth={1}
                    /> */}
                    <Area
                      type="monotone"
                      dataKey="netIncome"
                      fill="#FF0000"
                      stroke="#FF0000"
                      strokeWidth={1}
                      opacity={"30%"}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className=" lg:col-span-3 flex items-center justify-center w-full md:gap-5 gap-2 h-[25vh] ">
                <div
                  // style={{
                  //   backdropFilter: "blur(10px)",
                  //   backgroundColor: "rgba(192, 192, 192, 0.2)",
                  //   boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  //   border: "1px solid rgba(255, 255, 255, 0.3)"
                  // }}
                  style={{
                  backdropFilter: "blur(100px)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.3)"
                }}
                  className="flex md:flex-row w-[50%] flex-col md:p-1 px-2 rounded-lg border-incomeBC bg-white shadow-expenseBC relative bg-opacity-70 md:gap-5 text-center justify-center items-center"
                >
                  <div className="md:p-2 relative ">
                    <p className="flex text-black font-bold md:text-lg text-sm font-sans px-3">
                      Total Income
                    </p>
                    <p className="flex text-incomeAmount font-semibold font-mono text-md lg:text-2xl">
                      <span>Rs</span>
                      {formatAmount(calculations.totalIncome)}
                    </p>
                  </div>
                  <div className=" bg-gray-100 rounded-full relative m-2 mx-0 p-2">
                    <PieChart
                      series={[
                        {
                          //arcLabel: (item) => `${item.id}`,
                          data: incomeData,
                          outerRadius: 70,
                          innerRadius: 60,
                          paddingAngle: 0.5,
                          cornerRadius: 5,
                          startAngle: 0,
                          endAngle: 360,
                          cx: 65,
                          cy: 65
                        }
                      ]}
                      colors={incomeColorPalette}
                      onItemClick={handleIncomeSliceClick}
                      width={140}
                      height={140}
                      slotProps={{ legend: { hidden: true } }}
                      className="responsive-chart"
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        fontSize: "sm",
                        fontWeight: "bold",
                        pointerEvents: "none"
                      }}
                    >
                      {selectedIncomeCategory !== null
                        ? <div>
                            <span className=" text-[10px] font-bold lg:text-md text-expenseBC font-serif">
                              {selectedIncomeCategory}
                            </span>
                            <br />
                            <span className=" text-md lg:text-lg text-incomeAmount font-mono">
                              {" "}Rs.{selectedIncomeAmount}
                            </span>
                          </div>
                        : <span className=" text-md lg:text-lg text-expenseBC font-serif">
                            <img
                              src="/money_Increase.png"
                              alt=""
                              className=" bg-cover w-14 h-14"
                            />
                          </span>}
                    </div>
                  </div>
                </div>
                <div
                  // style={{
                  //   backdropFilter: "blur(10px)",
                  //   backgroundColor: "rgba(192, 192, 192, 0.2)",
                  //   boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  //   border: "1px solid rgba(255, 255, 255, 0.3)"
                  // }}
                  style={{
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.3)"
                  }}
                  className="flex md:flex-row-reverse w-[50%] flex-col md:flex md:p-1 px-2 rounded-lg bg-white border-incomeBC shadow-expenseBC relative bg-opacity-70 md:gap-5 text-center justify-center items-center"
                >
                  <div className="md:p-2 relative">
                    <p className=" text-black md:text-lg text-sm font-bold font-sans px-3 ">
                      Total Expense
                    </p>
                    <p className=" text-expenseAmount font-semibold font-mono text-md lg:text-2xl">
                      Rs{formatAmount(calculations.totalExpense)}
                    </p>
                  </div>
                  <div className=" bg-gray-100 rounded-full relative m-2 mx-0 p-2">
                    <PieChart
                      series={[
                        {
                          data: expenseData,
                          outerRadius: 70,
                          innerRadius: 60,
                          paddingAngle: 0.5,
                          cornerRadius: 5,
                          startAngle: 0,
                          endAngle: 360,
                          cx: 65,
                          cy: 65
                        }
                      ]}
                      colors={expenseColorPalette}
                      onItemClick={handleExpenseSliceClick}
                      width={140}
                      height={140}
                      slotProps={{ legend: { hidden: true } }}
                      className="responsive-chart"
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        fontSize: "lg",
                        fontWeight: "bold",
                        pointerEvents: "none"
                      }}
                    >
                      {selectedExpenseCategory !== null
                        ? <div>
                            <span className=" text-[10px] font-bold lg:text-md text-expenseBC font-serif">
                              {selectedExpenseCategory}
                            </span>
                            <br />
                            <span className=" text-md lg:text-lg  text-expenseAmount font-mono">
                              {" "}Rs.{selectedExpenseAmount}
                            </span>
                          </div>
                        : <span className=" text-xl text-expenseBC font-serif">
                            <img
                              src="/money_Decrease.png"
                              alt=""
                              className=" bg-cover w-14 h-14"
                            />
                          </span>}
                    </div>
                  </div>
                  {/* <div className="net-income-card hidden lg:flex">
                    <div
                      className={` flex flex-col items-center justify-center ${calculations.rest <
                      0
                        ? "bg-expenseBC text-white"
                        : " bg-incomeBC text-black"} text-lg p-5 rounded-lg shadow-2xl shadow-expenseBC`}
                    >
                      <h3
                        className={` ${calculations.rest < 0
                          ? "text-[#f93838]"
                          : "text-[#ad2525]"} font-bold text-xl`}
                      >
                        Net Income
                      </h3>
                      <p className=" font-bold text-2xl">
                        Rs. {formatAmount(calculations.rest)}
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
        </div>
      </div>
      {/* <div className="lg:hidden flex justify-center items-center">
        <div className=" relative  lg:hidden flex py-5 lg:col-span-2 ">
          <div
            ref={bottom1ElementRef}
            className="left-triangle-clip p-3 pr-0 opacity-0 h-20 rounded-l bottom1 items-center flex justify-center focus:bg-white hover:bg-white shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-incomeBC 
      focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out 
       "
          >
            <div className="relative m-2">
              <input
                type="date"
                className="peer m-0 block h-[50px] focus:shadow-md focus:shadow-incomeBC w-36 rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black transition duration-200 ease-linear placeholder:text-transparent focus:border-white focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                id="floatingDate"
                onChange={handleStartingDate}
              />
              <label
                htmlFor="floatingDate"
                className="pointer-events-none absolute font-bold left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-black transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
              >
                Starting Date
              </label>
            </div>
          </div>
          <div
            ref={bottom2ElementRef}
            className=" right-triangle-clip opacity-0 p-3 pl-0 w-full h-20 rounded-r items-center bottom2 flex justify-center focus:bg-white hover:bg-white shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-expenseBC focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out"
          >
            <div className="m-2 relative">
              <input
                type="date"
                className="peer m-0 block h-[50px] focus:shadow-md focus:shadow-incomeBC w-36 rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black transition duration-200 ease-linear placeholder:text-transparent focus:border-white focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                id="floatingDate"
                onChange={handleEndingDate}
              />
              <label
                htmlFor="floatingDate"
                className="pointer-events-none absolute font-bold left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-black transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none "
              >
                Ending Date
              </label>
            </div>
          </div>
        </div> 
      </div>*/}
      {/* <div className="flex mx-2 lg:hidden items-center justify-center net-income-card_sm">
        <div
          className={` flex flex-col items-center justify-center ${calculations.rest <
          0
            ? "bg-expenseBC expense text-white"
            : "bg-incomeBC text-black income"} text-lg p-5 rounded-lg shadow-2xl shadow-expenseBC`}
        >
          <h3 className="text-[#9d2828] font-bold">Net Income</h3>
          <p className=" font-bold text-2xl">
            Rs. {formatAmount(calculations.rest)}
          </p>
        </div>
      </div> */}
      {/* <div className={`flex ${calculations.rest < 0 ? "pipe-border2": " pipe-border1"}  mx-2 `}></div>
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-3  ">
      <div className={`flex ${calculations.rest < 0 ? "bg-incomeBC": " bg-expenseBC"} rounded-r justify-center lg:justify-start flex-row-reverse lg:flex-row`}>
       
      </div>
      <div className={`flex ${calculations.rest < 0 ? "bg-incomeBC": " bg-expenseBC"} rounded-l justify-center lg:justify-end`}>
        
      </div>
    </div> */}
    </>
  );
};

export default Dashboard;
