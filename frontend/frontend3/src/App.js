import React, { Fragment, useReducer,useEffect,useState } from "react";
import Routes from "./components";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import { LayoutContext, layoutState, layoutReducer } from "./components/shop";
import Dashboard from './components/admin/Dashboard'
import Sidebar from './components/admin/Sidebar';
import ProductsList from "./components/admin/ProductsList";
import Menu from './components/admin/Menu';
import Login from './components/LoginDashboard/Login'
import SignUp from "./components/SignUpDashboard/SignUp";
import 'react-notifications/lib/notifications.css';
import Home from './components/shop/home/Home';
import {loadUser} from './actions/userActions'
import store from './store'
import Ads from "./components/shop/ads/Ads";
import Admin from "./components/admin/Admin";
import axios from "axios";
import ProductHome from "./components/shop/product/ProductHome";
import NewPassword from "./components/LoginDashboard/NewPassword";
import OrderHome from './components/shop/order/OrderHome';
import MenuHome from './components/shop/MenuHome';
import CartItems from './components/shop/cart/CartItems';
import 'reactjs-popup/dist/index.css';
import clientRequest from "./APIFeatures/clientRequest";
import { useDispatch } from "react-redux";
import { LOAD_USER_REQUEST } from "./constants/userConstants";
import { getCryptoCurrency } from './actions/etherActions';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={
      props => <Component {...rest} {...props} />
    } />
  )
}
const PrivateRoute = ({ component: Component, handleLogout, isAuthenticated, ...rest }) => (
  <Route {...rest} render={(props) => (
      isAuthenticated === true
      ? <Component {...props} handleLogout={handleLogout} />
      : <Redirect to="/login"/>
  )} />
);
function App() {
  const [authenticated,setAuthenticated]=useState(true)
  let dispatch = useDispatch();
  useEffect(async()=>{
    if(!localStorage.getItem("token")){
      setAuthenticated(false)
    }
    else{
      setAuthenticated(true)
    }
    dispatch(loadUser());
    dispatch(getCryptoCurrency())
  },[])
  
  return (
    <Fragment>

      <Router>
       
        <Fragment>
          <ProtectedRoute exact path={['/',"/home","/product/:id","/order/create-new",'/cart-items']} component={MenuHome}/>
          <ProtectedRoute exact path={['/','/home']} component={Home}/>
         

        </Fragment>
        <Fragment>
          <ProtectedRoute exact path="/product/:id" component={ProductHome}/>
          <ProtectedRoute exact path="/order/create-new" component={CartItems}/>
          {/* <Elements stripe={stripePromise}> */}
          <PrivateRoute exact path="/cart-items" component={CartItems} isAuthenticated={authenticated}/>
          {/* </Elements> */}
    </Fragment>
        <Admin/>
        
        <Fragment>
          <ProtectedRoute exact path='/login' component={Login}/>
          <ProtectedRoute exact path='/create-account' component={SignUp}/>
          <ProtectedRoute exact path='/password/reset/:token' component={NewPassword}/>
        </Fragment>
      </Router>
    </Fragment>
  );
}

export default App; 