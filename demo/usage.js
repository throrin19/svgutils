var Svg = require('../index').Svg;


Svg.fromSvgDocument(__dirname + '/test.svg', function(err, svg){
    console.log(svg.findByType('rect').toJSON());
});