const path = require('path');
const Server = require('./lib/service');

const server = new Server({
	host : process.env.HOST || 'localhost',
	port : process.env.PORT || 8888,
	rootPath : path.dirname(require.main.filename) 
});

server.start();
