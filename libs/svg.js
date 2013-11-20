"use strict";

var fs          = require('fs'),
    xml2js      = require('xml2js'),
    _           = require('underscore'),
    SvgParser   = require(__dirname + '/parser');

var Svg = function(){};

Svg.prototype.elements = [];

Svg.prototype.setElements = function(elements){
    this.elements = elements;
};

Svg.prototype.addElement = function(element){
    this.elements.push(element);
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