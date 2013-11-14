'use strict';

var fs      = require('fs'),
    xml2js  = require('xml2js'),
    _       = require('underscore'),
    Polygon = require(__dirname + '/objects/polygon'),
    Group   = require(__dirname + '/objects/group');

/**
 * Create SVG Parser
 * @constructor
 */
var Parser = function(){};

/**
 * SVG Content file
 * @private
 */
Parser.prototype._svg = null;

/**
 * Read SVG File, set _svgContent and  return the content into callback
 *
 * @param {string}      path            SVG FilePath
 * @param {function}    callback        Callback Function
 */
Parser.prototype.parseFile = function(path, callback){

    var parser  = new xml2js.Parser(),
        self    = this;

    parser.addListener('end', function(result) {
        self._svg = result;
        self._convert(callback);
    });

    fs.readFile(path, function(error, data){
        if(error){
            callback(error);
            return;
        }
        parser.parseString(data);
    });
};

Parser.prototype._convert = function(callback){
    if(this._svg == null || typeof this._svg.svg == 'undefined' || this._svg.svg == null){
        callback(new Error("Your SVG is empty or invalid"));
        return;
    }

    var elements = this.parseNode(this._svg.svg);
    callback(null, elements);
};

Parser.prototype.parseNode = function(node){
    var nodes = [],
        self    = this;

    _.each(node, function(content, index){
        switch(index){
            case 'g' :
                nodes = _.union(nodes, self.parseGroup(content));
                break;
            case 'polygon' :
                nodes = _.union(nodes, self.parsePolygon(content));
                break;
            case 'polyline' :
                nodes = _.union(nodes, self.parsePolygon(content, true));
                break;
        }
    });

    return nodes;
};

/**
 * Parse Group Elements Array
 *
 * @param {Array} array         xml2js elements array
 * @returns {Array}             Groups array
 */
Parser.prototype.parseGroup = function(array){
    var groups = [];

    _.each(array, function(item){
        groups.push(Group.fromNode(item));
    });

    return groups;
};

Parser.prototype.parsePolygon = function(array, isPolyline){
    var polygons = [];

    _.each(array, function(item){
        polygons.push(Polygon.fromNode(item, isPolyline));
    });

    return polygons;
};

module.exports = Parser;