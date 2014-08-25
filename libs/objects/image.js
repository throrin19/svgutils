var SvgObject   = require(__dirname + '/svgobject'),
    Matrix      = require(__dirname + '/../matrix/extends'),
    _           = require('underscore'),
    utils       = require(__dirname + '/../matrix/utils'),
    async       = require('async'),
    nUtil       = require('util');

var Img = function(){
    if (!(this instanceof Img))
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

nUtil.inherits(Img, SvgObject);

Img.prototype.setX = function setX(x) {
    this.x = x;
};
Img.prototype.setY = function setY(y) {
    this.y = y;
};
Img.prototype.setWidth = function setWidth(w) {
    this.width = w;
};
Img.prototype.setHeight = function setHeight(h) {
    this.height = h;
};
Img.prototype.setHref = function setHref(href) {
    this.href = href;
};
Img.prototype.setPreserveAspectRatio = function setPreserveAspectRatio(p) {
    this.preserveAspectRatio = p;
};

/**
 * Return JSON from object
 * @param   {boolean}    [matrix]       return transform attribute if false.
 * @returns {object}                    JSON Object
 */
Img.prototype.toJSON = function toJSON(matrix) {
    var parentJSON = SvgObject.prototype.toJSON.call(this, matrix);

    parentJSON.x                    = this.x;
    parentJSON.y                    = this.y;
    parentJSON.href                 = this.href;
    parentJSON.preserveAspectRatio  = this.preserveAspectRatio;
    parentJSON.width                = this.width;
    parentJSON.height               = this.height;

    return parentJSON;
};

/**
 * Return XML from object
 * @param   {boolean}    [matrix]       return transform attribute if false.
 * @returns {xmlBuilder}                XML Object
 */
Img.prototype.toXml = function toXml(matrix) {
    var xml = SvgObject.prototype.toXml.call(this, matrix);

    xml.att('x', this.x);
    xml.att('y', this.y);
    xml.att('xlink:href', this.href);
    xml.att('preserveAspectRatio', this.preserveAspectRatio);
    xml.att('width', this.width);
    xml.att('height', this.height);

    return xml;
};

/**
 * Get the element Bounding Box
 * @param {function} callback               Callback Function
 */
Img.prototype.getBBox = function getBBox(callback) {
    this.bbox = utils.bbox(this.x, this.y, this.width, this.height);
    callback(this.bbox);
};

module.exports = Img;

/**
 * Create Img from SVG image node
 *
 * @param   {object}    node        xml2js node from SVG file
 * @returns {Img}                 the Img object
 */
module.exports.fromNode = function fromNode(node) {
    var image = new Img();

    if (typeof node !== 'undefined' && typeof node.$ !== 'undefined') {
        SvgObject.fromNode(image, node);

        if (typeof node.$.x !== 'undefined') {
            image.x = parseFloat(node.$.x);
        }
        if (typeof node.$.y !== 'undefined') {
            image.y = parseFloat(node.$.y);
        }
        if (typeof node.$.width !== 'undefined') {
            image.width = parseFloat(node.$.width);
        }
        if (typeof node.$.height !== 'undefined') {
            image.height = parseFloat(node.$.height);
        }
        if (typeof node.$.href !== 'undefined') {
            image.href = node.$.href;
        }
        if (typeof node.$['xlink:href'] !== 'undefined') {
            image.href = node.$['xlink:href'];
        }
        if (typeof node.$.preserveAspectRatio !== 'undefined') {
            image.preserveAspectRatio = node.$.preserveAspectRatio;
        }
    }
    return image;
};

/**
 * Create Img from JSON element
 *
 * @param   {object}    json        json element
 * @returns {Img}                 the image object
 */
module.exports.fromJson = function fromJson(json){
    var image = new Img();

    if (typeof json != 'undefined') {
        SvgObject.fromJson(image, json);

        if (typeof json.x !== 'undefined') {
            image.x = json.x;
        }
        if (typeof json.y !== 'undefined') {
            image.y = json.y;
        }
        if (typeof json.width !== 'undefined') {
            image.width = json.width;
        }
        if (typeof json.height !== 'undefined') {
            image.height = json.height;
        }
        if (typeof json.href !== 'undefined') {
            image.href = json.href;
        }
        if (typeof json.preserveAspectRatio !== 'undefined') {
            image.preserveAspectRatio = json.preserveAspectRatio;
        }
    }
    return image;
};