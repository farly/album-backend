const bodyParser = require('body-parser');
const Express = require('express');

class BaseServer
{
	constructor(config) {
		if (undefined === config) {
			throw new Error('Config is undefined');
		}

		this.config = config;
		this.context = {
			models : {},
			utils : {},
			rootPath : config.rootPath,
			albumsPath : `${config.rootPath}/albums/`
		}
	}

	start() {
		this.preStart(error => {
			if (error != null) {
				throw new Error(error.message);
			}

			this.startServer();
		});
	}

	startServer() {
		const app = Express();

		app.use(bodyParser.json());
		app.use('/photos', Express.static(`${this.context.albumsPath}`));
		
		this.applyRoutes(app, this.context);
		
		app.listen(this.config.port);
	}

	applyRoutes(app, context) {
		throw new Error('apply routes not implemented')	
	}

	preStart(error) {
		throw new Error('Pre start setup not implemented');
	}
}

module.exports = BaseServer;
