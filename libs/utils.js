"use strict";

var phantom = require('node-phantom'),
    jsdom   = require("jsdom"),
    utils   = require(__dirname + '/../libs/matrix/utils'),
    _       = require('underscore');

module.exports = {
    /**
     * @deprecated
     */
    loadSvg : function(xml, type, callback){

        var html = '<!DOCTYPE html><html><head><title></title></head><body style="margin: 0; padding: 0;"><svg id="svg" xmlns="http://www.w3.org/2000/svg" version="1.1" style="margin: 0; padding: 0;">'+ xml +'</svg></body></html>';

        phantom.create(function(err, ph){
            ph.createPage(function(err, page){
                page.set('content', html, function(){
                    page.evaluate(function(type){
                        return document.body.children[0].lastElementChild.getBBox();
                    }, function(err, result){
                        ph.exit();
                        callback(utils.bbox(result.x, result.y, result.width, result.height));
                    }, type);
                });
            });
        });

        // uncomment if jsdom work with getBBOX() or getBoundingClientRect() functions
//        jsdom.env({
//            html : html,
//            done : function(errors, window){
//                console.log(window.document.body.children[0].children[0].getBoundingClientRect());
//                callback({});
//            }
//        });
    }
};