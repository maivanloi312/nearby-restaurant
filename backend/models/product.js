const mongoose=require('mongoose')
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required: [true,"Please enter product name"],
        trim: true,
        maxLength: [100,"Product name cannot exceed 100 characters"]
    },
    price:{
        type:Number,
        required:[true,"Please enter price"],
        maxLength:[15,"Product price cannot exceed 15 characters "],
        default:0.0
    },
    description:{
        type:String,
        required:[true,"please enter description"]
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
        required:[true,'Please enter classify'],
        enum:{
            values:[
                "Men",
                "Women",
                "Kid"
            ]
        }
    },
    category:{
        type:String,
        required:[true,'Please enter category'],
        enum:{
            values:[
                'T_SHIRT',
                'SHIRT',
                'COAT',
                'SHORT',
                'TROUSER',
                'SUIT',
                'SHOES',
                'HAT',
                'BAG',

                
            ],
            message:'Please enter select category'
        }
    },
    seller:{
        type:String,
        required:[true,'Please enter product seller']
    },
    stock:{
        type:Number,
        required:[true,'Please enter product stock'],
        maxLength:[5,'Product stock cannot exceed 5 characters']
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