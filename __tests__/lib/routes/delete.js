const Express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const Route = require('./../../../lib/routes/delete');
const Document = require('./../../../lib/models/document');
const fs = require('fs');

describe('/lib/routes/delete.js', function() {
    let server;

    const rootPath = `${__dirname}/../..`;

    beforeAll(() => {
        const app = Express();
        app.use(bodyParser.json());

        const documents = [
            {
                id : 'id',
                name : 'personal',
                path : '/albums/personal/image1.webp',
                raw : 'localhost:1111/photos/personal/file.jpg'
            },
            {
                id : 'id',
                name : 'personal',
                path : '/albums/personal/image2.jpg',
                raw : 'localhost:1111/photos/personal/file1.jpg'
            }
        ];

        const context = {
            models : {
                document : new Document(documents)
            },
            rootPath : rootPath
        }

        const route = new Route(app, context);
        route.setup();

        server = app.listen(8101);
    });

    afterAll(() => {
        server.close();
    })

    describe('Success', function() {

        beforeEach(function() {
            const path = `${rootPath}/albums/personal`;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path)
            }

            fs.copyFileSync(`${rootPath}/documents/image1.webp`, `${path}/image1.webp`);
            fs.copyFileSync(`${rootPath}/documents/image2.jpg`, `${path}/image2.jpg`);
            fs.copyFileSync(`${rootPath}/documents/image3.jpg`, `${path}/image3.jpg`);
        });
        
        test('Should return correct documents', function(done) {
            fetch('http://0.0.0.0:8101/photos', {
                method : 'delete',
                body : JSON.stringify([{
                    album : 'personal',
                    documents : 'image1.webp,image2.jpg'
                }]),
                headers: { 'Content-Type': 'application/json' },
            }).then(function(res){
                return res.json();
            }).then(function(json){
                expect(json).toEqual({
                    message : "ok"
                })

                expect(fs.existsSync(`${rootPath}/albums/personal/image1.webp`)).toBeFalsy();
                expect(fs.existsSync(`${rootPath}/albums/personal/image2.jpg`)).toBeFalsy();
                expect(fs.existsSync(`${rootPath}/albums/personal/image3.jpg`)).toBeTruthy();
                done();
            })
        })
    });
});