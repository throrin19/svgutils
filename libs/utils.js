"use strict";

var phantom = require('node-phantom'),
    html    = __dirname + '/../external/svg.html',
    jquery  = __dirname + '/../external',
    utils   = require(__dirname + '/../libs/matrix/utils');

module.exports = {
    loadSvg : function(xml, type, callback){
        phantom.create(function(err, ph){
            return ph.createPage(function(err, page){
                page.viewportSize = { width: 1920, height: 1080 };
                return page.open(html, function(err,status) {
                    page.evaluate(function(type, xml, utils){
                        $('#svg').append(xml);
                        $('body').html($('body').html());
                        var clientBox = $("#svg").find(type)[0].getBoundingClientRect();
                        return utils.bbox(clientBox.left, clientBox.top, clientBox.width, clientBox.height);
                    }, function(err, result){
                        ph.exit();
                        callback(result);
                    }, type, xml, utils);
                });
            });
        });
    }
};