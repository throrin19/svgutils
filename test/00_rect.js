"use strict";

var svgutils = require(__dirname + '/../index'),
    xml2js   = require('xml2js'),
    rectJSON = {
        type : 'rect',
        x : 10,
        y : 10,
        width : 100,
        height: 100
    };

describe("manipulate Rect class", function(){
    it("create from XML", function(done){
        var xml = '<rect x="10" y="10" width="100" height="100"></rect>';

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
        var rect = svgutils.Elements.Rect.fromJson(rectJSON);
        if((rect instanceof svgutils.Elements.Rect) == false){
            done(new Error("Creation failed"));
            return;
        }
        done();
    });
    it("apply translate Matrix", function(done){
        // translate(10, 50)
        var matrix = new svgutils.Matrix(1, 0, 0, 1, 10, 50);
        var rect = svgutils.Elements.Rect.fromJson(rectJSON);

        rect.applyMatrix(matrix, function(polygon){
            if((polygon instanceof svgutils.Elements.Polygon) == false){
                done(new Error("Apply matrix failed"));
                return;
            }
            polygon.getBBox(function(bbox){
                if(bbox.x != 20 || bbox.y != 60){
                    done(new Error("Apply matrix failed"));
                    return;
                }
                done();
            });
        });
    });
    it("get current Matrix", function(done){
        var rect = svgutils.Elements.Rect.fromJson(rectJSON);
        rect.getCurrentMatrix(function(matrix){
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