/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/10/27
 */
/*global define, require, exports, module, app, _, $, console*/
define(function (require, exports, module) {
    'use strict';
    var unitData = {
        campaignId: 'Number',     // 计划ID
        engineNo: 'Number',       // 引擎编号
        mandateStatus: 'String',  // 托管状态
        mandateType: 'Number'     // 托管策略
    };
    var Model = require('model');
    var utils = require('utils');
    var CONFIG = require('CONFIG');

    var model = new Model('getEngine');
    model.api = '/sources/users/engines';
    model.type = 'get';

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {
            var result = json.data.engines;
            if (isFormat) {
                var key;
                for (key in result) {
                    if (result.hasOwnProperty(key)) {
                        if (result[key]) {
                            result[key] = utils.copyByfirst(unitData, result[key]);
                            // 人机标识
                            result[key].isHmi = CONFIG.mandate.hmi.hasOwnProperty(result[key].mandateType);
                        }
                    }
                }
            }

            model.data = result;
            if (_.isFunction(cb)) {
                cb(result);
            }
        } else {
            if (_.isFunction(cb)) {
                cb({success: false});
            }
        }
    };

    module.exports = model.entry;
});