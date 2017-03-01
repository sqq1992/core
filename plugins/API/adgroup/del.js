/**
 * @fileOverview
 * @author crow
 * @version 0.0.1
 * @time 15/11/13
 */

/*global app, _, $, console, JSONTree, moment*/
(function (app) {
    'use strict';

    var model = new app.API.model('del');
    model.api = '/sources/adgroups';
    model.type = 'delete';
    // 请求参数
    model.requestParams = {
        'adgroupId': 'Number'
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = QC.dataFormat.formatOptionalParams(requestParams);
        if (!requestParams.adgroupId) {
            throw new window.Error("API.adGroup.del: *缺少参数：adgroupId");
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

    app.API.adGroup.del = model.entry;

}(app));