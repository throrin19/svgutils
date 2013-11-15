"use strict";

var SvgObject = require(__dirname + "/svgobject");

var Rect = function(){
    SvgObject.call(this);
};

Rect.prototype          = new SvgObject();
Rect.prototype.type     = 'rect';
Rect.prototype.x        = 0;
Rect.prototype.y        = 0;
Rect.prototype.width    = 0;
Rect.prototype.height   = 0;
Rect.prototype.rx       = 0;
Rect.prototype.ry       = 0;

Rect.prototype.toJSON = function(){
    var parentJSON = SvgObject.prototype.toJSON.call(this);

    parentJSON.x        = this.x;
    parentJSON.y        = this.y;
    parentJSON.rx       = this.rx;
    parentJSON.ry       = this.ry;
    parentJSON.width    = this.width;
    parentJSON.height   = this.height;

    return parentJSON;
};

module.exports = Rect;

/**
 * Create Rect from SVG polygon|polyline node
 *
 * @param   {object}    node        xml2js node from SVG file
 * @returns {Rect}               the rect object
 */
module.exports.fromNode = function(node){
    var rect = new Rect();

    SvgObject.fromNode.call(this, node);

    if(typeof node != 'undefined' && typeof node.$ != 'undefined'){
        if(typeof node.$.x != 'undefined'){
            rect.x = node.$.x;
        }
        if(typeof node.$.y != 'undefined'){
            rect.y = node.$.y;
        }
        if(typeof node.$.rx != 'undefined'){
            rect.rx = node.$.rx;
        }
        if(typeof node.$.ry != 'undefined'){
            rect.ry = node.$.ry;
        }
        if(typeof node.$.width != 'undefined'){
            rect.width = node.$.width;
        }
        if(typeof node.$.height != 'undefined'){
            rect.height = node.$.height;
        }
    }

    return rect;
};

