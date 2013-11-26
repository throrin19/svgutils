var _       = require('underscore'),
    util    = require('util'),
    builder = require('xmlbuilder'),
    utils   = require(__dirname + '/../utils'),
    Matrix  = require(__dirname + '/../matrix/extends');

/**
 * @constructor
 */
var SvgObject = function(){
    this.classes = [];
    this.id = "";
    this.name = "";
    this.stroke = "";
    this.fill = "";
    this.style = {};
    this.transform = undefined;
    this.data = {};
};

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
SvgObject.prototype.toJSON = function(matrix){

    var json = {
        type : this.type
    };

    if(this.classes.length > 0)
        json.classes = this.classes;
    if(this.id != null && this.id != '')
        json.id = this.id;
    if(this.name != null && this.name != '')
        json.name = this.name;
    if(this.stroke != null && this.stroke != '')
        json.stroke = this.stroke;
    if(this.fill != null && this.fill != '')
        json.fill = this.fill;
    if(_.keys(this.style).lenght > 0)
        json.style = this.style;
    if(_.keys(this.data).lenght > 0)
        json.data = this.data;
    if(this.transform != null && this.transform != '')
        json.transform = this.transform;

    return json;
};

SvgObject.prototype.toXml = function(matrix){
    var xml = builder.create(this.type);

    var style = "";
    _.each(this.style, function(value, index){
        style += index + ":" + value + ";"
    });

    if(this.classes.length > 0)
        xml.att("class", this.classes.join(" "));
    if(typeof this.transform != 'undefined' && matrix != true)
        xml.att("transform", this.transform);
    if(this.id.length > 0)
        xml.att("id", this.id);
    if(this.name.length > 0)
        xml.att("name", this.name);
    if(this.stroke.length > 0)
        xml.att("stroke", this.stroke);
    if(this.fill.length > 0)
        xml.att("fill", this.fill);

    _.each(this.data, function(value, key){
        xml.att("data-" + key, typeof value == "string" ? value : JSON.stringify(value));
    });

    xml.att("style", style);

    return xml;
};

SvgObject.prototype.toString = function(){
    return this.toXml().toString();
};

SvgObject.prototype.getBBox = function(callback){
    utils.loadSvg(this.toString(), this.type, callback);
};

SvgObject.prototype.getCurrentMatrix = function(callback){
    var self = this;
    this.getBBox(function(bbox){
        callback(Matrix.fromElement(bbox, self));
    });
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
            object.data.id      = node.$.id;
            object.data.name    = node.$.name;
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
        _.each(node.$, function(value, index){
            var match = index.match(/(?:^|\s)data-(.*?)(?:$|\s)\b/);
            if(match){
                try{
                    object.data[match[1]] = JSON.parse(value);
                }catch(e){
                    object.data[match[1]] = value;
                }
            }
        });
    }
};

/**
 * Generate SVGElement from JSON element
 *
 * @param {SvgObject}   object      SvgObject element (polygon|group|...
 * @param {object}      json        json element
 */
module.exports.fromJson = function(object, json){
    if(typeof json != 'undefined'){
        if(typeof json.classes != 'undefined'){
            object.classes = json.classes;
        }
        if(typeof json.id != 'undefined'){
            object.id   = json.id;
            object.name = json.name;
        }
        if(typeof json.name != 'undefined'){
            object.name = json.name;
        }
        if(typeof json.stroke != 'undefined'){
            object.stroke = json.stroke;
        }
        if(typeof json.fill != 'undefined'){
            object.fill = json.fill;
        }
        if(typeof json.style != 'undefined'){
            object.style = json.style;
        }
        if(typeof json.transform != 'undefined'){
            object.transform = json.transform;
        }
        if(typeof json.data != 'undefined'){
            object.data = json.data;
        }
    }
};