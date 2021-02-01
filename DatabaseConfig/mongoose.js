const mongoose = require('mongoose');

const connectionString = process.env['DB_CONNECTION_STRING'].replace('<password>', process.env['DB_PASSWORD']).replace('<dbname>', process.env['DB_NAME'])  

const dbConnect = mongoose.connect(connectionString, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
 });

module.exports = dbConnect;
        