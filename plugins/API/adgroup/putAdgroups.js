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

    var model = new Model('putAdgroups');
    model.api = '/sources/hostingAdgroups';
    model.type = 'put';
    // �������
    model.requestParams = {
        'campaignId': 'Number',
        'engineNo': 'Number',
        'engineType': 'Number'
    };


    /**
     * ���������������λ�����û�ж�Ӧ�Ĳ��������ʼ����
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.campaignId) {
            throw new window.Error("API.adgroup.putAdgroups: *ȱ�ٲ�����campaignId");
        }

        if (!requestParams.engineNo) {
            throw new window.Error("API.adgroup.putAdgroups: *ȱ�ٲ�����engineNo");
        }
        if (!requestParams.engineType) {
            throw new window.Error("API.adgroup.putAdgroups: *ȱ�ٲ�����engineType");
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