var SvgObject   = require(__dirname + '/svgobject'),
    Matrix      = require(__dirname + '/../matrix/extends'),
    _           = require('underscore'),
    utils       = require(__dirname + '/../matrix/utils'),
    async       = require('async');

var Image = function(){
    if (!(this instanceof Image))
        throw 'this function in a constructor. Use new to call it';

    SvgObject.call(this);
    this.type = 'image';
    this.href = '';
    this.x = 0;
    this.y = 0;
    this.preserveAspectRatio = 'none';
    this.width = 0;
    this.height = 0;
};

Image.prototype              = new SvgObject();
Image.prototype.constructor  = Image;

Image.prototype.setX = function(x){
    this.x = x;
};
Image.prototype.setY = function(y){
    this.y = y;
};
Image.prototype.setWidth = function(w){
    this.width = w;
};
Image.prototype.setHeight = function(h){
    this.height = h;
};
Image.prototype.setHref = function(href){
    this.href = href;
};
Image.prototype.setPreserveAspectRatio = function(p){
    this.preserveAspectRatio = p;
};


Image.prototype.toJSON = function(matrix){
    var parentJSON = SvgObject.prototype.toJSON.call(this, matrix);

    parentJSON.x                    = this.x;
    parentJSON.y                    = this.y;
    parentJSON.href                 = this.href;
    parentJSON.preserveAspectRatio  = this.preserveAspectRatio;
    parentJSON.width                = this.width;
    parentJSON.height               = this.height;

    return parentJSON;
};

Image.prototype.toXml = function(matrix){
    var xml = SvgObject.prototype.toXml.call(this, matrix);

    xml.att('x', this.x);
    xml.att('y', this.y);
    xml.att('xlink:href', this.href);
    xml.att('preserveAspectRatio', this.preserveAspectRatio);
    xml.att('width', this.width);
    xml.att('height', this.height);

    return xml;
};

Image.prototype.getBBox = function(callback){
    this.bbox = utils.bbox(this.x, this.y, this.width, this.height);
    callback(this.bbox);
};

module.exports = Image;

/**
 * Create Image from SVG image node
 *
 * @param   {object}    node        xml2js node from SVG file
 * @returns {Image}                 the rect object
 */
module.exports.fromNode = function(node){
    var image = new Image();

    if(typeof node != 'undefined' && typeof node.$ != 'undefined'){
        SvgObject.fromNode(image, node);

        if(typeof node.$.x != 'undefined'){
            image.x = parseInt(node.$.x);
        }
        if(typeof node.$.y != 'undefined'){
            image.y = parseInt(node.$.y);
        }
        if(typeof node.$.width != 'undefined'){
            image.width = parseInt(node.$.width);
        }
        if(typeof node.$.height != 'undefined'){
            image.height = parseInt(node.$.height);
        }
        if(typeof node.$.href != 'undefined'){
            image.href = node.$.href;
        }
        if(typeof node.$.preserveAspectRatio != 'undefined'){
            image.preserveAspectRatio = node.$.preserveAspectRatio;
        }
    }
    return image;
};

/**
 * Create Image from JSON element
 *
 * @param   {object}    json        json element
 * @returns {Image}                 the image object
 */
module.exports.fromJson = function(json){
    var image = new Image();

    if(typeof json != 'undefined'){
        SvgObject.fromJson(rect, json);

        if(typeof json.x != 'undefined'){
            image.x = json.x;
        }
        if(typeof json.y != 'undefined'){
            image.y = json.y;
        }
        if(typeof json.width != 'undefined'){
            image.width = json.width;
        }
        if(typeof json.height != 'undefined'){
            image.height = json.height;
        }
        if(typeof json.href != 'undefined'){
            image.href = json.href;
        }
        if(typeof json.preserveAspectRatio != 'undefined'){
            image.preserveAspectRatio = json.preserveAspectRatio;
        }
    }

    return image;
};