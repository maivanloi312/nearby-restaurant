import { React } from 'react';
import '../../../css/Home.css'
import  {Carousel}  from 'react-bootstrap';
import { useEffect } from 'react';
import clientRequest from '../../../APIFeatures/clientRequest';
import { useState } from 'react';
import logo from '../../../images/tazas.png'
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import MenuHome from '../MenuHome';
import { Popup } from 'reactjs-popup';
import ModalPopup from '../../shared/ModalPopup';
import { set } from 'mongoose';
import { formatterMoney } from '../../../HandlerCaculate/formatDate';


const CaroselHome=()=>{
  return <div className='container' style={{marginTop:'87px'}}><Carousel className='carousel-home'>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="https://img.freepik.com/free-vector/flat-design-pizza-sale-banner_23-2149116013.jpg?w=1060&t=st=1685861895~exp=1685862495~hmac=8482c933dd624c8482b3fd396a7edeca232c379dc6c7d94a38fe88f2957b9894"
      alt="First slide"
    />
    
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="https://img.freepik.com/free-vector/flat-design-asian-food-facebook-template_23-2150057871.jpg?w=996&t=st=1685861934~exp=1685862534~hmac=27da51b0519712922b2d9b4dd2ac5e84d26975687fa25040fb134b0752041f12"
      alt="Second slide"
    />

  
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="https://img.freepik.com/free-vector/flat-design-food-sale-background_23-2149167390.jpg?w=1060&t=st=1685861970~exp=1685862570~hmac=384905b2ef7f9f7522d4b6f9bb9e4398aaf0a8cc6de461f61780bdd20e362c6f"
      alt="Third slide"
    />

    
  </Carousel.Item>
</Carousel></div>
}
const Home =()=>{
  const [sizePage,setSizePage]=useState({
    current:1,
    count:6,
    total:0,
  })
  const [products,setProducts]=useState([]);
  const [search,setSearch]=useState('')
  const [category,setCategory]=useState('')
  const [classify,setClassify]=useState('')
  // useEffect(()=>{

  // },[sizePage.current,search,category,classify])
  useEffect(()=>{
    // clientRequest.getLengthAllProductsHome().then(res=>setSizePage({...sizePage,total:res.lengthProducts}))
    if(search===''&& category===''&&classify==''){
      clientRequest.getRandomProduct().then(res=>setProducts(res.products))
    }
    else{
    clientRequest.getSearchProductsHome(search,sizePage.current,category,classify).then(res=>{setProducts(res.products)})
    }
  },[search,category,classify])

   
  const loadMoreItem=()=>{
    if(search===''&& category===''&&classify==''){
    clientRequest.getRandomProduct().then(res=>{
      setProducts(oldArray => [...oldArray, ...res.products])
     })
    }
  }
  const handlePageChange=(e)=>{
    setSizePage({...sizePage,current:e})
  }
    return (
        <>
        
        <CaroselHome/>
        <br></br>
        <div className='container product-list'>
          <input className='search-input-home' placeholder='Tìm món ăn' onChange={(e)=>setSearch(e.currentTarget.value)}/>
          <button  type="submit">
              <i className="fa fa-search"></i>
          </button>
          <div style={{display:'inline-block',float:'right'}}>
          <span>Bộ lọc</span>
          <span>
          <select className="form-select form-select-sex" aria-label="Default select example" onChange={(e)=>setClassify(e.target.value)}>
          <option selected value='' >Tất cả</option>
          <option  value={'New'} >Mới</option>
          <option  value={'Signature'} >Signature</option>
          <option  value={'Traditional'} >Truyền thống</option>

</select>
          </span>
          <span>

          <select className="form-select" aria-label="Default select example" onChange={(e)=>setCategory(e.target.value)}>
        
        <option selected value='' >Tất cả</option>
              <option value={'BREAD'}>Bánh mì/Xôi</option>
              <option value={'VEGETARIAN'}>Đồ chay</option>
              <option value={'RICE'}>Cơm/Cơm tấm</option>
              <option value={'NOODLE'}>Bún/Phở/Mì/Cháo</option>
              <option value={'SEAFOOD'}>Ốc/Cá/Hải sản</option>
              <option value={'HOTPOT'}>Lẩu/Đồ nướng</option>
              <option value={'DESSERT'}>Tráng miệng</option>
              <option value={'BEER'}>Bia/Rượu</option>
              <option value={'SOFT'}>Sinh tố/Nước ngọt</option>
      </select>
          </span>
          </div>
          
         
        <div className='row'>

          {products.map(item=><div className='col-md-4' style={{marginBottom:'15px'}}>
            <Link to={`/product/${item._id}`}>
              <div className="element-product" style={{padding:'15px'}}>
        <div className='avatar-home'>
          <div className='line'>
          <img src={item.images[0].url}/>
          <div className='avatar-home_thumbnail'>
          <img src={logo}/>
          
          </div>

          </div>
          
         
        </div>
        <br></br>
        <br></br>

        <div className="product-info" style={{display:'flex',justifyContent:'space-between'}}>
            <span>{item.name}</span>
            <span>{formatterMoney.format(item.price)}</span>
          </div>
          </div>
        </Link>
</div>)}
          
        </div>
        {/* <Pagination
         activePage={sizePage.current}
         itemsCountPerPage={sizePage.count}
         totalItemsCount={sizePage.total}
         itemClass="page-item"
         linkClass="page-link"
         onChange={(e)=>handlePageChange(e)}/> */}
        

        </div>
        <div style={{textAlign:'center'}}><button name="" id="" class="btn create-button" role="button" onClick={()=>loadMoreItem()}>Xem thêm</button></div>
       </>
       
    )
}
export default Home