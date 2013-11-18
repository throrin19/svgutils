"use strict";

var SvgObject   = require(__dirname + '/svgobject'),
    _           = require('underscore'),
    Tspan       = require(__dirname + '/tspan');

var Text = function(){
    SvgObject.call(this);
};

Text.prototype          = new SvgObject();
Text.prototype.type     = 'text';
Text.prototype.value    = "";
Text.prototype.x        = 0;
Text.prototype.y        = 0;
Text.prototype.childs   = [];

Text.prototype.toJSON = function(){
    var parentJSON = SvgObject.prototype.toJSON.call(this);

    parentJSON.value    = this.value;
    parentJSON.x        = this.x;
    parentJSON.y        = this.y;

    parentJSON.childs = [];

    _.each(this.childs, function(child){
        parentJSON.childs.push(child.toJSON());
    });

    return parentJSON;
};

Text.prototype.toXml = function(){
    var xml = SvgObject.prototype.toXml.call(this);

    xml.att('x', this.x);
    xml.att('y', this.y);
    xml.txt(this.value);

    _.each(this.childs, function(child){
        xml.children.push(child);
    });

    return xml;
};

module.exports = Text;

module.exports.fromNode = function(node){
    var text = new Text();

    SvgObject.fromNode.call(this, text, node);

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