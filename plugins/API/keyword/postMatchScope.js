/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/1/2
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('postMatchScope');
    model.api = '/sources/keywords';
    model.type = 'post-arr';
    // �������
    model.requestParams = {
        'campaignId': 'Number',
        'adgroupId': 'Number',
        'matchScope': 'Number',
        'keywordId': 'Number'
    };


    /**
     * ���������������λ�����û�ж�Ӧ�Ĳ��������ʼ����
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.campaignId) {
            throw new window.Error("API.keyword.campaignId: *ȱ�ٲ�����campaignId");
        }

        if (!requestParams.adgroupId) {
         throw new window.Error("API.keyword.adgroupId: *ȱ�ٲ�����adgroupId");
        }

        if (!requestParams.matchScope) {
         throw new window.Error("API.keyword.matchScope: *ȱ�ٲ�����matchScope");
        }

        if (!requestParams.keywordId) {
         throw new window.Error("API.keyword.postMatchScope: *ȱ�ٲ�����postMatchScope");
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