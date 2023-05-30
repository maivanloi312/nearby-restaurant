import React, { Fragment, useReducer,useEffect,useState } from "react";
import { BrowserRouterasRouter, Route, Switch, Redirect } from 'react-router-dom';
import '../../css/Admin.css'
import Menu from "./Menu";
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import ProductsList from "./ProductsList";
import DiscountList  from "./DiscountList";

import ProductDetail from "./ProductDetail";
import OrdersList from "./OrdersList";
import store from "../../store";
import { loadUser } from "../../actions/userActions";
import axios from "axios";
import OrderDetail from './OrderDetail';
import UserDetail from "./UserDetail";
import UserList from "./UserList";
import DiscountDetail from "./DiscountDetail";
import AnalyticsPage from "./AnalyticsPage";
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

const Admin=(props)=>{
  const [authenticated,setAuthenticated]=useState(true)
   useEffect(()=>{
        if(!localStorage.getItem("token")){
          setAuthenticated(false)
        }
        else{
          setAuthenticated(true)
        }
       
      
   },[])
    return (
        <Fragment>
        <PrivateRoute exact  path={['/admin/*','/order/me/*','/order/me','/discounts','/discount/*','/profile']} component={Sidebar} isAuthenticated={authenticated}/>
       
        <main className='main-content mt-1 border-radius-lg'>
        <PrivateRoute exact  path={['/admin/*','/order/me/*','/order/me','/discounts','/discount/*','/profile']} component={Menu} avatar={"tada"} isAuthenticated={authenticated}/>
          {/* <Menu/> */}
          <PrivateRoute exact path='/admin/dashboard' component={Dashboard} isAuthenticated={authenticated}/>
        <ProtectedRoute exact path='/admin/products' component={ProductsList} isAuthenticated={authenticated}/>
        <PrivateRoute exact path='/admin/create-product' component={ProductDetail} isAuthenticated={authenticated} />
        <PrivateRoute exact path='/admin/product/:id' component={ProductDetail} isAuthenticated={authenticated}/>
        <PrivateRoute exact path='/admin/orders' component={OrdersList} isAuthenticated={authenticated}/>
        <PrivateRoute exact path={['/admin/order/:id','/order/me/:id']} component={OrderDetail} isAuthenticated={authenticated}/>
        <PrivateRoute exact path='/profile' component={UserDetail} isAuthenticated={authenticated}/>
        <PrivateRoute exact path='/admin/users' component={UserList} isAuthenticated={authenticated}/>
        <PrivateRoute exact path='/admin/user/:id' component={UserDetail} isAuthenticated={authenticated}/>
        <PrivateRoute exact path='/order/me' component={OrdersList} isAuthenticated={authenticated}/>
        <PrivateRoute exact path='/discounts' component={DiscountList} isAuthenticated={authenticated}/>
        <PrivateRoute exact path={['/admin/create-discount','/discount/:id']} component={DiscountDetail} isAuthenticated={authenticated} />
        <PrivateRoute exact path='/admin/analytics' component={AnalyticsPage} isAuthenticated={authenticated}/>

        </main>
        
        </Fragment>
    )
}
export default Admin
