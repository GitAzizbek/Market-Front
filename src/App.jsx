import React from "react";
import BottomNavbar from "./components/Navbar";
import "./App.css";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import PaymentProcessing from "./components/PaymentProcess";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path={"/"} Component={Home} />
          <Route path="/product/:id" Component={ProductDetail} />
          <Route path="/cart" Component={Cart} />
          <Route path="/payment-processing" Component={PaymentProcessing} />
        </Routes>
        <BottomNavbar />
      </div>
    </BrowserRouter>
  );
}

export default App;
