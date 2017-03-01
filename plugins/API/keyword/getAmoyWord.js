/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/1/20
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getAmoyWord');
    model.api = '/sources/keywords/searchedKeywords';
    model.type = 'get';
    // �������
    model.requestParams = {
        'campaignId': 'Number',
        'adgroupId': 'Number',
        'word': 'String',
        'excludeWords': 'String',
        'decorateWords': 'String'
    };


    /**
     * ���������������λ�����û�ж�Ӧ�Ĳ��������ʼ����
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.campaignId) {
            throw new window.Error("API.keyword.getAmoyWord: *ȱ�ٲ�����campaignId");
        }

        if (!requestParams.adgroupId) {
            throw new window.Error("API.keyword.getAmoyWord: *ȱ�ٲ�����adgroupId");
        }

        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb) {
        if (json.success) {
            var _data = json.data.keywords;

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