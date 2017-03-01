/**
 * Created by Administrator on 2016/5/23.
 */
define(function (require, exports, module) {
    'use strict';
    var Model = require('model');
    var model = new Model('addRecommend');
    model.api = '/sources/promotion/initUrl';
    model.type = 'post';

    // 请求参数
    model.requestParams = {
        'toNick': 'String',
        'version': 'String',
        'buyPeriod': 'String',
        'type': 'String',
        'rePromotionId': 'String'
    };

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {
            if (_.isFunction(cb)) {
                cb(json);
            }
        } else {
            new PNotify({
                title: '提示',
                text: json.subMsg,
                type: 'notice',
                icon: 'iconfont icon-tishi'
            });
        }
    };

    module.exports = model.entry;
});
/**
 * Created by Administrator on 2016/5/27.
 */
