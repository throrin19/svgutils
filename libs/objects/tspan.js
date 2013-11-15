"use strict";

var SvgObject   = require(__dirname + '/svgobject');

var Tspan = function(){
    SvgObject.call(this);
};

Tspan.prototype          = new SvgObject();
Tspan.prototype.type     = 'tspan';
Tspan.prototype.value    = "";
Tspan.prototype.x        = 0;
Tspan.prototype.y        = 0;

module.exports = Tspan;

module.exports.fromNode = function(node){
    var text = new Tspan();

    SvgObject.fromNode.call(this, node);

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