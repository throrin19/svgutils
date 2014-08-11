var Svg = require('../index').Svg;


Svg.fromDxfFile({
    path : __dirname + '/test.dxf'
}, function (err, svg) {
    svg.calculateAllInnerBoxes( function (svg) {

    });
});