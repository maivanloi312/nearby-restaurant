import axios from 'axios';
import { React, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import clientRequest from '../../APIFeatures/clientRequest';
import {getFormattedDate} from './../../HandlerCaculate/formatDate';

const ProductsList=()=>{
    const [listProduct,setListProduct]=useState([])
    const [searchName,setSearchName]=useState('')
    const [sizePage,setSizePage]=useState({
      current:1,
      total:0,
      count:10,

    })
    useEffect(()=>{
      clientRequest.getProductsRoleAdmin()
            .then((result) => {
              setListProduct(result.products)
            })
            .catch(() => {})
      
      clientRequest.getLengthAllProducts()
      .then(res=>{setSizePage(sizePage=>({...sizePage,total:res.lengthProducts}))})
      .catch(error=>console.error()) 
       
    },[])
    useEffect(()=>{
      clientRequest.getSearchProductsRoleAdmin(searchName,sizePage.current).then(res=>setListProduct(res.products))
    },[sizePage.current,searchName])
    const handlePageChange=(pageNumber)=> {
      setSizePage(sizePage=>({...sizePage,current:pageNumber}))
    }
    
    const ProductRow=(product)=>{
        return <tr>
                  <td>
                    <div className="d-flex px-2 py-1">
                      <div>
                        <img src={product.images[0].url} className="avatar avatar-sm me-3" />
                      </div>
                      <div className="d-flex flex-column justify-content-center">
                        <h6 className="mb-0 text-sm">{product.name}</h6>
                        <p className="text-xs text-secondary mb-0">{product._id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="text-xs font-weight-bold mb-0">{product.seller}</p>
                  </td>
                  <td className="align-middle text-center text-sm">
                  <p className="text-xs font-weight-bold mb-0" style={{color:product.stock<10?"red":""}}>{product.stock}</p>

                  </td>
                  <td className="align-middle text-center">
                    <span className="text-secondary text-xs font-weight-bold">{getFormattedDate(product.createdAt)}</span>
                  </td>
                  <td className="align-middle">
                    <Link  to={"/admin/product/"+product._id} className="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                      Edit
                    </Link>
                  </td>
                  
                </tr>
    }
    const onChangeSearchProduct=(e)=>{
      setSearchName(e.currentTarget.value)
      const config={
        headers:{
            'Content-Type':'application/json'
        }
    }
    const userToken=localStorage.getItem("token")
      axios.get(`http://localhost:4000/api/v1/products?keyword=${e.currentTarget.value}`,{
        params:{
          userToken
        }
      },config).then(res=>setListProduct(res.data.products))
    }
    return (
        <div className="container-fluid py-4">
  <div className="row">
    <div className="col-12">
      <div className="card mb-4">
        <div className="card-header pb-0">
          <h6>Product List</h6>
          <div style={{display:'flex',justifyContent:'space-between'}}>
          <input className='search-product' onChange={e=>onChangeSearchProduct(e)} placeholder="Search product"/>
          <Link name="" id="" class="btn create-button" to="/admin/create-product" role="button" style={{background:"#29e625"}}>Create Product</Link>
          </div>
          <br/>

        </div>
        <div className="card-body px-0 pt-0 pb-2">
          <div className="table-responsive p-0">
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Name</th>
                  <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Seller</th>
                  <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Stock</th>
                  <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">CreatedAt</th>
                  <th className="text-secondary opacity-7" />
                </tr>
              </thead>
              <tbody>
                  {listProduct.map(item=>{return ProductRow(item)})}
               
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
 
</div>

    )
}
export default ProductsList