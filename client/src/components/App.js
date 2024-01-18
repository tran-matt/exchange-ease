import React, { useState, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./navbar";
import Home from "./home";
import FAQ from "./faq";
import Login from "./login";
import SearchPage from "./searchpage";
import UserDashboard from "./userdashboard";
import TradePage from "./tradepage";
import Registration from "./Registration";
import { ThemeProvider } from "./ThemeContext";
import AddItem from "./AddItem";
import EditItem from "./EditItem";
import AddReview from "./AddReview";
import CustomerSupport from "./CustomerSupport"; 
import ContactUs from "./ContactUs"; 
// import Footer from "./Footer";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSuccessfulLogin = () => {
    setLoggedIn(true);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar loggedIn={loggedIn} />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" exact element={<Login onSuccessfulLogin={handleSuccessfulLogin} />} />
            <Route path="/userdashboard" exact element={<UserDashboard />} />
            <Route path="/" exact element={<Home />} />
            <Route path="/faq" exact element={<FAQ />} />
            <Route path="/registration" exact element={<Registration />} />
            <Route path="/searchpage" exact element={<SearchPage />} />
            <Route path="/trade/:itemId" element={<TradePage />} />
            <Route path="/additem" exact element={<AddItem />} />
            <Route path="/edititem/:itemId" exact element={<EditItem />} />
            <Route path="/addreview/:userId" element={<AddReview />} />
            <Route path="/customersupport" element={<CustomerSupport />} />
            <Route path="/contactus" element={<ContactUs />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
