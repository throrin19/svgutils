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
 *
 * @param {number} x            X origin
 */
Tspan.prototype.setX = function(x){
    this.x = x;
};

/**
 * Set Y origin
 *
 * @param {number} y            y origin
 */
Tspan.prototype.setY = function(y){
    this.y = y;
};

/**
 * Set Text Value
 *
 * @param {string} string       Text value
 */
Tspan.prototype.setValue = function(string){
    this.value = string;
};

Tspan.prototype.toJSON = function(matrix){
    var parentJSON = SvgObject.prototype.toJSON.call(this, matrix);

    parentJSON.value    = this.value;
    parentJSON.x        = this.x;
    parentJSON.y        = this.y;

    return parentJSON;
};

Tspan.prototype.toXml = function(matrix){
    var xml = SvgObject.prototype.toXml.call(this, matrix);

    xml.att('x', this.x);
    xml.att('y', this.y);
    xml.txt(this.value);

    return xml;
};

Tspan.prototype.applyMatrix = function(matrix, callback){
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

module.exports.fromNode = function(node){
    var text = new Tspan();

    if(typeof node != 'undefined'){

        SvgObject.fromNode(text, node);

        if(typeof node.$ != 'undefined'){
            if(typeof node.$.x != 'undefined'){
                text.x = parseInt(node.$.x);
            }
            if(typeof node.$.y != 'undefined'){
                text.y = parseInt(node.$.y);
            }
        }

        if(typeof node._ != 'undefined'){
            text.value = node._;
        }
    }

    return text;
};

module.exports.fromJson = function(json){
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