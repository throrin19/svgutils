var Svg = require('../index').Svg;


Svg.fromJsonFile(__dirname + '/test.json', function (err, svg) {
    var element = svg.elements[0];
    element.getInnerBox(function (innerBox) {
        //console.log(innerBox);
    });
    //var element = svg.elements[1];
    //element.getInnerBox(function (innerBox) {
    //    console.log(innerBox);
    //});
});