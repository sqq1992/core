/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/10/28
 */

/*global app, _, $, console, JSONTree, moment*/
(function (app) {
    'use strict';

    var model = new QC.API.model('getSchedules');
    model.api = '/sources/campaign/{campaignId}/currentSchedules/all';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number'
    };

    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = QC.dataFormat.formatOptionalParams(requestParams);
        if (!requestParams.campaignId) {
            throw new window.Error("API.campaign.getSchedules: *缺少参数：campaignId");
        }
        app.cache.addParams('request', requestParams);
    };

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {
            var result = json;
            if (isFormat) {
                result = QC.dataFormat.schedule.parse(result.data.schedule);
            }
            if (_.isFunction(cb)) {
                cb(result);
            }
        } else {
            if (_.isFunction(cb)) {
                cb({success: false});
            }
        }
    };

    app.API.campaign.getSchedules = model.entry;
}(app));