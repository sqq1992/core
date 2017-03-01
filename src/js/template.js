/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/12/30
 */

/*global define, require, exports, module, app, _, uic, $, console*/
define(function (require, exports, module) {
    'use strict';

    var TEMPLATE = require('template');


    // 计划列表模块父节点模块
    var content = document.getElementById('content');


    var template = '<div class="panel panel-default panel-border hide" id="{{id}}">\n    <div class="panel-body">\n        <div class="uic-table-box">\n            <table class="uic-table">\n                <tbody>\n                <tr>\n                    {{if data}}\n                    <td>\n                        <h4>\n                            优化简报\n                            <span class="hintcss hint--top hint--info" data-hint="亲，优化简报是整个账户的优化大致情况，优化的详情请见关键词列表的宝贝日志">\n                                <i class="iconfont icon-wenhao"></i>\n                            </span>\n                        </h4>\n                        <p>上次优化时间：{{data.optimizeTime}}</p>\n                    </td>\n                    <td>\n                        <h4>{{data.adgroupCount}}个</h4>\n                        <p>共优化宝贝</p>\n                    </td>\n                    <td>\n                        <h4>{{data.addWordCount}}个</h4>\n                        <p>共添加关键词</p>\n                    </td>\n                    <td>\n                        <h4>{{data.delWordCount}}个</h4>\n                        <p>共删除关键词</p>\n                    </td>\n                    <td>\n                        <h4>{{data.modifyPriceWordCount}}个</h4>\n                        <p>共修改关键词价格</p>\n                    </td>\n                    <td>\n                        <h4>{{data.matchScopeCount}}个</h4>\n                        <p>共修改关键词匹配方式</p>\n                    </td>\n                    {{if versionNum >= 5 && versionNum !== 6}}\n                    <td>\n                        <a href="#tool/grabRanks">\n                            <h4>\n                                {{data.autoGrabStatus}}个\n                            <span class="hintcss hint--left hint--info" data-hint="已经使用的数量/总共可以使用的数据量">\n                                <i class="iconfont icon-wenhao"></i>\n                            </span>\n                            </h4>\n                            <p>自动抢排名词数</p>\n                        </a>\n                    </td>\n                    {{/if}}\n                    {{else}}\n                    <td>\n                        <h4>\n                            优化简报\n                            \n                            <span class="hintcss hint--top hint--info" data-hint="亲，优化简报是整个账户的优化大致情况，优化的详情请见关键词列表的宝贝日志">\n                            <i class="iconfont icon-wenhao"></i>\n                        </span>\n                        </h4>\n                        <p>{{error}}</p>\n                    </td>\n                    {{/if}}\n                </tr>\n                </tbody>\n            </table>\n            <i class="iconfont icon-delete close"></i>\n        </div>\n    </div>\n</div>';

    var Module = function () {
        this.option = {
            id: 'briefing'
        };
        this.loginDate = (new Date()).toLocaleDateString();
        this.insert();
    };

    Module.prototype = {
        getHtml: function () {
            return render(this.option).trim();
        },
        getDom: function () {
            return $.parseHTML(render(this.option).trim())[0];
        },
        insert: function () {
            content.appendChild(this.getDom());
        },
        checkSession: function () {
            return app.storage.get(this.uid + ".briefing.lastClose") != this.loginDate;
        },
        updSession: function () {
            app.storage.add(this.uid + ".briefing.lastClose", this.loginDate);
        },
        initEvent: function () {
            var _this = this;
            $('#' + _this.option.id).on("click", '.close', function () {
                $('#' + _this.option.id).remove();
                this.updSession();
            }.bind(this));
        },
        data: function () {
            var _this = this;

        }
    };

    Module.prototype.render = function () {
        this.data();
    };

    Module.prototype.update = function () {
        this.data();
    };

    Module.prototype.destroy = function () {
        $('#' + this.option.id).remove();
    };


    module.exports = Module;
});