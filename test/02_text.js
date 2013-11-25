"use strict";

var svgutils = require(__dirname + '/../index'),
    xml2js   = require('xml2js'),
    json = {
        type : 'text',
        x : 10,
        y : 10,
        value : "Lorem Ipsum"
    };

describe("manipulate Text class", function(){
    it("create from XML", function(done){
        var xml = '<text x="10" y="10">Lorem Ipsum</text>';

        var parser  = new xml2js.Parser();
        parser.addListener('end', function(result) {
            var text = svgutils.Elements.Text.fromNode(result);

            if((text instanceof svgutils.Elements.Text) == false){
                done(new Error("Creation failed"));
                return;
            }
            done();
        });
        parser.parseString(xml);
    });
    it("create from JSON", function(done){
        var text = svgutils.Elements.Text.fromJson(json);
        if((text instanceof svgutils.Elements.Text) == false){
            done(new Error("Creation failed"));
            return;
        }
        done();
    });
    it("apply translate Matrix", function(done){
        // translate(10, 50)
        var matrix = new svgutils.Matrix(1, 0, 0, 1, 10, 50);
        var text = svgutils.Elements.Text.fromJson(json);

        text.applyMatrix(matrix, function(newText){
            if((newText instanceof svgutils.Elements.Text) == false){
                done(new Error("Apply matrix failed"));
                return;
            }
            if(newText.x != text.x + 10 || newText.y != text.y + 50){
                done(new Error("Apply matrix failed"));
                return;
            }
            done();
        });
    });
    it("get current Matrix", function(done){
        var text = svgutils.Elements.Text.fromJson(json);
        text.getCurrentMatrix(function(matrix){
            if(
                matrix.a != 1 ||
                    matrix.b != 0 ||
                    matrix.c != 0 ||
                    matrix.d != 1 ||
                    matrix.e != 0 ||
                    matrix.f != 0
                ){
                done(new Error("Incorrect Matrix"));
                return;
            }
            done();
        });
    });
});