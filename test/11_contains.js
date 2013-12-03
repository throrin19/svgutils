"use strict";

var containPath     = __dirname + '/svg/contains.svg',
    noContainPath   = __dirname + '/svg/notcontains.svg',
    svgutils        = require(__dirname + '/../index');

describe("Contains or not contains", function(){
    it('polygon contains text', function(done){
        svgutils.Svg.fromSvgDocument(containPath, function(err, svg){
            if(err){
                done(err);
                return;
            }

            // polygon contains text
            svg.elements[0].contains(svg.elements[1], function(result){
                if(result == false){
                    done(new Error('Polygon must be contains text'));
                    return;
                }
                done();
            });
        });
    });
    it('polygon not contains text', function(done){
        svgutils.Svg.fromSvgDocument(noContainPath, function(err, svg){
            if(err){
                done(err);
                return;
            }

            // polygon contains text
            svg.elements[0].contains(svg.elements[1], function(result){
                if(result == true){
                    done(new Error('Polygon must be no contains text'));
                    return;
                }
                done();
            });
        });
    });
});