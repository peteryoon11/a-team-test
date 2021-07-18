const express = require('express');
const server = express();
const path = require('path');
const http = require('http');
//const middleware = require('./middleware');

const user_routers = require('./src/routers/store-routers');

const port =  5400;
const host = 'localhost';



var router = express.Router();

server.use(express.json());

server.use('/api/v1', router);
server.use('/api/v1', user_routers);




console.log(`Server Listen ${host}:${port}`);
server.listen(port, host);

