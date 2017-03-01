/**
 * @fileOverview
 * @author crow
 * @version 0.0.1
 * @time 15/11/13
 */

/*global app, _, $, console, JSONTree, moment*/
(function (app) {
    'use strict';

    var model = new app.API.model('postSpreadStatus');
    model.api = '/sources/campaign';
    model.type = 'post';
    // 请求参数
    model.requestParams = {
        'campaignId': 'number',
        'onlineStatus': 'String'
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = QC.dataFormat.formatOptionalParams(requestParams);
        if (!requestParams.campaignId) {
            throw new window.Error("API.campaign.postSpreadStatus: *缺少参数：campaignId");
        }
        if (!requestParams.onlineStatus) {
            throw new window.Error("API.campaign.postSpreadStatus: *缺少参数：onlineStatus");
        }
        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb, isFormat) {
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

    app.API.campaign.postSpreadStatus = model.entry;

}(app));