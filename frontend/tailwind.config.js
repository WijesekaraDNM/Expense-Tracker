/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',],
  theme: {
    extend: {
      colors: {
        incomeBC: '#62956A',
        incomeB: '',
        expenseBC: '#C4896F',
        expenseB: '',
        golden: '#CDA618'
      },
      backgroundImage: {
        'credit-card': "url('/images/creditCard.png')",
        'voucher': "url('/images/voucherNew.png')",
      },

      
    },
  },
  plugins: [],
}

