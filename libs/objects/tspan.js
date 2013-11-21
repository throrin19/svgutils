"use strict";

var SvgObject   = require(__dirname + '/svgobject');

var Tspan = function(){
    SvgObject.call(this);
    this.type     = 'tspan';
    this.value    = "";
    this.x        = 0;
    this.y        = 0;
};

Tspan.prototype             = new SvgObject();
Tspan.prototype.constructor = Tspan;


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

    callback(tspan);
};

module.exports = Tspan;

module.exports.fromNode = function(node){
    var text = new Tspan();

    SvgObject.fromNode(text, node);

    if(typeof node != 'undefined'){
        if(typeof node.$ != 'undefined'){
            if(typeof node.$.x != 'undefined'){
                text.x = node.$.x;
            }
            if(typeof node.$.y != 'undefined'){
                text.y = node.$.y;
            }
        }

        if(typeof node._ != 'undefined'){
            text.value = node._;
        }
    }

    return text;
};