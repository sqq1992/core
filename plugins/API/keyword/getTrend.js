/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/12/20
 */


/*global define, require, exports, module, app, _, $, console*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');


    var model = new Model('getTrend');
    model.api = '/sources/keywords/trend';
    model.type = 'get';

    // �������
    model.requestParams = {
        'keywordId': 'Number',
        'campaignId': 'Number',
        'adgroupId': 'Number',
        'fromDate': 'YYYY-MM-DD',
        'toDate': 'YYYY-MM-DD'
    };

    /**
     * ���������������λ�����û�ж�Ӧ�Ĳ��������ʼ����
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.keywordId) {
            throw new window.Error("API.keyword.getTrend: *ȱ�ٲ�����keywordId");
        }
        if (!requestParams.campaignId) {
            throw new window.Error("API.keyword.getTrend: *ȱ�ٲ�����campaignId");
        }
        if (!requestParams.adgroupId) {
            throw new window.Error("API.keyword.getTrend: *ȱ�ٲ�����adgroupId");
        }
        app.cache.addParams('request', requestParams);
    };

    /**
     * ����ɹ��ص�����
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {
            if (_.isFunction(cb)) {
                cb(json);
            }
        } else {
            if (_.isFunction(cb)) {
                cb({success: false});
            }
        }
    };

    module.exports = model.entry;
});
