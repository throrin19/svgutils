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
 * @param {number} x            X origin
 */
Rect.prototype.setX = function setX(x){
    this.x = x;
};

/**
 * Set Y origin
 * @param {number} y            y origin
 */
Rect.prototype.setY = function setY(y){
    this.y = y;
};

/**
 * Set Width
 * @param {number} width            Rect width
 */
Rect.prototype.setWidth = function setWidth(width){
    this.width = width;
};

/**
 * Set Height
 * @param {number} height            Rect height
 */
Rect.prototype.setHeight = function setHeight(height){
    this.height = height;
};

/**
 * Set rounded x corner
 * @param {number} rx            rounded x corner
 */
Rect.prototype.setRx = function setRx(rx){
    this.rx = rx;
};

/**
 * Set rounded y corner
 * @param {number} ry            rounded y corner
 */
Rect.prototype.setRy = function setRy(ry){
    this.ry = ry;
};

Rect.prototype.toJSON = function toJSON(matrix){
    var parentJSON = SvgObject.prototype.toJSON.call(this, matrix);

    parentJSON.x        = this.x;
    parentJSON.y        = this.y;
    parentJSON.rx       = this.rx;
    parentJSON.ry       = this.ry;
    parentJSON.width    = this.width;
    parentJSON.height   = this.height;

    return parentJSON;
};

Rect.prototype.toXml = function toXml(matrix){
    var xml = SvgObject.prototype.toXml.call(this, matrix);

    xml.att('x', this.x);
    xml.att('y', this.y);
    xml.att('width', this.width);
    xml.att('height', this.height);
    xml.att('rx', this.rx);
    xml.att('ry', this.ry);

    return xml;
};

/**
 * Return element converted into Path.
 * @return {Path}                           Path Object
 */
Rect.prototype.toPath = function toPath() {
    var path = SvgObject.prototype.toPath.call(this);

    path.d = 'M' + this.x + ' ' + this.y +
             ' L' + this.x + ' ' + (this.y+this.height) +
             ' L' + (this.x+this.width) + ' ' + (this.y+this.height) +
             ' L' + (this.x+this.width) + ' ' + this.y +
             ' Z';

    return path;
};

Rect.prototype.applyMatrix = function applyMatrix(matrix, callback){
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

/**
 * Get the element Bounding Box
 * @param {function} callback               Callback Function
 */
Rect.prototype.getBBox = function getBBox(callback){
    this.bbox = utils.bbox(this.x, this.y, this.width, this.height);
    callback(this.bbox);
};

/**
 * Get the element innerBox
 * @param {function} callback               Callback function
 */
Rect.prototype.getInnerBox = function getInnerBox(callback) {
    this.getBBox(callback);
};

module.exports = Rect;

/**
 * Create Rect from SVG rect node
 * @param   {object}    node        xml2js node from SVG file
 * @returns {Rect}                  the rect object
 */
module.exports.fromNode = function fromNode(node){
    var rect = new Rect();

    if(typeof node != 'undefined' && typeof node.$ != 'undefined'){
        SvgObject.fromNode(rect, node);

        if(typeof node.$.x != 'undefined'){
            rect.x = parseFloat(node.$.x);
        }
        if(typeof node.$.y != 'undefined'){
            rect.y = parseFloat(node.$.y);
        }
        if(typeof node.$.rx != 'undefined'){
            rect.rx = parseFloat(node.$.rx);
        }
        if(typeof node.$.ry != 'undefined'){
            rect.ry = parseFloat(node.$.ry);
        }
        if(typeof node.$.width != 'undefined'){
            rect.width = parseFloat(node.$.width);
        }
        if(typeof node.$.height != 'undefined'){
            rect.height = parseFloat(node.$.height);
        }
    }

    return rect;
};

/**
 * Create Rect from JSON element
 * @param   {object}    json        json element
 * @returns {Rect}                  the rect object
 */
module.exports.fromJson = function fromJson(json){
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

