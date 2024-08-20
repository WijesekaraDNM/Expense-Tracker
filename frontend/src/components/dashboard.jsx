import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { PieChart } from "@mui/x-charts";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
//import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import {
  calculateCategoricalAmounts,
  calculateTransactions,
  dailyForcastOfIncomeExpense
} from "../Services/transactionService";
import { Grid } from "@mui/material";

const Dashboard = () => {
  const [calculations, setCalculations] = useState({});
  const [categoricalCalculations, setCategoricalCalculations] = useState({
    income: [],
    expense: []
  });
  const { userId } = useAuth();
  const [data, setData] = useState([]);
  const [selectedIncomeCategory, setSelectedIncomeCategory] = useState(null);
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState(null);
  useEffect(
    () => {
      const loadCalculations = calculateTransactions(userId);
      const loadCategoricalAmounts = calculateCategoricalAmounts(userId);
      const loadDailyData = dailyForcastOfIncomeExpense(userId);
      loadCalculations.then(fetchedData => {
        setCalculations(fetchedData);
      });
      loadCategoricalAmounts.then(fetchData => {
        setCategoricalCalculations(fetchData);
      });
      loadDailyData.then(fetchData => {
        setData(fetchData.slice(-7));
      })
    },
    [userId]
  );

  // const generateConsecutiveDates = (fetchedData) => {
  //   const today = new Date();
  //   const daysArray = [];

  //   // Generate the last 7 days
  //   for (let i = 6; i >= 0; i--) {
  //     const date = new Date(today);
  //     date.setDate(today.getDate() - i);
  //     const dateString = date.toISOString().split('T')[0];
  //     daysArray.push({
  //       date: formatDate(dateString),
  //       totalIncome: 0,
  //       totalExpense: 0,
  //     });
  //   }

  //   // Merge with fetched data
  //   fetchedData.forEach(item => {
  //     const foundIndex = daysArray.findIndex(day => day.date === formatDate(item.date));
  //     if (foundIndex >= 0) {
  //       daysArray[foundIndex] = {
  //         date: formatDate(item.date),
  //         totalIncome: item.totalIncome,
  //         totalExpense: item.totalExpense
  //       };
  //     }
  //   });

  //   return daysArray;
  // };


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

  // const formatDate = (dateStr) => {
  //   const date = new Date(dateStr);
  //   return date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Mon", "Tue"
  // };

  const dailyData = data.map(item => ({
    date: item.date,
    totalIncome: item.totalIncome,
    totalExpense: item.totalExpense
  }));

  

  const colorPalette = [
    "#003366", // Dark Blue
    "#0033cc", // Royal Blue
    "#00bfff", // Sky Blue
    "#2e8b57", // Sea Green
    "#32cd32", // Lime Green
    "#daa520", // Golden Rod
    "#ff7f50", // Coral
    "#ff6347" // Tomato
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
    <div className="grid lg:grid-cols-2 grid-cols-1 p-2 gap-3 ">
      <div className="flex bg-gray-100 rounded flex-row-reverse lg:flex-row">
        <div className="flex w-[40%]  justify-center items-center rounded relative p-5">
          <PieChart
            series={[
              {
                //arcLabel: (item) => `${item.id}`,
                data: incomeData,
                color: colorPalette,
                outerRadius: 100,
                innerRadius: 80,
                paddingAngle: 0.5,
                cornerRadius: 5,
                startAngle: 0,
                endAngle: 360,
                cx: 95,
                cy: 95,
                
              }
            ]}    
            onItemClick={handleIncomeSliceClick}
            width={200}
            height={200}
            slotProps={{ legend: { hidden: true } }}
            
          />
           <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "bold",
              pointerEvents: "none"
            }}>
           {(selectedIncomeCategory !== null)? (
            <div>
                  <span className=" text-xl text-expenseBC font-serif">{selectedIncomeCategory}</span>
                  <br /><span className=" text-xl text-incomeAmount font-mono">  Rs.{selectedIncomeAmount}</span>
            </div>
            ):(<span className=" text-xl text-expenseBC font-serif">Income</span>)}
            </div>
        </div>
        <div className="flex flex-col lg:col-start-1 lg:row-start-1 p-3 m-3 rounded-lg border-incomeBC bg-gray-300 justify-center items-center w-[60%]">
          <p className=" text-gray-800 font-semibold text-4xl font-sans p-3">
            Total Income
          </p>
          <p className=" text-incomeAmount font-semibold font-mono text-3xl">
            Rs.{calculations.totalIncome}
          </p>
        </div>
      </div>
      <div className="flex bg-gray-100 rounded">
      <div className="flex flex-col p-3 m-3 bg-gray-300 justify-center items-center rounded-lg w-[60%]">
        <p className=" text-gray-800 text-4xl font-semibold font-sans p-3">Total Expense</p>
        <p className=" text-expenseAmount font-semibold font-mono text-3xl">
          Rs.{calculations.totalExpense}
        </p>
      </div>
      <div className="flex w-[40%] justify-center items-center rounded relative p-5">
          <PieChart
            series={[
              {
                data: expenseData,
                color: colorPalette,
                outerRadius: 100,
                innerRadius: 80,
                paddingAngle: 0.5,
                cornerRadius: 5,
                startAngle: 0,
                endAngle: 360,
                cx: 95,
                cy: 95,
                
              }
            ]}
            onItemClick={handleExpenseSliceClick}
            width={200}
            height={200}
            slotProps={{ legend: { hidden: true } }}
            
          />
           <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "bold",
              pointerEvents: "none"
            }}>
           {(selectedExpenseCategory !== null)? (
            <div>
                  <span className=" text-xl text-expenseBC font-serif">{selectedExpenseCategory}</span>
                  <br /><span className=" text-xl text-expenseAmount font-mono">  Rs.{selectedExpenseAmount}</span>
            </div>
            ):(<span className=" text-xl bg-gray-200 text-expenseBC font-serif">Expense</span>)}
            </div>
        </div>
      </div>
    </div>
    <div className="flex backdrop:blur-lg bg-2/3white m-5 justify-center items-center">
      {/* <BarChart
        dataset={dailyData}
        xAxis={[{ 
            scaleType: 'band',
            dataKey: 'date',
            label:'Date'
            
         }]}
        series={[
          { dataKey: 'totalIncome', label: 'Income', valueFormatter,color:'#00DDA2' },
          { dataKey: 'totalExpense', label: 'Expense', valueFormatter, color: '#334050' }
        ]
      }
        {...chartSetting}
      /> */}

      <ResponsiveContainer width="80%" height={400}  >
        <BarChart
          topic={"F"}
          data={dailyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barSize={60} 
        >
        <defs>
          <linearGradient id="incomeGradient" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#00DDA2" />
            <stop offset="50%" stopColor="#009B68" />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#334050" />
            <stop offset="100%" stopColor="#1C241F" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeLinearray="3 3" lineColor="expenseBC" horizontal={true} vertical={false} />
        
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#334050', fontWeight:'bold' }}
            label={{ value: 'Date', fontSize: 16, fill: '#334050', position:'outsideBottom', fontWeight:'bold' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#334050', fontWeight:'bold'  }}
            label={{ value: 'Amount', angle: -90, position: 'outsideLeft', fontSize: 16, fill: '#334050', fontWeight:'bold' }}
          />
          <Tooltip />
          <Bar dataKey="totalIncome" fill="url(#incomeGradient)" radius={[5, 5, 0, 0]} width={10}/>
          <Bar dataKey="totalExpense" fill="url(#expenseGradient)" radius={[5, 5, 0, 0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
    </>
    
  );
};

export default Dashboard;
