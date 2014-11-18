"use strict";

var _       = require('underscore'),
    builder = require('xmlbuilder'),
    async   = require('async'),
    Matrix  = require(__dirname + '/../matrix/extends');

/**
 *
 * @constructor
 */
var SvgObject = function(){
    if (!(this instanceof SvgObject))
        throw 'this function in a constructor. Use new to call it';

    this.classes    = [];
    this.id         = "";
    this.name       = "";
    this.stroke     = "";
    this.fill       = "";
    this.style      = {};
    this.transform  = undefined;
    this.data       = {};
    this.bbox       = undefined;
};


/**
 * Set classes
 *
 * @param {string}  classes     Classes separate by space
 */
SvgObject.prototype.setClassesFromString = function setClassesFromString(classes){
    this.classes = classes.split(" ");
};

/**
 * Add specific class to svgObject
 * @param {string}  className   Class Name
 */
SvgObject.prototype.addClass = function addClass(className) {
    this.classes.push(className);
};

/**
 * Set Stroke Color
 *
 * @param {string} stroke       Stroke Color (default : black)
 */
SvgObject.prototype.setStroke = function setStroke(stroke){
    this.stroke = stroke;
};

/**
 * Set Fill color
 *
 * @param {string} fill         Fill Color (default : black)
 */
SvgObject.prototype.setFill = function setFill(fill){
    this.fill = fill;
};

/**
 * Set ID
 * @param {string} id           ID for element
 */
SvgObject.prototype.setId = function setId(id){
    this.id = id;
    this.data.id = id;
};

/**
 * Set Name
 * @param {string} name         Name
 */
SvgObject.prototype.setName = function setName(name){
    this.name = name;
    this.data.name = name;
};

/**
 * Set Transformation String
 * @param {string} transform    Transformation in SVG format
 */
SvgObject.prototype.setTransform = function setTransform(transform){
    this.transform = transform;
};

/**
 * Set all data attrbutes for element
 * @param {object} data         Data Object
 */
SvgObject.prototype.setData = function setData(data){
    this.data = data;
};

/**
 * Set Style from css string (color:#aaaaaa; background-color:#ffffff;)
 * @param {string}        styleStr        Element style like the style html attribute value. Each styles are separate by ';'
 */
SvgObject.prototype.setStyleFromString = function setStyleFromString(styleStr){
    styleStr.split(';').forEach(function(line){
        if(line.length > 0){
            var style = line.split(':');
            this.style[style[0].replace(/^\s+|\s+$/g, '')] = style[1].replace(/^\s+|\s+$/g, '');
        }
    }, this);
};

/**
 * Set Style
 * @param {object}        style         Element style object
 */
SvgObject.prototype.setStyle = function setStyle(style){
    this.style = style;
};

/**
 * get Element classes
 * @returns {Array}
 */
SvgObject.prototype.getClasses = function getClasses(){
    return this.classes;
};

/**
 * get Element id
 * @returns {string}
 */
SvgObject.prototype.getId = function getId(){
    return this.id;
};

/**
 * get Element Name
 * @returns {string}
 */
SvgObject.prototype.getName = function getName(){
    return this.name;
};

/**
 * get Element Stroke
 * @returns {string}
 */
SvgObject.prototype.getStroke = function getStroke(){
    return this.stroke;
};

/**
 * Get Element fill
 * @returns {string}
 */
SvgObject.prototype.getFill = function getFill(){
    return this.fill;
};

/**
 * get Element Style
 * @returns {object}
 */
SvgObject.prototype.getStyle = function getStyle(){
    return this.style;
};

/**
 * get transformation matrix
 * @returns {undefined|object}
 */
SvgObject.prototype.getTransform = function getTransform(){
    return this.transform;
};

/**
 * get Element data
 * @returns {object}
 */
SvgObject.prototype.getData = function getData(){
    return this.data;
};

/**
 * Return JSON from object
 * @param   {boolean}    [matrix]       return transform attribute if false.
 * @returns {object}                    JSON Object
 */
SvgObject.prototype.toJSON = function toJSON(matrix){

    var json = {
        type : this.type
    };

    if(this.classes.length > 0)
        json.classes = this.classes;
    if(this.id != null && this.id != '')
        json.id = this.id;
    if(this.name != null && this.name != '')
        json.name = this.name;
    if(this.stroke != null && this.stroke != '')
        json.stroke = this.stroke;
    if(this.fill != null && this.fill != '')
        json.fill = this.fill;
    if(!_.isEmpty(this.style))
        json.style = this.style;
    if(!_.isEmpty(this.data))
        json.data = this.data;
    if (this.bbox) {
        json.bbox = this.bbox;
    }
    if(typeof this.transform != 'undefined' && matrix != true)
        json.transform = this.transform;

    return json;
};

/**
 * Return XML from object
 * @param   {boolean}    [matrix]       return transform attribute if false.
 * @returns {xmlBuilder}                XML Object
 */
SvgObject.prototype.toXml = function toXml(matrix){
    var xml = builder.create(this.type);

    var style = "";
    _.each(this.style, function(value, index){
        style += index + ":" + value + ";"
    });

    if(this.classes.length > 0)
        xml.att("class", this.classes.join(" "));
    if(typeof this.transform != 'undefined' && matrix != true)
        xml.att("transform", this.transform);
    if(this.id.length > 0)
        xml.att("id", this.id);
    if(this.name.length > 0)
        xml.att("name", this.name);
    if(this.stroke.length > 0)
        xml.att("stroke", this.stroke);
    if(this.fill.length > 0)
        xml.att("fill", this.fill);
    if (this.bbox) {
        xml.att("data-bbox", JSON.stringify(this.bbox));
    }

    _.each(this.data, function(value, key){
        if(key && value){
            xml.att("data-" + key, typeof value == "string" ? value : JSON.stringify(value));
        }
    });

    xml.att("style", style);

    return xml;
};

/**
 * Return element with XML String representation
 * @returns {string}                        Element convert to String
 */
SvgObject.prototype.toString = function toString(){
    return this.toXml().toString();
};

/**
 * Return element converted into Path.
 * For moment, works only with rect, polygon and polyline
 * Others return empty path
 * @return {Path}                           Path Object
 */
SvgObject.prototype.toPath = function toPath() {
    var Path = require(__dirname + "/path");
    var path = new Path();
    path.classes    = this.classes;
    path.id         = this.id;
    path.name       = this.name;
    path.stroke     = this.stroke;
    path.fill       = this.fill;
    path.style      = this.style;
    path.transform  = this.transform;
    path.bbox       = this.bbox;
    path.data       = this.data;

    return path;
};

/**
 * Get the element Bounding Box
 * @param {function} callback               Callback Function
 */
SvgObject.prototype.getBBox = function getBBox(callback){
    callback(this.bbox);
};

/**
 * Return Matrix representation of current transform attribute.
 * @param {function} callback               Callback function
 */
SvgObject.prototype.getCurrentMatrix = function getCurrentMatrix(callback){
    var self = this;
    this.getBBox(function(bbox){
        callback(Matrix.fromElement(bbox, self));
    });
};

/**
 * Get the element innerBox
 * @param {function} callback
 */
SvgObject.prototype.getInnerBox = function getInnerBox(callback) {
    callback({
        x : 0,
        y : 0,
        width : 0,
        height : 0
    });
};

/**
 * Indicates whether an other svgObject is contained in this svgObject
 * @param {SvgObject}  svgObject            SvgObject
 * @param {function}   callback             Callback function
 */
SvgObject.prototype.contains = function contains(svgObject, callback){
    var self = this;
    async.parallel({
        ownBbox : function(c){
            self.getBBox(function(bbox){
               c(null, bbox);
            });
        },
        objBBox : function(c){
            svgObject.getBBox(function(bbox){
                c(null, bbox);
            });
        }
    }, function(err, result){
        var ownPoints = [
                { x : result.ownBbox.x, y : result.ownBbox.y  },
                { x : result.ownBbox.x2, y : result.ownBbox.y  },
                { x : result.ownBbox.x2, y : result.ownBbox.y2  },
                { x : result.ownBbox.x, y : result.ownBbox.y2  }
            ],
            objPoints = [
                { x : result.objBBox.x, y : result.objBBox.y  },
                { x : result.objBBox.x2, y : result.objBBox.y  },
                { x : result.objBBox.x2, y : result.objBBox.y2  },
                { x : result.objBBox.x, y : result.objBBox.y2  }
            ];

        var c = [ false, false, false, false ];

        for(var i = 0; i < objPoints.length; ++i){
            for(var j = 0, k = ownPoints.length -1; j < ownPoints.length; k = j++){
                if(
                    ((ownPoints[j].y > objPoints[i].y) != (ownPoints[k].y > objPoints[i].y)) &&
                    (objPoints[i].x < (ownPoints[k].x - ownPoints[j].x) * (objPoints[i].y - ownPoints[j].y) / (ownPoints[k].y - ownPoints[j].y) + ownPoints[j].x)
                ){
                    c[i] = !c[i];
                }
            }
        }

        if(c[0] == true || c[1] == true || c[2] == true || c[3] == true){
            callback(true);
            return;
        }

        callback(false);
    });
};

module.exports = SvgObject;

/**
 * Generate SVGElement from SVG node
 *
 * @param {SvgObject}   object      SvgObject element (polygon|group|...
 * @param {object}      node        xml2js element
 */
module.exports.fromNode = function fromNode(object, node){
    if(typeof node != 'undefined' && typeof node.$ != 'undefined'){
        if(typeof node.$['class'] != 'undefined'){
            object.setClassesFromString(node.$['class']);
        }
        if(typeof node.$.id != 'undefined'){
            object.setId(node.$.id);
            object.setName(node.$.id);
        }
        if(typeof node.$.stroke != 'undefined'){
            object.setStroke(node.$.stroke);
        }
        if(typeof node.$.fill != 'undefined'){
            object.setFill(node.$.fill);
        }
        if(typeof node.$.style != 'undefined'){
            object.setStyleFromString(node.$.style);
        }
        if(typeof node.$.transform != 'undefined'){
            object.setTransform(node.$.transform);
        }
        _.each(node.$, function(value, index){
            var match = index.match(/(?:^|\s)data-(.*?)(?:$|\s)\b/);
            if(match){
                try{
                    object.data[match[1]] = JSON.parse(value);
                }catch(e){
                    object.data[match[1]] = value;
                }
            }
        });
    }
};

/**
 * Generate SVGElement from JSON element
 *
 * @param {SvgObject}   object      SvgObject element (polygon|group|...
 * @param {object}      json        json element
 */
module.exports.fromJson = function fromJson(object, json){
    if(typeof json != 'undefined'){
        if(typeof json.classes != 'undefined'){
            object.classes = json.classes;
        }
        if(typeof json.id != 'undefined'){
            object.setId(json.id);
            object.setName(json.id);
        }
        if(typeof json.name != 'undefined'){
            object.setName(json.id);
        }
        if(typeof json.stroke != 'undefined'){
            object.stroke = json.stroke;
        }
        if(typeof json.fill != 'undefined'){
            object.fill = json.fill;
        }
        if(typeof json.style != 'undefined'){
            object.style = json.style;
        }
        if(typeof json.transform != 'undefined'){
            object.transform = json.transform;
        }
        if(typeof json.data != 'undefined'){
            object.data = json.data;
        }
    }
};