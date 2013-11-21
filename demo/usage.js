var Svg = require('../index').Svg;


Svg.fromSvgDocument(__dirname + '/test.svg', function(err, svg){
    svg.applyMatrix(function(newSvg){
        console.log(newSvg.toString());
    });
});