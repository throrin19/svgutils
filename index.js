'use strict';

var Matrix      = require(__dirname +'/libs/matrix/extends'),
    Parser      = require(__dirname + '/libs/parser'),
    Svg         = require(__dirname + '/libs/svg'),
    Elements    = require(__dirname + '/libs/objects/index'),
    utilsMatrix = require(__dirname + '/libs/matrix/utils');

module.exports = {
    Matrix      : Matrix,
    Parser      : Parser,
    Svg         : Svg,
    Elements    : Elements,
    utilsMatrix : utilsMatrix
};