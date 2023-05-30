const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const Review = require("../models/review");
const dayTime=86400000;
const labelsByWeek=['Ngày 7','Ngày 6','Ngày 5','Ngày 4','Ngày 3','Ngày 2','Ngày 1']
const labelsByMonth=['Tuần 4','Tuần 3','Tuần 2','Tuần 1']
const labelsByYear=['Tháng 12','Tháng 11','Tháng 10','Tháng 9','Tháng 8','Tháng 7','Tháng 6','Tháng 5','Tháng 4','Tháng 3','Tháng 2','Tháng 1']
const dataAnalytics=(arrayLabels,arrayFilter,name,pointColor,color)=>{
    return{
        labels:arrayLabels,
        datasets: [
          {
            label: name,
            data: arrayFilter,
            fill: false,
            backgroundColor: pointColor,
            borderColor: color,
          },
        ],
      };
}
const analyticsByFilter=(arrayLabels,typeFilter,listData)=>{
    const arrayWeek=[0,0,0,0,0,0,0]
    const arrayMonth=[0,0,0,0]
    const arrayYear=[0,0,0,0,0,0,0,0,0,0,0,0]
    listData.forEach(item,index=>{
        const createdAt=new Date(item.createdAt)
        const dateNow=new Date();
        if(createdAt.getTime()>(dateNow.getTime()-dayTime*7)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*6)){
            arrayWeek[0]++
        }
    })
}

const formatHoursDate=(dateNow,dateTime,count)=>{
   
    const datePrev=new Date(dateNow-dateTime*count)
    datePrev.setDate(datePrev.getDate()+1)
    datePrev.setHours(0,0,0,0)
    
    return datePrev.getTime()
}
exports.analyticsByProduct=catchAsyncError(async (req,res,next)=>{
    const products=await Product.find()
    const listData=[]
    products.map(item=>{
        const createdAt=new Date(item.createdAt)
        const dateNow=new Date();
        if(req.query.filter=='week'&&createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,7)) && createdAt.getTime()<=dateNow.getTime()){
            listData.push(item)
        }
        if(req.query.filter=='month'&&createdAt.getTime()>(dateNow.getTime()-dayTime*30) && createdAt.getTime()<=dateNow.getTime()){
            listData.push(item)
        }
        if(req.query.filter=='year'&&createdAt.getTime()>(dateNow.getTime()-dayTime*30*12) && createdAt.getTime()<=dateNow.getTime()){
            listData.push(item)
        }
    })
    const arrayWeek=[0,0,0,0,0,0,0]
    const arrayMonth=[0,0,0,0]
    const arrayYear=[0,0,0,0,0,0,0,0,0,0,0,0]
    if(req.query.filter=='week'){
        listData.map(item=>{
        const createdAt=new Date(item.createdAt)
        const dateNow=new Date();
        //ngay 7
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,7))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,6))){
            arrayWeek[0]++
        }
        //ngay 6
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,6))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,5))){
            arrayWeek[1]++
        }
        //ngay 5
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,5))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,4))){
            arrayWeek[2]++
        }
        //ngay 4
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,4))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,3))){
            arrayWeek[3]++
        }
        //ngay 3
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,3))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,2))){
            arrayWeek[4]++
        }
        //ngay 2
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,2))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,1))){
            arrayWeek[5]++
        }
        //ngay 1
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,1))&&createdAt.getTime()<=(dateNow.getTime())){
            arrayWeek[6]++
        }
    })}
    if(req.query.filter=='month'){
        listData.map(item=>{
            const createdAt=new Date(item.createdAt)
            const dateNow=new Date();
             //tuan 4
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*22.5)){
                arrayMonth[0]++
            }
            //tuan 3
            if(createdAt.getTime()>(dateNow.getTime()-dayTime*22.5)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*15)){
                arrayMonth[1]++
            }
             //tuan 2
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*15)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*7.5)){
                arrayMonth[2]++
            }
             //tuan 1
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*7.5)&&createdAt.getTime()<=(dateNow.getTime())){
                arrayMonth[3]++
            }
           
        })
    }
    if(req.query.filter=='year'){
        listData.map(item=>{
            const createdAt=new Date(item.createdAt)
            const dateNow=new Date();
            //thang 12
            if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*12)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*11)){
                arrayYear[0]++
            }
            //thang 11
            if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*11)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*10)){
                arrayYear[1]++
            }
             //thang 10
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*10)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*9)){
                arrayYear[2]++
            }
             //thang 9
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*9)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*8)){
                arrayYear[3]++
            }
             //thang 8
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*8)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*7)){
                arrayYear[4]++
            }
             //thang 7
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*7)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*6)){
                arrayYear[5]++
            }
             //thang 6
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*6)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*5)){
                arrayYear[6]++
            }
             //thang 5
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*5)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*4)){
                arrayYear[7]++
            }
             //thang 4
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*4)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*3)){
                arrayYear[8]++
            }
             //thang 3
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*3)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*2)){
                arrayYear[9]++
            }
             //thang 2
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*2)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*1)){
                arrayYear[10]++
            }
             //thang 1
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*1)&&createdAt.getTime()<=(dateNow.getTime())){
                arrayYear[11]++
            }
        })
    }
    var data;
    if(req.query.filter=='week'){
        data=dataAnalytics(labelsByWeek,arrayWeek,'product created','rgba(116, 185, 255,1.0)','rgba(116, 185, 255,0.4)')
    }
    if(req.query.filter=='month'){
        data=dataAnalytics(labelsByMonth,arrayMonth,'product created','rgba(116, 185, 255,1.0)','rgba(116, 185, 255,0.4)')
    }
    if(req.query.filter=='year'){
        data=dataAnalytics(labelsByYear,arrayYear,'product created','rgba(116, 185, 255,1.0)','rgba(116, 185, 255,0.4)')
    }
    res.status(201).json({
        data
    })
})
exports.analyticsByUser=catchAsyncError(async (req,res,next)=>{
    const users=await User.find()
    const listData=[]
    users.map(item=>{
        const createdAt=new Date(item.createAt)
        const dateNow=new Date();
        if(req.query.filter=='week'&&createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,7)) && createdAt.getTime()<=dateNow.getTime()){
            listData.push(item)
        }
        if(req.query.filter=='month'&&createdAt.getTime()>(dateNow.getTime()-dayTime*30) && createdAt.getTime()<=dateNow.getTime()){
            listData.push(item)
        }
        if(req.query.filter=='year'&&createdAt.getTime()>(dateNow.getTime()-dayTime*30*12) && createdAt.getTime()<=dateNow.getTime()){
            listData.push(item)
        }
    })
    const arrayWeek=[0,0,0,0,0,0,0]
    const arrayMonth=[0,0,0,0]
    const arrayYear=[0,0,0,0,0,0,0,0,0,0,0,0]
    if(req.query.filter=='week'){
        listData.map(item=>{
        const createdAt=new Date(item.createAt)
        const dateNow=new Date();
        //ngay 7
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,7))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,6))){
            arrayWeek[0]++
        }
        //ngay 6
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,6))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,5))){
            arrayWeek[1]++
        }
        //ngay 5
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,5))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,4))){
            arrayWeek[2]++
        }
        //ngay 4
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,4))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,3))){
            arrayWeek[3]++
        }
        //ngay 3
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,3))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,2))){
            arrayWeek[4]++
        }
        //ngay 2
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,2))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,1))){
            arrayWeek[5]++
        }
        //ngay 1
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,1))&&createdAt.getTime()<=(dateNow.getTime())){
            arrayWeek[6]++
        }
    })}
    if(req.query.filter=='month'){
        listData.map(item=>{
            const createdAt=new Date(item.createAt)
            const dateNow=new Date();
             //tuan 4
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*22.5)){
                arrayMonth[0]++
            }
            //tuan 3
            if(createdAt.getTime()>(dateNow.getTime()-dayTime*22.5)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*15)){
                arrayMonth[1]++
            }
             //tuan 2
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*15)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*7.5)){
                arrayMonth[2]++
            }
             //tuan 1
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*7.5)&&createdAt.getTime()<=(dateNow.getTime())){
                arrayMonth[3]++
            }
           
        })
    }
    if(req.query.filter=='year'){
        listData.map(item=>{
            const createdAt=new Date(item.createAt)
            const dateNow=new Date();
            //thang 12
            if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*12)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*11)){
                arrayYear[0]++
            }
            //thang 11
            if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*11)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*10)){
                arrayYear[1]++
            }
             //thang 10
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*10)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*9)){
                arrayYear[2]++
            }
             //thang 9
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*9)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*8)){
                arrayYear[3]++
            }
             //thang 8
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*8)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*7)){
                arrayYear[4]++
            }
             //thang 7
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*7)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*6)){
                arrayYear[5]++
            }
             //thang 6
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*6)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*5)){
                arrayYear[6]++
            }
             //thang 5
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*5)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*4)){
                arrayYear[7]++
            }
             //thang 4
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*4)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*3)){
                arrayYear[8]++
            }
             //thang 3
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*3)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*2)){
                arrayYear[9]++
            }
             //thang 2
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*2)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*1)){
                arrayYear[10]++
            }
             //thang 1
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*1)&&createdAt.getTime()<=(dateNow.getTime())){
                arrayYear[11]++
            }
        })
    }
    var data;
    if(req.query.filter=='week'){
        data=dataAnalytics(labelsByWeek,arrayWeek,'user created','rgba(214, 48, 49,1.0)','rgba(214, 48, 49,0.4)')
    }
    if(req.query.filter=='month'){
        data=dataAnalytics(labelsByMonth,arrayMonth,'user created','rgba(214, 48, 49,1.0)','rgba(214, 48, 49,0.4)')
    }
    if(req.query.filter=='year'){
        data=dataAnalytics(labelsByYear,arrayYear,'user created','rgba(214, 48, 49,1.0)','rgba(214, 48, 49,0.4)')
    }
    res.status(201).json({
        data
    })
})
exports.analyticsByOrder=catchAsyncError(async (req,res,next)=>{
    const orders=await Order.find()
    const listData=[]
    orders.map(item=>{
        const createdAt=new Date(item.createAt)
        const dateNow=new Date();
        if(req.query.filter=='week'&&createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,7)) && createdAt.getTime()<=dateNow.getTime()){
            listData.push(item)
        }
        if(req.query.filter=='month'&&createdAt.getTime()>(dateNow.getTime()-dayTime*30) && createdAt.getTime()<=dateNow.getTime()){
            listData.push(item)
        }
        if(req.query.filter=='year'&&createdAt.getTime()>(dateNow.getTime()-dayTime*30*12) && createdAt.getTime()<=dateNow.getTime()){
            listData.push(item)
        }
    })
    const arrayWeek=[0,0,0,0,0,0,0]
    const arrayMonth=[0,0,0,0]
    const arrayYear=[0,0,0,0,0,0,0,0,0,0,0,0]
    if(req.query.filter=='week'){
        listData.map(item=>{
        const createdAt=new Date(item.createAt)
        const dateNow=new Date();
        //ngay 7
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,7))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,6))){
            arrayWeek[0]++
        }
        //ngay 6
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,6))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,5))){
            arrayWeek[1]++
        }
        //ngay 5
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,5))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,4))){
            arrayWeek[2]++
        }
        //ngay 4
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,4))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,3))){
            arrayWeek[3]++
        }
        //ngay 3
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,3))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,2))){
            arrayWeek[4]++
        }
        //ngay 2
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,2))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,1))){
            arrayWeek[5]++
        }
        //ngay 1
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,1))&&createdAt.getTime()<=(dateNow.getTime())){
            arrayWeek[6]++
        }
    })}
    if(req.query.filter=='month'){
        listData.map(item=>{
            const createdAt=new Date(item.createAt)
            const dateNow=new Date();
             //tuan 4
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*22.5)){
                arrayMonth[0]++
            }
            //tuan 3
            if(createdAt.getTime()>(dateNow.getTime()-dayTime*22.5)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*15)){
                arrayMonth[1]++
            }
             //tuan 2
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*15)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*7.5)){
                arrayMonth[2]++
            }
             //tuan 1
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*7.5)&&createdAt.getTime()<=(dateNow.getTime())){
                arrayMonth[3]++
            }
           
        })
    }
    if(req.query.filter=='year'){
        listData.map(item=>{
            const createdAt=new Date(item.createAt)
            const dateNow=new Date();
            //thang 12
            if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*12)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*11)){
                arrayYear[0]++
            }
            //thang 11
            if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*11)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*10)){
                arrayYear[1]++
            }
             //thang 10
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*10)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*9)){
                arrayYear[2]++
            }
             //thang 9
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*9)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*8)){
                arrayYear[3]++
            }
             //thang 8
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*8)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*7)){
                arrayYear[4]++
            }
             //thang 7
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*7)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*6)){
                arrayYear[5]++
            }
             //thang 6
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*6)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*5)){
                arrayYear[6]++
            }
             //thang 5
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*5)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*4)){
                arrayYear[7]++
            }
             //thang 4
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*4)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*3)){
                arrayYear[8]++
            }
             //thang 3
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*3)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*2)){
                arrayYear[9]++
            }
             //thang 2
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*2)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*1)){
                arrayYear[10]++
            }
             //thang 1
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*1)&&createdAt.getTime()<=(dateNow.getTime())){
                arrayYear[11]++
            }
        })
    }
    var data;
    if(req.query.filter=='week'){
        data=dataAnalytics(labelsByWeek,arrayWeek,'order created','rgba(0, 184, 148,1.0)','rgba(0, 184, 148,0.4)')
    }
    if(req.query.filter=='month'){
        data=dataAnalytics(labelsByMonth,arrayMonth,'order created','rgba(0, 184, 148,1.0)','rgba(0, 184, 148,0.4)')
    }
    if(req.query.filter=='year'){
        data=dataAnalytics(labelsByYear,arrayYear,'order created','rgba(0, 184, 148,1.0)','rgba(0, 184, 148,0.4)')
    }
    res.status(201).json({
        data
    })
})

exports.analyticsByTotalPayment=catchAsyncError(async (req,res,next)=>{
    const orders=await Order.find()
    const listData=[]
    orders.map(item=>{
        const createdAt=new Date(item.paidAt)
        const dateNow=new Date();
        if(req.query.filter=='week'&&createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,7)) && createdAt.getTime()<=dateNow.getTime() && item.orderStatus=='Complete'){
            listData.push(item)
        }
        if(req.query.filter=='month'&&createdAt.getTime()>(dateNow.getTime()-dayTime*30) && createdAt.getTime()<=dateNow.getTime() && item.orderStatus=='Complete'){
            listData.push(item)
        }
        if(req.query.filter=='year'&&createdAt.getTime()>(dateNow.getTime()-dayTime*30*12) && createdAt.getTime()<=dateNow.getTime() && item.orderStatus=='Complete'){
            listData.push(item)
        }
    })
    const arrayWeek=[0,0,0,0,0,0,0]
    const arrayMonth=[0,0,0,0]
    const arrayYear=[0,0,0,0,0,0,0,0,0,0,0,0]
    if(req.query.filter=='week'){
        listData.map(item=>{
        const createdAt=new Date(item.paidAt)
        const dateNow=new Date();
        //ngay 7
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,7))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,6))){
            arrayWeek[0]+=item.totalPrice
        }
        //ngay 6
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,6))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,5))){
            arrayWeek[1]+=item.totalPrice
        }
        //ngay 5
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,5))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,4))){
            arrayWeek[2]+=item.totalPrice
        }
        //ngay 4
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,4))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,3))){
            arrayWeek[3]+=item.totalPrice
        }
        //ngay 3
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,3))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,2))){
            arrayWeek[4]+=item.totalPrice
        }
        //ngay 2
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,2))&&createdAt.getTime()<=(formatHoursDate(dateNow.getTime(),dayTime,1))){
            arrayWeek[5]+=item.totalPrice
        }
        //ngay 1
        if(createdAt.getTime()>(formatHoursDate(dateNow.getTime(),dayTime,1))&&createdAt.getTime()<=(dateNow.getTime())){
            arrayWeek[6]+=item.totalPrice
        }
    })}
    if(req.query.filter=='month'){
        listData.map(item=>{
            const createdAt=new Date(item.paidAt)
            const dateNow=new Date();
             //tuan 4
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*22.5)){
                arrayMonth[0]+=item.totalPrice
            }
            //tuan 3
            if(createdAt.getTime()>(dateNow.getTime()-dayTime*22.5)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*15)){
                arrayMonth[1]+=item.totalPrice
            }
             //tuan 2
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*15)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*7.5)){
                arrayMonth[2]+=item.totalPrice
            }
             //tuan 1
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*7.5)&&createdAt.getTime()<=(dateNow.getTime())){
                arrayMonth[3]+=item.totalPrice
            }
           
        })
    }
    if(req.query.filter=='year'){
        listData.map(item=>{
            const createdAt=new Date(item.paidAt)
            const dateNow=new Date();
            //thang 12
            if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*12)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*11)){
                arrayYear[0]+=item.totalPrice
            }
            //thang 11
            if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*11)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*10)){
                arrayYear[1]+=item.totalPrice
            }
             //thang 10
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*10)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*9)){
                arrayYear[2]+=item.totalPrice
            }
             //thang 9
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*9)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*8)){
                arrayYear[3]+=item.totalPrice
            }
             //thang 8
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*8)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*7)){
                arrayYear[4]+=item.totalPrice
            }
             //thang 7
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*7)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*6)){
                arrayYear[5]+=item.totalPrice
            }
             //thang 6
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*6)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*5)){
                arrayYear[6]+=item.totalPrice
            }
             //thang 5
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*5)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*4)){
                arrayYear[7]+=item.totalPrice
            }
             //thang 4
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*4)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*3)){
                arrayYear[8]+=item.totalPrice
            }
             //thang 3
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*3)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*2)){
                arrayYear[9]+=item.totalPrice
            }
             //thang 2
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*2)&&createdAt.getTime()<=(dateNow.getTime()-dayTime*30*1)){
                arrayYear[10]+=item.totalPrice
            }
             //thang 1
             if(createdAt.getTime()>(dateNow.getTime()-dayTime*30*1)&&createdAt.getTime()<=(dateNow.getTime())){
                arrayYear[11]+=item.totalPrice
            }
        })
    }
    var data;
    if(req.query.filter=='week'){
        data=dataAnalytics(labelsByWeek,arrayWeek,'Total Payment','rgba(108, 92, 231,1.0)','rgba(108, 92, 231,0.4)')
    }
    if(req.query.filter=='month'){
        data=dataAnalytics(labelsByMonth,arrayMonth,'Total Payment','rgba(108, 92, 231,1.0)','rgba(108, 92, 231,0.4)')
    }
    if(req.query.filter=='year'){
        data=dataAnalytics(labelsByYear,arrayYear,'Total Payment','rgba(108, 92, 231,1.0)','rgba(108, 92, 231,0.4)')
    }
    res.status(201).json({
        data
    })
})


exports.topSellingByProduct=catchAsyncError(async(req,res,next)=>{
    const orders=await Order.find()
    const listDataOrder=[]
    orders.map(item=>{
        const createdAt=new Date(item.createAt)
        const dateNow=new Date();
        if(req.query.filter=='week'&&createdAt.getTime()>(dateNow.getTime()-dayTime*7) && createdAt.getTime()<=dateNow.getTime()){
            listDataOrder.push(item)
        }
        if(req.query.filter=='month'&&createdAt.getTime()>(dateNow.getTime()-dayTime*30) && createdAt.getTime()<=dateNow.getTime()){
            listDataOrder.push(item)
        }
        if(req.query.filter=='year'&&createdAt.getTime()>(dateNow.getTime()-dayTime*30*12) && createdAt.getTime()<=dateNow.getTime()){
            listDataOrder.push(item)
        }
    })
    const topSell=[]
    listDataOrder.forEach(order=>{order.orderItems.forEach(item2=>{
       
        var temp=topSell.find(item4=>item4.product.equals(item2.product))
        if(!temp){
            topSell.push(item2)
        }
        else{
            const list=topSell
           
            list.forEach((item3,index)=>{
                if(item3.product.equals(temp.product)){
                    topSell[index].quantity+=Number (item2.quantity)
                }
            })
        }
    })})
    const listSell=[]
    await Promise.all(topSell.map(async (item,index) => {
        try {
          // here candidate data is inserted into 
          const product=await Product.findById(item.product)
          // and response need to be added into final response array 
            if(product){
                listSell.push({
                    name:product.name,
                    product:item.product,
                    quantity:item.quantity
                  })
            }
        } catch (error) {
          console.log('error'+ error);
        }
      }))
      listSell.sort(function(a,b){
        return b.quantity-a.quantity
    })
    const finalList=listSell.slice(0,10)
    res.status(201).json({
        finalList
    })
})

exports.topSellingByReview=catchAsyncError(async(req,res,next)=>{
    const reviews=await Review.find()
    const listDataReview=[]
    reviews.map(item=>{
        const createdAt=new Date(item.createAt)
        const dateNow=new Date();
        if(req.query.filter=='week'&&createdAt.getTime()>(dateNow.getTime()-dayTime*7) && createdAt.getTime()<=dateNow.getTime()){
            listDataReview.push(item)
        }
        if(req.query.filter=='month'&&createdAt.getTime()>(dateNow.getTime()-dayTime*30) && createdAt.getTime()<=dateNow.getTime()){
            listDataReview.push(item)
        }
        if(req.query.filter=='year'&&createdAt.getTime()>(dateNow.getTime()-dayTime*30*12) && createdAt.getTime()<=dateNow.getTime()){
            listDataReview.push(item)
        }
    })
    const topReview=[];
    listDataReview.forEach((item,index)=>{
        const temp=topReview.find(item2=>item2.productId.equals(item.productId))
        if(!temp){
            topReview.push({
                numOfReviews:1,
                productId:item.productId
            })
        }
        else{
            topReview.forEach((item3,index)=>{
                if(temp.productId.equals(item3.productId)){
                    topReview[index].numOfReviews++
                }
            })
        }
    })
    const listSell=await Promise.all(topReview.map(async (item,index) => {
        try {
          // here candidate data is inserted into 
          const product=await Product.findById(item.productId)
          // and response need to be added into final response array 
    
            return {
                name:product.name,
                product:item.productId,
                numOfReviews:item.numOfReviews
              }
          }
         
        catch (error) {
          console.log('error'+ error);
        }
      }))
      listSell.sort(function(a,b){
        return b.numOfReviews-a.numOfReviews
    })
    const finalList=listSell.slice(0,10)
    res.status(201).json({
        finalList
    })
})
exports.topSellingByUser=catchAsyncError(async(req,res,next)=>{
    const orders=await Order.find()
    const listDataOrder=[]
    orders.map(item=>{
        const createdAt=new Date(item.createAt)
        const dateNow=new Date();
        if(req.query.filter=='week'&&createdAt.getTime()>(dateNow.getTime()-dayTime*7) && createdAt.getTime()<=dateNow.getTime()){
            listDataOrder.push(item)
        }
        if(req.query.filter=='month'&&createdAt.getTime()>(dateNow.getTime()-dayTime*30) && createdAt.getTime()<=dateNow.getTime()){
            listDataOrder.push(item)
        }
        if(req.query.filter=='year'&&createdAt.getTime()>(dateNow.getTime()-dayTime*30*12) && createdAt.getTime()<=dateNow.getTime()){
            listDataOrder.push(item)
        }
    })
    const topUser=[]
    listDataOrder.forEach(order=>{
        const temp=topUser.find(item=>item.user.equals(order.user))
        if(!temp){
            topUser.push({
                user:order.user,
                numOfOrders:1
            })
        }
        else{
            topUser.forEach((item,index)=>{
                if(item.user.equals(temp.user)){
                    topUser[index].numOfOrders++
                }
            })
        }
    })
    const listSell=[]
    await Promise.all(topUser.map(async (item,index) => {
        try {
          // here candidate data is inserted into 
          const user=await User.findById(item.user)
          // and response need to be added into final response array 
          if(user){
            listSell.push( {
                name:user.name,
                user:item.user,
                numOfOrders:item.numOfOrders
              })
          }
        } catch (error) {
          console.log('error'+ error);
        }
      }))
      listSell.sort(function(a,b){

        return b.numOfOrders-a.numOfOrders
    })
    const  finalList=listSell.slice(0,10)
    res.status(201).json({
        finalList
    })
})
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}
exports.analyticsByDate=catchAsyncError(async(req,res,next)=>{
    const {type,dateStart,dateEnd}=req.query
    const dateStartToDate=new Date(dateStart)
    const dateEndToDate=new Date(dateEnd)
    let models=[]
    const dateArray=getDates(dateStartToDate,dateEndToDate)
    if(type=='product'){
        models=await Product.find(
                    {
                    createdAt:{
                        $gte:dateStartToDate,
                        $lt:dateEndToDate
                    }
                })
    }
    else if(type=='order'){

                models=await Order.find(
                    {
                    createAt:{
                        $gte:dateStartToDate,
                        $lt:dateEndToDate

                    }
                })
            }
    else if(type=='customer'){
                models=await User.find(
                    {
                    createAt:{
                        $gte:dateStartToDate,
                        $lt:dateEndToDate

                    }
                })
            }
    else if(type=='total'){
        models=await Order.find(
            {
                createAt:{
                    $gte:dateStartToDate,
                    $lt:dateEndToDate

                },
                orderStatus:"Complete"
            })
    }
    var resultArray=[]

    // for (const date of dateArray) {
    //     var startDate=new Date(date)
    //     var endDate=new Date(startDate)
    //     endDate.setHours(23,59,59,999)
    //     if(type=='product'){
    //         models=await Product.find(
    //             {
    //             createdAt:{
    //                 $gte:startDate,
    //                 $lt:endDate
    //
    //             }
    //         })
    //     }
    //     else if(type=='order'){
    //
    //         models=await Order.find(
    //             {
    //             createAt:{
    //                 $gte:startDate,
    //                 $lt:endDate
    //
    //             }
    //         })
    //     }
    //     else if(type=='customer'){
    //         models=await User.find(
    //             {
    //             createAt:{
    //                 $gte:startDate,
    //                 $lt:endDate
    //
    //             }
    //         })
    //     }

    //     // var res2
    //     // if(type=='total'){
    //     //     res2=models.reduce((n,{totalPrice})=>n+totalPrice,0)
    //     // }
    //     // else{
    //     //     res2=models.length
    //     // }
    //     //
    //     //
    //     // resultArray.push(
    //     //      res2
    //     //  )
    //     console.log(models)
    //   }
    //   // var total=resultArray.reduce((a,b)=>a+b,0)

    
    res.status(201).json({
        models
    })
})