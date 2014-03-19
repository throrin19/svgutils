'use strict';

var Matrix      = require(__dirname + '/../matrix/extends'),
    SvgObject   = require(__dirname + '/svgobject'),
    utils       = require(__dirname + '/../matrix/utils'),
    _           = require('underscore'),
    nUtil       = require('util');

var Polygon = function() {
    if (!(this instanceof Polygon)) {
        throw 'this function in a constructor. Use new to call it';
    }

    SvgObject.call(this);
    this.type   = "polygon";
    this.points = [];
};

nUtil.inherits(Polygon, SvgObject);

/**
 * Get Polygon points in Array to simply manipulation
 *
 * @param {string}    points                    Polygon|Polyline points attribute value
 */
Polygon.prototype.setPointsFromString = function setPointsFromString(points) {
    var coords  = [],
        point   = {};

    _.each(points.split(/[, ]/), function(xy, index) {
        if (index%2 == 0) {
            point.x = xy;
        } else {
            point.y = xy;
        }

        if (index%2 == 1 && index > 0) {
            coords.push(point);
            point = {};
        }
    });

    this.points = coords;
    this.bbox = undefined;
};

Polygon.prototype.addPoint = function addPoint(x, y) {
    this.points.push({ x : x, y : y });
    this.bbox = undefined;
};

Polygon.prototype.toJSON = function toJSON(matrix) {
    var parentJSON = SvgObject.prototype.toJSON.call(this, matrix);

    parentJSON.type     = this.type;
    parentJSON.points   = this.points;

    return parentJSON;
};

Polygon.prototype.toXml = function toXml(matrix) {

    var xml = SvgObject.prototype.toXml.call(this, matrix);

    var points = "";
    _.each(this.points, function(point){
       points += point.x + "," + point.y + " ";
    });

    xml.att('points', points.substr(0, points.length-1));

    return xml;
};

Polygon.prototype.applyMatrix = function applyMatrix(matrix, callback) {
    var polygon     = new Polygon();
    polygon.style   = this.style;
    polygon.classes = this.classes;
    polygon.id      = this.id;
    polygon.name    = this.name;
    polygon.stroke  = this.stroke;
    polygon.fill    = this.fill;
    polygon.type    = this.type;
    polygon.data    = this.data;

    _.each(this.points, function (point) {
        polygon.addPoint(
            matrix.x(point.x, point.y),
            matrix.y(point.x, point.y)
        );
    });

    callback(polygon);
};

Polygon.prototype.getBBox = function getBBox(callback) {
    var minX = +Infinity,
        maxX = -Infinity,
        minY = +Infinity,
        maxY = -Infinity;

    _.each(this.points, function (point) {
        minX = Math.min(point.x, minX);
        maxX = Math.max(point.x, maxX);
        minY = Math.min(point.y, minY);
        maxY = Math.max(point.y, maxY);
    });


    this.bbox = utils.bbox(minX, minY, Math.abs(Math.abs(maxX) - Math.abs(minX)), Math.abs(Math.abs(maxY) - Math.abs(minY)));
    callback(this.bbox);
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

module.exports.fromJson = function(json, line){

    var polygon = new Polygon();

    if(line == true)
        polygon.type = 'polyline';

    if(typeof json != 'undefined'){
        SvgObject.fromJson(polygon, json);

        if(typeof json.points != 'undefined'){
            polygon.points = json.points;
        }
    }

    return polygon;
};