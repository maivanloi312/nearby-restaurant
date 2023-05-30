const ErrorHandler=require('../utils/errorHandler')
module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode|| 500;
    if(process.env.NODE_ENV==='DEVELOPMENT'){
        res.status(err.statusCode).json({
            succes:false,
            error:err,
            errMessage:err.message,
            stack:err.stack
        })
    
    }
    if(process.env.NODE_ENV==='PRODUCTION'){
        let error={...err}
        error.message=err.message
        //update comming
        res.status(err.statusCode).json({
            succes:false,
            message: error.message||"Internal Sever Error"
        })
    
    }
}