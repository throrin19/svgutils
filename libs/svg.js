"use strict";

var fs          = require('fs'),
    xml2js      = require('xml2js'),
    _           = require('underscore'),
    SvgParser   = require(__dirname + '/parser'),
    builder     = require('xmlbuilder');

var Svg = function(){};

Svg.prototype.elements = [];

Svg.prototype.setElements = function(elements){
    this.elements = elements;
};

Svg.prototype.addElement = function(element){
    this.elements.push(element);
};

Svg.prototype.toJSON = function(matrix){
    var json = {
        elements : []
    };

    _.each(this.elements, function(element){
        json.elements.push(element.toJSON());
    });

    return json;
};

Svg.prototype.toXml = function(matrix){
    var xml = builder.create('svg');
    xml.att('version', '1.1');
    xml.att('xmlns', 'http://www.w3.org/2000/svg');

    _.each(this.elements, function(element){
        xml.children.push(element.toXml());
    });

    return xml;
};

Svg.prototype.toString = function(matrix){
    return this.toXml(matrix).toString();
};

module.exports = Svg;

module.exports.fromSvgDocument = function(path, callback){
    fs.readFile(path, function(error, data){
        if(error){
            callback(error);
            return;
        }
        Svg.fromString(data.toString(), callback);
    });
};

module.exports.fromString = function(string, callback){
    var parser  = new xml2js.Parser(),
        self    = this;

    parser.addListener('end', function(result) {
        SvgParser.convert(result, function(err, elements){
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