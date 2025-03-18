import React from "react";
import BottomNavbar from "./components/Navbar";
import "./App.css";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import PaymentProcessing from "./components/PaymentProcess";
import PaymentPage from "./components/PaymentDetailPage";
import PaymentDetailPage from "./components/PaymentDetailPage";
import SuccessPage from "./components/PaymentConfirmation";
import Profile from "./components/Profile";
import ProductComments from "./components/Comments";
import Catalog from "./components/Catalog";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path={"/"} Component={Home} />
          <Route path="/product/:id" Component={ProductDetail} />
          <Route path="/cart" Component={Cart} />
          <Route path="/payment-processing" Component={PaymentProcessing} />
          <Route path="/payment" Component={PaymentDetailPage} />
          <Route path="/success" Component={SuccessPage} />
          <Route path="/profile" Component={Profile} />
          <Route path="/comments/:id" Component={ProductComments} />
          <Route path="/catalog" Component={Catalog} />
        </Routes>
        <BottomNavbar />
      </div>
    </BrowserRouter>
  );
}

export default App;
