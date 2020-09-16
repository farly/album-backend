const Ajv = require('ajv');
const formidable = require('formidable');
const fs = require('fs');

const schema = {
    type : "object",
    properties : {
      album : {
          type: "string"
      }
    },
    required : ["album"]
};

class UploadRoute
{
    constructor(server, context) {
        if (undefined === server) {
            return new Error('Server not defined');
        }

        if (undefined === context) {
            return new Error('Context not defined')
        }

        this.server = server;
        this.context = context;
    }

    setup() {
        this.server.put(
            '/photos', 
            this.sendResponse.bind(this), 
            this.uploadFiles.bind(this)
        )
    }

    sendResponse(request, response, next) {

        // const { album } = request.body;

        const form = formidable({ multiples : true });

        request.files = [];
        form.parse(request, (err, fields, files) => {
            
            const { album } = fields;

            const ajv = new Ajv();
            const valid = ajv.validate(schema, fields);

            if (!valid) {
                return next(new Error('validation error'))
            }

            if (err) {
                return next(err);
            }

            const dir = `${this.context.albumsPath}${album.toLowerCase()}`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }


            if (!Array.isArray(files.documents)) {
                files.documents = [
                    files.documents
                ];
            }


            const documents = files.documents.map(file => {

                const name = file.name;

                const info = {
                    album,
                    name,
                    path : `/albums/${album.toLowerCase()}/${name}`,
                    raw : `${request.protocol}://${request.get('host')}/photos/${album.toLowerCase()}/${name}`
                }

                file.info = info;

                request.files.push(file);

                return info;
            });

            response.send({
                message : "ok",
                documents : documents
            });
            next();
        });
    }

    uploadFiles(request, response, next) {
        const documents = [];
        request.files.forEach(file => {
            const info = file.info;
            fs.copyFileSync(file.path, `${this.context.rootPath}${info.path}`);
            documents.push(info);
        });

        this.context.models.document.save(documents);
        
        next();
    }
}

module.exports = UploadRoute;