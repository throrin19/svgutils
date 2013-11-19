"use strict";

var phantom = require('node-phantom'),
    //html    = '<!DOCTYPE html><html><head><title></title><script type="application/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" /></head><body><svg id="svg" xmlns="http://www.w3.org/2000/svg" version="1.1"></svg></body></html>';
    html    = __dirname + '/../external/svg.html',
    jquery  = __dirname + '/../external';

module.exports = {
    loadSvg : function(xml, type){
        phantom.create(function(err, ph){
            return ph.createPage(function(err, page){
                return page.open(html, function(err,status) {
                    page.evaluate(function(type, xml){
                        $('#svg').append(xml);
                        return $("#svg").find(type)[0].getBoundingClientRect();
                    }, function(err, result){
                        console.log(err, result);
                        ph.exit();
                    }, type, xml);
                });
            });
        });
    }
};