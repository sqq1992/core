/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/1/14
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('putNewCampaign');
    model.api = '/sources/campaign';
    model.type = 'put';
    // �������
    model.requestParams = {
        'title': 'String'
    };


    /**
     * ���������������λ�����û�ж�Ӧ�Ĳ��������ʼ����
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.title) {
            throw new window.Error("API.campaign.putNewCampaign: *ȱ�ٲ�����title");
        }
        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb) {
        if (_.isFunction(cb)) {
            cb(json);
        }
    };

    module.exports = model.entry;
});