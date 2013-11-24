"use strict";

var SvgObject   = require(__dirname + '/svgobject'),
    _           = require('underscore'),
    Tspan       = require(__dirname + '/tspan'),
    async       = require('async');

var Text = function(){
    SvgObject.call(this);
    this.type     = 'text';
    this.value    = "";
    this.x        = 0;
    this.y        = 0;
    this.childs   = [];
};

Text.prototype              = new SvgObject();
Text.prototype.constructor  = Text;


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
    //text.childs  = this.childs;

    async.each(this.childs, function(child, c){
        child.applyMatrix(matrix, function(tspan){
            text.childs.push(tspan);
            c();
        });
    }, function(){
        callback(text);
    });
};

module.exports = Text;

module.exports.fromNode = function(node){
    var text = new Text();

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