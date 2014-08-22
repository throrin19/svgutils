"use strict";

var SvgObject   = require(__dirname + '/svgobject'),
    nUtil       = require('util');

var Tspan = function(){
    if (!(this instanceof Tspan))
        throw 'this function in a constructor. Use new to call it';

    SvgObject.call(this);
    this.type     = 'tspan';
    this.value    = "";
    this.x        = 0;
    this.y        = 0;
};

nUtil.inherits(Tspan, SvgObject);

/**
 * Set X origin
 * @param {number} x            X origin
 */
Tspan.prototype.setX = function setX(x){
    this.x = x;
};

/**
 * Set Y origin
 * @param {number} y            y origin
 */
Tspan.prototype.setY = function setY(y){
    this.y = y;
};

/**
 * Set Text Value
 * @param {string} string       Text value
 */
Tspan.prototype.setValue = function setValue(string){
    this.value = string;
};

/**
 * Get X origin
 * @returns {number}
 */
Tspan.prototype.getX = function getX(){
    return this.x;
};

/**
 * Get Y origin
 * @returns {number}
 */
Tspan.prototype.getY = function getY(){
    return this.y;
};

/**
 * Get Tspan Value
 * @returns {string}
 */
Tspan.prototype.getValue = function getValue(){
    return this.value;
};

/**
 * Return JSON from object
 * @param   {boolean}    [matrix]       return transform attribute if false.
 * @returns {object}                    JSON Object
 */
Tspan.prototype.toJSON = function toJSON(matrix){
    var parentJSON = SvgObject.prototype.toJSON.call(this, matrix);

    parentJSON.value    = this.value;
    parentJSON.x        = this.x;
    parentJSON.y        = this.y;

    return parentJSON;
};

/**
 * Return XML from object
 * @param   {boolean}    [matrix]       return transform attribute if false.
 * @returns {xmlBuilder}                XML Object
 */
Tspan.prototype.toXml = function toXml(matrix){
    var xml = SvgObject.prototype.toXml.call(this, matrix);

    xml.att('x', this.x);
    xml.att('y', this.y);
    xml.txt(this.value);

    return xml;
};

/**
 * Apply param Matrix and callback new SvgObject with this matrix
 * @param {object}      matrix          Matrix to apply
 * @param {function}    callback        Callback Function
 */
Tspan.prototype.applyMatrix = function applyMatrix(matrix, callback){
    var tspan = new Tspan();
    tspan.style   = this.style;
    tspan.classes = this.classes;
    tspan.id      = this.id;
    tspan.name    = this.name;
    tspan.stroke  = this.stroke;
    tspan.fill    = this.fill;
    tspan.type    = this.type;
    tspan.value   = this.value;
    tspan.x       = matrix.x(this.x, this.y);
    tspan.y       = matrix.y(this.x, this.y);
    tspan.data    = this.data;

    callback(tspan);
};

module.exports = Tspan;

/**
 * Generate SVGElement from SVG node
 * @param {object}      node        xml2js element
 */
module.exports.fromNode = function fromNode(node){
    var text = new Tspan();

    if(typeof node != 'undefined'){

        SvgObject.fromNode(text, node);

        if(typeof node.$ != 'undefined'){
            if(typeof node.$.x != 'undefined'){
                text.x = parseFloat(node.$.x);
            }
            if(typeof node.$.y != 'undefined'){
                text.y = parseFloat(node.$.y);
            }
        }

        if(typeof node._ != 'undefined'){
            text.value = node._;
        }
    }

    return text;
};

/**
 * Generate SVGElement from JSON element
 * @param {object}      json        json element
 */
module.exports.fromJson = function fromJSON(json){
    var text = new Tspan();

    if(typeof json != 'undefined'){
        SvgObject.fromJson(text, json);

        if(typeof json.value != 'undefined'){
            text.value = json.value;
        }
        if(typeof json.x != 'undefined'){
            text.x = json.x;
        }
        if(typeof json.y != 'undefined'){
            text.y = json.y;
        }
    }

    return text;
};