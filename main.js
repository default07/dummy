
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const express = require('express');

const app = express();

var server;

// Server settings
server = http.createServer(function (req, res) { app(req, res); });
server.setMaxListeners(0);

// Check settings value
var www = path.resolve(__dirname, './dist');

// Http Server for client UI
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'x-access-token, x-auth-user, Origin, Content-Type, Accept');

    next();
    try {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // logger.info("Client: " + ip, false);
    } catch (err) {

    }
}
var resourcesFileDir = path.resolve(__dirname, 'resources');

app.use(allowCrossDomain);
app.use('/', express.static(www));
app.use('/resources', express.static(resourcesFileDir));
// app.use('/', FUXA.httpApi);

app.get('/resource', function (req, res) {
    var resDir = path.resolve(__dirname, 'resources');
    var map = path.join(resDir, 'images-map.json');
    var mymap = JSON.parse(fs.readFileSync(map, 'utf8'));
    // let tosend = { msg: 'pippo' };
    res.json(mymap);
});

server.listen(1881, 'localhost', function () {
    console.info('WebServer is_ running http://localhost:1881');
});

process.on('uncaughtException', function (err) {
    if (err.stack) {
        console.error(err.stack);
    } else {
        console.error(err);
    }
    process.exit(1);
});

process.on('SIGINT', function () {
    console.info('WebServer end!');
    process.exit();
});