"use strict";

var SvgObject = require(__dirname + "/svgobject"),
    utils     = require(__dirname + "/../matrix/utils");

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

Rect.prototype.getBBox = function(){
    return utils.bbox(this.x, this.y, this.width, this.height);
};

Rect.prototype.toXml = function(){
    var xml = SvgObject.prototype.toXml.call(this);

    xml.att('x', this.x);
    xml.att('y', this.y);
    xml.att('width', this.width);
    xml.att('height', this.height);
    xml.att('rx', this.rx);
    xml.att('ry', this.ry);

    return xml;
};

module.exports = Rect;

/**
 * Create Rect from SVG polygon|polyline node
 *
 * @param   {object}    node        xml2js node from SVG file
 * @returns {Rect}                  the rect object
 */
module.exports.fromNode = function(node){
    var rect = new Rect();

    SvgObject.fromNode.call(this, rect, node);

    if(typeof node != 'undefined' && typeof node.$ != 'undefined'){
        if(typeof node.$.x != 'undefined'){
            rect.x = parseInt(node.$.x);
        }
        if(typeof node.$.y != 'undefined'){
            rect.y = parseInt(node.$.y);
        }
        if(typeof node.$.rx != 'undefined'){
            rect.rx = parseInt(node.$.rx);
        }
        if(typeof node.$.ry != 'undefined'){
            rect.ry = parseInt(node.$.ry);
        }
        if(typeof node.$.width != 'undefined'){
            rect.width = parseInt(node.$.width);
        }
        if(typeof node.$.height != 'undefined'){
            rect.height = parseInt(node.$.height);
        }
    }

    return rect;
};

