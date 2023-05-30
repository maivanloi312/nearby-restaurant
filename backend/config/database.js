const mongoose =require('mongoose')
//error

const connectDatabase=()=>{
    mongoose.connect(process.env.DB_CLOUD,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true
    })
    .then(con=>{
        console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
    })
    .catch(console.error())
}
module.exports=connectDatabase