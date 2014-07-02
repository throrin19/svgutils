var Svg = require('../index').Svg;


Svg.fromDxfFile({
    path : __dirname + '/test.dxf'
}, function (err, svg) {
    svg.savePng({}, function(err, output) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(output);
    });
});