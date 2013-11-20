var Svg = require('../index').Svg;


Svg.fromSvgDocument(__dirname + '/test.svg', function(err, svg){
    var rect = svg.findByType('rect').elements[0];

    console.log(rect.toJSON());
});