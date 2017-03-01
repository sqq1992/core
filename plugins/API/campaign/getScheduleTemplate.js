/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/10/28
 */

/*global app, _, $, console, moment*/
(function (app) {
    'use strict';

    var model = new app.API.model('getScheduleTemplate');
    model.api = '/sources/campaign/getScheduleTemplate';
    model.type = 'get';


    function dataFormat(arr) {
        var result = {
            tempArr: [],
            userArr: []
        };
        var i, cache, o, name;
        for (i = 0; i < arr.length; i++) {
            o = arr[i];
            cache = '';
            if (o.type === 0) {
                name = o.name.split(":");
                if (name.length === 1) {
                    // 对无分组的特殊处理 容错
                    name = [cache, name[0]];
                }
                if (name[0] !== cache) {
                    // 添加组标
                    result.tempArr.push({
                        'name': name[0],
                        'cls': 'group'
                    });
                    cache = name[0];
                }
                // 系统标准模版
                result.tempArr.push({
                    'name': name[1],
                    'cls': 'group-item',
                    'schedule': QC.dataFormat.schedule.parse(o.schedule)
                });
            }
            if (o.type === 1) {
                // 用户自定义模版
                result.userArr.push({
                    'name': o.name,
                    'id': o.id,
                    'schedule': QC.dataFormat.schedule.parse(o.schedule)
                });
            }
        }
        return result;
    }

    /**
     * 请求成功回调函数
     * @private
     */
    model._success = function (json, cb, isFormat) {
        if (json.success) {
            var result = json;
            if (isFormat) {
                //TODO 有些问题
                result = dataFormat(result.data.templates);
            }
            if (_.isFunction(cb)) {
                cb(result);
            }
        } else {
            if (_.isFunction(cb)) {
                cb({success: false});
            }
        }
    };

    app.API.campaign.getScheduleTemplate = model.entry;
}(app));