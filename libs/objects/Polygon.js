'use strict';

var Matrix = require(__dirname + '/../matrix');

var Polygon = function(node, line){
    if(line == true)
        this.type = 'polyline';

    // gestion du transform


    // parsing des attributs
};

Polygon.prototype.type = 'polygon';
Polygon.prototype.attributes = {};

module.exports = Polygon;