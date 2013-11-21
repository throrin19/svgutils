'use strict';

var Matrix      = require(__dirname + '/../matrix/extends'),
    SvgObject   = require(__dirname + '/svgobject'),
    _           = require('underscore');

var Polygon = function(){
    SvgObject.call(this);
    this.type   = "polygon";
    this.points = [];
};

Polygon.prototype = new SvgObject();
Polygon.prototype.constructor = Polygon;

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

Polygon.prototype.addPoint = function(x, y){
    this.points.push({ x : x, y : y });
};

Polygon.prototype.toJSON = function(matrix){
    var parentJSON = SvgObject.prototype.toJSON.call(this, matrix);

    parentJSON.type     = this.type;
    parentJSON.points   = this.points;

    return parentJSON;
};

Polygon.prototype.toXml = function(matrix){

    var xml = SvgObject.prototype.toXml.call(this, matrix);

    var points = "";
    _.each(this.points, function(point){
       points += point.x + "," + point.y + " ";
    });

    xml.att('points', points.substr(0, points.length-1));

    return xml;
};

Polygon.prototype.applyMatrix = function(matrix, callback){
    var polygon = new Polygon();
    polygon.style   = this.style;
    polygon.classes = this.classes;
    polygon.id      = this.id;
    polygon.name    = this.name;
    polygon.stroke  = this.stroke;
    polygon.fill    = this.fill;
    polygon.type    = this.type;

    _.each(this.points, function(point){
        polygon.addPoint(
            matrix.x(point.x, point.y),
            matrix.y(point.x, point.y)
        );
    });

    callback(polygon);
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
        SvgObject.fromNode(polygon, node);

        if(typeof node.$.points != 'undefined'){
            polygon.setPointsFromString(node.$.points);
        }
    }

    return polygon;
};