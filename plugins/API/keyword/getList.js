/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/10/13
 */


/*global app, _, $, console, JSONTree, moment*/
define(function (require, exports, module) {
    'use strict';
    var Model = require('model');
    var utils = require('utils');
    var CONFIG = require('CONFIG');

    var report = {
        "impressions": 'Number',
        "click": 'Number',
        "cost": 'Number',
        "ctr": 'Number',
        "cvr": 'Number',
        "cpc": 'Number',
        "cpm": 'Number',
        "directPay": 'Number',
        "indirectPay": 'Number',
        "pay": 'Number',
        "directPayCount": 'Number',
        "indirectPayCount": 'Number',
        "payCount": 'Number',
        "favItemCount": 'Number',
        "favShopCount": 'Number',
        "favCount": 'Number',
        "realRoi": 'Number',
        "favRoi": 'Number',
        "avgPos": 'Number',
        "cartTotal": 'Number',
        "directCartTotal": 'Number',
        "indirectCartTotal": 'Number'
    };

    var model = new Model('getList');
    model.api = '/sources/keywords';
    model.type = 'get';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number',
        'adgroupId': 'Number',
        'fromDate': 'YYYY-MM-DD',
        'toDate': 'YYYY-MM-DD',
        'isYesterdayDate': 'Bollean',
        'filterKeywordIds' : 'String'
    };

    function dataFormat(o) {
        // -1|0|1|2|3
        var adGroupOptimizeStatus, keywordOptimizeStatus, a, b;
        var _black = [];
        o.unblack = {};

        if (o.blackwords) {
            o.blackwords.forEach(function (elem) {
                if (elem.type === 'TODEL') {
                    _black.push(elem.keywordId);
                }

                if (elem.type === 'TOKEEP') {
                    o.unblack[elem.keywordId] = 1;
                }
            });
        }


        a = o.adgroup.daemonOptimizeSetting;
        if (a.isOptimizeChangePrice === '1' && a.isOptimizeGenerateWord === '1') {
            // 宝贝全自动优化
            adGroupOptimizeStatus = 1;
        } else if (a.isOptimizeChangePrice === '1' && a.isOptimizeGenerateWord === '0') {
            // 宝贝只优化价格
            adGroupOptimizeStatus = 0;
        } else if (a.isOptimizeChangePrice === '0' && a.isOptimizeGenerateWord === '0') {
            if (o.adgroup.isMandate) {
                // 宝贝不优化[出词&出价]
                adGroupOptimizeStatus = 3;
            } else {
                // 宝贝不自动优化
                adGroupOptimizeStatus = -1;
            }
        } else {
            // 宝贝只优化出词
            adGroupOptimizeStatus = 2;
        }

        o.keywords.forEach(function (elem) {
            b = elem.daemonOptimizeSetting;
            // TODO 全网数据合并 bugfix 临时处理
            //$.extend(elem.report, elem.wordBase);

            elem.report.dayCtr = elem.wordBase ? parseFloat(elem.wordBase.dayCtr).toFixed(2) : '-';
            elem.report.dayCvr = elem.wordBase ? parseFloat(elem.wordBase.dayCvr).toFixed(2) : '-';
            elem.report.dayPrice = elem.wordBase ? parseFloat(elem.wordBase.dayPrice).toFixed(2) : '-';
            elem.report.dayCompetition = elem.wordBase ? elem.wordBase.dayCompetition : '-';
            elem.report.dayClick = elem.wordBase ? elem.wordBase.dayClick : '-';
            elem.report.dayPv = elem.wordBase ? elem.wordBase.dayPv : '-';

            if (!elem.wordBase) {
                elem.wordBase = {
                    dayPrice: 0,
                    dayCtr: 0,
                    dayCompetition: 0,
                    dayClick: 0,
                    dayPv: 0
                }
            }

            if (b.isOptimizeChangePrice === '1' && b.isOptimizeGenerateWord === '1') {
                // 关键词全自动优化
                keywordOptimizeStatus = 1;
            } else if (b.isOptimizeChangePrice === '1' && b.isOptimizeGenerateWord === '0') {
                // 关键词只优化价格
                keywordOptimizeStatus = 0;
            } else if (b.isOptimizeChangePrice === '0' && b.isOptimizeGenerateWord === '0') {
                // 关键词不自动优化
                keywordOptimizeStatus = -1;
            }

            // 命中黑名单，但不删除的关键词
            if (o.unblack[elem.keywordId]) {
                o.unblack[elem.keywordId] = elem.keyword.word;
            }

            elem.wordText = elem.keyword.word;

            if (_.indexOf(_black, elem.keywordId) > -1 && b.isOptimizeGenerateWord !== '0') {
                elem.blackStatus = 'toDel';
                elem.keyword.blackList.forEach(function (element) {
                    elem.wordText = elem.wordText.replace(element, '<font style="text-decoration: line-through">' + element + '</font>');
                });
            }

            switch (adGroupOptimizeStatus) {
                case -1:
                    elem.optimizeStatus = -1;
                    break;
                case 0:
                    // 除了不自动优化状态，其他全是只优化价格
                    if (keywordOptimizeStatus === -1) {
                        elem.optimizeStatus = -1;
                    } else {
                        elem.optimizeStatus = 0;
                    }
                    break;
                case 1:
                    elem.optimizeStatus = keywordOptimizeStatus;
                    //elem.optimizeStatus = -1;
                    break;
                case 2:
                    // 除了不自动优化状态，其他全是只优化出词
                    if (keywordOptimizeStatus === -1) {
                        elem.optimizeStatus = -1;
                    } else {
                        elem.optimizeStatus = 2;
                    }
                    break;
                case 3:
                    // 除了不自动优化状态，其他全是不优化[出词&出价]
                    if (keywordOptimizeStatus === -1) {
                        elem.optimizeStatus = -1;
                    } else {
                        elem.optimizeStatus = 3;
                    }
                    break;
                default:
                    // 未知状态
                    elem.optimizeStatus = 999;
                    break;
            }

            elem.report = utils.selfFormatData(elem.report);
            elem.report = utils.getReportByImpression(elem.report, CONFIG.manualKeywordReports);
            // 监控
            if (app.storage.get('csMode')) {
                if (elem.monitorConfigSettingVO) {
                    elem.monitorConfig = elem.monitorConfigSettingVO.configs.map(function (item) {
                        return {
                            'fieldId': item.fieldId,
                            'quantityParams': item.quantityParams,
                            'calculateSymbol': item.calculateSymbol,
                            'calculateParams': item.calculateParams
                        };
                    });
                    elem.monitorStatus = elem.monitorConfigSettingVO.batch ? '2' : '1';
                    elem.filterMonitor = elem.monitorConfigSettingVO.configs[0].relateIds;
                } else {
                    // 未设定
                    elem.monitorStatus = '0';
                }
            }
            elem.detail = {};
        });
        return o;
    }

    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.fromDate) {
            requestParams.fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
        }
        if (!requestParams.toDate) {
            requestParams.toDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        }
        if (!requestParams.campaignId) {
            throw new window.Error("API.keyword.getList: *缺少参数：campaignId");
        }

        if (!requestParams.adgroupId) {
            throw new window.Error("API.keyword.getList: *缺少参数：adgroupId");
        }

        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb, isFormat) {
        if (json.success) {
            var _data = json;
            if (isFormat) {
                _data = dataFormat(json.data);
            }
            if (_.isFunction(cb)) {
                cb(_data);
            }
        } else {
            if (_.isFunction(cb)) {
                cb({
                    success: false
                });
            }
        }
    };

    module.exports = model.entry;
});