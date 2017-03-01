/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/1/21
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getRecomPrices');
    model.api = '/sources/keywordsDiagnosisInfo';
    model.type = 'post-arr';
    // �������
    model.requestParams = {
        'adgroupId': 'Number',
        'campaignId': 'Number',
        'word': 'Array'
    };


    /**
     * ���������������λ�����û�ж�Ӧ�Ĳ��������ʼ����
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.adgroupId) {
            throw new window.Error("API.keyword.getRecomPrices: *ȱ�ٲ�����adgroupId");
        }

        if (!requestParams.campaignId) {
            throw new window.Error("API.keyword.getRecomPrices: *ȱ�ٲ�����campaignId");
        }

        if (!requestParams.word) {
            throw new window.Error("API.keyword.getRecomPrices: *ȱ�ٲ�����word");
        }

        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb) {
        if (json.success) {
            var _data = json.data.keywordDiagnosisInfo;

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