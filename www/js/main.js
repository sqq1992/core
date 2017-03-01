/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/11/26
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
            'timeCtr': 'modules/view/timeCtr',
            'header': 'modules/view/header',
            'menu': 'modules/view/menu',
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

            'loading':'dist/js/loading',
            'template':'dist/js/template'


        }
    });

    app.route.add('loading', ['loading'], function () {
        document.title = '数据同步';
    });

    app.route.add('test', ['feedBack'], function () {
        document.title = '测试';
    });

}(app));