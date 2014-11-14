"use strict";

var SvgObject   = require(__dirname + '/svgobject'),
    Matrix      = require(__dirname + '/../matrix/extends'),
    _           = require('underscore'),
    utils       = require(__dirname + '/../matrix/utils'),
    async       = require('async'),
    nUtil       = require('util');

var Group = function(){
    if (!(this instanceof Group))
        throw 'this function in a constructor. Use new to call it';

    SvgObject.call(this);
    this.type = "g";
    this.childs = [];
};

nUtil.inherits(Group, SvgObject);

Group.prototype.toJSON = function(matrix){
    var parentJSON = SvgObject.prototype.toJSON.call(this, matrix);

    parentJSON.type     = this.type;
    parentJSON.childs   = [];

    _.each(this.childs, function(child){
        parentJSON.childs.push(child.toJSON(matrix));
    });

    return parentJSON;
};

Group.prototype.toXml = function(matrix){
    var xml = SvgObject.prototype.toXml.call(this, matrix);

    _.each(this.childs, function(child){
        xml.importXMLBuilder(child.toXml(matrix));
    });

    return xml;
};

/**
 * Find elements in Group and return new Group object with all elements by selected type
 *
 * @param   {string}    type                Selected type (rect|polygon|g|...)
 * @param   {boolean}   all                 true : Return all elements in same level and children groups
 * @returns {Group}                         new Group object with selected types elements
 */
Group.prototype.findByType = function(type, all){
    var group = new Group(),
        elems = [];

    _.each(this.childs, function(elem){
        if(elem.type == type)
            elems.push(elem);

        if(all && elem.type == 'g'){
            var subgroup = elem.findByType(type, all);
            elems = _.union(elems, subgroup.childs);
        }
    });

    group.childs = _.union(group.childs, elems);

    return group;
};

/**
 * Find elements in Group and return selected SvgObject
 *
 * @param   {string}    id                  Item id
 * @returns {SvgObject}                     SvgObject element
 */
Group.prototype.findById = function findById(id) {
    var returnElem = null;

    _.each(this.childs, function (elem) {
        if (elem.id == id) {
            returnElem = elem;
        }else if (elem.type == 'g') {
            returnElem = elem.findById(id);
        }
    });

    return returnElem;
};

/**
 * Find elements in Group and return selected SvgObject
 *
 * @param   {string}    id                  Item id
 * @param   {string}    type                Item type (rect, path, ...)
 * @returns {SvgObject}                     SvgObject element
 */
Group.prototype.findByIdAndType = function findByIdAndType(id, type) {
    var returnElem = null;

    _.each(this.childs, function (elem) {
        if (elem.id == id && elem.type == type) {
            returnElem = elem;
        } else if (elem.type == 'g') {
            returnElem = elem.findByIdAndType(id, type);
        }
    });

    return returnElem;
};

/**
 * Find elements in Group and return selected SvgObject
 *
 * @param   {string}    id                  Item id
 * @param   {string}    type                Item type (rect, path, ...)
 * @returns {SvgObject}                     SvgObject element
 */
Group.prototype.findByIdWithoutType = function findByIdWithoutType(id, type) {
    var returnElem = null;

    _.each(this.childs, function (elem) {
        if (elem.id == id && elem.type != type) {
            returnElem = elem;
        } else if (elem.type == 'g') {
            returnElem = elem.findByIdWithoutType(id, type);
        }
    });

    return returnElem;
};

/**
 * Remove All elements by type. If type is 'g', all childs elements are moved on svg root node.
 * @param {string}      type                Type to remove
 * @return {Array}                          List of elements of we moved outside the group
 */
Group.prototype.removeAllByType = function removeAllByType(type) {
    var elements = [];
    _.each(this.childs, function (elem) {
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

    this.childs = elements;
    return elements;
};

Group.prototype.applyMatrix = function(matrix, callback){
    var group = new Group();
    group.style   = this.style;
    group.classes = this.classes;
    group.id      = this.id;
    group.name    = this.name;
    group.stroke  = this.stroke;
    group.fill    = this.fill;
    group.type    = this.type;
    group.data    = this.data;

    async.each(this.childs, function(child, c){
        child.getBBox(function(bbox){
            var matrix2 = matrix.clone();
            var childMatrix = Matrix.fromElement(bbox, child);
            matrix2.add(childMatrix);
            child.applyMatrix(matrix2, function(elem){
                group.childs.push(elem);
                c();
            });
        });
    }, function(){
        callback(group);
    });
};

Group.prototype.getBBox = function(callback){
    var minX = +Infinity,
        maxX = -Infinity,
        minY = +Infinity,
        maxY = -Infinity,
        self = this;

    async.each(this.childs, function(child, done){
        child.getBBox(function(bbox){
            minX = Math.min(minX, bbox.x);
            minY = Math.min(minY, bbox.y);
            maxX = Math.max(maxX, bbox.x2);
            maxY = Math.max(maxY, bbox.y2);
            done();
        });
    }, function(){
        self.bbox = utils.bbox(minX,minY,maxX-minX,maxY-minY);
        callback(self.bbox);
    });
};

/**
 * Remove specifics types of objetcs in group
 * @param {object}          params              Function params
 * @param {string|Array}    params.type         target type(s) (g, rect, ...)
 */
Group.prototype.removeByType = function removeByType(params) {
    this.childs = _.filter(this.childs, function (element) {
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
                _.union(this.childs, element.childs);
            }
        }

        return !_.contains(params.type, element.type);
    }, this);
};

/**
 * Convert Svg elements into Path.
 * Works only on rect, polygon and polyline
 */
Group.prototype.convertElementsToPath = function convertElementsToPath() {
    var elements = [];

    _.each(this.childs, function (element) {
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

    this.childs = elements;
};

/**
 * Calculate all innerboxes in Group. Return copy of current group with elements with data attribute innerbox.
 * @param {function}    callback                    Callback Function
 */
Group.prototype.calculateAllInnerBoxes = function calculateAllInnerBoxes(callback) {
    var group = new Group();
    group.style   = this.style;
    group.classes = this.classes;
    group.id      = this.id;
    group.name    = this.name;
    group.stroke  = this.stroke;
    group.fill    = this.fill;
    group.type    = this.type;
    group.data    = this.data;
    async.each(this.childs, function (child, done) {
        switch (child.type) {
            case 'rect' :
            case 'polygon' :
            case 'polyline' :
            case 'circle' :
                child.getInnerBox(function (innerBox) {
                    child.data.innerbox = innerBox;
                    group.childs.push(child);
                    done();
                });
                break;
            case 'g' :
                child.calculateAllInnerBoxes( function (group) {
                    group.childs.push(child);
                    done();
                });
                break;
            default :
                group.childs.push(child);
                done();
        }
    }, function () {
        callback(group);
    });
};

module.exports = Group;

module.exports.fromNode = function(node){
    var group = new Group();

    if(typeof node != 'undefined'){
        SvgObject.fromNode(group, node);

        var Parser  = require(__dirname + '/../parser');

        group.childs = Parser.parseXmlNode(node);
    }
    return group;
};

module.exports.fromJson = function(json){
    var group = new Group();

    if(typeof json != 'undefined'){
        SvgObject.fromJson(group, json);

        var Parser  = require(__dirname + '/../parser');

        group.childs = Parser.parseJson(json.childs);
    }
    return group;
};