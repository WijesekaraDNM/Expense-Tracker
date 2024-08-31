import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { PieChart } from "@mui/x-charts";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Line, ComposedChart, Legend } from 'recharts';
//import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import {
  calculateCategoricalAmounts,
  calculateTransactions,
  dailyForcastOfIncomeExpense
} from "../Services/transactionService";
import './../index.css';

const Dashboard = ({ setLocalStartingDate, setLocalEndingDate, databaseUpdate }) => {
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
  const [startingDate, setStartingDate] = useState();
  const [endingDate, setEndingDate] = useState();

  useEffect(() => {

      console.log("Local Starting Date(dash): ", startingDate);
      console.log("Local Ending Date(dash): ", endingDate);
      const loadCalculations = calculateTransactions(userId,{startingDate,endingDate});
      const loadCategoricalAmounts = calculateCategoricalAmounts(userId,{startingDate, endingDate});
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
    [userId, startingDate, endingDate,databaseUpdate ]
  );

  const handleStartingDate = (e) => {
    setLocalStartingDate(e.target.value);
    setStartingDate(e.target.value);
  };
  const handleEndingDate = (e) => {
    setLocalEndingDate(e.target.value);
    setEndingDate(e.target.value);
  };

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
      case 0: return dData;
      case 1: return mData;
      case 2: return yData;
      default: return [];
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
    "#66CDAA"  // Medium Aquamarine
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
    "#E9967A"  // Dark Salmon
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

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

 const chartSetting = {
  yAxis: [
    {
      label: 'Amount',
      axisLabel: {
        fontSize: 20,
        color: '#333',
      },
  
      tick: {
        fontSize: 12,
        color: '#666',
      },
    },
  ],
  width: 800,
  height: 350,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
  },
};

const valueFormatter = (value) => `$${value}`;


  return (
  <>
    <div className="flex inset-0 transition-transform duration-2000 ease-in-out w-full flex-col backdrop:blur-lg mb-2 justify-center items-center">
      
    <div className="grid grid-cols-1 lg:grid-cols-8 justify-center w-full">
      <div className=" relative lg:flex hidden  lg:col-span-2 ">
        <div className="absolute left-2 h-60 hover:z-50 w-60 border-[2rem] border-incomeBC border-solid rounded-full items-center flex justify-center focus:bg-white hover:bg-white shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-incomeBC focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out">
          <div className="relative m-2">
              <input
                type="date"
                className="peer m-0 block h-[58px] border-[1px] focus:shadow-md focus:shadow-incomeBC border-solid border-golden w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black transition duration-200 ease-linear placeholder:text-transparent focus:border-white focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
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
        <div className="absolute top-32 hover:z-50 left-32 h-60 w-60 border-[2rem] border-expenseBC border-solid rounded-full items-center flex justify-center focus:bg-white hover:bg-white shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-expenseBC focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out">
          <div className="m-2 relative">
            <input
              type="date"
              className="peer m-0 block h-[58px] border-[1px] focus:shadow-md focus:shadow-incomeBC border-solid border-golden w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black transition duration-200 ease-linear placeholder:text-transparent focus:border-white focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
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
        <div className=" lg:col-span-6 w-full ">
            <div className="flex justify-center">
              <h1 className=" self-center p-3 mt-1 text-2xl font-bold">{dataForChart.length > 0 ? dataForChart[0].title : "Default Title"}</h1>
            </div>
            <ResponsiveContainer width="100%" height={300} margin={5} >
              <ComposedChart
                data={dataForChart}
                margin={{ top: 20, right: 10, left: 50, bottom: 5 }}
                barSize={60} 
              >
              <defs>
                <linearGradient id="incomeGradient" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#00DDA2" />
                <stop offset="50%" stopColor="#00E7B1" />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="#334050" />
                  <stop offset="100%" stopColor="#28323e" />
                </linearGradient>
              </defs>
              <CartesianGrid horizontal={true} vertical={false} stroke="#626262"/>
              
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 'lg', fill: '#000', fontWeight:'bold' }}
                  label={{ value: 'Date', fontSize: 'lg', fill: '#CC0909', position:'insideBottoRight', fontWeight:'bold', offset: 10, dy:14 }}
                  stroke="#334050" // Axis line color
                  strokeWidth={3}
                />
                <YAxis
                  tick={{ fontSize: 'lg', fill: '#000', fontWeight:'bold'  }}
                  label={{ value: 'Amount', angle: -90, position: 'outsideLeft', fontSize: 'lg', fill: '#CC0909', fontWeight:'bold', offset: 10, dx:-40 }}
                  stroke="#334050" // Axis line color
                  strokeWidth={3}
                />
                <Tooltip />
                <Legend/>
                <Bar dataKey="totalIncome" fill="url(#incomeGradient)" radius={[5, 5, 0, 0]} width={10}/>
                <Bar dataKey="totalExpense" fill="url(#expenseGradient)" radius={[5, 5, 0, 0]}/>
                <Line type="monotone" dataKey="netIncome" stroke="#FF0000" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
    </div>
    <div className="lg:hidden flex justify-center items-center">
    <div className=" relative lg:hidden flex py-5 lg:col-span-2 ">
      <div className=" p-3 w-full h-20 rounded-l-full bottom1 items-center flex justify-center focus:bg-white hover:bg-white shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-incomeBC focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out">
        <div className="relative m-2">
          <input
            type="date"
            className="peer m-0 block h-[58px] border-[1px] focus:shadow-md focus:shadow-incomeBC border-solid border-golden w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black transition duration-200 ease-linear placeholder:text-transparent focus:border-white focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
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
      <div className="  p-3 w-full h-20 rounded-r-full items-center bottom2 flex justify-center focus:bg-white hover:bg-white shadow-[0_4px_9px_-4px_#9e9e9e] hover:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] hover:shadow-expenseBC focus:shadow-[0_8px_9px_-4px_#9e9e9e,0_4px_18px_0_#7e7d7d] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] transition duration-150 ease-in-out">
        <div className="m-2 relative">
          <input
            type="date"
            className="peer m-0 block h-[58px] border-[1px] focus:shadow-md focus:shadow-incomeBC border-solid border-golden w-full rounded bg-transparent bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-black transition duration-200 ease-linear placeholder:text-transparent focus:border-white focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-black [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
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
    </div>
    <div className="flex mx-2 lg:hidden items-center justify-center net-income-card_sm">
      <div className={` flex flex-col items-center justify-center ${calculations.rest < 0 ? "bg-expenseBC expense text-white": "bg-incomeBC text-black income"} text-lg p-5 rounded-lg shadow-2xl shadow-expenseBC`}>
        <h3 className="text-[#9d2828] font-bold">Net Income</h3>
        <p className=" font-bold text-2xl">Rs. {formatAmount(calculations.rest)}</p>
      </div>
    </div>
    <div className="flex pipe-border mx-2 lg:mt-4"></div>
    <div className="grid lg:grid-cols-2 grid-cols-1 px-2 gap-3 ">
      <div className="flex bg-expenseBC rounded-r justify-center lg:justify-start flex-row-reverse lg:flex-row">
        <div className="flex justify-center items-center bg-gray-200 rounded-full  relative m-3 p-2">
          <PieChart
            series={[
              {
                //arcLabel: (item) => `${item.id}`,
                data: incomeData,
                outerRadius:90,
                innerRadius: 70,
                paddingAngle: 0.5,
                cornerRadius: 5,
                startAngle: 0,
                endAngle: 360,
                cx: 85,
                cy: 85,
                
              }
            ]}   
            colors={incomeColorPalette} 
            onItemClick={handleIncomeSliceClick}
            width={180}
            height={180}
            slotProps={{ legend: { hidden: true } }}
            
          />
           <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              fontSize: "sm",
              fontWeight: "bold",
              pointerEvents: "none"
            }}>
           {(selectedIncomeCategory !== null)? (
            <div>
                  <span className=" text-sm lg:text-md text-expenseBC font-serif">{selectedIncomeCategory}</span>
                  <br /><span className=" text-md lg:text-lg text-incomeAmount font-mono">  Rs.{selectedIncomeAmount}</span>
            </div>
            ):(<span className=" text-lg lg:text-xl text-expenseBC font-serif"><img src="/money_Increase.png" alt="" className=" bg-cover w-16 h-16"/></span>)}
            </div>
        </div>
        <div className="flex flex-col lg:col-start-1 lg:row-start-1 p-3 m-3 rounded-lg border-incomeBC bg-white text-center justify-center items-center w-[60%]">
          <p className=" text-black font-bold text-2xl md:text-4xl font-sans p-3">
            Total Income
          </p>
          <p className=" text-incomeAmount font-semibold font-mono text-2xl md:text-3xl">
           <span>Rs</span>{formatAmount(calculations.totalIncome)}
          </p>
        </div>
      </div>
      <div className="flex bg-expenseBC rounded-l justify-center lg:justify-end  ">
        <div className="flex flex-col p-3 pt-6 m-3 bg-white justify-center text-center items-center rounded-lg w-[60%]">
          <p className=" text-gray-800 text-2xl md:text-4xl font-bold font-sans p-3">Total Expense</p>
          <p className=" text-expenseAmount font-semibold font-mono md:text-3xl text-2xl">
            Rs{formatAmount(calculations.totalExpense)}
          </p>
        </div>
        <div className="flex justify-center items-center bg-gray-200 rounded-full relative p-2 m-3">
          <PieChart
            series={[
              {
                data: expenseData,
                outerRadius: 90,
                innerRadius: 70,
                paddingAngle: 0.5,
                cornerRadius: 5,
                startAngle: 0,
                endAngle: 360,
                cx: 85,
                cy: 85,
                
              }
            ]}
            colors={expenseColorPalette}
            onItemClick={handleExpenseSliceClick}
            width={180}
            height={180}
            slotProps={{ legend: { hidden: true } }}
            
          />
           <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              fontSize: "lg",
              fontWeight: "bold",
              pointerEvents: "none"
            }}>
           {(selectedExpenseCategory !== null)? (
            <div>
                  <span className=" text-sm lg:text-md text-expenseBC font-serif">{selectedExpenseCategory}</span>
                  <br /><span className=" text-md lg:text-lg  text-expenseAmount font-mono">  Rs.{selectedExpenseAmount}</span>
            </div>
            ):(<span className=" text-xl text-expenseBC font-serif"><img src="/money_Decrease.png" alt="" className=" bg-cover w-16 h-16"/></span>)}
            </div>
        </div>
        <div className="net-income-card hidden lg:flex">
          <div className={` flex flex-col items-center justify-center ${calculations.rest < 0 ? "bg-expenseBC text-white": " bg-incomeBC text-black"} text-lg p-5 rounded-lg shadow-2xl shadow-expenseBC`}>
            <h3 className="text-[#9d2828] font-bold">Net Income</h3>
            <p className=" font-bold text-2xl">Rs. {formatAmount(calculations.rest)}</p>
          </div>
      </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
