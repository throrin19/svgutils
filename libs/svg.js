"use strict";

var fs          = require('fs'),
    xml2js      = require('xml2js'),
    _           = require('underscore'),
    builder     = require('xmlbuilder'),
    async       = require('async'),
    SvgParser   = require(__dirname + '/parser'),
    Matrix      = require(__dirname + '/matrix/extends');

var Svg = function(){};

Svg.prototype.elements = [];

/**
 * Set Svg Elements
 * @param {Array}       elements            SvgObject Array (rect|polygon|polyline|...)
 */
Svg.prototype.setElements = function(elements){
    this.elements = elements;
};

/**
 * Add SvgObject element to current SVG
 * @param {SvgObject}   element             SvgObject Element
 */
Svg.prototype.addElement = function(element){
    this.elements.push(element);
};

/**
 * Convert Svg to Json format
 * @param {boolean}     matrix              String representation without transform attribute
 * @returns {object}                        Svg Json Object representation
 */
Svg.prototype.toJSON = function(matrix){
    if(typeof matrix == 'undefined') matrix = false;

    var json = {
        elements : []
    };

    _.each(this.elements, function(element){
        json.elements.push(element.toJSON(matrix));
    });

    return json;
};

/**
 * Convert Svg to Xml format
 * @param {boolean}     matrix              String representation without transform attribute
 * @returns {object}                        XMLBuilder Svg representation
 */
Svg.prototype.toXml = function(matrix){
    if(typeof matrix == 'undefined') matrix = false;

    var xml = builder.create('svg');
    xml.att('version', '1.1');
    xml.att('xmlns', 'http://www.w3.org/2000/svg');

    _.each(this.elements, function(element){
        xml.importXMLBuilder(element.toXml(matrix));
    });

    return xml;
};

/**
 * Convert SVG to String :
 *     '<svg>...</svg>'
 * @param {boolean}     content             true : return only svg content, false : return all svg in <svg> tag
 * @param {boolean}     matrix              String representation without transform attribute
 * @returns {string}                        Svg String representation
 */
Svg.prototype.toString = function(content, matrix){
    if(typeof matrix == 'undefined') matrix = false;

    if(content == true)
        return this.toXml(matrix).toString();
    else{
        var string = '';
        _.each(this.elements, function(element){
            string += element.toXml(matrix).toString();
        });
        return string;
    }
};

/**
 * Find elements in SVG and return new Svg object with all elements by selected type
 *
 * @param   {string}    type                Selected type (rect|polygon|g|...)
 * @param   {boolean}   all                 true : find all type in groups and root, false : find only in root
 * @returns {Svg}                           new Svg object with selected types elements
 */
Svg.prototype.findByType = function(type, all){
    var svg = new Svg();

    _.each(this.elements, function(elem){
        if(elem.type == type)
            svg.addElement(elem);

        if(all && elem.type == 'g'){
            var group = elem.findByType(type, all);
            _.each(group.childs, function(child){
                svg.addElement(child);
            });
        }
    });

    return svg;
};

/**
 * Generate new Svg element with all applied matrix to all elements.
 * Convert rect into polygon
 * @param {function}    callback            Callback Function
 */
Svg.prototype.applyMatrix = function(callback){
    var svg = new Svg();

    async.each(this.elements, function(elem, c){
        elem.getBBox(function(bbox){
            var matrix = Matrix.fromElement(bbox, elem);
            elem.applyMatrix(matrix, function(e){
                svg.addElement(e);
                c();
            });
        });
    }, function(){
        callback(svg);
    });
};

module.exports = Svg;

/**
 * Create Svg from Svg Document
 * @param {string}      path                Uri of source file
 * @param {function}    callback            Callback Function
 */
module.exports.fromSvgDocument = function(path, callback){
    fs.readFile(path, function(error, data){
        if(error){
            callback(error);
            return;
        }
        Svg.fromXmlString(data.toString(), callback);
    });
};

/**
 * Create Svg from Xml String representation
 * @param {string}      string              Svg string representation
 * @param {function}    callback            Callback Function
 */
module.exports.fromXmlString = function(string, callback){
    var parser  = new xml2js.Parser();

    parser.addListener('end', function(result) {
        SvgParser.convertXml(result, function(err, elements){
            if(err){
                callback(err);
                return;
            }

            var svg = new Svg();
            svg.setElements(elements);
            callback(null, svg);
        });
    });

    parser.parseString(string);
};


module.exports.fromJsonFile = function(path, callback){
    fs.readFile(path, function(error, data){
        if(error){
            callback(error);
            return;
        }
        Svg.fromJsonString(data.toString(), callback);
    });
};

module.exports.fromJsonString = function(string, callback){
    var json = JSON.parse(string);

    SvgParser.convertJson(json, function(err, elements){
        if(err){
            callback(err);
            return;
        }

        var svg = new Svg();
        svg.setElements(elements);
        callback(null, svg);
    });
};