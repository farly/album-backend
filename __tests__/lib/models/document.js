const Document = require('./../../../lib/models/document');


describe('/lib/models/document.js', function() {
    test('should throw an error if  constructor parameter is not defined', function() {
        expect(() => {
            new Document()
        }).toThrow(new Error('Documents is not defined'))
    });

    test('should assign documents parameter to class variable', function() {
        const documents = [
            {
                album : "Personal",
                path : "/albums/personal/image.jpeg"
            }
        ]

        const document = new Document(documents);

        expect(document.documents).toEqual(documents);
    })
});