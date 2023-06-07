const mongoose=require('mongoose')
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required: [true,"Vui lòng nhập tên món ăn"],
        trim: true,
        maxLength: [100,"Tên món ăn không được quá 100 kí tự"]
    },
    price:{
        type:Number,
        required:[true,"Vui lòng nhập giá"],
        maxLength:[15,"Giá món ăn không được quá 15 kí tự"],
        default:0.0
    },
    description:{
        type:String,
        required:[true,"Vui lòng nhập mô tả"]
    },
   
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            },

        }
    ],
    classify:{
        type:String,
        required:[true,'Vui lòng chọn phân loại'],
        enum:{
            values:[
                "New",
                "Signature",
                "Traditional"
            ]
        }
    },
    category:{
        type:String,
        required:[true,'Vui lòng chọn danh mục'],
        enum:{
            values:[
                // 'T_SHIRT',
                // 'SHIRT',
                // 'COAT',
                // 'SHORT',
                // 'TROUSER',
                // 'SUIT',
                // 'SHOES',
                // 'HAT',
                // 'BAG',
                'BREAD', //'Bánh mì/Xôi',
                'VEGETARIAN',//Đồ chay',
                'RICE', //'Cơm/Cơm tấm',
                'NOODLE',//'Bún/Phở/Mì/Cháo',
                'SEAFOOD',//Ốc/Cá/Hải sản',
                'HOTPOT', //Lẩu/Đồ nướng
                'DESSERT',//'Tráng miệng',
                'BEER',//'Bia/Rượu',
                'SOFT',//'Sinh tố/Nước ngọt',
                
            ],
            message:'Vui lòng chọn danh mục'
        }
    },
    seller:{
        type:String,
        required:true,
    },
    stock:{
        type:Number,
        required:[true,'Vui lòng nhập số lượng hàng'],
        maxLength:[5,'Số lượng hàng không được quá 5 kí tự']
    },
   
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    updateStock:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                require:true
            },
            
            quantity:{
                type:Number,
                require:true
            },
            updateDate:{
                type:Date,
                default:Date.now()
            }
        
        }
    ],
    reviews:[
        {
    
            userId:{
                type:mongoose.Schema.ObjectId,
                ref:'User'
            },
            
            comment:{
                type:String,
                require:true
            },
            rating:{
                type:Number,
                require:true
            },
            createAt:{
                type:Date,
                default:Date.now()
            }
        }
    ]
    //add value 

})
module.exports=mongoose.model('Product',productSchema)