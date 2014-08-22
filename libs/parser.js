'use strict';

var fs          = require('fs'),
    _           = require('underscore'),
    elements    = require(__dirname + '/objects/index'),
    dxfParser   = require('dxf-parsing').Parser;

var Parser = function Parser() {};

/**
 * Convert Svg file into Svg object
 * @param {object}      svg                 xml2js object
 * @param {function}    callback            Callback function
 */
Parser.convertXml = function convertXml(svg, callback) {
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
Parser.convertJson = function convertJson(json, callback) {
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
Parser.parseXmlNode = function parseXmlNode(node) {
    var nodes = [];

    _.each(node, function (content, index) {
        switch (index) {
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
            case 'image' :
                nodes = _.union(nodes, Parser.parseXmlImage(content));
                break;
            case 'circle' :
                nodes = _.union(nodes, Parser.parseXmlCircle(content));
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
Parser.parseJson = function parseJson(elements) {
    var nodes = [];

    _.each(elements, function (element) {
        switch (element.type) {
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
            case 'image' :
                nodes.push(Parser.parseJsonImage(element));
                break;
            case 'circle' :
                nodes.push(Parser.parseJsonCircle(element));
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
Parser.parseXmlGroup = function parseXmlGroup(array) {
    var groups = [];

    _.each(array, function (item) {
        groups.push(elements.Group.fromNode(item));
    });

    return groups;
};

/**
 * Parse Group json element
 * @param {object}  elem                    Group element in JSON format
 * @returns {object}                        Group object
 */
Parser.parseJsonGroup = function parseJsonGroup(elem) {
    return elements.Group.fromJson(elem);
};

/**
 * Parse Group Elements Array
 * @param {Array}       array               xml2js elements array
 * @param {boolean}     [isPolyline]        true : polyline. false : polygon. (default : false)
 * @returns {Array}                         Polygons array
 */
Parser.parseXmlPolygon = function parseXmlPolygon(array, isPolyline) {
    var polygons = [];

    _.each(array, function (item) {
        polygons.push(elements.Polygon.fromNode(item, isPolyline));
    });

    return polygons;
};

/**
 * Parse Polygon json element
 * @param {object}  elem                    Polygon element in JSON format
 * @returns {Polygon}                       Polygon object
 */
Parser.parseJsonPolygon = function parseJsonPolygon(elem) {
    return elements.Polygon.fromJson(elem);
};

/**
 * Parse Rect Elements Array
 * @param {Array}       array               xml2js elements array
 * @returns {Array}                         Rects array
 */
Parser.parseXmlRect = function parseXmlRect(array) {
    var rects = [];

    _.each(array, function (item) {
        rects.push(elements.Rect.fromNode(item));
    });

    return rects;
};

/**
 * Parse Rect json element
 * @param {object}  elem                    Rect element in JSON format
 * @returns {object}                        Rect object
 */
Parser.parseJsonRect = function parseJsonRect(elem) {
    return elements.Rect.fromJson(elem);
};

/**
 * Parse Text Elements Array
 * @param {Array}       array               xml2js elements array
 * @returns {Array}                         Texts array
 */
Parser.parseXmlText = function parseXmlText(array) {
    var texts = [];

    _.each(array, function (item) {
        texts.push(elements.Text.fromNode(item));
    });

    return texts;
};

/**
 * Parse Text json element
 * @param {object}  elem                    Text element in JSON format
 * @returns {Text}                        Text object
 */
Parser.parseJsonText = function (elem) {
    return elements.Text.fromJson(elem);
};

/**
 * Parse Image Elements Array
 * @param {Array}       array               xml2js elements array
 * @returns {Array}                         Image array
 */
Parser.parseXmlImage = function parseXmlImage(array) {
    var images = [];

    _.each(array, function (item) {
        images.push(elements.Image.fromNode(item));
    });

    return images;
};

/**
 * Parse Image json element
 * @param {object}  elem                    Image element in JSON format
 * @returns {object}                        Image object
 */
Parser.parseJsonImage = function parseJsonImage(elem) {
    return elements.Image.fromJson(elem);
};

/**
 * Parse Circle Elements Array
 * @param {Array}       array               xml2js elements array
 * @returns {Array}                         Circle array
 */
Parser.parseXmlCircle = function parseXmlCircle(array) {
    var circles = [];

    _.each(array, function (item) {
        circles.push(elements.Circle.fromNode(item));
    });

    return circles;
};

/**
 * Parse Circle json element
 * @param {object}  elem                    Circle element in JSON format
 * @returns {object}                        Circle object
 */
Parser.parseJsonCircle = function parseJsonCircle(elem) {
    return elements.Circle.fromJson(elem);
};

/**
 * Convert DXF File to SVG
 * @param {object}      params              Function params
 * @param {string}      params.path         DXF File path
 * @param {function}    callback            Callback Function
 */
Parser.convertDxf = function convertDxf(params, callback) {
    dxfParser.toArray(params.path, function (err, tab) {
        if (err) {
            callback(err);
            return;
        }

        var polygons    = dxfParser.getPolygons(tab),
            texts       = dxfParser.getTexts(tab, true);

        callback(null, {
            polygons    : polygons,
            texts       : texts,
            circles     : dxfParser.getCircles(tab, true),
            mapping     : dxfParser.makeMappings(polygons, texts),
            layers      : dxfParser.getLayersByEntities(tab, ['text', 'polygon', 'circle']),
            parameters  : dxfParser.getParameters(tab),
            dimensions  : dxfParser.getDimensions(polygons)
        });
    }.bind(this));
};

module.exports = Parser;