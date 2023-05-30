import axios from "axios";
import { Component } from "react";
const config={
    headers:{
        'Content-Type':'application/json'
    }
}
const userToken=localStorage.getItem("token")
const DOMAIN='http://deskita-ecommerce.herokuapp.com'
//  const DOMAIN='localhost:4000'

class ClientRequest{
   
    getProducts(){
        return new Promise( (resolve, reject) => {
            axios.get(`${DOMAIN}/api/v1/products`,{
                params:{userToken}
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    getProductsRoleAdmin(){
        return new Promise( (resolve, reject) => {
            axios.get(`${DOMAIN}/api/v1/admin/products`,{
                params:{userToken}
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    getLengthAllProducts(){
        return new Promise( (resolve, reject) => {
            axios.get(`${DOMAIN}/api/v1/length-product`,{
                params:{userToken}
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    getLengthAllProductsHome(){
        return new Promise( (resolve, reject) => {
            axios.get(`${DOMAIN}/api/v1/home-length-product`).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    getSearchProducts(searchName,currentPage){
        return new Promise( (resolve, reject) => {
            axios.get(`${DOMAIN}/api/v1/products?keyword=${searchName}&page=${currentPage}`,{
                params:{userToken}
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    getSearchProductsRoleAdmin(searchName,currentPage){
        return new Promise( (resolve, reject) => {
            axios.get(`${DOMAIN}/api/v1/admin/products?keyword=${searchName}&page=${currentPage}`,{
                params:{userToken}
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    getRandomProduct(){
        return new Promise( (resolve, reject) => {
            axios.get(`${DOMAIN}/api/v1/random-products`).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    getSearchProductsHome(searchName,currentPage,category,classify){
        return new Promise( (resolve, reject) => {
            axios.get(`${DOMAIN}/api/v1/products-home?keyword=${searchName}&page=${currentPage}&category=${category}&classify=${classify}`).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    getOrders(){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/admin/orders`,{
                params:{userToken}
            }).then(result => {
                resolve(result.data)
            }, reject)
        })
    }

    getOrdersSearch(currentPage){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/admin/orders-search?page=${currentPage}`,{
                params:{userToken}
            }).then(result => {
                resolve(result.data)
            }, reject)
        })
    }

    getMyOrdersSearch(currentPage){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/admin/my-orders-search?page=${currentPage}`,{
                params:{userToken}
            }).then(result => {
                resolve(result.data)
            }, reject)
        })
    }

    getAllUser(){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/admin/all-user`,{
                params:{userToken}
            }).then(result => {
                resolve(result.data)
            }, reject)
        })
    }

    getProductDetail(id){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/product/${id}`,{
                params:{userToken}
            }).then(result => {
                resolve(result.data)
            }, reject)
        })
    }

    getProductDetailRoleAdmin(id){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/admin/product/${id}`,{
                params:{userToken}
            }).then(result => {
                resolve(result.data)
            }, reject)
        })
    }

    newProduct(data){
        return new Promise((resolve,reject)=>{
            axios.post(`${DOMAIN}/api/v1/admin/product/new`,{
                params:{
                  userToken
              },data},config).then(result => {
                resolve(result.data)
            }, reject)
        })
    }

    updateProduct(id,data){
        return new Promise((resolve,reject)=>{
            axios.put(`${DOMAIN}/api/v1/admin/product/${id}`,{
                params:{
                  userToken
              },data},config).then(result => {
                resolve(result.data)
            }, reject)
        })
    }

    deleteProduct(id){
        return new Promise((resolve,reject)=>{
            axios.delete(`${DOMAIN}/api/v1/admin/product/${id}`,{
                params:{
                  userToken
              }},config).then(result => {
                resolve(result.data)
            }, reject)
        }) 
    }

    getOrder(id){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/order/${id}`,{
                params:{
                  userToken
              }},config).then(result => {
                resolve(result.data)
            }, reject)
        }) 
    }
    getOrderRoleAdmin(id){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/admin/order/${id}`,{
                params:{
                  userToken
              }},config).then(result => {
                resolve(result.data)
            }, reject)
        }) 
    }
    getUser(id){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/admin/user/${id}`,{
                params:{
                  userToken
              }},config).then(result => {
                resolve(result.data)
            }, reject)
        }) 
    }

    deleteOrder(id){
        return new Promise((resolve,reject)=>{
            axios.delete(`${DOMAIN}/api/v1/admin/order/${id}`,{
                params:{
                  userToken
              }},config).then(result => {
                resolve(result.data)
            }, reject)
        }) 
    }

    getProfileMe(){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/me`,{
                params:{
                  userToken
              }},config).then(result => {
                resolve(result.data)
            }, reject)
        }) 
    }

    deleteAccountMe(){
        return new Promise((resolve,reject)=>{
            axios.delete(`${DOMAIN}/api/v1/me`,{
                params:{userToken},
                },config).then(result => {
                resolve(result.data)
            }, reject)
        }) 
    }

    postLogin(email,password){
        return new Promise((resolve,reject)=>{
            axios.post(`${DOMAIN}/api/v1/user/login`,{email,password},config).then(result => {
                resolve(result.data)
            }, reject)
        }) 
    }

    createUser(data){
        return new Promise((resolve,reject)=>{
            axios.post(`${DOMAIN}/api/v1/user/create`,data,config).then(result => {
                resolve(result.data)
            }, reject)
        }) 
    }

    updateUser(data,avatarPr){
        return new Promise((resolve,reject)=>{
            axios.put(`${DOMAIN}/api/v1/user/update-profile`,{
                params:{
                  userToken
              },data,avatarPr},config).then(result => {
                resolve(result.data)
            }, reject)
        }) 
    }

    updatePassword(oldPassword,password){
        return new Promise((resolve,reject)=>{
            axios.put(`${DOMAIN}/api/v1/user/update-password`,{
                params:{
                  userToken
              },oldPassword,password},config).then(result => {
                resolve(result.data)
            }, reject)
        }) 
    }

    getAllUsers(){
        return new Promise((resolve,reject)=>{
            axios.put(`${DOMAIN}/api/v1/admin/all-user`,{
                params:{
                  userToken
              }},config).then(result => {
                resolve(result.data)
            }, reject)
        })
    }

    getSearchUsers(searchName,currentPage){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/admin/users?keyword=${searchName}&page=${currentPage}`,{
                params:{userToken}
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    getUserDetail(id){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/admin/user/${id}`,{
                params:{userToken}
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    updateUserDetail(id,data,avatarPr){
        return new Promise((resolve,reject)=>{
            axios.put(`${DOMAIN}/api/v1/admin/user/${id}`,{
                params:{userToken},
                data,
                avatarPr
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    deleteUserDetail(id){
        return new Promise((resolve,reject)=>{
            axios.delete(`${DOMAIN}/api/v1/admin/user/${id}`,{
                params:{userToken}
               
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    forgotPassword(email){
        return new Promise((resolve,reject)=>{
            axios.post(`${DOMAIN}/api/v1/user/password/forgot`,email).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    resetPassword(data,token){
        return new Promise((resolve,reject)=>{
            axios.put(`${DOMAIN}/api/v1/user/password/reset?token=${token}`,data).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    postOrder(data){
        return new Promise((resolve,reject)=>{
            axios.post(`${DOMAIN}/api/v1/order/create`,{
                params:{userToken},
                data
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    updateOrder(id,orderStatus){
        return new Promise((resolve,reject)=>{
            axios.put(`${DOMAIN}/api/v1/admin/order/${id}`,{
                params:{userToken},
                orderStatus
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    addToCartItem(data){
        return new Promise((resolve,reject)=>{
            axios.put(`${DOMAIN}/api/v1/add-to-cart`,{
                params:{userToken},
                data
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    getMyOrders(currentPage){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/orders/me?page=${currentPage}`,{
                params:{userToken}
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })

    }

    deleteMyOrder(id){
        return new Promise((resolve,reject)=>{
            axios.delete(`${DOMAIN}/api/v1/order/${id}`,{
                params:{userToken}
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }
    updateReviewProduct(rating,comment,productId,avatar){
        return new Promise((resolve,reject)=>{
            axios.put(`${DOMAIN}/api/v1/review`,{
                params:{userToken},
                rating,
                comment,
                productId,
                avatar
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }
    getReviewsByProduct(id){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/reviews?id=${id}`,{
                params:{userToken},
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    getStripeApi(){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/get-stripe-api`,{
                params:{userToken},
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    updateCartItem(data){
        return new Promise((resolve,reject)=>{
            axios.put(`${DOMAIN}/api/v1/update-to-cart`,{
                params:{userToken},
                data
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    processPayment(data){
        
        return new Promise((resolve,reject)=>{
            axios.post(`${DOMAIN}/api/v1/payment/process`,{
                params:{userToken},
                data
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    getCart(){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/my-cart`,{
                params:{userToken}
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    addStock(data){
        return new Promise((resolve,reject)=>{
            axios.post(`${DOMAIN}/api/v1/add-stock`,{
                params:{userToken},
                data
                
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    getInventoryByProduct(id){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/get-inventory-by-product/${id}`,{
                params:{userToken},
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })
    }

    createDiscount(data){
        return new Promise((resolve,reject)=>{
            axios.post(`${DOMAIN}/api/v1/create-discount`,{
                params:{userToken},
                data
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }

    getListDiscount(name){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/admin/discounts?keyword=${name}`,{
                params:{userToken},
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }

    getDiscountDetail(id){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/admin/discount/${id}`,{
                params:{userToken},
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }

    removeDiscount(id){
        return new Promise((resolve,reject)=>{
            axios.delete(`${DOMAIN}/api/v1/admin/discount/${id}`,{
                params:{userToken},
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }

    updateStock(id,data){
        return new Promise((resolve,reject)=>{
            axios.put(`${DOMAIN}/api/v1/admin/discount/${id}`,{
                params:{userToken},
                data
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }

    getDiscount(name){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/discount/${name}`,{
                params:{userToken},
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }

    analyticsByProduct(filter){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/analytics-by-product?filter=${filter}`,{
                params:{userToken},
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }
    analyticsByUser(filter){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/analytics-by-user?filter=${filter}`,{
                params:{userToken},
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }
    analyticsByOrder(filter){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/analytics-by-order?filter=${filter}`,{
                params:{userToken},
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }
    topSellingByProduct(filter){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/top-sell-by-product?filter=${filter}`,{
                params:{userToken},
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }
    topSellingByReview(filter){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/top-sell-by-review?filter=${filter}`,{
                params:{userToken},
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }
    topSellingByUser(filter){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/top-sell-by-user?filter=${filter}`,{
                params:{userToken},
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }

    analyticsByTotalPayment(filter){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/analytics-payment?filter=${filter}`,{
                params:{userToken},
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }


    analyticsByDate(data){
        return new Promise((resolve,reject)=>{
            axios.get(`${DOMAIN}/api/v1/analytics-by-date?`,{
                params:{userToken,dateStart:data.dateStart,dateEnd:data.dateEnd,type:data.type}
            }).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }

        
    getCryptoCompare(){
        return new Promise((resolve,reject)=>{
            axios.get(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR,ETH`).then(result => {
                    resolve(result.data)
                }, reject)
        })  
    }
}
const clientRequest = new ClientRequest();
export default clientRequest;

