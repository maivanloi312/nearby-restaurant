import { useEffect } from 'react';
import clientRequest from '../../APIFeatures/clientRequest';
import { useState } from 'react';
import {getFormattedDate} from './../../HandlerCaculate/formatDate';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';

const UserList=()=>{
    const [users,setUsers]=useState([]);
    const [sizePage,setSizePage]=useState({
      current:1,
      count:10,
      total:0
    })
    const [searchName,setSearchName]=useState('')
    
    useEffect(()=>{
        clientRequest.getAllUser().then(res=>setSizePage({...sizePage,total:res.user.length}))
    },[])
    useEffect(()=>{
      clientRequest.getSearchUsers(searchName,sizePage.current).then(res=>{
        setUsers(res.users)
      })
    },[sizePage.current,searchName])
    const UserRow=(item)=>{
        return ( <tr>
            
            <td>
              <div className="d-flex px-2 py-1">
                <div>
                  <img src={item.avatar.url} className="avatar avatar-sm me-3" />
                </div>
                <div className="d-flex flex-column justify-content-center">
                        <h6 className="mb-0 text-sm">{item.name}</h6>
                        <p className="text-xs text-secondary mb-0">{item._id}</p>
                      </div>
              </div>
            </td>
           
           
            <td className="align-middle text-center">
              <span className="text-secondary text-xs font-weight-bold">{item.emailUser}</span>
            </td>
           
            <td className="align-middle text-center">
              <span className="text-secondary text-xs font-weight-bold">{getFormattedDate (item.createAt)}</span>
            </td>
            <td className="align-middle">
              <Link  to={"/admin/user/"+item._id} className="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                Edit
              </Link>
            </td>
            
          </tr>)
    }
    const changeSearchUser=(e)=>{
      setSearchName(e.currentTarget.value)
    }
    const handlePageChange=(pageNumber)=> {
      setSizePage(sizePage=>({...sizePage,current:pageNumber}))
    }
    return (<div className="container-fluid py-4">
    <div className="row">
      <div className="col-12">
        <div className="card mb-4">
          <div className="card-header pb-0">
            <h6>User List</h6>
            <input onChange={(e)=>changeSearchUser(e)} placeholder="Search product"/>
            <div style={{display:'flex',justifyContent:'space-between'}}>
            </div>
            <br/>
  
          </div>
          <div className="card-body px-0 pt-0 pb-2">
            <div className="table-responsive p-0">
              <table className="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Avatar</th>
                    <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Email</th>
                    <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">createAt</th>

                    <th className="text-secondary opacity-7" />
                  </tr>
                </thead>
                <tbody>
                    {users.map(item=>{return UserRow(item)})}
                 
                </tbody>
  
              </table>
              <div>
              <Pagination
          activePage={sizePage.current}
          itemsCountPerPage={sizePage.count}
          totalItemsCount={sizePage.total}
          itemClass="page-item"
          linkClass="page-link"
          onChange={(e)=>handlePageChange(e)}
        />
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
   
  </div>)
}
export default UserList