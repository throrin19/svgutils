'use strict';

var fs          = require('fs'),
    _           = require('underscore'),
    elements    = require(__dirname + '/objects/index');

var Parser = function(){};


Parser.convert = function(svg, callback){
    if(svg == null || typeof svg.svg == 'undefined' || svg.svg == null){
        callback(new Error("Your SVG is empty or invalid"));
        return;
    }

    var elements = this.parseNode(svg.svg);
    callback(null, elements);
};

Parser.parseNode = function(node){
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
            case 'rect' :
                nodes = _.union(nodes, self.parseRect(content));
                break;
            case 'text' :
                nodes = _.union(nodes, self.parseText(content));
                break;
        }
    });

    return nodes;
};

/**
 * Parse Group Elements Array
 *
 * @param {Array}   array               xml2js elements array
 * @returns {Array}                     Groups array
 */
Parser.parseGroup = function(array){
    var groups = [];

    _.each(array, function(item){
        groups.push(elements.Group.fromNode(item));
    });

    return groups;
};

/**
 * Parse Group Elements Array
 *
 * @param {Array}   array               xml2js elements array
 * @param {boolean} [isPolyline]        true : polyline. false : polygon. (default : false)
 * @returns {Array}                     Polygons array
 */
Parser.parsePolygon = function(array, isPolyline){
    var polygons = [];

    _.each(array, function(item){
        polygons.push(elements.Polygon.fromNode(item, isPolyline));
    });

    return polygons;
};

/**
 * Parse Rect Elements Array
 *
 * @param {Array}   array               xml2js elements array
 * @returns {Array}                     Rects array
 */
Parser.parseRect = function(array){
    var rects = [];

    _.each(array, function(item){
        rects.push(elements.Rect.fromNode(item));
    });

    return rects;
};

/**
 * Parse Text Elements Array
 *
 * @param {Array}   array               xml2js elements array
 * @returns {Array}                     Texts array
 */
Parser.parseText = function(array){
    var texts = [];

    _.each(array, function(item){
        texts.push(elements.Text.fromNode(item));
    });

    return texts;
};

module.exports = Parser;