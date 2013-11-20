"use strict";

var SvgObject = require(__dirname + '/svgobject'),
    _         = require('underscore');

var Group = function(){
    SvgObject.call(this);
};

Group.prototype         = new SvgObject();
Group.prototype.childs  = [];
Group.prototype.type    = 'g';

Group.prototype.toJSON = function(matrix){
    var parentJSON = SvgObject.prototype.toJSON.call(this, matrix);

    parentJSON.type     = this.type;
    parentJSON.childs   = [];

    _.each(this.childs, function(child){
        parentJSON.push(child.toJSON(matrix));
    });

    return parentJSON;
};

Group.prototype.toXml = function(matrix){
    var xml = SvgObject.prototype.toXml.call(this, matrix);

    _.each(this.childs, function(child){
        xml.children.push(child.toXml(matrix));
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

module.exports = Group;

module.exports.fromNode = function(node){
    var group = new Group();

    SvgObject.fromNode.call(this, group, node);

    var Parser  = require(__dirname + '/../parser');

    group.childs = Parser.parseNode(node);

    return group;
};