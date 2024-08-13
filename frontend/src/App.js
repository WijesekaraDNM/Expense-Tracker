import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import TransactionForm from "./components/common/transactionForm";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/form" element={<TransactionForm/>}/>
          <Route path= "/login" element={<LoginPage/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;