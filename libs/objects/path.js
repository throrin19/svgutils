"use strict";

var SvgObject = require(__dirname + "/svgobject"),
    utils     = require(__dirname + '/../matrix/utils'),
    nUtil     = require('util');

var Path = function(){
    if (!(this instanceof Path))
        throw 'this function in a constructor. Use new to call it';

    SvgObject.call(this);
    this.type   = 'path';
    this.d      = "";
};

nUtil.inherits(Path, SvgObject);

/**
 * Set the path draw command (attribute d)
 * @param   {string}        d           The draw command
 */
Path.prototype.setD = function setD(d) {
    this.d = d;
};

/**
 * Convert Path element to JSON element
 * @param   {boolean}       [matrix]       return transform attribute if false.
 * @returns {object}                        JSON representation of Path element
 */
Path.prototype.toJSON = function toJSON(matrix){
    var parentJSON = SvgObject.prototype.toJSON.call(this, matrix);

    parentJSON.d = this.d;

    return parentJSON;
};

/**
 * Convert Path Element to xml object
 * @param       {boolean}    [matrix]       return transform attribute if false.
 * @returns     {xmlBuilder}                XML Object
 */
Path.prototype.toXml = function toXml(matrix) {
    var xml = SvgObject.prototype.toXml.call(this, matrix);

    xml.att('d', this.d);

    return xml;
};

module.exports = Path;