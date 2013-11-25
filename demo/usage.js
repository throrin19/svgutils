var Svg = require('../index').Svg;


Svg.fromSvgDocument(__dirname + '/test.svg', function(err, svg){
    console.log(svg.toString(true));
});
