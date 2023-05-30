
import axios from 'axios';
import { useState, useEffect } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Redirect, Switch, Link } from 'react-router-dom';
import clientRequest from '../../APIFeatures/clientRequest';
import imageDefault from '../../images/default.jpg'
import  Modal  from 'react-awesome-modal';
import { getFormattedDate } from '../../HandlerCaculate/formatDate';

const ProductDetail=(props)=>{
  
  const [avatar,setAvatar]=useState('')
  const [stProduct,setStProduct]=useState({
    name:'',
    price:0,
    description:'',
    images:[{
      public_id:"",
      url:""
    }],
    classify:'',
    category:'',
    stock:0,
  })
  const [openModal,setOpenModal]=useState(false)
  const [inventories,setInventories]=useState()
  useEffect(async()=>{
    if(props.match.path=='/admin/create-product'){
    }
    else if(props.match.path=='/admin/product/:id'){
      clientRequest.getProductDetailRoleAdmin(props.match.params.id).then(res=>{
        setStProduct(res.product)
        setAvatar(res.product.images[0].url)
      })
      const result=await clientRequest.getInventoryByProduct(props.match.params.id)
      setInventories(result.list)
    }
  },[])
  const submitHandler=(e)=>{
    e.preventDefault();
    if(props.match.path=='/admin/create-product'){
      if(isNaN(document.getElementsByName('price')[0].value)
          ||isNaN(document.getElementsByName('stock')[0].value)){
        NotificationManager.error('Error', 'Wrong format')
        return
       }
      const data={
        name:document.getElementsByName('name')[0].value,
        price:Number(document.getElementsByName('price')[0].value),
        description:document.getElementsByName('descriptionInput')[0].value,
        classify:document.getElementsByName('classify')[0].value,
        category:document.getElementsByName('category')[0].value,
        stock:Number(document.getElementsByName('stock')[0].value),
        image:avatar
      }
      console.log(data)
      if(!data.name|| !data.price || !data.description || !data.classify || !data.category || !data.stock || !data.image){
        NotificationManager.error('Error', 'Please enter full information')
        return
      }
      if(Number (data.price)<0){
        NotificationManager.error('Error', 'Please enter price greater 0')
        return
      }
      if(Number (data.stock)<0){
        NotificationManager.error('Error', 'Please enter stock greater 0')
        return
      }
      if(!Number.isInteger(data.stock)){
        NotificationManager.error('Error', 'Wrong format stock')
        return
      }


    
    clientRequest.newProduct(data).then(res=>{NotificationManager.success('Success', 'Success')
    window.location.href=`/admin/product/${res.product._id}`
    })
    
    }
    else{
      
      setStProduct({...stProduct,
      name:document.getElementsByName('name')[0].value,
      price:Number(document.getElementsByName('price')[0].value),
      description:document.getElementsByName('descriptionInput')[0].value,
      classify:document.getElementsByName('classify')[0].value,
      category:document.getElementsByName('category')[0].value,
      stock:Number(document.getElementsByName('stock')[0].value)

      })
      if(isNaN(document.getElementsByName('price')[0].value)
          ||isNaN(document.getElementsByName('stock')[0].value)){
        NotificationManager.error('Error', 'Wrong format')
        return
       }
      const data={
        name:document.getElementsByName('name')[0].value,
        price:Number(document.getElementsByName('price')[0].value),
        description:document.getElementsByName('descriptionInput')[0].value,
        classify:document.getElementsByName('classify')[0].value,
        category:document.getElementsByName('category')[0].value,
        stock:Number(document.getElementsByName('stock')[0].value),
        image:avatar
      }
      if(!data.name|| !data.price || !data.description || !data.classify || !data.category || !data.stock || !data.image){
        NotificationManager.error('Error', 'Please full enter information')
        return
      }
      if(Number (data.price)<0){
        NotificationManager.error('Error', 'Please enter price greater 0')
        return
      }
      if(Number (data.stock)<0){
        NotificationManager.error('Error', 'Please enter stock greater 0')
        return
      }
      if(!Number.isInteger(data.stock)){
        NotificationManager.error('Error', 'Wrong format stock')
        return
      }

    //update duoc nhung bao loi
    clientRequest.updateProduct(stProduct._id,data).then(NotificationManager.success('Success', 'Success')).catch(err=>console.error())
      
    }
    

  }
  const deleteItem=(id)=>{
    
  clientRequest.deleteProduct(id).then(res=>{NotificationManager.success('Success', 'Success')
    window.history.go(-1)
  }).catch(err=> NotificationManager.error('Error', 'Error'))
     
      
  }
 
  const Form =()=>{
    
    return(<form style={{padding:'30px 0'}} 
    onSubmit={submitHandler}
    >
        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Name</label>
            <input type="text" className="form-control" placeholder="Name product" name="name" defaultValue={stProduct.name} />
          </div>
          <div className="form-group col-md-6">
          <label>Price</label>

            <input type="text" className="form-control" placeholder="Price product" name="price" defaultValue={stProduct.price}/>
          </div>
        </div>
        <div className="form-group">
        <label>Description</label>

          <textarea class="form-control" placeholder="Description" rows="3" name="descriptionInput" defaultValue={stProduct.description}></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group col-md-4">
            <label>Classify</label>
            <select className="form-control" name='classify' defaultValue={stProduct.classify}>
              <option selected>Men</option>
              <option>Women</option>
              <option>Kid</option>
            </select>
          </div>
          <div className="form-group col-md-4">
            <label>Category</label>
            <select className="form-control" name='category' defaultValue={stProduct.category}>
              <option value={'T_SHIRT'}>Áo thun</option>
              <option value={'SHIRT'}>Áo sơ mi</option>
              <option value={'COAT'}>Áo khoác</option>
              <option value={'SHORT'}>Quần lửng</option>
              <option value={'TROUSER'}>Quần dài</option>
              <option value={'SUIT'}>Vét</option>
              <option value={'SHOES'}>Giày</option>
              <option value={'HAT'}>Mũ</option>
              <option value={'BAG'}>Túi xách</option>
            </select>
          </div>
          <div className="form-group col-md-4">
            <label>Stock</label>
            <input type="text" className="form-control" placeholder="Stock" name="stock" defaultValue={stProduct.stock} disabled={props.match.path=='/admin/product/:id'}/>
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary">Save</button>
        {props.match.path=='/admin/product/:id' && <button style={{marginLeft:'15px'}} type="submit" className="btn btn-danger" onClick={()=>deleteItem(stProduct._id)}>Delete</button>}
        {props.match.path=='/admin/product/:id' && <button style={{marginLeft:'15px'}} type="submit" className="btn btn-success"  onClick={()=>setOpenModal(true)}>Update Stock</button>}

      </form>
      )
}
const onChangeAvatar=(e)=>{
  const reader=new FileReader()
  reader.onload=()=>{
    if(reader.readyState===2){
      setAvatar(reader.result)
    }
  }
  reader.readAsDataURL(e.target.files[0])
  setStProduct({...stProduct,
    name:document.getElementsByName('name')[0].value,
    price:Number(document.getElementsByName('price')[0].value),
    description:document.getElementsByName('descriptionInput')[0].value,
    classify:document.getElementsByName('classify')[0].value,
    category:document.getElementsByName('category')[0].value,
    stock:Number(document.getElementsByName('stock')[0].value)

    })
}
const InputImage=()=>{
    return(<div className="custom-file">
      <label > product image</label>
    <input
     type='file'
     name='avatar'
     className='custom-file-input'
     accept='images/*'
     onChange={(e)=>onChangeAvatar(e)}
    required 
    />
    <div className="invalid-feedback">Example invalid custom file feedback</div>
    <img src={(avatar)?(avatar):(imageDefault)} style={{width:'100%'}}/>
  </div>
  )
}
const updateStock=async()=>{
  if(!Number.isInteger(Number (document.getElementsByName('addStock')[0].value))){
    NotificationManager.error('Error', 'Wrong format stock ')
    return
  }
    const data={
      productId:stProduct._id,
      quantity:document.getElementsByName('addStock')[0].value
    }
    await clientRequest.addStock(data).then(res=>NotificationManager.success('Success', 'Success'))
    setOpenModal(false)
}
const ModalStock=()=>{
  return <Modal  visible={openModal} width="400" height="300" effect="fadeInUp"
  onClickAway={() => setOpenModal(false)}
  >  <div  className='popup-tazas text-center'>
      <div style={{margin:'auto'}}> 
            <h6>Update stock</h6>
            <input type="number" defaultValue={0}  name='addStock'/>
                <div className='btn-group btn'>
                     <button className='btn btn-success' onClick={()=>updateStock()}>
                      Update
                     </button>
                     <button className='btn'>
                     <a href="javascript:void(0);"
                      onClick={() =>setOpenModal(false)}
                      >Close</a>
                     </button>
                     
                 </div>
                 </div>
                 </div>
             </Modal>
}
const InventoryRow=(item)=>{
  return <tr>
      
            <td>
              
              <p>{item.seller}</p>
            </td>
            <td>
              <p className="text-xs font-weight-bold mb-0">{item.quantity}</p>
            </td>
            <td className="align-middle text-center text-sm">
            <p className="text-xs font-weight-bold mb-0">{getFormattedDate(item.updateDate) }</p>

            </td>
           
            
          </tr>
}
  const TableInventories=()=>{
    return <table className="table align-items-center mb-0">
      <thead>
        <tr>
          <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Seller</th>
          <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Quantity</th>
          <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Update Date</th>
        </tr>
      </thead>
      <tbody>
        {inventories && inventories.map(item=>InventoryRow(item))}
      </tbody>

    </table>
  }
    return(
        <div style={{paddingTop:'30px'}}>
            <h3>{props.match.path=='/admin/create-product'?('Create Product'):('Product Detail')}</h3>
        
       <div className="row">
           <div className="col-md-7 form">
            <Form/>
            <br/>
            <br/>
            <h6>History Update Stock</h6>
       <TableInventories/>

           </div>
           <div className="col-md-1"></div>
           <div className="col-md-3 form">
           <InputImage/>
           </div>
       </div>
       <NotificationContainer/>
      <ModalStock/>
       </div>
    )
}
export default ProductDetail