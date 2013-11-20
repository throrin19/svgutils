var Svg = require('../index').Svg;


Svg.fromSvgDocument(__dirname + '/test.svg', function(err, svg){
    var rect = svg.findByType('rect').elements[0];

    rect.getMatrix(function(matrix){
        console.log(rect.applyMatrix(matrix).toString());
        console.log(rect.toString());
    });
});