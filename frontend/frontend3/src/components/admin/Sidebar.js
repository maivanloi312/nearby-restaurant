import { React, useState, useEffect } from 'react';
import {Link} from'react-router-dom'
import logo from '../../images/tazas.png'
import clientRequest from './../../APIFeatures/clientRequest';
const SidebarRow=(props)=>{

  return (
    <li className={'nav-item sidebar'}>
        <Link className="nav-link" to={props.url}>
          <i class={props.icon}></i>
           
          <span className="nav-link-text ms-1">{props.title}</span>
        </Link>
      </li>
  )
}

const Sidebar=()=>{
  const [user,setUser]=useState({})
    useEffect(async ()=>{
      const res=await clientRequest.getProfileMe()
      setUser(res.user)
    },[])
    return (
        <aside className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-left ms-3" id="sidenav-main">
  <div className="sidenav-header">
    <Link className="navbar-brand m-0" to="/admin/dashboard">
      <img src={logo} className="navbar-brand-img" alt="..." />
    </Link>
  </div>
  <hr className="horizontal dark mt-0" />
  <div className="collapse navbar-collapse  w-auto" id="sidenav-collapse-main">
    <ul className="navbar-nav">
    <SidebarRow url={'/home'} icon={"fas fa-store"} title={'Store'}/>
      {user.role=='admin'&&<SidebarRow url={'/admin/dashboard'} icon={'fas fa-home'} title={'Dashboard'}/>}
      {user.role=='admin'&&<SidebarRow url={'/admin/products'} icon={'fas fa-archive'} title={'Products'}/>}
      {user.role=='admin'&&<SidebarRow url={'/admin/orders'} icon={"fas fa-shipping-fast"} title={'Orders'}/>}
      {user.role=='admin'&&<SidebarRow url={'/admin/users'} icon={"fas fa-users"} title={'Customer'}/>}
      <SidebarRow url={'/profile'} icon={"fas fa-user"} title={'Profile'}/>
      {user.role=='user'&&<SidebarRow url={'/order/me'} icon={"fas fa-shipping-fast"} title={'My orders'}/>}
      <SidebarRow url={'/discounts'} icon={"fas fa-badge-dollar"} title={'Discounts'}/>
      {user.role=='admin'&&<SidebarRow url={'/admin/analytics'} icon={"fas fa-chart-line"} title={'Analytics'}/>}
    </ul>
  </div>
  
</aside>

    )
}
export default Sidebar