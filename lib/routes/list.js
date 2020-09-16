const Ajv = require('ajv')

class UploadRoute
{
	constructor(server, context) {
		this.server = server;
		this.context = context;
	}
	
	setup() {
		this.server.post('/photos/list', this.validateBody, this.sendResponse.bind(this));
	}

	validateBody(request, response, next) {
		const ajv = new Ajv();

		const valid = ajv.validate({
			type : "object",
			properties : {
				skip : {
					type : "integer",
					minimum : 0
				},
				limit : {
					type : "integer",
					minimum : 1
				}
			},
			required : ["skip", "limit"]
		}, request.body);

		if (valid) {
			return next(null);
		}
		
		next(new Error('validation error'));
	}

	sendResponse(request, response, next) {

		const { skip, limit } = request.body;
		
		response.send({
			message : "ok",
			documents : this.context.models.document.find({skip, limit}),
			count : this.context.models.document.count(),
			skip,
			limit
		});

		next();
	}
}

module.exports = UploadRoute;

