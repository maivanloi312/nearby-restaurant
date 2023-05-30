import { React, useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {register,clearErrors} from '../../actions/userActions'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import clientRequest from '../../APIFeatures/clientRequest';
const MenuSignUp=()=>{
    return (<nav className="navbar navbar-expand-lg position-absolute top-0 z-index-3 w-100 shadow-none my-3  navbar-transparent mt-4">
    <div className="container">
     
      <button className="navbar-toggler shadow-none ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon mt-2">
          <span className="navbar-toggler-bar bar1" />
          <span className="navbar-toggler-bar bar2" />
          <span className="navbar-toggler-bar bar3" />
        </span>
      </button>
      <div className="collapse navbar-collapse" id="navigation">
        <ul className="navbar-nav mx-auto">
          <li className="nav-item">
            <Link className="nav-link d-flex align-items-center me-2 active" aria-current="page" to="/admin/dashboard">
              <i className="fa fa-chart-pie opacity-6  me-1" aria-hidden="true" />
              Dashboard
            </Link>
          </li>
          
          <li className="nav-item">
            <Link className="nav-link me-2" to="/create-account">
              <i className="fas fa-user-circle opacity-6  me-1" aria-hidden="true" />
              Sign Up
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link me-2" to="/login">
              <i className="fas fa-key opacity-6  me-1" aria-hidden="true" />
              Sign In
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav d-lg-block d-none">
         
        </ul>
      </div>
    </div>
  </nav>
  )
}
const BackgroundSignUp=()=>{
    return (<div className="page-header align-items-start section-height-50 pt-5 pb-11 m-3 border-radius-lg" style={{backgroundImage: 'url("https://i.pinimg.com/originals/3d/c4/49/3dc449b04d9ace524a0ecd247e1fdc83.png")'}}>
    <span className="mask bg-gradient-dark opacity-6" />
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-5 text-center mx-auto">
          <h1 className="text-white mb-2 mt-5">Welcome!</h1>
          <p className="text-lead text-white">Use these awesome forms to login or create new account in your project for free.</p>
        </div>
      </div>
    </div>
  </div>
  )
}
const Form=()=>{
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [avatarPreview,setAvatarPreview]=useState('')
    const [avatar,setAvatar]=useState('')
    const dispatch=useDispatch()
    const [isRedirect,setIsRedirect]=useState(false)
    const delay = (ms) => new Promise(resolve =>
      setTimeout(resolve, ms)
    );
    const submitRegister= async (e)=>{
      try{
        e.preventDefault();
        
        const userData={
            // "name":name,
            "email":email,
            "password":password,
            // "avatar":avatar
        }
        await clientRequest.createUser(userData).then(res=>{
          NotificationManager.success('Success message', 'Account successfully created')
          setIsRedirect(!isRedirect)
      })
       
      }catch{

      }
       
        
    }
    const onChangeAvatar=(e)=>{
      const reader=new FileReader()
      reader.onload=()=>{
        if(reader.readyState===2){
          setAvatarPreview(reader.result)
          setAvatar(reader.result)
        }
      }
      
      reader.readAsDataURL(e.target.files[0])
    }
    return (<>
    {isRedirect && <Redirect to="/login"/>}
    <div className="card z-index-0">
    <div className="card-header text-center pt-4">
      <h5>Register</h5>
    </div>
    
    <div className="card-body">
      <form role="form text-left" onSubmit={submitRegister}>
       
        <div className="mb-3">
          <input onChange={(e)=>setEmail(e.currentTarget.value)} type="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="email-addon" />
        </div>
        <div className="mb-3">
          <input onChange={(e)=>setPassword(e.currentTarget.value)} type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password-addon" />
        </div>
      
       
        <div className="text-center">
          <button type="submit" className="btn bg-gradient-dark w-100 my-4 mb-2">Sign up</button>
        </div>
        <p className="text-sm mt-3 mb-0">Already have an account? <Link to="/login" className="text-dark font-weight-bolder">Sign in</Link></p>
      </form>
    </div>
  </div>
  </>
  )
}
const SignUp=()=>{
  useEffect(()=>{
    if(localStorage.getItem("token")){
      window.location.href='/admin/dashboard'
    }
  },[])
    return (
        <div className={'g-sidenav-show  bg-gray-100'}>
            <MenuSignUp/>
            <section className='h-100-vh mb-8'>
            <BackgroundSignUp/>
            <div className={'container'}>
                <div className={'row mt-lg-n10 mt-md-n11 mt-n10'}>
                    <div className={'col-xl-4 col-lg-5 col-md-7 mx-auto'}>
                        <Form/>
                    </div>
                </div>
            </div>
            </section>
            <NotificationContainer/>
        </div>
    )
}
export default SignUp