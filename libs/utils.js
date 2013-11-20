"use strict";

var phantom = require('node-phantom'),
    html    = __dirname + '/../external/svg.html',
    jquery  = __dirname + '/../external',
    utils   = require(__dirname + '/../libs/matrix/utils');

module.exports = {
    loadSvg : function(xml, type, callback){
        phantom.create(function(err, ph){
            return ph.createPage(function(err, page){
                return page.open(html, function(err,status) {
                    page.evaluate(function(type, xml){
                        $('#svg').append(xml);
                        $('body').html($('body').html());
                        var clientBox = $("#svg").find(type)[0].getBoundingClientRect();
                        return clientBox;
                    }, function(err, result){
                        ph.exit();
                        callback(utils.bbox(result.left, result.top, result.width, result.height));
                    }, type, xml);
                });
            });
        });
    }
};