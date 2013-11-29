var Svg = require('../index').Svg;


Svg.fromSvgDocument(__dirname + '/test2.svg', function(err, svg){
    svg.elements[0].contains(svg.elements[1], function(result){
        console.log(result);
    });
});