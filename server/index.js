const express = require('express');
const http =require('http');
const router = require('./startup/router');
const app = express();
const server = http.createServer(app);



app.use(express.json());
require('./startup/db')();
require('./startup/cors')(app);
require('./startup/socket')(server);

app.use(router);



const port = process.env.PORT || 5000;

server.listen(port,() => console.log(`Server running on PORT ${port}`) );
