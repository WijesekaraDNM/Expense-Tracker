/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/index.js",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',],
  theme: {
    extend: {
      colors: {
        incomeBC: '#62956A',
        incomeHover: '#5fad5f',
        focusColor:'#767575',
        //incomeBC: '#73B285',
        //incomeBC:'#98E0AC',
        expenseBC: '#C4896F',
        expenseHover: '#da997d',
        //golden: '#CDA618'
        golden: '#B5710A',
        goldenHover: '#bc8736',
        textColor:'#FFFFF',
        subText: '#454545'
      },
      backgroundImage: {
        'credit-card': "url('/images/creditCard.png')",
        'voucher': "url('/images/voucherNew.png')",
        'bgExpenses': "url('/images/bgExpenses-01.jpeg')",
        'bgIncome': "url('/images/bgIncome.jpeg')"
      },

      
    },
  },
  plugins: [],
}

