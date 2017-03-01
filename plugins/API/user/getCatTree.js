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
        cid: 'Number',
        name: 'String',
        sub: null
    };

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getCatTree');
    model.api = '/sources/category/userCatTree';
    model.type = 'get';

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {
            var result = json.data.sellerCatTree;
            if (isFormat) {
                var arr = [];
                var temp;
                if (result[0]) {
                    result[0].forEach(function (elem) {
                        temp = result[elem.cid];
                        if (temp) {
                            elem.sub = [];
                            temp.forEach(function (ele) {
                                elem.sub.push(utils.copyByfirst(unitData, ele));
                            });
                        }
                        arr.push(utils.copyByfirst(unitData, elem));
                    });
                }
                result = arr;
            }

            // 下拉选择
            result.splice(0, 0, {
                cid: -1,
                name: '所有类目',
                selected: true
            });

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