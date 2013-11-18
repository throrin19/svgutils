"use strict";

var jsdom   = require('jsdom'),
    fs      = require('fs'),
    jquery  = __dirname + '/../external/jquery.min.js';

var window = jsdom.jsdom('<html><head></head><body><svg xmlns="http://www.w3.org/2000/svg" style="width: 2000px; height: 2000px" version="1.1"></svg></body></html>').parentWindow;

module.exports = {
    loadSvg : function(callback){
        jsdom.jQueryify(
            window,
            jquery,
            function(){
                callback(window);
            }
        );
    }
};