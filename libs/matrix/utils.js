"use strict";

var Matrix = require(__dirname + '/matrix');

module.exports = {
    clone : function(obj) {
        if (typeof obj == "function" || Object(obj) !== obj) {
            return obj;
        }
        var res = new obj.constructor;
        for (var key in obj) if (obj[has](key)) {
            res[key] = clone(obj[key]);
        }
        return res;
    },
    parseTransformString : function(TString){
        if (!TString) {
            return null;
        }
        var paramCounts = {r: 3, s: 4, t: 2, m: 6},
            data = [];
        if (is(TString, "array") && is(TString[0], "array")) { // rough assumption
            data = this.clone(TString);
        }
        if (!data.length) {
            Str(TString).replace(tCommand, function (a, b, c) {
                var params = [],
                    name = b.toLowerCase();
                c.replace(pathValues, function (a, b) {
                    b && params.push(+b);
                });
                data.push([b].concat(params));
            });
        }
        return data;
    },
    rgTransform : new RegExp("^[a-z][" + spaces + "]*-?\\.?\\d"),
    transform2matrix : function(tstr, bbox){
        var tdata = this.parseTransformString(tstr),
            m = new Matrix;
        if (tdata) {
            for (var i = 0, ii = tdata.length; i < ii; i++) {
                var t = tdata[i],
                    tlen = t.length,
                    command = Str(t[0]).toLowerCase(),
                    absolute = t[0] != command,
                    inver = absolute ? m.invert() : 0,
                    x1,
                    y1,
                    x2,
                    y2,
                    bb;
                if (command == "t" && tlen == 3) {
                    if (absolute) {
                        x1 = inver.x(0, 0);
                        y1 = inver.y(0, 0);
                        x2 = inver.x(t[1], t[2]);
                        y2 = inver.y(t[1], t[2]);
                        m.translate(x2 - x1, y2 - y1);
                    } else {
                        m.translate(t[1], t[2]);
                    }
                } else if (command == "r") {
                    if (tlen == 2) {
                        bb = bb || bbox;
                        m.rotate(t[1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                    } else if (tlen == 4) {
                        if (absolute) {
                            x2 = inver.x(t[2], t[3]);
                            y2 = inver.y(t[2], t[3]);
                            m.rotate(t[1], x2, y2);
                        } else {
                            m.rotate(t[1], t[2], t[3]);
                        }
                    }
                } else if (command == "s") {
                    if (tlen == 2 || tlen == 3) {
                        bb = bb || bbox;
                        m.scale(t[1], t[tlen - 1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                    } else if (tlen == 4) {
                        if (absolute) {
                            x2 = inver.x(t[2], t[3]);
                            y2 = inver.y(t[2], t[3]);
                            m.scale(t[1], t[1], x2, y2);
                        } else {
                            m.scale(t[1], t[1], t[2], t[3]);
                        }
                    } else if (tlen == 5) {
                        if (absolute) {
                            x2 = inver.x(t[3], t[4]);
                            y2 = inver.y(t[3], t[4]);
                            m.scale(t[1], t[2], x2, y2);
                        } else {
                            m.scale(t[1], t[2], t[3], t[4]);
                        }
                    }
                } else if (command == "m" && tlen == 7) {
                    m.add(t[1], t[2], t[3], t[4], t[5], t[6]);
                }
            }
        }
        return m;
    }
};