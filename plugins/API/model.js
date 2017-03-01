/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/10/27
 */

/*global define, require, exports, module, app, _, $, console*/
define(function (require, exports, module) {
    'use strict';

    var Dialog = require('Dialog');

    var option = {
        'isFormat': false,      // 是否内部格式化
        'isCache': false,        // 是否缓存数据
        'extraMethod' : false      // 额外的接口
    };

    var Model = function (name) {
        this.name = name;
        this.api = '';
        this.type = '';
        this._initRequestParams = new Function();     //处理请求参数，如何缓存中没有对应的参数，则初始化它
        this.requestParams = null;            // 请求参数
        this.data = null;
        this.isCustom = false;                  // 支持自定义参数，不用cache中获取
        this.entry = this.main.bind(this);
    };

    /**
     * 请求执行前
     * @private
     */
    Model.prototype._beforeSend = function () {
        console.log('API.' + this.name + ': 接口发送前');
    };

    Model.prototype._success = function () {
        console.log('API.' + this.name + ': 建立连接');
    };

    Model.prototype._complete = function () {
        console.log('API.' + this.name + ': 接口完成');
    };

    Model.prototype._error = function (a, b) {
        if (console.error) {
            console.error('====ERROR======API.' + this.api + ': 接口出错' + b);
        } else {
            throw '====ERROR======API.' + this.api + ': 接口出错' + b;
        }
    };


    /**
     * 主函数
     * @param bsce      {Object}    b:beforeSend, s: success, e: error, c: complete
     * @param cb        {Function}  回调函数，不需要特殊处理数据情况下，就直接传入回调函数就可以（部分封装内部会有自带的数据处理）。
     *                              当封装的API数据处理不满足添加，可以通过bac,中的s覆盖初始处理函数
     * @param isFormat {boolean}    是否启动内部数据格式方法
     */
    Model.prototype.main = function (absec, cb, opt) {
        var self = this;
        var _absec = {},
            _cb = null,
            _opt = $.extend({}, option, opt);

        if (_opt.extraMethod && this.extraMethod) {
            // 偷偷打个洞
            this.extraMethod(_opt);
        }

        var ajaxConfig = {
            'type': self.type,
            'api': self.api,
            'data': _.keys(self.requestParams),
            'beforeSend': self._beforeSend,
            'success': self._success,
            'complete': self._complete,
            'error': self._error
        };

        // 处理第一个参数
        if (_.isFunction(absec)) {
            _cb = absec;
        } else if (_.isObject(absec)) {
            _absec = absec;
        }

        if (_.isObject(_absec) && _absec.data) {
            ajaxConfig = $.extend({}, ajaxConfig, _absec);
        } else {
            self._initRequestParams(self.requestParams);
        }

        if (cb) {
            if (_.isFunction(cb)) {
                _cb = cb;
            } else {
                _opt = cb;
            }
        }
        // 处理请求参数

        // 请求
        // TODO 如果缓存有数据，直接使用
        if (_opt.isCache && self.data) {
            // 直接读取缓存
            if (_cb) {
                _cb(self.data);
            }
        } else {
            app.connect.ajax($.extend(true, ajaxConfig, {
                beforeSend: _absec.beforeSend || self._beforeSend.bind(self),
                success: function (json) {
                    if (json.evm) {
                        var str = '';
                        str += '请截图联系客服<br/>';
                        str += '类型：' + json.evm.type + '<br/>';
                        str += 'id：' + json.evm.traceId + '<br/>';
                        str += '服务错误代码：' + json.evm.serviceCode + '<br/>';
                        str += '服务方法错误代码：' + json.evm.methodCode;
                        return Dialog.showConfirm({
                            'style': 'danger',
                            'content': str
                        });
                    }

                    if (_absec.success) {
                        _absec.success(json, _cb, _opt.isFormat || false);
                    } else {
                        self._success(json, _cb, _opt.isFormat || false);
                    }
                },
                complete: _absec.complete || self._complete.bind(self)
            }));
        }
    };

    module.exports = Model;
});