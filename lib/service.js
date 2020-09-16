const BaseServer = require('./base/server');
const Document = require('./models/document')

const ListRoute = require('./routes/list.js');
const HealthCheckRoute = require('./routes/healthcheck.js');
const UploadRoute = require('./routes/upload.js');
const PhotoRoute = require('./routes/photo');
const DeleteRoute = require('./routes/delete');

class Server extends BaseServer
{
	
	constructor(config) {
		super(config);
	}

	preStart(cb) {
		const documents = [];
		this.context.models.document = new Document(documents);
		// this.context.utils.file = new FileUpload(config.rootPath);
		// setup dependecies here
		cb(null);
	}

	applyRoutes(app, context) {

		const healthCheckRoute = new HealthCheckRoute(app);
		healthCheckRoute.setup();
		// maybe loop thru all routes..
		const listRoute = new ListRoute(app, context);
		listRoute.setup();

		const uploadRoute = new UploadRoute(app, context);
		uploadRoute.setup();

		const photoRoute = new PhotoRoute(app, context);
		photoRoute.setup();

		const deleteRoute = new DeleteRoute(app, context);
		deleteRoute.setup();
	}
}

module.exports = Server;
