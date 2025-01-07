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
  dailyForcastOfIncomeExpense,
  dateRangetBasedIncomeExpense,
  getTransactions
} from "../Services/transactionService";
import "./../index.css";
import { DateRange } from "@mui/icons-material";

const Dashboard = ({
  startingDate,
  endingDate,
  databaseUpdate,
  isCustomChart,
  selectedRange
}) => {
  const [calculations, setCalculations] = useState({});
  const [chartData, setChartData] = useState();
  const [categoricalCalculations, setCategoricalCalculations] = useState({
    income: [],
    expense: []
  });

  // const incomeColorPalette = [
  //   "#228B22", // Forest Green
  //   "#87CEEB", // Sky Blue
  //   "#2E8B57", // Sea Green
  //   "#4682B4", // Steel Blue
  //   "#90EE90", // Light Green
  //   "#40E0D0", // Turquoise
  //   "#6A5ACD", // Slate Blue
  //   "#98FF98", // Pale Green
  //   "#00FF7F", // Spring Green
  //   "#20B2AA", // Light Sea Green
  //   "#32CD32", // Lime Green
  //   "#3CB371", // Medium Sea Green
  //   "#7FFF00", // Chartreuse
  //   "#00FA9A", // Medium Spring Green
  //   "#8FBC8F", // Dark Sea Green
  //   "#00FF00", // Lime
  //   "#ADFF2F", // Green Yellow
  //   "#00FF00", // Lime (duplicate)
  //   "#9ACD32", // Yellow Green
  //   "#66CDAA" // Medium Aquamarine
  // ];

  const incomeColorPalette = [
    "#00CED1", // Dark Turquoise
    "#40E0D0", // Turquoise
    "#5F9EA0", // Cadet Blue
    "#48D1CC", // Medium Turquoise
    "#AFEEEE", // Pale Turquoise
    "#7FFFD4", // Aquamarine
    "#B0E0E6", // Powder Blue
    "#ADD8E6", // Light Blue
    "#4682B4", // Steel Blue
    "#87CEFA", // Light Sky Blue
    "#20B2AA", // Light Sea Green
    "#00FA9A", // Medium Spring Green
    "#32CD32", // Lime Green
    "#66CDAA", // Medium Aquamarine
    "#8FBC8F", // Dark Sea Green
    "#228B22", // Forest Green
    "#2E8B57", // Sea Green
    "#90EE90", // Light Green
    "#3CB371", // Medium Sea Green
    "#00FF7F"  // Spring Green
  ];
  

  // const expenseColorPalette = [
  //   "#DC143C", // Crimson
  //   "#333333", // Dark Gray
  //   "#B22222", // Firebrick
  //   "#708090", // Slate Gray
  //   "#F08080", // Light Coral
  //   "#B2BEB5", // Ash Gray
  //   "#8B0000", // Dark Red
  //   "#C0C0C0", // Silver
  //   "#FF6347", // Tomato
  //   "#A52A2A", // Brown
  //   "#CD5C5C", // Indian Red
  //   "#D2691E", // Chocolate
  //   "#FF4500", // Orange Red
  //   "#FF0000", // Red
  //   "#F5DEB3", // Wheat
  //   "#FF8C00", // Dark Orange
  //   "#B8860B", // Dark Goldenrod
  //   "#D3D3D3", // Light Gray
  //   "#C71585", // Medium Violet Red
  //   "#E9967A" // Dark Salmon
  // ];

  const expenseColorPalette = [
    "#E57342", // Burnt Orange
    "#FF8C42", // Deep Saffron
    "#FF7043", // Coral Orange
    "#F4A460", // Sandy Brown
    "#FFD27F", // Light Apricot
    "#FFAD60", // Soft Peach
    "#FFA07A", // Light Salmon
    "#CD853F", // Peru
    "#D2691E", // Chocolate
    "#FF4500", // Orange Red
    "#E9967A", // Dark Salmon
    "#FFA500", // Orange
    "#FFC87C", // Topaz
    "#C8703D", // Copper
    "#DEB887", // Burlywood
    "#F5DEB3", // Wheat
    "#B8860B", // Dark Goldenrod
    "#DAA520", // Goldenrod
    "#FF6347", // Tomato
    "#FA8072"  // Salmon
  ];  

  const { userId } = useAuth();
  const [data, setData] = useState([]);
  const [dData, setDData] = useState([]);
  const [mData, setMData] = useState([]);
  const [yData, setYData] = useState([]);
  const [selectedIncomeCategory, setSelectedIncomeCategory] = useState(null);
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(["daily", "monthly", "annually"]);
  const [showNetIncomeCard, setShowNetIncomeCard] = useState(false);
  const bottom1ElementRef = useRef(null);
  const bottom2ElementRef = useRef(null);
  const [rangeTextIncome, setRangeTextIncome] = useState();
  const [rangeTextExpense, setRangeTextExpense] = useState();
  const isSmallScreen = useMediaQuery("(max-width:600px)"); // Phones
  const isMediumScreen = useMediaQuery("(max-width:960px)"); // Tablets
  const isLargeScreen = useMediaQuery("(min-width:961px)"); // Laptops and larger devices
  const [isSlideChangerActive, setIsSlideChangerActive] = useState(true);


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
      loadCalculations.then(fetchedData => {
        setCalculations(fetchedData);
        console.log("load calculations:", fetchedData);
      });
      loadCategoricalAmounts.then(fetchData => {
        setCategoricalCalculations(fetchData);
      });

      const loadTransactionByRange = dateRangetBasedIncomeExpense(userId, {
        startingDate,
        endingDate
      }, selectedRange);
  
      // Update chart data
      setChartData(loadTransactionByRange);

      const loadForecastData = dailyForcastOfIncomeExpense(userId);
      loadForecastData.then(fetchData => {
        setDData(fetchData.daily.slice(-7));
        setMData(fetchData.monthly.slice(-12));
        setYData(fetchData.annually.slice(-10));
      });

    },
    [userId, startingDate, endingDate, databaseUpdate]
  );
  useEffect(
    () => {
      let textI, textE;
      switch (selectedRange){
        case "today": {textI = "What have you earned today?";textE = "What have you expense today?";  break;}
        case "yesterday":  {textI = "Review your income from yesterday."; textE= "Review your expenses from yesterday."; break;}
        case "lastWeek":  {textI = textE = "Here's how your finances looked over the past week."; break;}
        case "lastMonth":  {textI = textE ="Analyze your income for the previous month."; textE = "Analyze your expenses for the previous month."; break;}
        case "lastSixMonths":  {textI = textE ="Your financial summary for the last six months."; break;}
        case "lastYear":  {textI = textE =  "See how you managed your finances over the past year."; break;}
        default:  {textI = textE =  "Track your financial activity for the selected range."; break;}
      }
      setRangeTextIncome(textI);
      setRangeTextExpense(textE);

    // Determine whether the slide changer should be active
  switch (selectedRange) {
    case "today":
    case "yesterday":
    case "lastWeek":
      setIsSlideChangerActive(false);
      setSlides(["daily"]); // Fixed to daily
      setCurrentSlide(0);
      break;

    case "lastMonth":
    case "lastSixMonths":
      setIsSlideChangerActive(false);
      setSlides(["monthly"]); // Fixed to monthly
      setCurrentSlide(0);
      break;

    case "lastYear":
      setIsSlideChangerActive(false);
      setSlides(["annually"]); // Fixed to annual
      setCurrentSlide(0);
      break;

    default:
      setIsSlideChangerActive(true);
      setSlides(["daily", "monthly", "annually"]); // Enable all levels
  }
  },[selectedRange]);

  useEffect(() => {
    if (isSlideChangerActive && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 10000); // Change slide every 10 seconds
  
      return () => clearInterval(interval);
    }
  }, [isSlideChangerActive, slides]);

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
    if (slides[currentSlide] === "daily") return dData;
    if (slides[currentSlide] === "monthly") return mData;
    if (slides[currentSlide] === "annually") return yData;
    return [];
  };

  const dataForChart = getDataForSlide().map(item => ({
    date: item.date,
    totalIncome: item.totalIncome,
    totalExpense: item.totalExpense,
    netIncome: item.netIncome,
    title: item.title
  }));

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

  const handleTest = () =>{
    
  }

  const valueFormatter = value => `$${value}`;

  return (
    <>
      <div className="flex inset-0 transition-transform duration-2000 ease-in-out w-full backdrop:blur-lg justify-center items-center">
        <div className=" justify-center w-[95%] lg:gap-10">
          <div
            className=" w-full rounded-md md:p-3 p-1 gap-10 flex flex-col justify-center items-center bg-transparent"
          >
              <div className="lg:col-span-7 w-full h-[60vh] items-center flex flex-col justify-center rounded-lg bg-white" 
                  style={{
                    backdropFilter: "blur(100px)",
                    // boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
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
                        <stop offset="0%" stopColor="#00D0C2" />
                        <stop offset="50%" stopColor="#00D0C2" />
                      </linearGradient>
                      <linearGradient
                        id="expenseGradient"
                        x1="1"
                        y1="0"
                        x2="0"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#EF854B" />
                        <stop offset="100%" stopColor="#EF854B" />
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
                        fill: "#4B71F0",
                        fontWeight: "semibold",
                        
                      }}
                      label={{
                        value: "Date",
                        fontSize: fontSizeLabel,
                        fill: "#4B71F0",
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
                        fill: "#4B71F0",
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
                      fill="#00D0C2"
                      radius={[5, 5, 0, 0]}
                      width={10}
                    />
                    <Bar
                      dataKey="totalExpense"
                      fill="#EF854B"
                      radius={[5, 5, 0, 0]}
                    />
                    <Area
                      type="monotone"
                      dataKey="netIncome"
                      fill="#eac0a9"
                      stroke="#EF854B"
                      strokeWidth={2}
        
                      opacity={"50%"}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className=" lg:col-span-3 flex items-center justify-center w-full md:gap-5 gap-2 h-[25vh] ">
                <div
                  style={{
                  backdropFilter: "blur(100px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)"
                }}
                  className="flex md:flex-row w-[50%] flex-col md:p-1 px-2 rounded-lg border-incomeBC bg-white shadow-expenseBC relative text-center justify-center items-center"
                >
                  <div className="md:p-2 relative flex flex-col items-center justify-center">
                    <p className=" text-black md:text-sm text-xs font-semibold font-sans px-3 ">
                      {rangeTextIncome}
                    </p>
                    <p className="flex text-black font-bold md:text-xl text-sm font-sans px-3">
                      Total Income
                    </p>
                    <p className="flex text-[#00d0c2] font-semibold font-mono text-md lg:text-2xl">
                      <span>Rs</span>
                      {formatAmount(calculations.totalIncome)}
                    </p>
                  </div>
                  <div className=" bg-gray-100 rounded-full relative mx-0 p-2">
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
                            <span className=" text-md lg:text-lg text-[#00d0c2] font-mono">
                              {" "}Rs.{selectedIncomeAmount}
                            </span>
                          </div>
                        : <span className=" text-md lg:text-3xl text-[#00d0c2] font-serif">
                            {/* <img
                              src="/money_Increase.png"
                              alt=""
                              className=" bg-cover w-14 h-14"
                            /> */}
                            {(calculations.totalIncome/(calculations.totalIncome+ calculations.totalExpense)*100).toFixed(0)}%
                          </span>}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)"
                  }}
                  className="flex md:flex-row-reverse w-[50%] flex-col md:flex md:p-1 px-2 rounded-lg bg-white border-incomeBC shadow-expenseBC relative  text-center justify-center items-center"
                >
                  <div className=" md:p-2 relative">
                    <p className=" text-black md:text-sm text-xs font-semibold font-sans px-3 ">
                      {rangeTextExpense}
                    </p>
                    <p className=" text-black md:text-xl text-sm font-bold font-sans px-3 ">
                      Total Expense
                    </p>
                    <p className=" text-[#EF854B] font-semibold font-mono text-md lg:text-2xl">
                      Rs{formatAmount(calculations.totalExpense)}
                    </p>
                  </div>
                  <div className=" bg-gray-100 rounded-full relative mx-0 p-2">
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
                            <span className=" text-md lg:text-lg  text-[#EF854B] font-mono">
                              {" "}Rs.{selectedExpenseAmount}
                            </span>
                          </div>
                        : <span className=" text-3xl text-[#EF854B] font-serif">
                            {/* <img
                              src="/money_Decrease.png"
                              alt=""
                              className=" bg-cover w-14 h-14"
                            /> */}
                             {(calculations.totalExpense/(calculations.totalIncome+ calculations.totalExpense)*100).toFixed(0)}%
                          </span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
