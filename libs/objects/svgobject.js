var _ = require('underscore'),
    util = require('util');

/**
 * @constructor
 */
var SvgObject = function(){};

SvgObject.prototype.classes   = [];
SvgObject.prototype.id        = "";
SvgObject.prototype.name      = "";
SvgObject.prototype.stroke    = "black";
SvgObject.prototype.fill      = "black";
SvgObject.prototype.style     = {};

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
 * Return JSON from object
 *
 * @returns {object}
 */
SvgObject.prototype.toJSON = function(){
    return {
        classes : this.classes,
        id      : this.id,
        name    : this.name,
        stroke  : this.stroke,
        fill    : this.fill,
        style   : this.style
    }
};

module.exports = SvgObject;