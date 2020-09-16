const Express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const Route = require('./../../../lib/routes/upload');
const Document = require('./../../../lib/models/document');
const fs = require('fs');

describe('/lib/routes/delete.js', function() {
    let server;

    const rootPath = `${__dirname}/../..`;

    beforeAll(() => {
        const app = Express();
        
        const context = {
            models : {
                document : new Document([])
            },
            rootPath : rootPath,
            albumsPath : `${rootPath}/albums/`
        }

        const route = new Route(app, context);
        route.setup();

        server = app.listen(8102);
    });

    afterAll(() => {
        server.close();
    })

    describe('Success', function() {

        afterEach(function() {

            const files = [
                `${rootPath}/albums/test/image1.webp`,
                `${rootPath}/albums/test/image2.jpg`,
                `${rootPath}/albums/test/image3.jpg`
            ];

            files.forEach(function(file){
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
            });
        })

        test('Should upload single doc successfully', function(done) {
            const FormData = require('form-data');

            const form = new FormData();
            form.append('album', 'Test');
            form.append('documents', fs.createReadStream(`${rootPath}/documents/image3.jpg`));
            
            fetch('http://0.0.0.0:8102/photos', {
                method : 'PUT',
                body : form
            }).then(function(res){
                return res.json();
            }).then(function(json){
                expect(json).toEqual({
                    message : "ok",
                    documents: [{
                        album: 'Test',
                        name: 'image3.jpg',
                        path: '/albums/test/image3.jpg',
                        raw: 'http://0.0.0.0:8102/photos/test/image3.jpg'
                    }]
                })

                expect(fs.existsSync(`${rootPath}/albums/test/image3.jpg`)).toBeTruthy();
                done();
            })
        })

        test('Should upload multiple docs successfully', function(done) {
            const FormData = require('form-data');

            const form = new FormData();
            form.append('album', 'Test');
            form.append('documents', fs.createReadStream(`${rootPath}/documents/image1.webp`));
            form.append('documents', fs.createReadStream(`${rootPath}/documents/image2.jpg`));

            fetch('http://0.0.0.0:8102/photos', {
                method : 'PUT',
                body : form
            }).then(function(res){
                return res.json();
            }).then(function(json){
                expect(json).toEqual({
                    message : "ok",
                    documents: [{
                        album: 'Test',
                        name: 'image1.webp',
                        path: '/albums/test/image1.webp',
                        raw: 'http://0.0.0.0:8102/photos/test/image1.webp'
                    },
                    {
                        album: 'Test',
                        name: 'image2.jpg',
                        path: '/albums/test/image2.jpg',
                        raw: 'http://0.0.0.0:8102/photos/test/image2.jpg'
                    }]
                })

                expect(fs.existsSync(`${rootPath}/albums/test/image1.webp`)).toBeTruthy();
                expect(fs.existsSync(`${rootPath}/albums/test/image2.jpg`)).toBeTruthy();
                done();
            })
        })
    });
});