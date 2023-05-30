const swaggerJSDoc = require("swagger-jsdoc");
const SwaggerUI = require("swagger-ui");

const swaggerOptions = {  
    swaggerDefinition: {  
        info: {  
            title:'Employee API',  
            version:'1.0.0'  
        }  
    },  
    apis:['api.js'],  
}  
const swaggerDocs = swaggerJSDoc(swaggerOptions);  
app.use('/api-docs',SwaggerUI.serve,swaggerUI.setup(swaggerDocs));  