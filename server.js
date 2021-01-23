const app = require('./app');

app.listen(process.env['PORT'],'localhost', (err)=> {
    if(!err) {
        console.log('Server is running');
    }
})