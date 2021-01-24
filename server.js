const app = require('./app');
const dbConnect = require('./DatabaseConfig/mongoose');


dbConnect.then(response=>{
    app.listen(process.env['PORT'],'localhost', (err)=> {
        if(!err) {
            console.log('Application is running. \nDatabase Connection established');
        }
    })
}).catch(err=> {
        process.exit(1);    
})
