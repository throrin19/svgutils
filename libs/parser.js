'use strict';

var fs      = require('fs'),
    xml2js  = require('xml2js'),
    _       = require('underscore');

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

module.exports = Parser;

/**
 * Read SVG File, set _svgContent and  return the content into callback
 *
 * @param {string}      path            SVG FilePath
 * @param {function}    callback        Callback Function
 */
module.exports.prototype.parseFile = function(path, callback){

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

module.exports.prototype._convert = function(callback){
    if(this._svg == null || typeof this._svg.svg == 'undefined' || this._svg.svg == null){
        callback(new Error("Your SVG is empty or invalid"));
        return;
    }

    this._parseNode(this._svg.svg, true);
    callback();
};

module.exports.prototype._parseNode = function(node, ignoreAttributes){
    var nodeObj = {},
        self    = this;

    nodeObj.childs = [];

    _.each(node, function(content, index){
        switch(index){
            case 'g' :
                var objs = self._parseGroup(content);
                nodeObj.childs.push(objs);
                break;
            case 'polygon' :
                console.log(content);
                var obj = self._parseNode(content);
                nodeObj.childs.push(obj);
                break;
        }
    });

    return nodeObj;
};

module.exports.prototype._parseGroup = function(group){
    var objs = [],
        self = this;

    _.each(group, function(object){
        objs.push(self._parseNode(object));
    });

    return objs;
};