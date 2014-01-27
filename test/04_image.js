var svgutils = require(__dirname + '/../index'),
    xml2js   = require('xml2js'),
    imgJSON = {
        type : 'image',
        x : 0,
        y : 0,
        width : 2000,
        height: 2000,
        href : 'http://devgoomeodata.blob.core.windows.net/images/i_3bd86854ab1b0e627bc6de06381307fe.png',
        preserveAspectRatio : 'none'
    };

describe("manipulate Image class", function(){
    it("create from XML", function(done){
        var xml = '<image href="http://devgoomeodata.blob.core.windows.net/images/i_3bd86854ab1b0e627bc6de06381307fe.png" preserveAspectRatio="none" x="0" y="0" width="2000" height="2000"></image>';

        var parser  = new xml2js.Parser();
        parser.addListener('end', function(result) {
            var rect = svgutils.Elements.Rect.fromNode(result);

            if((rect instanceof svgutils.Elements.Rect) == false){
                done(new Error("Creation failed"));
                return;
            }
            done();
        });
        parser.parseString(xml);
    });
    it("create from JSON", function(done){
        var rect = svgutils.Elements.Rect.fromJson(imgJSON);
        if((rect instanceof svgutils.Elements.Rect) == false){
            done(new Error("Creation failed"));
            return;
        }
        done();
    });
});