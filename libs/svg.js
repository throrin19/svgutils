"use strict";

var fs          = require('fs'),
    xml2js      = require('xml2js'),
    _           = require('underscore'),
    builder     = require('xmlbuilder'),
    async       = require('async'),
    SvgParser   = require(__dirname + '/parser'),
    Matrix      = require(__dirname + '/matrix/extends'),
    gm          = require('gm').subClass({ imageMagick: true }),
    utils       = require(__dirname + '/matrix/utils');

var Svg = function Svg() {
    if (!(this instanceof Svg))
        throw 'this function in a constructor. Use new to call it';

    this.elements       = [];
    this.size           = { width: 100, height : 100 };
    this.stylesheets    = [];
};

/**
 * Set Svg Elements
 * @param {Array}       elements            SvgObject Array (rect|polygon|polyline|...)
 */
Svg.prototype.setElements = function setElements(elements) {
    this.elements = elements;
};

/**
 * Add SvgObject element to current SVG
 * @param {SvgObject}   element             SvgObject Element
 */
Svg.prototype.addElement = function toJSON(element) {
    this.elements.push(element);
};

/**
 * Add Specific stylesheet in SVG
 * @param {string}      cssFilePath         Css File Path to add
 */
Svg.prototype.addStyleSheet = function addStyleSheet(cssFilePath) {
    this.stylesheets.push(cssFilePath);
};

/**
 * Convert Svg to Json format
 * @param {boolean}     matrix              String representation without transform attribute
 * @returns {object}                        Svg Json Object representation
 */
Svg.prototype.toJSON = function toXml(matrix) {
    if(typeof matrix == 'undefined') matrix = false;

    var json = {
        elements    : [],
        stylesheets : this.stylesheets,
        size        : this.size
    };

    _.each(this.elements, function (element) {
        json.elements.push(element.toJSON(matrix));
    });

    return json;
};

/**
 * Convert Svg to Xml format
 * @param {boolean}     matrix              String representation without transform attribute
 * @returns {object}                        XMLBuilder Svg representation
 */
Svg.prototype.toXml = function toXml(matrix) {
    if(typeof matrix == 'undefined') matrix = false;

    var xml = builder.create('svg');
    xml.att('version', '1.1');
    xml.att('xmlns', 'http://www.w3.org/2000/svg');
    xml.att('width', this.size.width+'px');
    xml.att('height', this.size.height+'px');

    _.each(this.stylesheets, function (styleSheet) {
        xml.ins('xml-stylesheet', 'type="text/xsl" href="'+ styleSheet +'"');
    });

    _.each(this.elements, function (element) {
        xml.importXMLBuilder(element.toXml(matrix));
    });

    return xml;
};

/**
 * Convert SVG to String :
 *     '<svg>...</svg>'
 * @param {boolean}     content             false : return only svg content, true : return all svg in <svg> tag
 * @param {boolean}     [matrix]            String representation without transform attribute
 * @returns {string}                        Svg String representation
 */
Svg.prototype.toString = function toString(content, matrix) {
    if(typeof matrix == 'undefined') matrix = false;

    if (content == true) {
        return this.toXml(matrix).toString();
    } else {
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
Svg.prototype.findByType = function findByType(type, all) {
    var svg = new Svg();

    _.each(this.elements, function (elem) {
        if (elem.type == type) {
            svg.addElement(elem);
        }

        if (all && elem.type == 'g') {
            var group = elem.findByType(type, all);
            _.each(group.childs, function (child) {
                svg.addElement(child);
            });
        }
    });

    return svg;
};

/**
 * Find one element by id in SVG
 *
 * @param   {string}    id                  Item id
 * @returns {SvgObject}                     SvgObject element
 */
Svg.prototype.findById = function (id) {
    var returnElem = null;

    _.each(this.elements, function (elem) {
        if (elem.id == id) {
            returnElem = elem;
        }else if (elem.type == 'g') {
            returnElem = elem.findById(id);
        }
    });

    return returnElem;
};

/**
 * Find one element by id and type in SVG
 *
 * @param   {string}    id                  Item id
 * @param   {string}    type                Item type (rect, path, ...)
 * @returns {SvgObject}                     SvgObject element
 */
Svg.prototype.findByIdAndType = function findByIdAndType(id, type) {
    var returnElem = null;

    _.each(this.elements, function (elem) {
        if (elem.id == id && elem.type == type) {
            returnElem = elem;
        }else if (elem.type == 'g') {
            returnElem = elem.findByIdAndType(id, type);
        }
    });

    return returnElem;
};

/**
 * Find one element by id without param type in SVG
 *
 * @param   {string}    id                  Item id
 * @param   {string}    type                Item type (rect, path, ...)
 * @returns {SvgObject}                     SvgObject element
 */
Svg.prototype.findByIdWithoutType = function findByIdWithoutType(id, type) {
    var returnElem = null;

    _.each(this.elements, function (elem) {
        if (elem.id === id && elem.type !== type) {
            returnElem = elem;
        }else if (elem.type === 'g') {
            returnElem = elem.findByIdWithoutType(id, type);
        }
    });

    return returnElem;
};

/**
 * Remove All elements by type. If type is 'g', all childs elements are moved on svg root node.
 * @param {string}      type                Type to remove
 */
Svg.prototype.removeAllByType = function removeAllByType(type) {
    var elements = [];
    _.each(this.elements, function (elem) {
        if (elem.type === 'g') {
            var elms = elem.removeAllByType(type);
            if (type === 'g') {
                elements = _.union(elements, elms);
            }
        }
        if (elem.type !== type) {
            elements.push(elem);
        }
    });

    this.elements = elements;
};

/**
 * Generate new Svg element with all applied matrix to all elements.
 * Convert rect into polygon
 * @param {array|Matrix}        matrix              Matrix to be applied in addition to those elements.
 * @param {function}            callback            Callback Function
 */
Svg.prototype.applyMatrix = function applyMatrix(matrix, callback) {
    var svg = new Svg();

    var applyMatrix = new Matrix();
    if (matrix != null) {
        if(matrix instanceof Array){
            _.each(matrix, function(mat){
                applyMatrix.add(mat);
            });
        }else{
            applyMatrix = matrix;
        }
    }

    async.each(this.elements, function (elem, c) {
        elem.getBBox( function (bbox) {
            var applyCloneMatrix = applyMatrix.clone();
            var matrix = applyCloneMatrix.add(Matrix.fromElement(bbox, elem));
            elem.applyMatrix(matrix, function(e){
                svg.addElement(e);
                c();
            });
        });
    }, function () {
        callback(svg);
    });
};

/**
 * Save Svg file
 * @param {object}      params              Functon Params
 * @param {string}      [params.output]     Output file
 * @param {function}    callback            Callback Function
 */
Svg.prototype.save = function save(params, callback) {
    var defOpts = {
        output : '/tmp/export_' + new Date().getTime() + '.svg'
    };

    params = _.extend({}, defOpts, params);

    fs.writeFile(params.output, this.toString(true), function (err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, params.output);
    });
};

/**
 * Save Svg file in Png Format
 * @param {object}      params              Functon Params
 * @param {string}      [params.output]     Output file
 * @param {function}    callback            Callback Function
 */
Svg.prototype.savePng = function savePng(params, callback) {
    var defOpts = {
        output : '/tmp/export_' + new Date().getTime() + '.png'
    };

    params = _.extend({}, defOpts, params);

    this.save({}, function (err, file) {
        if (err) {
            callback(err);
            return;
        }

        gm(file).write(params.output, function (err) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, params.output);
        });
    });
};

/**
 * Refresh SVG size
 * @param {function}    callback        Callback Function
 */
Svg.prototype.getSize = function getSize(callback) {
    var minX = +Infinity,
        maxX = -Infinity,
        minY = +Infinity,
        maxY = -Infinity,
        self = this;

    async.each(this.elements, function (child, done) {
        child.getBBox(function (bbox) {
            minX = Math.min(minX, bbox.x);
            minY = Math.min(minY, bbox.y);
            maxX = Math.max(maxX, bbox.x2);
            maxY = Math.max(maxY, bbox.y2);
            done();
        });
    }, function () {
        var bbox  = utils.bbox(minX,minY,maxX,maxY);
        self.size = { width : bbox.w, height : bbox.h  };

        callback(self.size);
    });
};

/**
 * Get SVG bbox
 * @param {function}    callback        Callback Function
 */
Svg.prototype.getBBox = function getBBox(callback) {
    var minX = +Infinity,
        maxX = -Infinity,
        minY = +Infinity,
        maxY = -Infinity;

    async.each(this.elements, function (child, done) {
        child.getBBox(function (bbox) {
            minX = Math.min(minX, bbox.x);
            minY = Math.min(minY, bbox.y);
            maxX = Math.max(maxX, bbox.x2);
            maxY = Math.max(maxY, bbox.y2);
            done();
        });
    }, function () {
        callback(utils.bbox(minX,minY,maxX,maxY));
    });
};

/**
 * Calculate all innerboxes in SVG. Return copy of current svg with elements with data attribute innerbox.
 * @param {function}    callback                    Callback Function
 */
Svg.prototype.calculateAllInnerBoxes = function calculateAllInnerBoxes(callback) {
    var svg = new Svg();
    async.each(this.elements, function (child, done) {
        switch (child.type) {
            case 'rect' :
            case 'polygon' :
            case 'polyline' :
            case 'circle' :
                child.getInnerBox(function (innerBox) {
                    child.data.innerbox = innerBox;
                    svg.addElement(child);
                    done();
                });
                break;
            case 'g' :
                child.calculateAllInnerBoxes( function (group) {
                    svg.addElement(child);
                    done();
                });
                break;
            default :
                svg.addElement(child);
                done();
        }
    }, function () {
        svg.getSize(function () {
            callback(svg);
        });
    });
};

/**
 * Remove specifics types of objetcs in svg
 * @param {object}          params              Function params
 * @param {string|Array}    params.type         target type(s) (g, rect, ...)
 */
Svg.prototype.removeByType = function removeByType(params) {
    this.elements = _.filter(this.elements, function (element) {
        if (!_.isArray(params.type)) {
            var t = params.type;
            params.type = [];
            params.type.push(t);
        }

        if (element.type === 'g') {
            // remove elements for group
            element.removeByType(params);
            // if remove group type, add all elements in svg
            if (_.contains(params.type, 'g')) {
                _.union(this.elements, element.childs);
            }
        }

        return !_.contains(params.type, element.type);
    }, this);
};

/**
 * Convert Svg elements into Path.
 * Works only on rect, polygon and polyline
 */
Svg.prototype.convertElementsToPath = function convertElementsToPath() {
    var elements = [];

    _.each(this.elements, function (element) {
        switch(element.type) {
            case 'rect' :
            case 'polygon' :
            case 'polyline' :
                elements.push(element.toPath());
                break;
            case 'g' :
                element.convertElementsToPath();
                elements.push(element);
                break;
            default :
                elements.push(element);
        }
    }, this);
    this.elements = elements;
};

module.exports = Svg;

/**
 * Create Svg from Svg Document
 * @param {string}      path                Uri of source file
 * @param {function}    callback            Callback Function
 */
module.exports.fromSvgDocument = function fromSvgDocument(path, callback) {
    fs.readFile(path, function (error, data) {
        if (error) {
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
module.exports.fromXmlString = function fromXmlString(string, callback) {
    var parser  = new xml2js.Parser();

    parser.addListener('end', function (result) {
        SvgParser.convertXml(result, function (err, elements) {
            if (err) {
                callback(err);
                return;
            }

            var svg = new Svg();
            svg.setElements(elements);
            svg.getSize(function () {
                callback(null, svg);
            });
        });
    });

    parser.parseString(string);
};


module.exports.fromJsonFile = function fromJsonFile(path, callback) {
    fs.readFile(path, function (error, data) {
        if (error) {
            callback(error);
            return;
        }
        Svg.fromJsonString(data.toString(), callback);
    });
};

module.exports.fromJsonString = function fromJsonString(string, callback) {
    var json = JSON.parse(string);

    Svg.fromJson(json, callback);
};

module.exports.fromJson = function fromJson(json, callback) {
    SvgParser.convertJson(json, function (err, elements) {
        if (err) {
            callback(err);
            return;
        }

        var svg = new Svg();
        svg.setElements(elements);

        svg.getSize(function () {
            callback(null, svg);
        });
    });
};

/**
 * Create SVG from dxf file
 * @param {object}      params              Function params
 * @param {string}      params.path         DXF File path
 * @param {Array}       params.layers       Import element for passed layers names
 * @param {function}    callback            Callback Function
 */
module.exports.fromDxfFile = function fromDxfFile(params, callback) {
    SvgParser.convertDxf(params, function (err, result) {
        if (err) {
            callback (err);
            return;
        }

        var svg = new Svg();
        _.each(result.polygons, function (polygon) {
            // test if params.layers is set and if polygon is in specified layers
            if (!params.layers || params.layers.length == 0 || _.contains(params.layers, polygon.layer)) {
                svg.addElement(SvgParser.parseJsonPolygon({
                    points : polygon.points,
                    fill : 'white',
                    stroke : 'black'
                }));
            }
        }, this);
        _.each(result.circles, function (circle) {
            if (!params.layers || params.layers.length == 0 || _.contains(params.layers, circle.layer)) {
                svg.addElement(SvgParser.parseJsonPolygon({
                    points : circle.points,
                    fill : 'white',
                    stroke : 'black'
                }));
            }
        });
        _.each(result.texts, function (text) {
            if (!params.layers || params.layers.length == 0 || _.contains(params.layers, text.layer)) {
                svg.addElement(SvgParser.parseJsonText({
                    fill : 'black',
                    value : text.contents,
                    x : text.point.x,
                    y : text.point.y
                }));
            }
        });
        svg.getBBox(function (bbox) {
            var matrix = new Matrix(1, 0, 0, -1, Math.abs(Math.min(bbox.x, bbox.x2))+10, Math.abs(Math.min(bbox.y, bbox.y2))+10);
            svg.applyMatrix(matrix, function (svg) {
                svg.getSize(function () {
                    callback(null, svg);
                });
            });
        });
    });
};