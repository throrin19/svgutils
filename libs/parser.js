'use strict';

var fs          = require('fs'),
    _           = require('underscore'),
    elements    = require(__dirname + '/objects/index');

var Parser = function(){};

/**
 * Convert Svg file into Svg object
 * @param {object}      svg                 xml2js object
 * @param {function}    callback            Callback function
 */
Parser.convertXml = function(svg, callback){
    if(svg == null || typeof svg.svg == 'undefined' || svg.svg == null){
        callback(new Error("Your SVG is empty or invalid"));
        return;
    }

    var elements = Parser.parseXmlNode(svg.svg);
    callback(null, elements);
};

/**
 * Convert JSON file into Svg object
 * @param {object}      json                json object
 * @param {function}    callback            Callback function
 */
Parser.convertJson = function(json, callback){
    if(typeof json.elements == 'undefined' || json.elements.length == 0){
        callback(new Error("Your SVG is empty or invalid"));
        return;
    }

    var elements = Parser.parseJson(json.elements);
    callback(null, elements);
};

/**
 * Parse svg possibles nodes : <rect>, <g>, ...
 * @param {object}      node                xml2js node
 * @returns {Array}                         node elements convert to SvgObject type
 */
Parser.parseXmlNode = function(node){
    var nodes = [];

    _.each(node, function(content, index){
        switch(index){
            case 'g' :
                nodes = _.union(nodes, Parser.parseXmlGroup(content));
                break;
            case 'polygon' :
                nodes = _.union(nodes, Parser.parseXmlPolygon(content));
                break;
            case 'polyline' :
                nodes = _.union(nodes, Parser.parseXmlPolygon(content, true));
                break;
            case 'rect' :
                nodes = _.union(nodes, Parser.parseXmlRect(content));
                break;
            case 'text' :
                nodes = _.union(nodes, Parser.parseXmlText(content));
                break;
        }
    });

    return nodes;
};

/**
 * Parse json elements
 * @param {Array}      elements               xml2js node
 * @returns {Array}                           node elements convert to SvgObject type
 */
Parser.parseJson = function(elements){
    var nodes = [];

    _.each(elements, function(element){
        switch(element.type){
            case 'g' :
                nodes.push(Parser.parseJsonGroup(element));
                break;
            case 'polygon' :
                nodes.push(Parser.parseJsonPolygon(element));
                break;
            case 'polyline' :
                nodes.push(Parser.parseJsonPolygon(element, true));
                break;
            case 'rect' :
                nodes.push(Parser.parseJsonRect(element));
                break;
            case 'text' :
                nodes.push(Parser.parseJsonText(element));
                break;
        }
    });

    return nodes;
};

/**
 * Parse Group Elements Array
 * @param {Array}   array                   xml2js elements array
 * @returns {Array}                         Groups array
 */
Parser.parseXmlGroup = function(array){
    var groups = [];

    _.each(array, function(item){
        groups.push(elements.Group.fromNode(item));
    });

    return groups;
};

/**
 * Parse Group json element
 * @param {object}  elem                    Group element in JSON format
 * @returns {object}                        Group object
 */
Parser.parseJsonGroup = function(elem){
    return elements.Group.fromJson(elem);
};

/**
 * Parse Group Elements Array
 * @param {Array}       array               xml2js elements array
 * @param {boolean}     [isPolyline]        true : polyline. false : polygon. (default : false)
 * @returns {Array}                         Polygons array
 */
Parser.parseXmlPolygon = function(array, isPolyline){
    var polygons = [];

    _.each(array, function(item){
        polygons.push(elements.Polygon.fromNode(item, isPolyline));
    });

    return polygons;
};

/**
 * Parse Polygon json element
 * @param {object}  elem                    Polygon element in JSON format
 * @returns {object}                        Polygon object
 */
Parser.parseJsonPolygon = function(elem){
    return elements.Polygon.fromJson(elem);
};

/**
 * Parse Rect Elements Array
 * @param {Array}       array               xml2js elements array
 * @returns {Array}                         Rects array
 */
Parser.parseXmlRect = function(array){
    var rects = [];

    _.each(array, function(item){
        rects.push(elements.Rect.fromNode(item));
    });

    return rects;
};

/**
 * Parse Rect json element
 * @param {object}  elem                    Rect element in JSON format
 * @returns {object}                        Rect object
 */
Parser.parseJsonRect = function(elem){
    return elements.Rect.fromJson(elem);
};

/**
 * Parse Text Elements Array
 * @param {Array}       array               xml2js elements array
 * @returns {Array}                         Texts array
 */
Parser.parseXmlText = function(array){
    var texts = [];

    _.each(array, function(item){
        texts.push(elements.Text.fromNode(item));
    });

    return texts;
};

/**
 * Parse Text json element
 * @param {object}  elem                    Text element in JSON format
 * @returns {object}                        Text object
 */
Parser.parseJsonText = function(elem){
    return elements.Text.fromJson(elem);
};

module.exports = Parser;