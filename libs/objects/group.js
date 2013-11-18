"use strict";

var SvgObject = require(__dirname + '/svgobject');

var Group = function(){
    SvgObject.call(this);
};

Group.prototype         = new SvgObject();
Group.prototype.childs  = [];
Group.prototype.type    = 'g';

/**
 * Return JSON from object
 *
 * @returns {object}
 */
Group.prototype.toJSON = function(){
    var parentJSON = SvgObject.prototype.toJSON.call(this);

    parentJSON.type     = this.type;
    parentJSON.childs   = [];

    _.each(this.childs, function(child){
        parentJSON.push(child.toJSON());
    });

    return parentJSON;
};

Group.prototype.toXml = function(){
    var xml = SvgObject.prototype.toXml.call(this);

    _.each(this.childs, function(child){
        xml.children.push(child.toXml());
    });

    return xml;
};

module.exports = Group;

module.exports.fromNode = function(node){
    var group = new Group();

    SvgObject.fromNode.call(this, group, node);

    var Parser  = require(__dirname + '/../parser'),
        parser  = new Parser();

    group.childs = parser.parseNode(node);

    return group;
};