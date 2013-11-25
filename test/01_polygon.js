"use strict";

var svgutils    = require(__dirname + '/../index'),
    xml2js      = require('xml2js'),
    _           = require('underscore'),
    polygonJSON = {
        type : 'polygon',
        points : [
            { x : 10, y : 10 },
            { x : 30, y : 10 },
            { x : 30, y : 30 },
            { x : 10, y : 30 }
        ]
    };

describe("manipulate Polygon class", function(){
    it("create from XML", function(done){
        var xml = '<polygon points="10,10 30,10 30,30 10,30"></polygon>';

        var parser  = new xml2js.Parser();
        parser.addListener('end', function(result) {
            var polygon = svgutils.Elements.Polygon.fromNode(result);

            if((polygon instanceof svgutils.Elements.Polygon) == false){
                done(new Error("Creation failed"));
                return;
            }
            done();
        });
        parser.parseString(xml);
    });
    it("create from JSON", function(done){
        var polygon = svgutils.Elements.Polygon.fromJson(polygonJSON);
        if((polygon instanceof svgutils.Elements.Polygon) == false){
            done(new Error("Creation failed"));
            return;
        }
        done();
    });
    it("apply translate Matrix", function(done){
        // translate(10, 50)
        var matrix = new svgutils.Matrix(1, 0, 0, 1, 10, 50);
        var polygon = svgutils.Elements.Polygon.fromJson(polygonJSON);

        polygon.applyMatrix(matrix, function(polygon2){
            if((polygon2 instanceof svgutils.Elements.Polygon) == false){
                done(new Error("Matrix failed"));
                return;
            }
            var success = true;
            _.each(polygon2.points, function(point, index){
                if(point.x != polygon.points[index].x + 10 || point.y != polygon.points[index].y + 50){
                    success = false;
                }
            });
            if(!success){
                done(new Error("Matrix failed"));
                return;
            }
            done();
        });
    });
    it("get current Matrix", function(done){
        var polygon = svgutils.Elements.Rect.fromJson(polygonJSON);
        polygon.getCurrentMatrix(function(matrix){
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
