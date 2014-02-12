"use strict";

var SvgObject   = require(__dirname + '/svgobject'),
    Matrix      = require(__dirname + '/../matrix/extends'),
    _           = require('underscore'),
    utils       = require(__dirname + '/../matrix/utils'),
    async       = require('async');

var Group = function(){
    if (!(this instanceof Group))
        throw 'this function in a constructor. Use new to call it';

    SvgObject.call(this);
    this.type = "g";
    this.childs = [];
};

Group.prototype             = new SvgObject();
Group.prototype.constructor = Group;

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
Group.prototype.findById = function(id){
    var returnElem = null;

    _.each(this.childs, function(elem){
        if(elem.id == id){
            returnElem = elem;
        }else if(elem.type == 'g'){
            returnElem = elem.findById(id);
        }
    });

    return returnElem;
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