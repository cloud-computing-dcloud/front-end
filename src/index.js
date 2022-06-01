import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter,Route,Switch}from "react-router-dom";
import Index from "./views/Index";
import Login from "./views/login/Index";
import Register from "./views/register/Index";
import Home from "./views/Home";
import './style/main.less';
import reportWebVitals from './reportWebVitals';


ReactDOM.render((
    <BrowserRouter>
        <Switch>

            <Route path={'/login'} component={Login}/>
            <Route path={'/register'} component={Register}/>
            <Route path={'/home'} component={Home}/>
            <Route component={Index}/>
        </Switch>
    </BrowserRouter>
), document.getElementById("root"));
reportWebVitals();
