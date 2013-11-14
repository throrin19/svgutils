var svgParser = require('../index').Parser;

var parser = new svgParser();
parser.parseFile(__dirname + '/test.svg', function(err, file){
    console.log(file);
});