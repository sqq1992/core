/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/10/13
 */


/*global app, _, $, console, JSONTree, moment*/
define(function(require, exports, module) {
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
        "avgPos": '-',
        "cartTotal": 'Number',
        "directCartTotal": 'Number',
        "indirectCartTotal": 'Number'
    };

    var paging = {
        'pageNo': 'Number', // 当前页
        'pageSize': 'Number', // 每页几条数据
        'pageCount': 'Number', // 总共几页
        'allCount': 'Number', // 总共宝贝个数
        'mandateCount': 'Number', // 优化的宝贝个数
        'notMandateCount': 'Number', // 不优化的宝贝个数
        'openGenerateWordCount': 'Number' // 全自动优化的宝贝个数
    };

    var unitData = {
        'adgroupId': 'Number', // 广告组ID
        'numIid': 'Number', // 宝贝ID
        'offlineType': 'String', // 排查下架, audit_offline
        'onlineStatus': 'String', // 推广状态
        'wordMaxPrice': 'Number', // 关键词最高限价
        'wordMaxPriceScope': 'Number', // 1|2 计划级别|宝贝级别
        'interventionStatus': 'Number', // 加大减小投入，0|1|2|3|4|5|6 没有|正在加大投入|正在减小|今日已加大|今日已减少|正在加大|正在减小
        'title': 'String',
        'volume': 'Number',
        'price': 'Number',
        'picUrl': 'Link',
        'delistTime': 'Date',
        'campaigns': 'Object',
        'report': 'Object',
        'status': 'Number', // 9999|-1|0|1|2    投放中|不自动优化|只优化价格|全自动优化|只优化出词
        'matchStatus': 'Number' // 1 | 0 优化匹配方式|不优化匹配方式
    };

    function dataFormat(data) {
        var arr = [],
            result = {};
        var temp,
            campaignId = app.cache.getParams('campaignId'),
            fromDate = app.cache.getParams('fromDate'),
            toDate = app.cache.getParams('toDate'),
            engineNo = app.cache.getParams('engineNo'),
            engineType = app.cache.getParams('engineType');

        data.adgroups.forEach(function(elem) {
            // 处理adgroup层
            temp = utils.copyByfirst(unitData, elem.adgroupItem.adgroup);
            //处理item层
            temp = utils.copyByfirst(temp, elem.adgroupItem.item);
            //处理报表层
            temp.report = utils.copyByfirst(report, elem.report);
            temp.report = utils.selfFormatData(temp.report);

            // 宝贝还在哪些托管计划
            temp.campaigns = [];
            if (_.isArray(elem.adgroupItem.item.campaignIds)) {
                elem.adgroupItem.item.campaignIds.forEach(function(ele, index) {
                    temp.campaigns.push({
                        campaignId: ele,
                        name: elem.adgroupItem.item.campaignTitles[index]
                    });
                });
            }

            // 状态处理
            temp.status = parseInt(elem.daemonOptimizeSettingVO.isOptimizeGenerateWord, 10);
            if (temp.status === 1) {
                if (parseInt(elem.daemonOptimizeSettingVO.isOptimizeChangePrice, 10) !== 1) {
                    temp.status = 2;
                }
            }

            // 推广状态
            if (elem.adgroupItem.adgroup.onlineStatus == 'online') {
                temp.mandate = '<span class="msg-success">推广中</span>';
                temp.iconstausOnline = 'zanting';
                temp.icontextOnline = '暂停';
            } else {
                temp.mandate = '<span class="msg-danger">暂停</span>';
                temp.iconstausOnline = 'bofang';
                temp.icontextOnline = '推广';
            }

            temp.isMobileDicount = data.platform.mobileStatus;
            temp.engineType = engineType;

            // 排查下架
            if (elem.adgroupItem.adgroup.offlineType == "audit_offline") {
                temp.auditOffline = (!!elem.adgroupItem.adgroup.reason);
                temp.auditOfflineText = utils.formatOfflineText(elem.adgroupItem.adgroup.reason) + "&#xa;您可以通过点击排查下架，查询相关规则。&#xa;具体原因可以拨打0571-88157999号码咨询。";
                temp.auditOfflineHref = "http://rule.alimama.com/?spm=0.0.0.0.IQgCos#!/announce/business/detail?id=8306451&knowledgeid=5857304";
                if (temp.auditOffline) {
                    temp.mandate = '<span class="msg-danger">排查下架</span>';
                    temp.iconstausOnline = 'off';
                    temp.icontextOnline = '';
                }
            }

            if (elem.adgroupItem.adgroup.isMandate === true) {
                temp.status = '已托管';
                temp.iconstausisMandate = 'cancleMandate'; //TODO 干嘛的
                temp.icontextisMandate = '取消托管';
                
                temp.href = '#list/autokeyword?fromDate=' + fromDate +
                    '&toDate=' + toDate +
                    '&campaignId=' + campaignId +
                    '&adgroupId=' + elem.adgroupItem.adgroup.adgroupId +
                    '&engineNo=' + engineNo +
                    '&engineType=' + engineType +
                    '&isYesterdayDate=true';
            } else {
                temp.status = '未托管';
                temp.iconstausisMandate = 'mandate';
                temp.icontextisMandate = '加入托管';

                temp.href = '#list/manualkeyword?fromDate=' + fromDate +
                    '&toDate=' + toDate +
                    '&campaignId=' + campaignId +
                    '&adgroupId=' + elem.adgroupItem.adgroup.adgroupId +
                    //'&engineNo=' + engineNo +
                    '&isYesterdayDate=true';
            }

            if (elem.adgroupItem.adgroup.isMandate === true) {
                temp.wMPriceStatus = 'table-show';
                temp.wMPriceValue = elem.adgroupItem.adgroup.wordMaxPrice;
                temp.wordMaxPriceScope = elem.adgroupItem.adgroup.wordMaxPriceScope;
                temp.isActive = 'active';
            } else {
                temp.wMPriceStatus = 'table-show';
                temp.wMPriceValue = '-';
                temp.isActive = '';
            }

            temp.adgroupId = elem.adgroupItem.adgroup.adgroupId.toString();
            temp.onlineStatus = elem.adgroupItem.adgroup.onlineStatus;
            // TODO
            // if (__search) {
            //     temp.title = elem.adgroupItem.item.title.replace(eval('/' + __search + '/gi'), '<span style="color: red;">' + __search + '</span>');
            // } else {
            //     temp.title = elem.adgroupItem.item.title;
            // }

            temp.title = temp.title.replace(/\s/g, '&nbsp;');
            temp.picUrl = elem.adgroupItem.item.picUrl;
            temp.price = elem.adgroupItem.item.price;
            temp.volume = elem.adgroupItem.item.volume.toString();
            temp.numIid = elem.adgroupItem.item.numIid;
            temp.catName = elem.adgroupItem.item.catName;

            switch (elem.adgroupItem.adgroup.interventionStatus) {
                case 0:
                    temp.interventionStatus = '';
                    temp.isInterventionStatus = false;
                    break;
                case 1:
                    temp.interventionStatus = '<div class="adgroup-msg">正在加大投入</div>';
                    temp.isInterventionStatus = true;
                    break;
                case 2:
                    temp.interventionStatus = '<div class="adgroup-msg">正在减小投入</div>';
                    temp.isInterventionStatus = true;
                    break;
                case 3:
                    temp.interventionStatus = '<div class="mgb5">今日已加大投入</div>';
                    temp.isInterventionStatus = true;
                    break;
                case 4:
                    temp.interventionStatus = '<div class="mgb5">今日已减小投入</div>';
                    temp.isInterventionStatus = true;
                    break;
                case 5:
                    temp.interventionStatus = '<div class="adgroup-msg">正在加大投入</div>';
                    temp.isInterventionStatus = true;
                    break;
                case 6:
                    temp.interventionStatus = '<div class="adgroup-msg">正在减小投入</div>';
                    temp.isInterventionStatus = true;
                    break;
            }


            if (elem.adgroupItem.adgroup.isInitBiding === true && elem.adgroupItem.adgroup.initBidStatus !== 'success'
                && elem.adgroupItem.adgroup.initBidStatus !== 'fail' && app.cache.getParams('engineType') !== undefined) {
                elem.daemonOptimizeSettingVO.isOptimizeGenerateWord = 9999;
                temp.href = 'javascript:void(0)';
                temp.isOptimizeGenerateWord = '投放中...';
                temp.isOptimizeGenerateWordVlaue = '9999';
                temp.isMandate = 'doing';
                temp.interventionStatus = '';
                temp.isInterventionStatus = false;
                temp.disabled = 'disabled';
            } else if (elem.daemonOptimizeSettingVO.isOptimizeChangePrice === '0' && elem.daemonOptimizeSettingVO.isOptimizeGenerateWord === '0') {
                if (elem.adgroupItem.adgroup.isMandate) {
                    temp.isOptimizeGenerateWord = '不优化[出词&出价]';
                    temp.isOptimizeGenerateWordVlaue = '1';
                    temp.isMandate = 'true';
                } else {
                    temp.isOptimizeGenerateWord = '不自动优化';
                    temp.isOptimizeGenerateWordVlaue = '-1';
                    temp.isMandate = 'false';
                    temp.interventionStatus = '';
                    temp.isInterventionStatus = false;
                }

            } else if (elem.daemonOptimizeSettingVO.isOptimizeChangePrice === '1' && elem.daemonOptimizeSettingVO.isOptimizeGenerateWord === '0') {
                temp.isOptimizeGenerateWord = '只优化价格';
                temp.isOptimizeGenerateWordVlaue = '0';
                temp.isMandate = 'true';
            } else if (elem.daemonOptimizeSettingVO.isOptimizeChangePrice === '1' && elem.daemonOptimizeSettingVO.isOptimizeGenerateWord === '1') {
                temp.isOptimizeGenerateWord = '全自动优化';
                temp.isOptimizeGenerateWordVlaue = '1';
                temp.isMandate = 'true';
            } else if (elem.daemonOptimizeSettingVO.isOptimizeChangePrice === '0' && elem.daemonOptimizeSettingVO.isOptimizeGenerateWord === '1') {
                temp.isOptimizeGenerateWord = '只优化出词';
                temp.isOptimizeGenerateWordVlaue = '1';
                temp.isMandate = 'true';
            }

            if (elem.daemonOptimizeSettingVO.isOptimizeGenerateWord !== '-1') {
                temp.delistTime = moment(elem.adgroupItem.adgroup.gmtCreate).format('YYYY-M-D HH:mm');
            } else {
                temp.delistTime = false;
            }

            if (elem.daemonOptimizeSettingVO.isOptimizeGenerateWord === '1' || elem.daemonOptimizeSettingVO.isOptimizeGenerateWord === '0') {
                temp.matchScopeClazz = 'show';
            } else {
                temp.matchScopeClazz = 'hideIpt';
            }

            if (elem.daemonOptimizeSettingVO.isOptimizeChangeMatchScope === '1') {
                temp.isOptimizeChangeMatchScope = 'active';
            } else {
                temp.isOptimizeChangeMatchScope = 'close';
            }

            temp.report.price = elem.adgroupItem.item.price;
            temp.report.volume = elem.adgroupItem.item.volume.toString();

            // temp.report = QC.dataFormat.getReport(elem.report, GLOBAL.VARIABLE.campaignReports, QC.cache.getParams('itemListSort'));

            var vo = elem.daemonOptimizeSettingVO;
            if (elem.daemonOptimizeSettingVO.reduceGenerateWordDegree !== undefined) {
                temp.csDestcri1 = '关键词数量：' + elem.keywordsCount + '<br/>出词策略:' + vo.tsStrategy;
                temp.csDestcri2 = (vo.isOptimizeGenerateWord == '1' ? '优化' : '不优化') + '出词<br/>'
                    + (vo.isOptimizeChangePrice == '1' ? '优化' : '不优化') + '改价<br/>'
                    + (vo.isOptimizeCreative == '1' ? '优化' : '不优化') + '创意标题<br/>'
                    + (vo.isOptimizeChangeMatchScope == '1' ? '优化' : '不优化') + '匹配方式<br/>'
                    + vo.addQscoreTh
                    + '<br/>' + vo.addLockDay + '<br/>' + (vo.reduceGenerateWordDegree == '0' ? '不' : '') + '降低出词要求';
            } else {
                temp.csDestcri1 = '';
                temp.csDestcri2 = '';
            }
            // 监控
            if (app.storage.get('csMode')) {
                if (elem.monitorConfigSettingVO) {
                    temp.monitorConfig = elem.monitorConfigSettingVO.configs.map(function (item) {
                        return {
                            'fieldId' : item.fieldId,
                            'quantityParams' : item.quantityParams,
                            'calculateSymbol' : item.calculateSymbol,
                            'calculateParams' : item.calculateParams
                        };
                    });
                    temp.monitorStatus = elem.monitorConfigSettingVO.batch ? '2' : '1';
                    temp.filterMonitor = elem.monitorConfigSettingVO.configs[0].relateIds;
                } else {
                    // 未设定
                    temp.monitorStatus = '0';
                }
            }
            // 质量分下限
            if (vo.isOpenQScoreLimit == "1") {
                temp.isOpenQScoreLimit = true;
                temp.pcQScoreFloor = vo.pcQScoreFloor;
                temp.mobileQScoreFloor = vo.mobileQScoreFloor;
                temp.qScoreStr = 'PC:' + vo.pcQScoreFloor + ', 无线:' + vo.mobileQScoreFloor;
            }

            temp.mobileDiscount = elem.adgroupItem.adgroup.mobileDiscount;

            temp.report = utils.getReportByImpression(temp.report, CONFIG.campaignReports);

            if (elem.daemonOptimizeSettingVO.isOptimizeMobileDiscount && engineType == 2) {
                temp.mobileStatus = elem.daemonOptimizeSettingVO.isOptimizeMobileDiscount;
                switch (elem.daemonOptimizeSettingVO.isOptimizeMobileDiscount) {
                    case '1':
                        temp.mobileText = '<div style="color:#4BC355">自动优化</div>';
                        break;
                    case '0':
                        temp.mobileText = '<div style="color:#ff6600">不自动优化</div>';
                        break;
                }
            }


            // 匹配方式处理
            // 产品逻辑：修改优化方式不会改变匹配方式的状态
            temp.matchStatus = parseInt(elem.daemonOptimizeSettingVO.isOptimizeChangeMatchScope, 10);
            temp.detail = {};
            arr.push(temp);
        });

        result.paging = utils.copyByfirst(paging, data.paging.extendParam);
        result.paging = utils.copyByfirst(result.paging, data.paging);
        result.paging.recordCount = data.paging.recordCount;

        result.platform = data.platform;
        result.adgroups = arr;

        // 当页是否有正在投放中的宝贝
        result.isInitBiding = data.isInitBiding;
        result.snycStatus = data.snycStatus;
        return result;
    }

    var model = new Model('getList');
    model.api = '/sources/adgroups/list';
    model.type = 'post';
    // 请求参数
    model.requestParams = {
        'campaignId': 'Number',
        'mandateStatus': 'String',
        'currentPage': 'Number',
        'fromDate': 'YYYY-MM-DD',
        'toDate': 'YYYY-MM-DD',
        'sortColumn': '',
        'direction': '',
        'searchKeyword': '',
        'filterAdgroupIds' : ''
    };


    /**
     * 处理请求参数，如何缓存中没有对应的参数，则初始化它
     * @private
     */
    model._initRequestParams = function(requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.fromDate) {
            requestParams.fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
        }
        if (!requestParams.toDate) {
            requestParams.toDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        }
        if (!requestParams.campaignId) {
            throw new window.Error("API.adGroup.getList: *缺少参数：campaignId");
        }
        app.cache.addParams('request', requestParams);
    };

    model._success = function(json, cb, isFormat) {
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