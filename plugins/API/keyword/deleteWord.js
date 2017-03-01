/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/1/6
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('deleteWord');
    model.api = '/sources/keywords';
    model.type = 'delete-arr';
    model.requestParams = {
        'campaignId': 'Number',
        'adgroupId': 'Number',
        'keywordId': 'Number',
        'isInBlackList': 'Boolean'
    };


    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.campaignId) {
            throw new window.Error("API.keyword.deleteWord: *????????campaignId");
        }

        if (!requestParams.adgroupId) {
            throw new window.Error("API.keyword.deleteWord: *????????adgroupId");
        }

        if (!requestParams.keywordId) {
            throw new window.Error("API.keyword.deleteWord: *????????keywordId");
        }

        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb) {
        if (json.success) {
            var _data = json;

            if (_.isFunction(cb)) {
                cb(_data);
            }
        } else {
            if (_.isFunction(cb)) {
                cb({success: false});
            }
        }
    };

    module.exports = model.entry;
});