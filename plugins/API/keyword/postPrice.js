/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/1/7
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('');
    model.api = '/sources/keywords';
    model.type = 'post-arrs';
    // �������
    model.requestParams = {
        'campaignId': 'Number',
        'adgroupId': 'Number',
        'maxPrice': 'Array',
        'keywordId': 'Array'
    };


    /**
     * ���������������λ�����û�ж�Ӧ�Ĳ��������ʼ����
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.maxPrice) {
            throw new window.Error("API.keyword.postPrice: *ȱ�ٲ�����maxPrice");
        }

        if (!requestParams.keywordId) {
            throw new window.Error("API.keyword.postPrice: *ȱ�ٲ�����keywordId");
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