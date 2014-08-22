var Svg = require('../index').Svg;


Svg.fromSvgDocument(__dirname + '/test.svg', function (err, svg) {
    console.log(JSON.stringify(svg.toJSON()));
});