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
 *
 * @param {number} x            X origin
 */
Text.prototype.setX = function(x){
    this.x = x;
};

/**
 * Set Y origin
 *
 * @param {number} y            y origin
 */
Text.prototype.setY = function(y){
    this.y = y;
};

/**
 * Set Text Value
 *
 * @param {string} string       Text value
 */
Text.prototype.setValue = function(string){
    this.value = string;
};

/**
 * Set Text children
 *
 * @param {Array} childs        Tspan Array
 */
Text.prototype.setChildren = function(childs){
    this.childs = childs;
};

/**
 * Add Tspan child
 *
 * @param {Tspan} child         Tspan child
 */
Text.prototype.addChild = function(child){
    this.childs.push(child);
};

Text.prototype.toJSON = function(matrix){
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

Text.prototype.toXml = function(matrix){
    var xml = SvgObject.prototype.toXml.call(this, matrix);

    xml.att('x', this.x + 'px');
    xml.att('y', this.y + 'px');
    xml.txt(this.value);

    _.each(this.childs, function(child){
        xml.importXMLBuilder(child.toXml());
    });

    return xml;
};

Text.prototype.applyMatrix = function(matrix, callback){
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

Text.prototype.getBBox = function(callback){
    this.bbox = utils.bbox(this.x, this.y, 9, 30); // ok, it's not true but, it's ok for basic short text with basic police
    callback(this.bbox);
};

module.exports = Text;

module.exports.fromNode = function(node){
    var text = new Text();

    SvgObject.fromNode(text, node);

    if(typeof node != 'undefined'){
        if(typeof node.$ != 'undefined'){
            if(typeof node.$.x != 'undefined'){
                text.x = parseInt(node.$.x);
            }
            if(typeof node.$.y != 'undefined'){
                text.y = parseInt(node.$.y);
            }
        }

        if(typeof node._ != 'undefined'){
            text.value  = node._;

            if(_.isEmpty(text.id)){
                text.setId(node._.replace(/[`~!@#$%^&*()|+\=?;:'",.<>\{\}\[\]\\\/ ]/img,''));
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

module.exports.fromJson = function(json){
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