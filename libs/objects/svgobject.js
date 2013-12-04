"use strict";

var _       = require('underscore'),
    builder = require('xmlbuilder'),
    async   = require('async'),
    utils   = require(__dirname + '/../utils'),
    Matrix  = require(__dirname + '/../matrix/extends');

/**
 *
 * @constructor
 */
var SvgObject = function(){
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


SvgObject.prototype.getClasses = function(){
    return this.classes;
};
SvgObject.prototype.getId = function(){
    return this.id;
};
SvgObject.prototype.getName = function(){
    return this.getName;
};
SvgObject.prototype.getStroke = function(){
    return this.stroke;
};
SvgObject.prototype.getFill = function(){
    return this.fill;
};
SvgObject.prototype.getStyle = function(){
    return this.style;
};
SvgObject.prototype.getTransform = function(){
    return this.transform;
};
SvgObject.prototype.getData = function(){
    return this.data;
};


/**
 * Set classes
 *
 * @param {string}  classes     Classes separate by space
 */
SvgObject.prototype.setClassesFromString = function(classes){
    this.classes = classes.split(" ");
};

/**
 * Set Stroke Color
 *
 * @param {string} stroke       Stroke Color (default : black)
 */
SvgObject.prototype.setStroke = function(stroke){
    this.stroke = stroke;
};

/**
 * Set Fill color
 *
 * @param {string} fill         Fill Color (default : black)
 */
SvgObject.prototype.setFill = function(fill){
    this.fill = fill;
};

/**
 * Set ID
 * @param {string} id           ID for element
 */
SvgObject.prototype.setId = function(id){
    this.id = id;
};

/**
 * Set Name
 * @param {string} name         Name
 */
SvgObject.prototype.setName = function(name){
    this.name = name;
};

/**
 * Set Transformation String
 * @param {string} transform    Transformation in SVG format
 */
SvgObject.prototype.setTransform = function(transform){
    this.transform = transform;
};

/**
 * Set all data attrbutes for element
 *
 * @param {object} data         Data Object
 */
SvgObject.prototype.setData = function(data){
    this.data = data;
};

/**
 * Set Style
 *
 * @param {string} styleStr     Element style like the style html attribute value. Each styles are separate by ';'
 */
SvgObject.prototype.setStyleFromString = function(styleStr){
    var self = this;
    styleStr.split(';').forEach(function(line){
        if(line.length > 0){
            var style = line.split(':');
            self.style[style[0].replace(/^\s+|\s+$/g, '')] = style[1].replace(/^\s+|\s+$/g, '');
        }
    });
};

/**
 * Return JSON from object
 *
 * @param   {boolean}    matrix         return transform attribute if false.
 * @returns {object}                    JSON Object
 */
SvgObject.prototype.toJSON = function(matrix){

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
    if(typeof this.transform != 'undefined' && matrix != true)
        json.transform = this.transform;

    return json;
};

/**
 * Return XML from object
 * @param   {boolean}    matrix         return transform attribute if false.
 * @returns {xmlBuilder}                XML Object
 */
SvgObject.prototype.toXml = function(matrix){
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
 *
 * @returns {string}                        Element convert to String
 */
SvgObject.prototype.toString = function(){
    return this.toXml().toString();
};

SvgObject.prototype.getBBox = function(callback){
    var self = this;
    if(typeof this.bbox == 'undefined' || this.type == 'g'){
        utils.loadSvg(this.toString(), this.type, function(bbox){
            self.bbox = bbox;
            callback(bbox);
        });
    }else{
        callback(this.bbox);
    }
};

/**
 * Return Matrix representation of current transform attribute.
 *
 * @param {function} callback               Callback function
 */
SvgObject.prototype.getCurrentMatrix = function(callback){
    var self = this;
    this.getBBox(function(bbox){
        callback(Matrix.fromElement(bbox, self));
    });
};

/**
 * Indicates whether an other svgObject is contained in this svgObject
 *
 * @param {SvgObject}  svgObject            SvgObject
 * @param {function}   callback             Callback function
 */
SvgObject.prototype.contains = function(svgObject, callback){
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
module.exports.fromNode = function(object, node){
    if(typeof node != 'undefined' && typeof node.$ != 'undefined'){
        if(typeof node.$['class'] != 'undefined'){
            object.setClassesFromString(node.$['class']);
        }
        if(typeof node.$.id != 'undefined'){
            object.setId(node.$.id);
            object.setName(node.$.id);
            object.data.id      = node.$.id;
            object.data.name    = node.$.name;
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
module.exports.fromJson = function(object, json){
    if(typeof json != 'undefined'){
        if(typeof json.classes != 'undefined'){
            object.classes = json.classes;
        }
        if(typeof json.id != 'undefined'){
            object.id   = json.id;
            object.name = json.name;
        }
        if(typeof json.name != 'undefined'){
            object.name = json.name;
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