"use strict";

var SvgObject   = require(__dirname + '/svgobject'),
    _           = require('underscore'),
    Tspan       = require(__dirname + '/tspan'),
    utils       = require(__dirname + '/../matrix/utils'),
    async       = require('async'),
    nUtil       = require('util');

var Text = function(){
    if (!(this instanceof Text))
        throw 'this function in a constructor. Use new to call it';

    SvgObject.call(this);
    this.type     = 'text';
    this.value    = "";
    this.x        = 0;
    this.y        = 0;
    this.childs   = [];
};

nUtil.inherits(Text, SvgObject);

/**
 * Set X origin
 * @param {number} x            X origin
 */
Text.prototype.setX = function setX(x){
    this.x = x;
};

/**
 * Set Y origin
 * @param {number} y            y origin
 */
Text.prototype.setY = function setY(y){
    this.y = y;
};

/**
 * Set Text Value
 * @param {string} string       Text value
 */
Text.prototype.setValue = function setValue(string){
    this.value = string;
};

/**
 * Set Text children
 * @param {Array} childs        Tspan Array
 */
Text.prototype.setChildren = function setChildren(childs){
    this.childs = childs;
};

/**
 * Get X origin
 * @returns {number}
 */
Text.prototype.getX = function getX(){
    return this.x;
};

/**
 * Get Y origin
 * @returns {number}
 */
Text.prototype.getY = function getY(){
    return this.y;
};

/**
 * Get Tspan Value
 * @returns {string}
 */
Text.prototype.getValue = function getValue(){
    return this.value;
};

/**
 * Get Text children
 * @returns {Array}
 */
Text.prototype.getChildren = function getChildren(){
    return this.childs;
}

/**
 * Add Tspan child
 * @param {Tspan} child         Tspan child
 */
Text.prototype.addChild = function addChild(child){
    this.childs.push(child);
};

/**
 * Return JSON from object
 * @param   {boolean}    [matrix]       return transform attribute if false.
 * @returns {object}                    JSON Object
 */
Text.prototype.toJSON = function toJSON(matrix){
    var parentJSON = SvgObject.prototype.toJSON.call(this, matrix);

    parentJSON.value    = this.value;
    parentJSON.x        = this.x;
    parentJSON.y        = this.y;

    parentJSON.childs = [];

    _.each(this.childs, function(child){
        parentJSON.childs.push(child.toJSON());
    });

    return parentJSON;
};

/**
 * Return XML from object
 * @param   {boolean}    [matrix]       return transform attribute if false.
 * @returns {xmlBuilder}                XML Object
 */
Text.prototype.toXml = function toXml(matrix){
    var xml = SvgObject.prototype.toXml.call(this, matrix);

    xml.att('x', this.x + 'px');
    xml.att('y', this.y + 'px');
    xml.txt(this.value);

    _.each(this.childs, function(child){
        xml.importXMLBuilder(child.toXml());
    });

    return xml;
};

/**
 * Apply param Matrix and callback new SvgObject with this matrix
 * @param {object}      matrix          Matrix to apply
 * @param {function}    callback        Callback Function
 */
Text.prototype.applyMatrix = function applyMatrix(matrix, callback){
    var text = new Text();
    text.style   = this.style;
    text.classes = this.classes;
    text.id      = this.id;
    text.name    = this.name;
    text.stroke  = this.stroke;
    text.fill    = this.fill;
    text.type    = this.type;
    text.value   = this.value;
    text.x       = matrix.x(this.x, this.y);
    text.y       = matrix.y(this.x, this.y);
    text.data    = this.data;

    async.each(this.childs, function(child, c){
        child.applyMatrix(matrix, function(tspan){
            text.childs.push(tspan);
            c();
        });
    }, function(){
        callback(text);
    });
};

/**
 * Get the element Bounding Box
 * @param {function} callback               Callback Function
 */
Text.prototype.getBBox = function getBBox(callback){
    this.bbox = utils.bbox(this.x, this.y, 9, 30); // ok, it's not true but, it's ok for basic short text with basic police
    callback(this.bbox);
};

module.exports = Text;

/**
 * Generate SVGElement from SVG node
 * @param {object}      node        xml2js element
 */
module.exports.fromNode = function fromNode(node){
    var text = new Text();

    SvgObject.fromNode(text, node);

    if(typeof node != 'undefined'){
        if(typeof node.$ != 'undefined'){
            if(typeof node.$.x != 'undefined'){
                text.x = parseFloat(node.$.x);
            }
            if(typeof node.$.y != 'undefined'){
                text.y = parseFloat(node.$.y);
            }
        }

        if(typeof node._ != 'undefined'){
            text.value  = node._;

            if(_.isEmpty(text.id)){
                text.setId(node._.replace(/[`~!@#$%^&*()|+\=?;:'",<>\{\}\[\]\\\/ ]/img,''));
            }
        }

        if(typeof node.tspan != 'undefined'){
            // we are children
            _.each(node.tspan, function(tspan){
                text.childs.push(Tspan.fromNode(tspan));
            });
        }
    }

    return text;
};

/**
 * Generate SVGElement from JSON element
 * @param {object}      json        json element
 */
module.exports.fromJson = function fromJson(json){
    var text = new Text();

    if(typeof json != 'undefined'){
        SvgObject.fromJson(text, json);

        if(typeof json.value != 'undefined'){
            text.value = json.value;

            if(_.isEmpty(text.id)){
                text.setId(json.value.replace(/[`~!@#$%^&*()|+\=?;:'",.<>\{\}\[\]\\\/ ]/img,''));
            }
        }
        if(typeof json.x != 'undefined'){
            text.x = json.x;
        }
        if(typeof json.y != 'undefined'){
            text.y = json.y;
        }
        if(typeof json.childs != 'undefined'){
            _.each(json.childs, function(tspan){
                text.childs.push(Tspan.fromJson(tspan));
            });
        }
    }

    return text;
};