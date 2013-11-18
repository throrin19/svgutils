'use strict';

var Matrix      = require(__dirname + '/../matrix/extends'),
    utils       = require(__dirname + '/../matrix/utils'),
    SvgObject   = require(__dirname + '/svgobject'),
    _           = require('underscore');

var Polygon = function(){
    SvgObject.call(this);
};

Polygon.prototype = new SvgObject();

Polygon.prototype.type      = 'polygon';
Polygon.prototype.points    = [];

/**
 * Get Polygon points in Array to simply manipulation
 *
 * @param {string}    points                    Polygon|Polyline points attribute value
 */
Polygon.prototype.setPointsFromString = function(points){
    var coords  = [],
        point   = {};

    _.each(points.split(/[, ]/), function(xy, index){
        if(index%2 == 0){
            point.x = xy;
        }else{
            point.y = xy;
        }

        if(index%2 == 1 && index > 0){
            coords.push(point);
            point = {};
        }
    });

    this.points = coords;
};

/**
 * Return JSON from object
 *
 * @returns {object}
 */
Polygon.prototype.toJSON = function(){
    var parentJSON = SvgObject.prototype.toJSON.call(this);

    parentJSON.type     = this.type;
    parentJSON.points   = this.points;

    return parentJSON;
};

Polygon.prototype.getBBox = function(){
    var minX = Number.POSITIVE_INFINITY,
        minY = Number.POSITIVE_INFINITY,
        maxX = Number.NEGATIVE_INFINITY,
        maxY = Number.NEGATIVE_INFINITY,
        width,
        height;

    _.each(this.points, function(point){

        console.log(point);

        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
    });

    width = maxX - minX;
    height = maxY - minY;

    return utils.bbox(minX, minY, width, height);
};

module.exports = Polygon;

/**
 * Create Polygon from SVG polygon|polyline node
 *
 * @param   {object}    node        xml2js node from SVG file
 * @param   {boolean}   [line]      true : polyline, false : polygon. False as default
 * @returns {Polygon}               the polygon object
 */
module.exports.fromNode = function(node, line){
    var polygon = new Polygon();

    if(line == true)
        polygon.type = 'polyline';

    if(typeof node != 'undefined' && typeof node.$ != 'undefined'){
        SvgObject.fromNode.call(polygon, node);

        if(typeof node.$.points != 'undefined'){
            polygon.setPointsFromString(node.$.points);
        }
    }

    return polygon;
};