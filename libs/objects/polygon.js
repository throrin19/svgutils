'use strict';

var Matrix      = require(__dirname + '/../matrix/extends'),
    SvgObject   = require(__dirname + '/svgobject'),
    utils       = require(__dirname + '/../matrix/utils'),
    _           = require('underscore'),
    nUtil       = require('util');

var EPSILON = 0.1;

var Polygon = function() {
    if (!(this instanceof Polygon)) {
        throw 'this function in a constructor. Use new to call it';
    }

    SvgObject.call(this);
    this.type   = "polygon";
    this.points = [];
};

nUtil.inherits(Polygon, SvgObject);

/**
 * Get Polygon points in Array to simply manipulation
 *
 * @param {string}    points                    Polygon|Polyline points attribute value
 */
Polygon.prototype.setPointsFromString = function setPointsFromString(points) {
    var coords          = [],
        point           = {},
        previousPoint   = {};

    points = points.replace(/ +(?= )/g, '');
    _.each(points.split(/[, ]/), function (xy, index) {
        if (index%2 == 0) {
            point.x = xy;
        } else {
            point.y = xy;
        }

        if (index%2 == 1 && index > 0 && (point.x !== previousPoint.x || point.y !== previousPoint.y)) {
            coords.push(point);
            previousPoint = point;
            point = {};
        }
    });

    this.points = coords;
    this.bbox   = undefined;
};

Polygon.prototype.addPoint = function addPoint(x, y) {
    var different = true;
    if (this.points.length > 0) {
        var lastPoint = this.points[this.points.length-1];
        different = lastPoint.x !== x || lastPoint.y !== y;
    }
    if (different) {
        this.points.push({ x : x, y : y });
    }
    this.bbox = undefined;
};

/**
 * Return JSON from object
 * @param   {boolean}    [matrix]       return transform attribute if false.
 * @returns {object}                    JSON Object
 */
Polygon.prototype.toJSON = function toJSON(matrix) {
    var parentJSON = SvgObject.prototype.toJSON.call(this, matrix);

    parentJSON.type     = this.type;
    parentJSON.points   = this.points;

    return parentJSON;
};

/**
 * Return XML from object
 * @param   {boolean}    [matrix]       return transform attribute if false.
 * @returns {xmlBuilder}                XML Object
 */
Polygon.prototype.toXml = function toXml(matrix) {

    var xml = SvgObject.prototype.toXml.call(this, matrix);

    var points = "";
    _.each(this.points, function (point) {
       points += point.x + "," + point.y + " ";
    });

    xml.att('points', points.substr(0, points.length-1));

    return xml;
};

/**
 * Return element converted into Path.
 * @return {Path}                           Path Object
 */
Polygon.prototype.toPath = function toPath() {
    var path = SvgObject.prototype.toPath.call(this);

    path.d =  "";
    this.points.forEach(function(point, index) {
        if(index == 0){
            path.d += "M " + point.x + " " + point.y;
        } else {
            path.d += " L" + point.x + " " + point.y
        }
    });
    path.d += ' Z';

    return path;
};

Polygon.prototype.applyMatrix = function applyMatrix(matrix, callback) {
    var polygon     = new Polygon();
    polygon.style   = this.style;
    polygon.classes = this.classes;
    polygon.id      = this.id;
    polygon.name    = this.name;
    polygon.stroke  = this.stroke;
    polygon.fill    = this.fill;
    polygon.type    = this.type;
    polygon.data    = this.data;

    _.each(this.points, function (point) {
        polygon.addPoint(
            matrix.x(point.x, point.y),
            matrix.y(point.x, point.y)
        );
    });

    callback(polygon);
};

/**
 * Get the element Bounding Box
 * @param {function} callback               Callback Function
 */
Polygon.prototype.getBBox = function getBBox(callback) {
    var minX = +Infinity,
        maxX = -Infinity,
        minY = +Infinity,
        maxY = -Infinity;

    _.each(this.points, function (point) {
        minX = Math.min(point.x, minX);
        maxX = Math.max(point.x, maxX);
        minY = Math.min(point.y, minY);
        maxY = Math.max(point.y, maxY);
    });


    this.bbox = utils.bbox(minX, minY, Math.abs(Math.abs(maxX) - Math.abs(minX)), Math.abs(Math.abs(maxY) - Math.abs(minY)));
    callback(this.bbox);
};

/**
 * Get the element innerBox
 * @param {function} callback               Callback function
 */
Polygon.prototype.getInnerBox = function getInnerBox(callback) {
    var verticesY       = [],
        pointsCount     = this.points.length,
        segments        = [],
        prevY           = Infinity,
        innerRect       = {
            x       : 0,
            y       : 0,
            width   : 0,
            height  : 0
        },
        segment;

    if (pointsCount === 0) {
        callback(innerRect);
        return;
    }

    _.each(this.points, function (point) {
        verticesY.push(point.y);
    }, this);
    verticesY = _.sortBy(verticesY, function (y) {
        return y;
    });
    _.each(verticesY, function (y, i) {
        if (Math.abs(y - prevY) < EPSILON) {
            return;
        }
        if (i > 0) {
            segment = this._widestSegmentAtY(y-0.1);
            if (segment.width > 0) {
                segments.push(segment);
            }
        }
        if (i < pointsCount-1) {
            segment = this._widestSegmentAtY(y+0.1);
            if (segment.width > 0) {
                segments.push(segment);
            }
        }

        prevY = y;
    }, this);

    if (segments.length > 1) {
        var iSeg0   = 0,
            iSeg1   = 0,
            curRect = innerRect;

        for (iSeg0 = 0, iSeg1 = 1; iSeg1 < segments.length; iSeg0 += 2, iSeg1 += 2) {
            var segment0 = segments[iSeg0],
                segment1 = segments[iSeg1];

            if (Math.abs(segment0.width - segment1.width) < EPSILON) {
                var x0      = Math.max(segment0.x, segment1.x),
                    x1      = Math.min(segment0.x + segment0.width, segment1.x + segment1.width),
                    width   = x1 - x0;
                curRect = {
                    x : x0,
                    y : segment0.y,
                    width : width,
                    height : segment1.y - segment0.y
                };
            } else {
                var point0, point1;

                if (segment1.width > segment0.width) {
                    point0 = {
                        x : 0.5 * (segment0.x + segment1.x),
                        y : 0.5 * (segment0.y + segment1.y)
                    };
                    point1 = {
                        x : 0.5 * (segment0.x + segment0.width + segment1.x + segment1.width),
                        y : 0.5 * (segment0.y + segment0.width + segment1.y + segment1.height)
                    };
                    curRect = {
                        x : point0.x,
                        y : point0.y,
                        width : point1.x - point0.x,
                        height : segment1.y - point0.y
                    }
                } else {
                    point0 = {
                        x : 0.5 * (segment0.x + segment1.x),
                        y : 0.5 * (segment0.y + segment1.y)
                    };
                    point1 = {
                        x : 0.5 * (segment0.x + segment0.width + segment1.x + segment1.width),
                        y : 0.5 * (segment0.y + segment0.width + segment1.y + segment1.height)
                    };
                    curRect = {
                        x : point0.x,
                        y : segment0.y,
                        width : point1.x - point0.x,
                        height : point0.y - segment0.y
                    }
                }
            }

            if (
                curRect.width > innerRect.width ||
                (curRect.width === innerRect.width && curRect.height > innerRect.height)
            ) {
                innerRect = curRect;
            }
        }
    }

    callback(innerRect);
};

/**
 * Get segment at specific Y coordinate
 * @param {number} y            Y coordinate
 * @returns {{x: number, y: number, width: number}}
 * @private
 */
Polygon.prototype._widestSegmentAtY = function _widestSegmentAtY(y) {
    var segment = {
            x : 0,
            y : y,
            width : 0
        },
        pointsCount = this.points.length,
        xArray      = [],
        i, j;

    if (pointsCount < 3) {
        return segment;
    }

    // compute all the intersections (x coordinates)
    for (i = 0,  j = pointsCount-1; i < pointsCount; j = i++) {
        var point1 = this.points[i],
            point2 = this.points[j];
        if ((point1.y > y) != (point2.y > y)) {
            if (Math.abs(point2.x - point1.x) < EPSILON) {
                xArray.push(point1.x);
            } else {
                // y = a x + b
                var a = (point2.y - point1.y)/(point2.x - point1.x),
                    b = point2.y - a * point2.x,
                    x = (y - b)/a;
                if (x >= Math.min(point2.x, point1.x) && x <= Math.max(point2.x, point1.x)) {
                    xArray.push(x);
                }
            }
        }
    }

    xArray = _.sortBy(xArray, function (x) {
        return x;
    });

    for (i = 0, j = 1; j < xArray.length; i+=2, j+=2) {
        var width = xArray[j] - xArray[i];
        if (width > segment.width) {
            segment.x = xArray[i];
            segment.width = width;
        }
    }

    return segment;
};

module.exports = Polygon;

/**
 * Create Polygon from SVG polygon|polyline node
 *
 * @param   {object}    node        xml2js node from SVG file
 * @param   {boolean}   [line]      true : polyline, false : polygon. False as default
 * @returns {Polygon}               the polygon object
 */
module.exports.fromNode = function fromNode(node, line) {
    var polygon = new Polygon();

    if (line == true) {
        polygon.type = 'polyline';
    }
    if (typeof node != 'undefined' && typeof node.$ != 'undefined') {
        SvgObject.fromNode(polygon, node);

        if (typeof node.$.points != 'undefined') {
            polygon.setPointsFromString(node.$.points);
        }
    }

    return polygon;
};

/**
 * Create Polygon From JSON object
 * @param   {object}    json            JSON polygon Object
 * @param   {boolean}   line            True : polyline, false : polygon
 * @returns {Polygon}
 */
module.exports.fromJson = function fromJson(json, line) {

    var polygon = new Polygon();

    if (line == true) {
        polygon.type = 'polyline';
    }
    if (typeof json != 'undefined') {
        SvgObject.fromJson(polygon, json);

        if (typeof json.points != 'undefined') {
            polygon.points = json.points;
        }
    }

    return polygon;
};