
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
        NotificationManager.error('Error', 'Vui lòng nhập đầy đủ thông tin')
        return
      }
      if(Number (data.price)<0){
        NotificationManager.error('Error', 'Giá phải lớn hơn 0')
        return
      }
      if(Number (data.stock)<0){
        NotificationManager.error('Error', 'Số lượng phải lớn hơn 0')
        return
      }
      if(!Number.isInteger(data.stock)){
        NotificationManager.error('Error', 'Số lượng định dạng không đúng')
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
        NotificationManager.error('Error', 'Sai định dạng')
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
        NotificationManager.error('Error', 'Vui lòng nhập đầy đủ thông tin')
        return
      }
      if(Number (data.price)<0){
        NotificationManager.error('Error', 'Vùi lòng nhập giá lớn hơn 0')
        return
      }
      if(Number (data.stock)<0){
        NotificationManager.error('Error', 'Vui lòng nhập số lượng lớn hơn 0')
        return
      }
      if(!Number.isInteger(data.stock)){
        NotificationManager.error('Error', 'Định dạng số lượng không đúng')
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
            <label>Tên</label>
            <input type="text" className="form-control" placeholder="Tên món ăn" name="name" defaultValue={stProduct.name} />
          </div>
          <div className="form-group col-md-6">
          <label>Giá</label>

            <input type="text" className="form-control" placeholder="Giá món ăn" name="price" defaultValue={stProduct.price}/>
          </div>
        </div>
        <div className="form-group">
        <label>Mô tả</label>

          <textarea class="form-control" placeholder="Mô tả" rows="3" name="descriptionInput" defaultValue={stProduct.description}></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group col-md-4">
            <label>Phân loại</label>
            <select className="form-control" name='classify' defaultValue={stProduct.classify}>
              <option selected>Mới</option>
              <option>Signature</option>
              <option>Truyền thống</option>
            </select>
          </div>
          <div className="form-group col-md-4">
            <label>Danh mục</label>
            <select className="form-control" name='category' defaultValue={stProduct.category}>
              <option value={'BREAD'}>Bánh mì/Xôi</option>
              <option value={'VEGETARIAN'}>Đồ chay</option>
              <option value={'RICE'}>Cơm/Cơm tấm</option>
              <option value={'NOODLE'}>Bún/Phở/Mì/Cháo</option>
              <option value={'SEAFOOD'}>Ốc/Cá/Hải sản</option>
              <option value={'HOTPOT'}>Lẩu/Đồ nướng</option>
              <option value={'DESSERT'}>Giày</option>
              <option value={'BEER'}>Bia/Rượu</option>
              <option value={'SOFT'}>Sinh tố/Nước ngọt</option>
            </select>
          </div>
          <div className="form-group col-md-4">
            <label>Số lượng</label>
            <input type="text" className="form-control" placeholder="Số lượng" name="stock" defaultValue={stProduct.stock} disabled={props.match.path=='/admin/product/:id'}/>
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary">Lưu</button>
        {props.match.path=='/admin/product/:id' && <button style={{marginLeft:'15px'}} type="submit" className="btn btn-danger" onClick={()=>deleteItem(stProduct._id)}>Xóa</button>}
        {props.match.path=='/admin/product/:id' && <button style={{marginLeft:'15px'}} type="submit" className="btn btn-success"  onClick={()=>setOpenModal(true)}>Cập nhật số lượng</button>}

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
      <label >Ảnh món ăn</label>
    <input
     type='file'
     name='avatar'
     className='custom-file-input'
     accept='images/*'
     onChange={(e)=>onChangeAvatar(e)}
    required 
    />
    <div className="invalid-feedback">Ảnh không hợp lệ</div>
    <img src={(avatar)?(avatar):(imageDefault)} style={{width:'100%'}}/>
  </div>
  )
}
const updateStock=async()=>{
  if(!Number.isInteger(Number (document.getElementsByName('addStock')[0].value))){
    NotificationManager.error('Error', 'Định dạng số lượng không đúng')
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
            <h6>Cập nhật số lượng</h6>
            <input type="number" defaultValue={0}  name='addStock'/>
                <div className='btn-group btn'>
                     <button className='btn btn-success' onClick={()=>updateStock()}>
                      Cập nhật
                     </button>
                     <button className='btn'>
                     <a href="javascript:void(0);"
                      onClick={() =>setOpenModal(false)}
                      >Đóng</a>
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
          <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Người tạo</th>
          <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Số lượng</th>
          <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Thời gian cập nhật</th>
        </tr>
      </thead>
      <tbody>
        {inventories && inventories.map(item=>InventoryRow(item))}
      </tbody>

    </table>
  }
    return(
        <div style={{paddingTop:'30px'}}>
            <h3>{props.match.path=='/admin/create-product'?('Thêm Sản Phẩm'):('Chi Tiết Sản Phẩm')}</h3>
        
       <div className="row">
           <div className="col-md-7 form">
            <Form/>
            <br/>
            <br/>
            <h6>Lịch sử cập nhật số lượng</h6>
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