var _       = require('underscore'),
    util    = require('util'),
    builder = require('xmlbuilder'),
    utils   = require(__dirname + '/../utils');

/**
 * @constructor
 */
var SvgObject = function(){};

SvgObject.prototype.classes   = [];
SvgObject.prototype.id        = "";
SvgObject.prototype.name      = "";
SvgObject.prototype.stroke    = "";
SvgObject.prototype.fill      = "";
SvgObject.prototype.style     = {};
SvgObject.prototype.transform = undefined;

/**
 * Set classes
 *
 * @param {string}  classes     Classes separate by space
 */
SvgObject.prototype.setClassesFromString = function(classes){
    this.classes = classes.split(" ");
};

/**
 * Set Stroke Color
 *
 * @param {string} stroke       Stroke Color (default : black)
 */
SvgObject.prototype.setStroke = function(stroke){
    this.stroke = stroke;
};

/**
 * Set Fill color
 *
 * @param {string} fill         Fill Color (default : black)
 */
SvgObject.prototype.setFill = function(fill){
    this.fill = fill;
};

/**
 * Set ID
 * @param {string} id           ID for element
 */
SvgObject.prototype.setId = function(id){
    this.id = id;
};

/**
 * Set Name
 * @param {string} name         Name
 */
SvgObject.prototype.setName = function(name){
    this.name = name;
};

/**
 * Set Transformation String
 * @param {string} transform    Transformation in SVG format
 */
SvgObject.prototype.setTransform = function(transform){
    this.transform = transform;
};

/**
 * Set Style
 *
 * @param {string} styleStr     Element style like the style html attribute value. Each styles are separate by ';'
 */
SvgObject.prototype.setStyleFromString = function(styleStr){
    var self = this;
    styleStr.split(';').forEach(function(line){
        if(line.length > 0){
            var style = line.split(':');
            self.style[style[0].replace(/^\s+|\s+$/g, '')] = style[1].replace(/^\s+|\s+$/g, '');
        }
    });
};

/**
 * Get the current Element BBox
 *
 * @returns {object}            Element bbox
 */
SvgObject.prototype.getBBox = function(){
    return {};
};

/**
 * Return JSON from object
 *
 * @returns {object}
 */
SvgObject.prototype.toJSON = function(){
    return {
        type    : this.type,
        classes : this.classes,
        id      : this.id,
        name    : this.name,
        stroke  : this.stroke,
        fill    : this.fill,
        style   : this.style
    }
};

SvgObject.prototype.toXml = function(){
    var xml = builder.create(this.type);

    var style = "";
    _.each(this.style, function(value, index){
        style += index + ":" + value + ";"
    });

    if(this.classes.length > 0)
        xml.att("class", this.classes.join(" "));
    if(typeof this.transform != 'undefined')
        xml.att("transform", this.transform);
    if(this.id.length > 0)
        xml.att("id", this.id);
    if(this.name.length > 0)
        xml.att("name", this.name);
    if(this.stroke.length > 0)
        xml.att("stroke", this.stroke);
    if(this.fill.length > 0)
        xml.att("fill", this.fill);

    xml.att("style", style);

    return xml;
};

SvgObject.prototype.toString = function(){
    return this.toXml().toString();
};

SvgObject.prototype.getBBox = function(callback){
    utils.loadSvg(this.toString(), this.type, callback);
};

module.exports = SvgObject;

/**
 * Generate SVGElement from SVG node
 *
 * @param {SvgObject}   object      SvgObject element (polygon|group|...
 * @param {object}      node        xml2js element
 */
module.exports.fromNode = function(object, node){
    if(typeof node != 'undefined' && typeof node.$ != 'undefined'){
        if(typeof node.$['class'] != 'undefined'){
            object.setClassesFromString(node.$['class']);
        }
        if(typeof node.$.id != 'undefined'){
            object.setId(node.$.id);
            object.setName(node.$.id);
        }
        if(typeof node.$.stroke != 'undefined'){
            object.setStroke(node.$.stroke);
        }
        if(typeof node.$.fill != 'undefined'){
            object.setFill(node.$.fill);
        }
        if(typeof node.$.style != 'undefined'){
            object.setStyleFromString(node.$.style);
        }
        if(typeof node.$.transform != 'undefined'){
            object.setTransform(node.$.transform);
        }
    }
};