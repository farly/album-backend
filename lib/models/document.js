const uuid = require('uuid');

class Document
{
    constructor(documents) {

        if (undefined === documents) {
            throw new Error('Documents is not defined');
        }

        this.documents = documents;
    }

    save(files) {

        const docs = files.map(function(doc){
            doc.id = uuid.v4();
            return doc;
        })
        
        this.documents = this.documents.concat(docs);
    }

    count() {
        return this.documents.length;
    }

    find(options) {
        const { skip, limit } = options;

        const docs = this.documents.slice(skip, skip + limit);

        return docs;
    }

    findOneByPath(path) {
        return this.documents.find(doc => doc.path === path);
    }
    
    removeOneByPath(path) {
        this.documents = this.documents.filter(doc => doc.path !== path);
    }
}

module.exports = Document;