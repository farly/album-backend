const Express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const ListRoute = require('./../../../lib/routes/list');
const Document = require('./../../../lib/models/document');


describe('/lib/routes/list.js', function() {
    let server, context;

    beforeAll(() => {
        const app = Express();
        app.use(bodyParser.json());

        const documents = [
            {
                id : 'id',
                name : 'personal',
                path : 'path/personal/file.jpg',
                raw : 'localhost:1111/photos/personal/file.jpg'
            },
            {
                id : 'id',
                name : 'personal',
                path : 'path/personal/file1.jpg',
                raw : 'localhost:1111/photos/personal/file1.jpg'
            }
        ];

        const context = {
            models : {
                document : new Document(documents)
            }
        }

        const listRoute = new ListRoute(app, context);
        listRoute.setup();

        server = app.listen(8100);
    });

    afterAll(() => {
        server.close();
    })

    describe('Success', function() {
        test('Should return correct documents', function(done) {
            fetch('http://0.0.0.0:8100/photos/list', {
                method : 'post',
                body : JSON.stringify({
                    skip : 0,
                    limit : 10
                }),
                headers: { 'Content-Type': 'application/json' },
            }).then(function(res){
                return res.json();
            }).then(function(json){
                expect(json).toEqual({
                    message : "ok",
                    documents : [{
                        id : 'id',
                        name : 'personal',
                        path : 'path/personal/file.jpg',
                        raw : 'localhost:1111/photos/personal/file.jpg'
                    }, {
                        id : 'id',
                        name : 'personal',
                        path : 'path/personal/file1.jpg',
                        raw : 'localhost:1111/photos/personal/file1.jpg'
                    }],
                    skip : 0,
                    limit : 10,
                    count : 2
                })
                done();
            })
        })

        test('Should return sliced documents starting skip 1 with limit 1', function(done) {
            fetch('http://0.0.0.0:8100/photos/list', {
                method : 'post',
                body : JSON.stringify({
                    skip : 1,
                    limit : 10
                }),
                headers: { 'Content-Type': 'application/json' },
            }).then(function(res){
                return res.json();
            }).then(function(json){
                expect(json).toEqual({
                    message : "ok",
                    documents : [{
                        id : 'id',
                        name : 'personal',
                        path : 'path/personal/file1.jpg',
                        raw : 'localhost:1111/photos/personal/file1.jpg'
                    }],
                    skip : 1,
                    limit : 10,
                    count : 2
                })
                done();
            })
        })

        test('Should return number of documents base on limit', function(done) {
            fetch('http://0.0.0.0:8100/photos/list', {
                method : 'post',
                body : JSON.stringify({
                    skip : 0,
                    limit : 1
                }),
                headers: { 'Content-Type': 'application/json' },
            }).then(function(res){
                return res.json();
            }).then(function(json){
                expect(json).toEqual({
                    message : "ok",
                    documents : [{
                        id : 'id',
                        name : 'personal',
                        path : 'path/personal/file.jpg',
                        raw : 'localhost:1111/photos/personal/file.jpg'
                    }],
                    skip : 0,
                    limit : 1,
                    count : 2
                })
                done();
            })
        })
    });
});