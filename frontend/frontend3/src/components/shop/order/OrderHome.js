import { useEffect } from 'react';
import clientRequest from '../../../APIFeatures/clientRequest';
import { useState } from 'react';
import './OrderHome.css'
import { Link } from 'react-router-dom';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import NotificationContainer from 'react-notifications/lib/NotificationContainer';
const OrderHome=()=>{
    const [product,setProduct]=useState({})
    const [user,setUser]=useState({})
    const [itemsPrice,setItemsPrice]=useState(1);
    const [shippingPrice,setShippingPrice]=useState(0)
    const [totalPrice,setTotalPrice]=useState(1)
    const [taxPrice,setTaxPrice]=useState(0)
    useEffect(()=>{
        clientRequest.getProfileMe().then(res=>setUser(res.user))
        setProduct(JSON.parse(localStorage.getItem('cartItem')))
        setProduct(product=>({...product,quantity:1}))
        setItemsPrice(product.price)
    },[])
    useEffect(()=>{
        setTotalPrice(itemsPrice+shippingPrice+taxPrice)
    },[itemsPrice])
    const removeProduct=()=>{
        localStorage.removeItem('cartItem')
        window.location.href='/home'        
    }
    const changeQuantity=(e)=>{

        setItemsPrice(e.currentTarget.value*product.price)
    }
    const sendOrder=()=>{
        try {
            const data={
                shippingInfo:{
                    address: document.getElementsByName('address')[0].value,
                    city: document.getElementsByName('city')[0].value,
                    phoneNo: document.getElementsByName('phoneNo')[0].value,
                    postalCode:document.getElementsByName('postalCode')[0].value,
                    country:document.getElementsByName('country')[0].value,
                },
                user:user._id,
                orderItems:[
                    {
                        quantity:product.quantity,
                        product:product._id
                    }       
                ],
                itemsPrice:Number (itemsPrice),
                totalPrice:Number (totalPrice),
                orderStatus:'Processing'
            }
            clientRequest.postOrder(data).then(res=>NotificationManager.success('success',"Tạo đơn thành công")).catch(err=>NotificationManager.error('error','tao đơn không thành công'))
        } catch (error) {
        }
        

    }
    return <div className='container order-home' style={{marginTop:'80px'}}>
        <div className='row'>
            <div className='col-md-8'>
                <h1>Shipping Info</h1>
                <form>
                <div className="form-group">
                    <label htmlFor="exampleInputAddress">Address</label>
                    <input type="text" className="form-control" id="exampleInputAddress"  placeholder="Enter address" name='address'/>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputCity">City</label>
                    <input type="text" className="form-control" id="exampleInputCity" placeholder="City" name='city'/>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPhoneNo">Phone Number</label>
                    <input type="text" className="form-control" id="exampleInputPhoneNo" placeholder="Phone number" name='phoneNo'/>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPostal">Postal Code</label>
                    <input type="text" className="form-control" id="exampleInputPostal" placeholder="Postal code" name='postalCode'/>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputCountry">Country</label>
                    <input type="text" className="form-control" id="exampleInputCountry" placeholder="Country" name='country'/>
                </div>
                </form>

            </div>
            {user.avatar&&<div className='col-md-4'>
                <h1>User Info</h1>
                <form>
                <div className="form-group text-center">
                    <div className='avatar'>
                    <img  src={user.avatar.url}/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputName">Name</label>
                    <input type="text" className="form-control" id="exampleInputName"  defaultValue={user.name} disabled/>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail">Email</label>
                    <input type="text" className="form-control" id="exampleInputEmail" defaultValue={user.emailUser} disabled/>
                </div>
               
                </form>
            </div>}
            {!user.avatar&&<div className='col-md-4'>
                <h1>You have to login</h1>
                <button className='btn'>
                    <Link to='/login'>
                        Login
                    </Link>
                </button>
                </div>
            }
        </div>
        <div className='row'>
            <div className='col-md-8'>
            <table class="table-main table-borderless">
  <thead className="table-head">
    <tr className="">
      <th scope="col" className="col c1">Name</th>
      <th scope="col" className="col c2">Image</th>
      <th scope="col" className="col c3">Quantity</th>
      <th scope="col" className="col c4">Price</th>
      <th scope="col" className="col c5">Delete</th>
      


    </tr>
  </thead>
  {product.images&&<tbody>
    
    <tr>
      <td colspan="" className="product-name col">{product.name}</td>

      <td className="product-img col"><img src={product.images[0].url} style={{width:'40px'}}/></td>
      
      <td className="product-quantity col"><input type='number' onChange={(e)=>changeQuantity(e)} onBlur={(e)=>setProduct({...product,quantity:Number (e.currentTarget.value)})} defaultValue={1}/></td>
      
      <td className="product-price col">{product.price}</td>
      
      <td className="product-group col"><div className='btn-group'>
          <button className='btn fas fa-trash-alt' onClick={()=>removeProduct()}></button>

          </div></td>
    </tr>
  </tbody>}
</table>
            </div>
            <div className='col-md-4'>
                <h1>Total</h1>
            <div>
                <span>Items Price:</span>
                <span>{itemsPrice}$</span>
            </div>
            <div>
                <span>Total Price:</span>
                <span>{totalPrice}$</span>
            </div>
            <button className='btn btn-order' onClick={()=>sendOrder()}>Order Now</button>
            <NotificationContainer/>
            </div>
        </div>
    </div>
}
export default OrderHome

// là sao