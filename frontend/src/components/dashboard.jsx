import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { PieChart } from "@mui/x-charts";
import {
  calculateCategoricalAmounts,
  calculateTransactions
} from "../Services/transactionService";

const Dashboard = () => {
  const [calculations, setCalculations] = useState({});
  const [categoricalCalculations, setCategoricalCalculations] = useState({
    income: [],
    expense: []
  });
  const { userId } = useAuth();
  const [selectedIncomeCategory, setSelectedIncomeCategory] = useState(null);
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState(null);
  useEffect(
    () => {
      const loadCalculations = calculateTransactions(userId);
      const loadCategoricalAmounts = calculateCategoricalAmounts(userId);
      loadCalculations.then(fetchedData => {
        setCalculations(fetchedData);
      });
      loadCategoricalAmounts.then(fetchData => {
        setCategoricalCalculations(fetchData);
      });
    },
    []
  );
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
    const categoryIndex = index.dataIndex ?? index;
    const category = incomeData[categoryIndex]?.id;
    setSelectedIncomeCategory(category);
    console.log('Selected Category:', category);
  };
  const handleExpenseSliceClick = (event,index) => {
    const categoryIndex = index.dataIndex ?? index;
    const category = expenseData[categoryIndex]?.id;
    setSelectedExpenseCategory(category);
    console.log('Selected Category:', category);
  };
  const selectedIncomeAmount = incomeData.find(item => item.id === selectedIncomeCategory)?.value;
  const selectedExpenseAmount = expenseData.find(item => item.id === selectedExpenseCategory)?.value;
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 p-2 gap-3 ">
      <div className="flex bg-gray-100">
        <div className="flex w-[40%] justify-center items-center rounded relative p-5">
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
        <div className="flex flex-col p-3 m-3 rounded-lg border-incomeBC bg-gray-300 justify-center items-center w-[60%]">
          <p className=" text-gray-800 font-semibold text-4xl font-sans p-3">
            Total Income
          </p>
          <p className=" text-incomeAmount font-semibold font-mono text-3xl">
            Rs.{calculations.totalIncome}
          </p>
        </div>
      </div>
      <div className="flex bg-gray-100">
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
                  <br /><span className=" text-xl text-incomeAmount font-mono">  Rs.{selectedExpenseAmount}</span>
            </div>
            ):(<span className=" text-xl text-expenseBC font-serif">Expense</span>)}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
