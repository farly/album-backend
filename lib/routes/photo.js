const { response } = require("express");

class PhotoRoute
{
    constructor(server, context) {
        this.server = server;
        this.context = context;
    }

    setup() {
        this.server.get('/photos/:album/:filename', this.sendResponse.bind(this));
    }

    sendResponse(request, response, next) {

        const { album, filename } = request.params;
        const path = `/albums/${album.toLowerCase()}/${filename}`;

        const doc = this.context.models.document.findOneByPath(path);

        if (doc !== undefined) {
            response.sendFile(`${this.context.rootPath}${doc.path}`)
        } else {
            response.send({
                message : "NotFound"
            });
        }
    }
}

module.exports = PhotoRoute;