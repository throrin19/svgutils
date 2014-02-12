"use strict";

var SvgObject = require(__dirname + "/svgobject"),
    utils     = require(__dirname + '/../matrix/utils'),
    Polygon   = require(__dirname + '/polygon'),
    nUtil     = require('util');

var Rect = function(){
    if (!(this instanceof Rect))
        throw 'this function in a constructor. Use new to call it';

    SvgObject.call(this);
    this.type     = 'rect';
    this.x        = 0;
    this.y        = 0;
    this.width    = 0;
    this.height   = 0;
    this.rx       = 0;
    this.ry       = 0;
};

nUtil.inherits(Rect, SvgObject);

/**
 * Set X origin
 *
 * @param {number} x            X origin
 */
Rect.prototype.setX = function(x){
    this.x = x;
};

/**
 * Set Y origin
 *
 * @param {number} y            y origin
 */
Rect.prototype.setY = function(y){
    this.y = y;
};

/**
 * Set Rect Width
 *
 * @param {number} width            Rect width
 */
Rect.prototype.setWidth = function(width){
    this.width = width;
};

/**
 * Set Rect Height
 *
 * @param {number} height            Rect height
 */
Rect.prototype.setHeight = function(height){
    this.height = height;
};

/**
 * Set rounded x corner
 *
 * @param {number} rx            rounded x corner
 */
Rect.prototype.setX = function(rx){
    this.rx = rx;
};

/**
 * Set rounded y corner
 *
 * @param {number} ry            rounded y corner
 */
Rect.prototype.setX = function(ry){
    this.ry = ry;
};

Rect.prototype.toJSON = function(matrix){
    var parentJSON = SvgObject.prototype.toJSON.call(this, matrix);

    parentJSON.x        = this.x;
    parentJSON.y        = this.y;
    parentJSON.rx       = this.rx;
    parentJSON.ry       = this.ry;
    parentJSON.width    = this.width;
    parentJSON.height   = this.height;

    return parentJSON;
};

Rect.prototype.toXml = function(matrix){
    var xml = SvgObject.prototype.toXml.call(this, matrix);

    xml.att('x', this.x);
    xml.att('y', this.y);
    xml.att('width', this.width);
    xml.att('height', this.height);
    xml.att('rx', this.rx);
    xml.att('ry', this.ry);

    return xml;
};

Rect.prototype.applyMatrix = function(matrix, callback){
    var polygon = new Polygon();
    polygon.style   = this.style;
    polygon.classes = this.classes;
    polygon.id      = this.id;
    polygon.name    = this.name;
    polygon.stroke  = this.stroke;
    polygon.fill    = this.fill;
    polygon.data    = this.data;

    polygon.addPoint(
        matrix.x(this.x, this.y),
        matrix.y(this.x, this.y)
    );
    polygon.addPoint(
        matrix.x(this.x+this.width, this.y),
        matrix.y(this.x+this.width, this.y)
    );
    polygon.addPoint(
        matrix.x(this.x+this.width, this.y+this.height),
        matrix.y(this.x+this.width, this.y+this.height)
    );
    polygon.addPoint(
        matrix.x(this.x, this.y+this.height),
        matrix.y(this.x, this.y+this.height)
    );

    callback(polygon);
};

Rect.prototype.getBBox = function(callback){
    this.bbox = utils.bbox(this.x, this.y, this.width, this.height);
    callback(this.bbox);
};

module.exports = Rect;

/**
 * Create Rect from SVG rect node
 *
 * @param   {object}    node        xml2js node from SVG file
 * @returns {Rect}                  the rect object
 */
module.exports.fromNode = function(node){
    var rect = new Rect();

    if(typeof node != 'undefined' && typeof node.$ != 'undefined'){
        SvgObject.fromNode(rect, node);

        if(typeof node.$.x != 'undefined'){
            rect.x = parseInt(node.$.x);
        }
        if(typeof node.$.y != 'undefined'){
            rect.y = parseInt(node.$.y);
        }
        if(typeof node.$.rx != 'undefined'){
            rect.rx = parseInt(node.$.rx);
        }
        if(typeof node.$.ry != 'undefined'){
            rect.ry = parseInt(node.$.ry);
        }
        if(typeof node.$.width != 'undefined'){
            rect.width = parseInt(node.$.width);
        }
        if(typeof node.$.height != 'undefined'){
            rect.height = parseInt(node.$.height);
        }
    }

    return rect;
};

/**
 * Create Rect from JSON element
 *
 * @param   {object}    json        json element
 * @returns {Rect}                  the rect object
 */
module.exports.fromJson = function(json){
    var rect = new Rect();

    if(typeof json != 'undefined'){
        SvgObject.fromJson(rect, json);

        if(typeof json.x != 'undefined'){
            rect.x = json.x;
        }
        if(typeof json.y != 'undefined'){
            rect.y = json.y;
        }
        if(typeof json.rx != 'undefined'){
            rect.rx = json.rx;
        }
        if(typeof json.ry != 'undefined'){
            rect.ry = json.ry;
        }
        if(typeof json.width != 'undefined'){
            rect.width = json.width;
        }
        if(typeof json.height != 'undefined'){
            rect.height = json.height;
        }
    }

    return rect;
};

