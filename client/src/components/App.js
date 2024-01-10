import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./navbar";
import Home from "./home";
import FAQ from "./faq";
import Login from "./login";
import SearchPage from "./searchpage";
import TradePage from "./tradepage";
import UserDashboard from "./userdashboard";
import Registration from "./Registration"; 
import { ThemeProvider } from "./ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/faq" exact component={FAQ} />
          <Route path="/login" exact component={Login} />
          <Route path="/registration" exact component={Registration} /> 
          <Route path="/userdashboard" exact component={UserDashboard} />
          <Route path="/searchpage" exact component={SearchPage} />
          <Route path="/tradepage" exact component={TradePage} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
