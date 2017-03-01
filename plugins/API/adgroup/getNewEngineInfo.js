/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/12/26
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getNewEngineInfo');
    model.api = '/sources/hostingCampaignInfo/fullInfo';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number',
        'engineType': 'Number',
        'engineNo': 'Number'
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
     /*model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.type) {
            throw new window.Error("API.video.getList: *缺少参数：type");
        }

        app.cache.addParams('request', requestParams);
    };*/

    model._success = function (json, cb) {
        if (json.success) {
            var _data = json.data;

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