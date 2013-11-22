var Svg = require('../index').Svg;


//Svg.fromSvgDocument(__dirname + '/test.svg', function(err, svg){
//    svg.applyMatrix(function(newSvg){
//        console.log(JSON.stringify(newSvg.toJSON()));
//    });
//});

Svg.fromJsonFile(__dirname + '/test.json', function(err, svg){
    console.log(svg.toString(false));
});