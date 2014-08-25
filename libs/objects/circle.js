var SvgObject   = require(__dirname + '/svgobject'),
    Matrix      = require(__dirname + '/../matrix/extends'),
    _           = require('underscore'),
    utils       = require(__dirname + '/../matrix/utils'),
    async       = require('async'),
    nUtil       = require('util');

var Circle = function() {
    if (!(this instanceof Circle))
        throw 'this function in a constructor. Use new to call it';

    SvgObject.call(this);
    this.type   = 'circle';
    this.cx     = 0;
    this.cy     = 0;
    this.r      = 0;
};

nUtil.inherits(Circle, SvgObject);

/**
 * Get Center x value
 * @returns {number}
 */
Circle.prototype.getCx = function getCx() {
    return this.cx;
};

/**
 * Get Center y value
 * @returns {number}
 */
Circle.prototype.getCy = function getCy() {
    return this.cy;
};

/**
 * Get circle's radius
 * @return {number}
 */
Circle.prototype.getRadius = function getRadius() {
    return this.r;
};

/**
 * Set Cx coordinate
 * @param {number}      cx      cx coordinate
 */
Circle.prototype.setCx = function setCx(cx) {
    this.cx = cx;
};

/**
 * Set Cy coordinate
 * @param {number}      cy      cy coordinate
 */
Circle.prototype.setCy = function setCy(cy) {
    this.cy = cy;
};

/**
 * Set Radius
 * @param {number}      r      radius
 */
Circle.prototype.setRadius = function setRadius(r) {
    this.r = r;
};

/**
 * Return JSON from object
 * @param   {boolean}    [matrix]       return transform attribute if false.
 * @returns {object}                    JSON Object
 */
Circle.prototype.toJSON = function(matrix){
    var parentJSON = SvgObject.prototype.toJSON.call(this, matrix);

    parentJSON.cx   = this.cx;
    parentJSON.cy   = this.cy;
    parentJSON.r    = this.r;

    return parentJSON;
};

/**
 * Return XML from object
 * @param   {boolean}    [matrix]       return transform attribute if false.
 * @returns {xmlBuilder}                XML Object
 */
Circle.prototype.toXml = function toXml(matrix) {
    var xml = SvgObject.prototype.toXml.call(this, matrix);

    xml.att('cx', this.cx);
    xml.att('cy', this.cy);
    xml.att('r', this.r);

    return xml;
};

/**
 * Get the element Bounding Box
 * @param {function} callback           Callback Function
 */
Circle.prototype.getBBox = function getBBox(callback) {
    this.bbox = utils.bbox(this.cx - this.r, this.cy - this.r, this.r*2, this.r*2);
    callback(this.bbox);
};

/**
 * Get the element innerBox
 * @param {function} callback               Callback function
 */
Circle.prototype.getInnerBox = function getInnerBox(callback) {
    // @todo verify calcul
    var diff = this.r*2 - Math.sqrt(2)*this.r;

    callback({
        x       : this.cx - diff,
        y       : this.cy - diff,
        width   : this.r - diff,
        height  : this.r - diff
    });
};

module.exports = Circle;

/**
 * Create Circle from SVG image node
 *
 * @param   {object}    node            xml2js node from SVG file
 * @returns {Circle}                    the Circle object
 */
module.exports.fromNode = function fromNode(node) {
    var circle = new Circle();

    if (typeof node !== 'undefined' && typeof node.$ !== 'undefined') {
        SvgObject.fromNode(circle, node);

        if (typeof node.$.cx !== 'undefined') {
            circle.cx = parseFloat(node.$.cx);
        }
        if (typeof node.$.cy !== 'undefined') {
            circle.cy = parseFloat(node.$.cy);
        }
        if (typeof node.$.r !== 'undefined') {
            circle.r = parseFloat(node.$.r);
        }
    }
    return circle;
};

/**
 * Create Circle from JSON element
 *
 * @param   {object}    json        json element
 * @returns {Circle}                the Circle object
 */
module.exports.fromJson = function fromJson(json){
    var circle = new Circle();

    if (typeof json !== 'undefined') {
        SvgObject.fromJson(circle, json);

        if (typeof json.cx !== 'undefined') {
            circle.cx = json.cx;
        }
        if (typeof json.cy !== 'undefined') {
            circle.cy = json.cy;
        }
        if (typeof json.r !== 'undefined') {
            circle.r = json.r;
        }
    }
    return circle;
};