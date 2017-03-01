/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/3/4
 */


/*global app, console, moment*/
(function (app) {
    'use strict';

    moment.locale('zh-cn');

    app.load.config({
        baseUrl: '/',
        path: {

            // view
            'CONFIG': 'modules/view/config',
            'loading': 'modules/view/loading',
            'timeCtr': 'modules/view/timeCtr',
            'headerQn': 'modules/view/headerQn',
            'userTab': 'modules/view/userTab',
            'breadcrumb': 'modules/view/breadcrumb',
            'asynBreadcrumb': 'modules/view/asynBreadcrumb',
            'campaignTab': 'modules/view/campaignTab',
            'briefing': 'modules/view/briefing',
            'campaignList': 'modules/view/campaignList',
            'campaignSetting': 'modules/view/campaignSetting',
            'adgroupTab': 'modules/view/adgroupTab',
            'adgroupListView': 'modules/view/adgroupListView',
            'adgroupList': 'modules/view/adgroupList',
            'adgroupSetting': 'modules/view/adgroupSetting',
            'autoKeywordView': 'modules/view/autoKeywordView',
            'manualKeywordView': 'modules/view/manualKeywordView',
            'schoolView': 'modules/view/schoolView',
            'articleList': 'modules/view/articleList',
            'helpView': 'modules/view/helpView',
            'version': 'modules/view/version',
            'renew': 'modules/view/renew',

            'tactics': 'modules/view/tactics',
            'setCampaignOption': 'modules/view/setCampaignOption',
            'setAdgroupOption': 'modules/view/setAdgroupOption',
            'confirmOption': 'modules/view/confirmOption',
            'submitNewEngine': 'modules/view/submitNewEngine',

            'creativeTest': 'modules/view/creativeTest',
            'creativeAdd': 'modules/view/creativeAdd',
            'creativeDetail': 'modules/view/creativeDetail',
            'repeatWordManage': 'modules/view/repeatWordManage',
            'indexPopup': 'modules/view/indexPopup',
            'maijiaPlayer': 'modules/view/maijiaPlayer',


            // _view
            'More': 'modules/_view/button/more',
            'autoKeyword': 'modules/_view/autoKeyword',
            'manualKeyword': 'modules/_view/manualKeyword',
            'creativeManage': 'modules/_view/creativeManage',
            'adgroupLog': 'modules/_view/adgroupLog',
            'liveEntrance': 'modules/_view/liveEntrance',
            'videoList': 'modules/_view/videoList',
            'helpVideo': 'modules/_view/helpVideo',
            'helpArticle': 'modules/_view/helpArticle',
            'itemSelectView': 'modules/_view/itemSelectView',
            'adgroupItemSelectView': 'modules/_view/adgroupItemSelectView',
            'Creative': 'modules/_view/creative',
            'CreativeEdit': 'modules/_view/creativeEdit',
            'CreativeList': 'modules/_view/creativeList',
            'EditWatermark': 'modules/_view/editWatermark',
            'ColorPicker': 'modules/_view/colorPicker',
            'Draggable': 'modules/_view/draggable',
            'campaignInfo': 'modules/_view/campaignInfo',
            'campaignRealTime': 'modules/_view/campaignRealTime',
            'realTime': 'modules/_view/realTime',
            'userInfo': 'modules/_view/userInfo',
            'userRealTime': 'modules/_view/userRealTime',
            'setWordPrice' : 'modules/_view/setWordPrice',
            'historyReport' : 'modules/_view/historyReport',
            'keywordTrend' : 'modules/_view/keywordTrend',

            'campaignLog': 'modules/_view/campaignLog',

            'itemModel': 'modules/_view/item/itemModel',
            'innerItem': 'modules/_view/item/innerItem',
            'outerItem': 'modules/_view/item/outerItem',
            'chosenItem': 'modules/_view/item/chosenItem',
            'itemSelect': 'modules/_view/item/itemSelect',

            'addAutoKeyword': 'modules/_view/button/addAutoKeyword',
            'changeOptimizations': 'modules/_view/button/changeOptimizations',
            'dataSeparate': 'modules/_view/button/dataSeparate',
            'checkRank': 'modules/_view/button/checkRank',
            'checkRanks': 'modules/_view/button/checkRanks',
            'qScore': 'modules/_view/button/qScore',
            'actualPrice': 'modules/_view/button/actualPrice',
            'Like': 'modules/_view/button/like',
            'videoOp': 'modules/_view/button/videoOp',
            'newEngine': 'modules/_view/button/newEngine',
            'copy': 'modules/_view/button/copy',
            'export': 'modules/_view/export.js',
            'tableEdit': 'modules/_view/button/tableEdit',
            'tableSort': 'modules/_view/button/tableSort',
            'editPrices': 'modules/_view/button/editPrices',
            'grabRanking': 'modules/_view/button/grabRanking',

            'changeMatch': 'modules/_view/changeMatch',
            'changeMatchs': 'modules/_view/changeMatches',
            'changeOptimize': 'modules/_view/changeOptimize',
            'changeBlacklist': 'modules/_view/changeBlacklist',
            'changeBlacklists': 'modules/_view/ChangeBlacklists',
            'deleteWord': 'modules/_view/deleteWord',
            'deleteWords': 'modules/_view/deleteWords',
            'changePrice': 'modules/_view/changePrice',
            'textEditor': 'modules/_view/textEditor',
            'grabRank': 'modules/_view/grabRank',
            'sellingWords': 'modules/_view/sellingWords',
            'keywordSearchLog': 'modules/_view/keywordSearchLog',

            'grabRankSetting': 'modules/_view/grabRank/grabRankSetting',
            'grabRankLog': 'modules/_view/grabRank/grabRankLog',

            'vieRankModule': 'modules/_view/vieRankModule',
            'predictionRanking': 'modules/_view/predictionRanking',


            'campaign': 'modules/_view/button/campaign',
            'editBudget': 'modules/_view/button/editBudget',

            'CampaignSchedule': 'modules/_view/campaignSchedule',
            'CampaignPlatform': 'modules/_view/campaignPlatform',
            'CampaignRegion': 'modules/_view/campaignRegion',
            'qscoreLimit': 'modules/_view/qscoreLimit',
            'oneKeySet': 'modules/_view/oneKeySet',
            'oneKeyOptimize': 'modules/_view/oneKeyOptimize',

            // 手动添加关键词
            'addManualKeyword.view': 'modules/_view/addManualKeyword/view',
            'addManualKeyword.recommended': 'modules/_view/addManualKeyword/recommended',
            'addManualKeyword.amoyWord': 'modules/_view/addManualKeyword/amoyWord',
            'addManualKeyword.own': 'modules/_view/addManualKeyword/own',
            'addManualKeyword.wordSelect': 'modules/_view/addManualKeyword/wordSelect',

            'detailLogs': 'modules/_view/detailLogs',


            // component
            'template': 'modules/component/template',
            'highcharts': 'modules/component/highcharts',

            'Collapse': 'modules/component/collapse',
            'DropDown': 'modules/component/dropDown',
            'Pagnation': 'modules/component/pagnation',
            'pagnationSM': 'modules/component/pagnationSM',
            'Search': 'modules/component/search',
            'Select': 'modules/component/select',
            'SelectCheckBox': 'modules/component/selectCheckBox',
            'Tab': 'modules/component/tab',
            'TweenBar': 'modules/component/tweenBar',
            'Grid': 'modules/component/grid',
            'CheckBox': 'modules/component/checkBox',
            'CheckBoxGroup': 'modules/component/checkBoxGroup',
            'TextEditor': 'modules/component/textEditor',
            'ButtonGroup': 'modules/component/buttonGroup',
            'btnSwitch': 'modules/component/btnSwitch',
            'Dialog': 'modules/component/dialog',
            'Separate': 'modules/component/separate',
            'filter': 'modules/component/filter',
            'FilterBtnGroup': 'modules/component/filterBtnGroup',
            'radio': 'modules/component/radio',
            'steps': 'modules/component/steps',
            'input': 'modules/component/input',
            'button': 'modules/component/button',
            'btnGroup': 'modules/component/btnGroup',
            'tags': 'modules/component/tags',
            'tagGroup': 'modules/component/tagGroup',
            'tableExport': 'modules/component/tableExport.js',
            'fileSave': 'modules/component/fileSave.js',



            'utils': 'plugins/utils',

            // API
            'model': 'plugins/API/model',
            'user.getCheckSync': 'plugins/API/user/getCheckSync',
            'user.postRequestSync': 'plugins/API/user/postRequestSync',
            'user.getBalance': 'plugins/API/user/getBalance',
            'user.getCustomerServer': 'plugins/API/user/getCustomerServer',
            'user.getEngine': 'plugins/API/user/getEngine',
            'user.getInfo': 'plugins/API/user/getInfo',
            'user.getOrder': 'plugins/API/user/getOrder',
            'user.getReport': 'plugins/API/user/getReport',
            'user.getReportSeparation': 'plugins/API/user/getReportSeparation',
            'user.getCatTree': 'plugins/API/user/getCatTree',
            'user.getBriefing': 'plugins/API/user/getBriefing',
            'user.getRealTimeReport': 'plugins/API/user/getRealTimeReport',
            'user.getReportHourRealTime': 'plugins/API/user/getReportHourRealTime',
            'user.getLastLoginInfo': 'plugins/API/user/getLastLoginInfo',
            'campaign.getList': 'plugins/API/campaign/getList',
            'campaign.getInfo': 'plugins/API/campaign/getInfo',
            'campaign.getKeywordsLimit': 'plugins/API/campaign/getKeywordsLimit',
            'campaign.getLog': 'plugins/API/campaign/getLog',
            'campaign.getLogDetail': 'plugins/API/campaign/getLogDetail',
            'campaign.getReport': 'plugins/API/campaign/getReport',
            'campaign.getReportDevice': 'plugins/API/campaign/getReportDevice',
            'campaign.getReportSeparation': 'plugins/API/campaign/getReportSeparation',
            'campaign.getSuggestMaxPrice': 'plugins/API/campaign/getSuggestMaxPrice',
            'campaign.getSuggestBudget': 'plugins/API/campaign/getSuggestBudget',
            'campaign.del': 'plugins/API/campaign/del',
            'campaign.postBudget': 'plugins/API/campaign/postBudget',
            'campaign.postPromoteStatus': 'plugins/API/campaign/postPromoteStatus',
            'campaign.getScheduleCurrent': 'plugins/API/campaign/getScheduleCurrent',
            'campaign.getPlatform': 'plugins/API/campaign/getPlatform',
            'campaign.getPlatformDetail': 'plugins/API/campaign/getPlatformDetail',
            'campaign.putNewCampaign': 'plugins/API/campaign/putNewCampaign',
            'campaign.getRealTimeReport': 'plugins/API/campaign/getRealTimeReport',
            'campaign.getReportRealTime': 'plugins/API/campaign/getReportRealTime',
            'campaign.getReportHourRealTime': 'plugins/API/campaign/getReportHourRealTime',
            'campaign.getReportHourDevice': 'plugins/API/campaign/getReportHourDevice',
            'campaign.getCreativeStatus': 'plugins/API/campaign/getCreativeStatus',
            'campaign.getAllAdgroupNotMandaete': 'plugins/API/campaign/getAllAdgroupNotMandaete',
            'campaign.getInitBidNotOptimize': 'plugins/API/campaign/getInitBidNotOptimize',
            'campaign.postAllAdgroupNotMandaete': 'plugins/API/campaign/postAllAdgroupNotMandaete',
            'campaign.postInitBidNotOptimize': 'plugins/API/campaign/postInitBidNotOptimize',
            'newEngine.getStatus': 'plugins/API/newEngine/getStatus',
            'newEngine.put': 'plugins/API/newEngine/put',
            'newEngine.delete': 'plugins/API/newEngine/delete',
            'adgroup.getList': 'plugins/API/adgroup/getList',
            'adgroup.getSeparate': 'plugins/API/adgroup/getSeparate',
            'adgroup.getCount': 'plugins/API/adgroup/getCount',
            'adgroup.getCreative': 'plugins/API/adgroup/getCreative',
            'adgroup.getCreative.separate': 'plugins/API/adgroup/getCreativeSeparate',
            'adgroup.getLog': 'plugins/API/adgroup/getLog',
            'adgroup.getPrice': 'plugins/API/adgroup/getPrice',
            'adgroup.getLogDetail': 'plugins/API/adgroup/getLogDetail',
            'adgroup.getInfo': 'plugins/API/adgroup/getInfo',
            'adgroup.getReport': 'plugins/API/adgroup/getReport',
            'adgroup.getReportDevice': 'plugins/API/adgroup/getReportDevice',
            'adgroup.getReportSeparation': 'plugins/API/adgroup/getReportSeparation',
            'adgroup.getInnerList': 'plugins/API/adgroup/getInnerList',
            'adgroup.getOuterList': 'plugins/API/adgroup/getOuterList',
            'adgroup.getChosenList': 'plugins/API/adgroup/getChosenList',
            'adgroup.putChoseList': 'plugins/API/adgroup/putChoseList',
            'adgroup.putCampaignInfo': 'plugins/API/adgroup/putCampaignInfo',
            'adgroup.getNewEngineInfo': 'plugins/API/adgroup/getNewEngineInfo',
            'adgroup.getRecommendPrice': 'plugins/API/adgroup/getRecommendPrice',
            'adgroup.postPromoteStatus': 'plugins/API/adgroup/postPromoteStatus',
            'adgroup.putAdgroups': 'plugins/API/adgroup/putAdgroups',
            'adgroup.postWordPrice': 'plugins/API/adgroup/postWordPrice',
            'adgroup.postOptimizationState': 'plugins/API/adgroup/postOptimizationState',
            'keyword.getList': 'plugins/API/keyword/getList',
            'keyword.getNoSearch': 'plugins/API/keyword/getNoSearch',
            'keyword.getDirectional': 'plugins/API/keyword/getDirectional',
            'keyword.getRank': 'plugins/API/keyword/getRank',
            'keyword.getRanks': 'plugins/API/keyword/getRanks',
            'keyword.postMatchScope': 'plugins/API/keyword/postMatchScope',
            'keyword.getRecommendedList': 'plugins/API/keyword/getRecommendedList',
            'keyword.getAmoyWord': 'plugins/API/keyword/getAmoyWord',
            'keyword.getWordBase': 'plugins/API/keyword/getWordBase',
            'keyword.getRecomPrices': 'plugins/API/keyword/getRecomPrices',
            'keyword.getTextSegmentation': 'plugins/API/keyword/getTextSegmentation',
            'keyword.getBlackKeywords': 'plugins/API/keyword/getBlackKeywords',
            'keyword.getSellingWords': 'plugins/API/keyword/getSellingWords',
            'keyword.getNeverWords': 'plugins/API/keyword/getNeverWords',
            'keyword.getWordsDate': 'plugins/API/keyword/getWordsDate',
            'keyword.getPredictionRanking': 'plugins/API/keyword/getPredictionRanking',
            'keyword.getRankingLimit': 'plugins/API/keyword/getRankingLimit',
            'keyword.getGrabRanking': 'plugins/API/keyword/getGrabRanking',
            'keyword.getGrabRankingLog': 'plugins/API/keyword/getGrabRankingLog',
            'keyword.getOnceGrabRanking': 'plugins/API/keyword/getOnceGrabRanking',
            'keyword.getSeparate': 'plugins/API/keyword/getSeparate',
            'keyword.getTrend': 'plugins/API/keyword/getTrend',
            'keyword.getBestRank': 'plugins/API/keyword/getBestRank',
            'keyword.getBestPpr': 'plugins/API/keyword/getBestPpr',
            'keyword.getBestPprRang': 'plugins/API/keyword/getBestPprRang',
            'keyword.postGrabRanking': 'plugins/API/keyword/postGrabRanking',
            'keyword.postGrabRankingClose': 'plugins/API/keyword/postGrabRankingClose',
            'keyword.delGrabRanking': 'plugins/API/keyword/delGrabRanking',
            'keyword.delNeverWords': 'plugins/API/keyword/delNeverWords',
            'keyword.deleteWord': 'plugins/API/keyword/deleteWord',
            'keyword.postSetting': 'plugins/API/keyword/postSetting',
            'keyword.postBlackKeyword': 'plugins/API/keyword/postBlackKeyword',
            'keyword.putBlackKeyword': 'plugins/API/keyword/putBlackKeyword',
            'keyword.postPrice': 'plugins/API/keyword/postPrice',
            'keyword.postMatchScopeOptimizations': 'plugins/API/keyword/postMatchScopeOptimizations',
            'keyword.putSellingWords': 'plugins/API/keyword/putSellingWords',
            'keyword.putKeywords': 'plugins/API/keyword/putKeywords',
            'video.getList': 'plugins/API/video/getList',
            'video.getLives': 'plugins/API/video/getLives',
            'video.getCode': 'plugins/API/video/getCode',
            'article.getList': 'plugins/API/article/getList',
            'common.getWatermarkList' : 'plugins/API/common/getWatermarkList',
            'common.monitor.getConfig' : 'plugins/API/common/getMonitorConfig'

        }
    });

    app.route.add('loading', ['loading'], function () {
        document.title = '数据同步';
    });

    app.route.add('index', ['headerQn', 'timeCtr', 'userTab', 'briefing', 'campaignList', 'indexPopup'], function () {
        document.title = '首页';
    });

    app.route.add('list', ['headerQn', 'asynBreadcrumb', 'timeCtr', 'campaignTab', 'campaignSetting', 'adgroupListView'], function () {
        document.title = '自动宝贝列表';
    });

    app.route.add('manuallist', ['headerQn', 'asynBreadcrumb', 'timeCtr', 'campaignTab', 'campaignSetting', 'adgroupListView'], function () {
        document.title = '手动宝贝列表';
    });

    app.route.add('list/autokeyword', ['headerQn', 'asynBreadcrumb', 'timeCtr', 'adgroupTab', 'adgroupSetting', 'autoKeywordView'], function () {
        document.title = '自动关键词列表';
    });

    app.route.add('list/manualkeyword', ['headerQn', 'asynBreadcrumb', 'timeCtr', 'adgroupTab', 'adgroupSetting', 'manualKeywordView'], function () {
        document.title = '手动关键词列表';
    });

    app.route.add('school/video', ['headerQn', 'breadcrumb', 'schoolView'], function () {
        document.title = '课程中心-快车学堂';
    });

    app.route.add('school/article', ['headerQn', 'breadcrumb', 'articleList'], function () {
        document.title = '云鹤专栏-快车学堂';
    });

    app.route.add('school/help', ['headerQn', 'breadcrumb', 'helpView'], function () {
        document.title = '帮助中心-快车学堂';
    });

    app.route.add('new/list', ['headerQn', 'tactics'], function () {
        document.title = '选择策略-智能推广';
    });

    app.route.add('new/first_step', ['headerQn', 'setCampaignOption'], function () {
        document.title = '设置计划信息-智能推广';
    });

    app.route.add('new/second_step', ['headerQn', 'setAdgroupOption'], function () {
        document.title = '设置宝贝信息-智能推广';
    });

    app.route.add('new/third_step', ['headerQn', 'confirmOption'], function () {
        document.title = '确认新建信息-智能推广';
    });

    app.route.add('new/submit', ['headerQn', 'submitNewEngine'], function () {
        document.title = '提交-智能推广';
    });

    app.route.add('tool/creativeTest', ['headerQn', 'breadcrumb', 'creativeTest'], function () {
        document.title = '工具-创意测试';
    });

    app.route.add('tool/creativeTest/add', ['headerQn', 'breadcrumb', 'creativeAdd'], function () {
        document.title = '工具-创意测试-添加测试';
    });

    app.route.add('tool/creativeTest/detail', ['headerQn', 'breadcrumb', 'timeCtr', 'adgroupTab', 'creativeDetail'], function () {
        document.title = '工具-创意测试-测试详细';
    });

    app.route.add('tool/repeatWordManage', ['headerQn', 'breadcrumb', 'repeatWordManage'], function () {
        document.title = '工具-重复词管理';
    });
}(app));