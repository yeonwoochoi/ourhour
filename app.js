const express = require('express')
const mysql = require('mysql')
const session = require('express-session')
const MySQStore = require('express-mysql-session')(session)
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const route_loader = require('./routes/route_loader')
const app = express()

//server on
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function(){
    console.log('Express server listening on port' + app.get('port'))
})


//database config
let dbConfig = {
    connectionLimit : 20,
    host : 'localhost',
    user : 'root',
    password : 'qhans4rydlsrms',
    database : 'mydb',
    debug : 'false',
    port : 3306,
    multipleStatements : true
}

//db pool export
let pool = mysql.createPool(dbConfig)
let connection = mysql.createConnection(dbConfig)
connection.connect()
module.exports.pool = pool


//syncMysql connection exports
let syncMysql = require('sync-mysql')
let syncConnection = new syncMysql({
    'host': 'localhost',
    'user': 'root',
    'password': 'qhans4rydlsrms',
    'port' : 3306,
    'database': 'mydb'
})
module.exports.syncConnection = syncConnection


// set up express
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(compression())


//router loader
route_loader.init(app, express.Router())


//error process
process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise.', p)
    })
    .on('uncaughtException', (err, origin) => {
        fs.writeSync(
            process.stderr.fd,
            `Caught exception: ${err}\n` +
            `Exception origin: ${origin}`
        );
    });







