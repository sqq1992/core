/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/10/27
 */
/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';

    var data = {
        userId: 'Number',
        userNick: 'String',
        signupTime: 'Number',
        signinTime: 'Number',
        expireDate: 'Number',
        userTel: '',
        versionNum: "Number",
        engineHostingAdgroupsLimit: 'Object',
        toExpireDaysDiff: 'Number',
        isAdminOp: 'boolean',
        canUseDua11Engine: 'boolean',
        sign: 'String'
    };

    var Model = require('model');
    var utils = require('utils');

    var model = new Model('getInfo');
    model.api = '/sources/users';
    model.type = 'get';

    function formatData(o) {
        o.expireDate = moment(o.expireDate).format('YYYY-MM-DD');
        // 每次新进页面时重置 客服模式状态
        if (o.isAdminOp && app.storage.get('cs.loading')) {
            app.storage.del('cs.loading');
            app.storage.add('csMode', o.versionNum == '9');
            // 暂无更好的办法
            if (o.versionNum == '9') {
                utils.changeCSMode(true);
            }
        }
        return o;
    }

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {
            var result = json.data.users;
            // 是否启动内部数据处理
            if (isFormat) {
                result = utils.copyByfirst(data, result);
                result = utils.selfFormatData(result);
                result = formatData(result);
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