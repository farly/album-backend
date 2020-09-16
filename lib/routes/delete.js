const Ajv = require('ajv');
const fs = require('fs');
const schema = {
    type : "array",
    items : {
        type : "object",
        properties : {
            album : {
                type : "string"
            },
            documents : {
                type : "string"
            }
        },
        required : ["album", "documents"]
    }
}

class DeleteRoute
{
    constructor(server, context) {
        this.server = server;
        this.context = context;
    }

    setup() {
        this.server.delete(
            '/photos', 
            this.validateBody, 
            this.sendResponse.bind(this), 
            this.delete.bind(this)
        );
    }

    validateBody(request, response, next) {
        const ajv = new Ajv();
        const valid = ajv.validate(schema, request.body);

        if (!valid) {
            return next(new Error('Delete validation error'));
        }

        next();
    }

    sendResponse(request, response, next) {
        const docs = [];
        request.body.forEach(doc => {
            const { album, documents } = doc;
            documents.split(',').forEach(document => {
                docs.push(`/albums/${album.toLowerCase()}/${document.trim()}`)
            });
        });

        request.documents = docs;
        
        response.send({
            message : "ok"
        });

        next()
    }

    delete(request, response, next) {
        const { documents } = request;

        documents.forEach(doc => {
            try {
                fs.unlinkSync(`${this.context.rootPath}${doc}`);
                this.context.models.document.removeOneByPath(doc);
            } catch (err) {
                // do nothing
            } 
        });
    }
}

module.exports = DeleteRoute;