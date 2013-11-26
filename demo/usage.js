var Svg = require('../index').Svg;


Svg.fromSvgDocument(__dirname + '/test.svg', function(err, svg){
    console.log('-- svg 1 --');
    console.log(JSON.stringify(svg.toJSON(true)));
    svg.applyMatrix(null, function(newSvg){
        console.log('-- svg 1 --');
        console.log(JSON.stringify(newSvg.toJSON(true)));
    });
});
Svg.fromSvgDocument(__dirname + '/test2.svg', function(err, svg){
    console.log('-- svg 2 --');
    console.log(JSON.stringify(svg.toJSON(true)));
    svg.applyMatrix(null, function(newSvg){
        console.log('-- svg 2 --');
        console.log(JSON.stringify(newSvg.toJSON(true)));
    });
});