import { React, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import clientRequest from './../../APIFeatures/clientRequest';
import { logoutUser } from './../../actions/userActions';
import { useDispatch } from 'react-redux';
const Menu =(props)=>{
  const [avatar,setAvatar]=useState('')
  const dispatch=useDispatch()
  const [redirect, setRedirect]=useState(false)
  useEffect(()=>{
  clientRequest.getProfileMe().then(res=>setAvatar(res.user.avatar.url))
  
  },[])
  const logoutUser1=()=>{
    try {
      dispatch(logoutUser())
      setRedirect(!redirect)
  
    } catch (error) {
      
    }
  
    
  }
    return (<>
    {redirect &&  <Redirect to="/login" />}
        <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 border-radius-xl shadow-none" id="navbarBlur" navbar-scroll="true">
  <div className="container-fluid py-1 px-3">
    
    <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
      <div className="ms-md-auto pe-md-3 d-flex align-items-center">
        
      </div>
      <ul className="navbar-nav  justify-content-end">
        <li className="nav-item align-items-center">
          <Link to="/profile" className="nav-link font-weight-bold px-0 text-body avatar">
           <img src={avatar}/>
          </Link>
          <div className={'show-menu'}>
            <ul>
              <li><Link to='/profile'>Profile</Link></li>
              <li onClick={()=>logoutUser1()}>Log out</li>
            </ul>
          </div>
        </li>
        <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
          <a href="javascript:;" className="nav-link p-0 text-body" id="iconNavbarSidenav">
            <div className="sidenav-toggler-inner">
              <i className="sidenav-toggler-line" />
              <i className="sidenav-toggler-line" />
              <i className="sidenav-toggler-line" />
            </div>
          </a>
        </li>
        
       
      </ul>
    </div>
  </div>
</nav>

</>
    )
}
export default Menu
