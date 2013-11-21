"use strict";

var Matrix = require(__dirname + '/matrix'),
    utils  = require(__dirname + '/utils');

module.exports = Matrix;

/**
 * Create Matrix from element informations
 *
 * @param {object}      bbox            Bounding box
 * @param {SvgObject}   element         Svg Element
 * @return {Matrix}                     Applied Matrix object
 */
module.exports.fromElement = function(bbox, element){
    if(typeof element.transform != 'undefined'){
        var tstr = element.transform;

        var res = [];
        tstr = tstr.replace(/(?:^|\s)(\w+)\(([^)]+)\)/g, function (all, name, params) {
            params = params.split(/\s*,\s*/);
            if (name == "rotate" && params.length == 1) {
                params.push(0, 0);
            }
            if (name == "scale") {
                if (params.length == 2) {
                    params.push(0, 0);
                }
                if (params.length == 1) {
                    params.push(params[0], 0, 0);
                }
            }
            if (name == "skewX") {
                res.push(["m", 1, 0, math.tan(rad(params[0])), 1, 0, 0]);
            } else if (name == "skewY") {
                res.push(["m", 1, math.tan(rad(params[0])), 0, 1, 0, 0]);
            } else {
                res.push([name.charAt(0)].concat(params));
            }
            return all;
        });
        return utils.transform2matrix(res, bbox);
    }
    return new Matrix();
};