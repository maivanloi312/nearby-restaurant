import { useEffect } from 'react';
import { useState } from 'react';
import clientRequest from '../../APIFeatures/clientRequest';
import {compareValidDate, getFormattedDate, validateEmail, validateFullName, validatePhoneNumber} from '../../HandlerCaculate/formatDate';
import Curved from '../../images/curved0.jpg'
import { NotificationManager, NotificationContainer } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../slice/UserSlice';
const UserDetail=(props)=>{
    let profile = useSelector(getUser);
    let dispatch = useDispatch();
    const [user,setUser]=useState({
        name:"",
        url:'',
        email:"",
        password:"",
        avatar:[{
            public_id:"",
            url:"",
        }],
        role:"",
        createAt:""
    })
    const [avatarPr,setAvatarPr]=useState('')
    const [edit,setEdit]=useState(true)
    const [changePass,setChangePass]=useState(false);
    const [disabledAvatar,setDisabledAvatar]=useState(true)
    useEffect(()=>{
      if(props.match.path=='/profile')
        clientRequest.getProfileMe().then(res=>{
          setUser(res.user)
          setAvatarPr(res.user.avatar.url)
        })
        else{
          clientRequest.getUserDetail(props.match.params.id).then(res=>{
            setUser(res.user)
            setAvatarPr(res.user.avatar.url)
          })
        }
        
    },[])
    const onChangeAvatar=(e)=>{
      const reader=new FileReader()
      reader.onload=()=>{
        if(reader.readyState===2){
          setAvatarPr(reader.result)
        }
      }
      reader.readAsDataURL(e.target.files[0])
      setUser({
        ...user,
        name:document.getElementsByName('name')[0].value,
        emailUser:document.getElementsByName('emailUser')[0].value,
        role:document.getElementsByName('role')[0].value,
        dateOfBirth:document.getElementsByName('dateOfBirth')[0].value,
        placeOfBirth:document.getElementsByName('placeOfBirth')[0].value,
        phoneNumber:document.getElementsByName('phoneNumber')[0].value,
        
      })
    }
    const MenuUser=()=>{
        return (user && <div className="container-fluid">
        <div className="page-header min-height-300 border-radius-xl mt-4" style={{backgroundImage: `url(${Curved})`, backgroundPositionY: '50%'}}>
          <span className="mask bg-gradient-primary opacity-6" />
        </div>
        <div className="card card-body blur shadow-blur mx-4 mt-n6">
          <div className="row gx-4">
            <div className="col-auto">
              <div className="avatar avatar-xl position-relative">
                 <img src={avatarPr} alt="..." className="w-100 border-radius-lg shadow-sm" />
                <input onChange={(e)=>onChangeAvatar(e)} type="file" className=" fa fa-pen btn btn-sm btn-icon-only bg-gradient-light position-absolute bottom-0 end-0 mb-n2 me-n2" disabled={disabledAvatar}/>
                 
              </div>
            </div>
            <div className="col-auto my-auto">
              <div className="h-100">
                <h5 className="mb-1">
                  {user.name}
                </h5>
                <p className="mb-0 font-weight-bold text-sm">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="col-sm-4 col-8 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
              <div className="nav-wrapper position-relative end-0">
              
              </div>
            </div>
          </div>
        </div>
      </div>)
    }
    const saveUser=()=>{
      setUser({
        ...user,
        name:document.getElementsByName('name')[0].value,
        emailUser:document.getElementsByName('emailUser')[0].value,
        role:document.getElementsByName('role')[0].value,
        dateOfBirth:document.getElementsByName('dateOfBirth')[0].value,
        placeOfBirth:document.getElementsByName('placeOfBirth')[0].value,
        phoneNumber:document.getElementsByName('phoneNumber')[0].value,
      })
      
      const data={
        name:document.getElementsByName('name')[0].value,
        emailUser:document.getElementsByName('emailUser')[0].value,
        role:document.getElementsByName('role')[0].value,
        dateOfBirth:document.getElementsByName('dateOfBirth')[0].value,
        placeOfBirth:document.getElementsByName('placeOfBirth')[0].value,
        phoneNumber:document.getElementsByName('phoneNumber')[0].value,
      }
      if(!validateFullName(data.name) && props.match.path=='/profile'){
        NotificationManager.error('Error', 'Full name invalid')
        return
      }
      if(!validateEmail(data.emailUser)&& props.match.path=='/profile'){
        NotificationManager.error('Error', 'Email invalid')
        return
      }
      if(compareValidDate(data.dateOfBirth)&&props.match.path=='/profile'){
        NotificationManager.error('Error', 'Date of birth must be less than current ')
        return
      }
      if(!validatePhoneNumber(data.phoneNumber)&&props.match.path=='/profile'){
        NotificationManager.error('Error', 'Phone number invalid')
        return
      }
      if(props.match.path=='/profile'){
        clientRequest.updateUser(data,avatarPr).then(res=>NotificationManager.success('Success', 'Update success')).catch(err=>NotificationManager.error('error', 'Update failed'))
      }
      else{
        clientRequest.updateUserDetail(props.match.params.id,data,avatarPr).then(res=>NotificationManager.success('Success', 'Update success')).catch(err=>NotificationManager.error('error', 'User deleted before'))
      }
      setEdit(true)
    }

    const deleteUser=async()=>{
      if(props.match.path=='/profile'){
        await clientRequest.deleteAccountMe().then(res=>{NotificationManager.success('Success', 'Update success')
        localStorage.removeItem("token");
        window.location.href='/login'
      })
      }
      else{
        clientRequest.deleteUserDetail(props.match.params.id).then(res=>{NotificationManager.success('Success', 'Update success')
        window.location.href='/admin/users'
      })
      }
     

    }
    const InfoUser=()=>{
        return (user && <div className="col-12 col-xl-8">
        <div className="card h-100">
          <div className="card-header pb-0 p-3">
            <div className="row">
              <div className="col-md-8 d-flex align-items-center">
                <h6 className="mb-0">Profile Information</h6>
              </div>
              <div className="col-md-4 text-right">
                <a href="javascript:;">
                  {edit?
                  <i onClick={()=>{setEdit(false)
                  setDisabledAvatar(false)
                  }} className="fas fa-user-edit text-secondary text-sm" data-bs-toggle="tooltip" data-bs-placement="top" title aria-hidden="true" data-bs-original-title="Edit Profile" aria-label="Edit Profile" />
                  :(<div className="btn-group">
                    <button className='btn btn-primary' onClick={()=>saveUser()}>Save</button>
                  {props.match.path=='/profile' &&<><button className='btn' 
                  onClick={()=>setChangePass(!changePass)}>Change Password</button></>}
                  {props.match.path=='/profile'&& <button className='btn' onClick={()=>deleteUser()} >Delete</button>}
                  </div>
                  )
                  } 
                </a>
              </div>
            </div>
          </div>
          <div className="card-body p-3">
            
            <hr className="horizontal gray-light my-4" />
            <ul className="list-group">
              <li className="list-group-item border-0 ps-0 pt-0 text-sm"><strong className="text-dark">Full Name:</strong> &nbsp;<input name='name' defaultValue={user.name} disabled={props.match.path=="/admin/user/:id"||edit}/> </li>
              <li className="list-group-item border-0 ps-0 text-sm"><strong className="text-dark">Email:</strong> &nbsp; <input name='emailUser' defaultValue={user.emailUser} disabled={props.match.path=="/admin/user/:id"||edit}/></li>
              <li className="list-group-item border-0 ps-0 text-sm"><strong className="text-dark">Role:</strong> &nbsp;
              <select defaultValue={user.role} name='role' disabled={props.match.path=="/admin/user/:id"&&!edit?false:true}>
  <option value="user">user</option>
  <option value="admin">admin</option>
</select>

               </li>
               <li className="list-group-item border-0 ps-0 text-sm"><strong className="text-dark">Date Of Birth:</strong> &nbsp;
               <input type="date" id="start" name="dateOfBirth"
       defaultValue={user.dateOfBirth}
       min="1960-01-01" disabled={props.match.path=="/admin/user/:id"||edit}/>
               </li>
               <li className="list-group-item border-0 ps-0 text-sm"><strong className="text-dark">Place Of Birth:</strong> &nbsp;
               <input  name="placeOfBirth" defaultValue={user.placeOfBirth} disabled={props.match.path=="/admin/user/:id"||edit}/>
               </li>
               <li className="list-group-item border-0 ps-0 text-sm"><strong className="text-dark">Phone Number:</strong> &nbsp;
               <input name="phoneNumber" defaultValue={user.phoneNumber} disabled={props.match.path=="/admin/user/:id"||edit}/>
               </li>
              <li className="list-group-item border-0 ps-0 text-sm"><strong className="text-dark">Create At:</strong> &nbsp; {getFormattedDate(user.createAt)}</li>
              
            </ul>
          </div>
        </div>
      </div>
      )
    }
    const savePassword=()=>{

      const data={
        oldPassword:document.getElementsByName('oldPassword')[0].value,
        password:document.getElementsByName('password')[0].value,
      }
      clientRequest.updatePassword(data.oldPassword,data.password).then(res=>{
        NotificationManager.success('Success', 'Update password success')
      localStorage.removeItem("token");
      window.location.href='/login'
    }).catch(err=>
      NotificationManager.error('Error', 'Update password failed')
    )

    }
    const ChangePassUser=()=>{
      return (<div className="col-12 col-xl-4 change-password">
       
      <div className="card h-100">
     
        <div className="card-header pb-0 p-3">
        <div className="btn-group"><button className='btn' onClick={()=>setChangePass(!changePass)}>Back</button>
                  <button className='btn btn-primary' 
                  onClick={()=>savePassword()}
                  >Save</button></div>
          <h6 className="mb-0">Change Password</h6>
       
        </div>
        <div className="card-body p-3">
          <input placeholder="Old Password" name='oldPassword' type='password'/>
          <input placeholder="Password" name='password' type='password'/>
        </div>
      </div>
    </div>
    )
    }
    return (user &&<>
        <MenuUser/>
        <div className="container-fluid py-4">
            <div className="row">
                {!changePass &&<InfoUser/>}
                {(changePass && props.match.path=='/profile')&&<ChangePassUser/>}
            </div>
        </div>
        <NotificationContainer/>

    </>
  )
}
export default UserDetail