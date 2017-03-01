/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/11/24
 */

/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';
    var Dialog = require('Dialog');
    var utils = {};

    /**
     * 以第一个参数为模型复制第二个参数（对象）
     * @param obj1  Object  模型数据
     * @param obj2  Object  目标数据
     * @returns {{}}
     */
    utils.copyByfirst = function (obj1, obj2) {
        var result = {};
        var key;
        for (key in obj1) {
            if (obj1.hasOwnProperty(key)) {
                result[key] = _.isUndefined(obj2[key]) ? obj1[key] : obj2[key];
            }
        }
        return result;
    };

    /**
     * 格式化请求参数
     * @param obj Object 参数对象
     * @returns {*}
     */
    utils.formatOptionalParams = function (obj) {
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                obj[key] = app.cache.getParams('request', key);
            }
        }
        return obj;
    };


    utils.getDom = function (render, option) {
        return $.parseHTML(render(option).trim())[0];
    };

    utils.getHtml = function (render, option) {
        return render(option);
    };

    /**
     * 判断当前时间是否在规定的时间期，24时
     * @param  {Number}  start 起始时间
     * @param  {Number}  end   终止时间
     * @return {Boolean}
     */
    utils.isInTime = function (start, end) {
        var now = new Date(),
            hours = now.getHours(),
            minutes = now.getMinutes(),
            num = 0;

        num = hours + minutes / 60;

        return (num >= start && num <= end);
    };

    /**
     * 字符串首字母大写
     * @param {[type]} str [description]
     */
    utils.upCaseStrFirst = function (str) {
        var index = 0,
            upper = '',
            _str = str || '',
            _first = _str.charAt(index);

        _str = _str.substring(1, _str.length);

        upper = _first.toUpperCase();

        _str = upper + _str;

        return _str;
    };


    /**
     * 合并两个一维对象
     * @param  {Object} obj01 参数1
     * @param  {Object} obj02 参数2
     * @param {String} prefix 前缀
     * @return {Object}       合并对象
     */
    utils.unionObject = function (obj01, obj02, prefix, initDate, initWordBase) {
        var str = '',
            obj = {};

        for (str in initDate) {
            if (initDate.hasOwnProperty(str)) {
                obj[str] = obj01[str];
            }
        }

        for (str in initWordBase) {
            if (initWordBase.hasOwnProperty(str)) {
                if (str === 'cpc') {
                    obj[prefix + utils.upCaseStrFirst('price')] = obj02[str] / 100;
                } else if (str === 'coverage') {
                    obj[prefix + utils.upCaseStrFirst('cvr')] = obj02[str];
                } else {
                    obj[prefix + utils.upCaseStrFirst(str)] = obj02[str];
                }
            }
        }

        return obj;
    };

    // 格式化下架信息
    utils.formatOfflineText = function (text) {
        /*var result = null;
         if (text) {
         result = "您推广的内容存在如下问题：";
         text = text.replace("\n", "&lt;br/&gt;");
         text = text.replace("\r", "");
         text = text.replace("\\\\", "\\");
         if (text.indexOf("~~~") > 0) {
         var info = text.split("~~~"),
         link1 = info[0].split("^^^"),
         link2 = info[1].split("^^^");
         result += "&lt;a href='" + link1[2] + "' id='offlineLink1' target='_blank' &gt;" + link1[1] + "：&lt;/a&gt;&lt;br/&gt;";
         result += "&lt;a href='" + link2[2] + "' id='offlineLink2' target='_blank' &gt;" + link2[1] + "&lt;/a&gt;";
         } else {
         result += text;
         console.log("formatOfflineText特殊字符" + text);
         }
         } else {
         result = "";
         }
         return result;*/

        var result = null;
        if (text) {
            result = "您推广的内容存在如下问题：&#xa;";
            text = text.replace("\n", "&#xa;");
            text = text.replace("\r", "");
            text = text.replace("\\\\", "\\");
            if (text.indexOf("~~~") > 0) {
                var info = text.split("~~~"),
                    link1 = info[0].split("^^^"),
                    link2 = info[1].split("^^^");
                result += link1[1] + "：";
                result += link2[1];
            } else {
                result += text;
                console.log("formatOfflineText特殊字符" + text);
            }
        } else {
            result = "";
        }
        return result;
    };


    /**
     * @description 处理后端report数据，将对象转化为数据，方便排序
     *              有这几个字段：className,dataNum,dataValue,type
     * @param data {Object} 后台返回的 JSON 数据
     * @param config {Object} 配置信息，目前在 VARIABLE 下面
     * @param custom {Object} 用户自定义数据，目前只支持 数据显示或隐藏及数据顺序
     * @return result {Array}
     */
    utils.getReport = function (data, config, custom) {

        data = this.selfFormatData(data);

        // 全网成交量不显示，这里特殊处理，因为计算全网转化率要用，fuck
        var _config = $.extend(true, {}, config);
        _config.dayPayCount = {'name': '全网成交量', 'unit': '', 'sortNum': '-20'};

        var _obj = null,
            _UNIT = true,       // UNIT单位的配置，如果为true，则优先后置单位，否则优先前置单位
            _prev = null,
            _after = null,
            _mark = '#',
            _isAdmin = true,
            _dataValue = null,
            str = null,
            result = [];

        var _impressionsDependData = [
            'impressions',
            'click',
            'cost',
            'ctr',
            'cvr',
            'cpc',
            'volume',
            'realRoi',
            'avgPos',
            'price',
            'pay',
            'directPay',
            'directPayCount',
            'indirectPay',
            'indirectPayCount',
            'favItemCount',
            'favShopCount',
            'payCount',
            'favCount',
            'cartTotal',
            'directCartTotal',
            'indirectCartTotal'
        ];
        _config = _config || {};
        custom = custom || {};
        data = data || {};
        data.impressions = data.impressions || 0;

        // 如果从boss系统进入，这区分数据为 undefined，用户登录则不区分
        _mark = _isAdmin ? '#' : '-';

        // 遍历整个配置数据
        for (str in _config) {
            if (_config.hasOwnProperty(str)) {

                _obj = {
                    'className': null,     // class
                    'dataNum': null,        // 顺序号码
                    'dataValue': null,     // 值
                    'type': null            // 类型
                };

                custom[str] = _.isUndefined(custom[str]) ? -99999 : custom[str];

                // 判断用户是否选择这个数据
                if (custom[str] >= 0) {
                    _obj.className = 'table-show';

                } else {
                    _obj.className = 'hide';
                }

                _obj.dataNum = _.isUndefined(custom[str]) ? 99999 : custom[str];
                _obj.type = str;

                // 业务逻辑，如果展现量为0，则所有宝贝数据显示‘-’，除了全网数据
                if (data.impressions === 0 && _.indexOf(_impressionsDependData, str) >= 0) {
                    _obj.dataValue = '-';
                } else {
                    if (data[str] !== '-') {
                        // 设置单位
                        if (_UNIT) {
                            _prev = '';
                            _after = _config[str].unit || '';
                        } else {
                            _prev = _config[str].pre || '';
                            _after = '';
                        }

                        _dataValue = _.isUndefined(data[str]) ? _mark : data[str];

                        if ((_prev || _after || str === 'realRoi' || str === 'dayCtr') && _dataValue !== _mark) {
                            _dataValue = parseFloat(data[str]).toFixed(2);
                        }


                        // 目前只有两个单位（元，%），所以有单位只取精度为 QC.CONFIG.FLOAT_ACCURACY
                        _obj.dataValue = _dataValue /*_prev + _dataValue + _after*/;
                    } else {
                        _obj.dataValue = _mark;
                    }

                }
                result.push(_obj);
                _obj = null;
            }
        }

        result = result.sort(utils.compare('dataNum'));

        return result;
    };

    utils.getReportByImpression = function (data, _config) {

        var str;
        var _mark = '-';
        var _impressionsDependData = [
            'impressions',
            'click',
            'cost',
            'ctr',
            'cvr',
            'cpc',
            'volume',
            'realRoi',
            'avgPos',
            'price',
            'pay',
            'directPay',
            'directPayCount',
            'indirectPay',
            'indirectPayCount',
            'favItemCount',
            'favShopCount',
            'payCount',
            'favCount',
            'cartTotal',
            'directCartTotal',
            'indirectCartTotal',
            'directPpr',
            'indirectPpr',
            'pprTotal',
            'favItemRate',
            'favShopRate',
            'favRate',
            'directPprFavRate'
        ];

        data = data || {};
        data.impressions = data.impressions || 0;

        // 遍历整个配置数据
        for (str in _config) {
            if (_config.hasOwnProperty(str)) {
                // 业务逻辑，如果展现量为0，则所有宝贝数据显示‘-’，除了全网数据
                if ((data.impressions === 0 || data.impressions === _mark) && _.indexOf(_impressionsDependData, str) >= 0) {
                    data[str] = _mark;
                }
            }
        }
        return data;
    };


    /**
     * @description 合并报表数据，目前处理细分数据
     * @param arr {Array} 四个细分数据合并的数组
     * @param config {Object} 配置信息，目前在 VARIABLE 下面
     * @return {{}}
     */
    utils.reportConcat = function (arr, config) {
        // 全网成交量不显示，这里特殊处理，因为计算全网转化率要用，fuck
        var _config = $.extend(true, {}, config);
        _config.dayPayCount = {'name': '全网成交量', 'unit': '', 'sortNum': '-20'};
        var avgPosSum = 0,
        //cpcSum = 0,
            n = 0,
            key = null,
            _isHasDayCtr = false,
            result = {};

        for (n; n < arr.length; n++) {
            for (key in _config) {
                if (_config.hasOwnProperty(key)) {
                    // 初始化数值，默认为0
                    result[key] = result[key] || 0;
                    result[key] += arr[n][key];

                    // 处理含有全网的数据
                    if (key === 'dayCtr') {
                        _isHasDayCtr = true;
                    }

                    //if (key === 'dayPayCount');

                    if (_.isUndefined(arr[n].avgPos)) {
                        //console.log("arr" + n + "不存在avgPos");
                    }
                    //cpcSum += arr[n].cpc * arr[n].impressions;
                }
            }
            avgPosSum += arr[n].avgPos * arr[n].impressions;
        }

        result.ctr = (result.impressions === 0 ? 0 : result.click / result.impressions) * 100;
        result.cvr = (result.click === 0.0 ? 0 : result.payCount / result.click) * 100;
        result.cpc = result.click === 0 ? 0 : result.cost / result.click;
        result.realRoi = result.cost === 0.0 ? 0.0 : result.pay / result.cost;
        result.avgPos = Math.ceil(result.impressions === 0 ? 0.0 : avgPosSum / result.impressions);

        result.ctr = result.ctr.toFixed(2);
        result.cpc = result.cpc.toFixed(2);

        // 处理含有全网的数据
        if (_isHasDayCtr) {
            result.dayCtr = (result.dayPv === 0 ? 0.0 : result.dayClick / result.dayPv) * 100;
            // 全网转化率 = 全网成交数/全网点击指数
            result.dayCvr = (result.dayClick === 0.0 ? 0.0 : result.dayPayCount / result.dayClick) * 100;
            result.dayCtr = result.dayCtr.toFixed(2);
        }
        return result;
    };


    utils.getDetailData = function (id, arr, type, key, config, custom, isHasDay) {
        var result = [],
            arrOne = $.extend(true, {}, arr),
            arrID = null,
            _initData = {},
            _initWordBase = {},
            _temp = {},
            n = 0,
            str = null;


        id = _.isString(id) ? parseInt(id, 10) : id;

        // 遍历数组，找到目标
        /*for (n = 0; n < arr.length; n++) {
         arrID = _.isString(arr[n][key]) ? parseInt(arr[n][key], 10) : arr[n][key];
         if (id === arrID) {
         arrOne = arr[n];
         console.log('到找到目标');
         break;
         }
         }*/

        // 根据配置文件初始化 _initData
        for (str in config) {
            if (config.hasOwnProperty(str)) {
                _initData[str] = 0;
            }
        }

        // 赋值，防止字段为空
        arrOne.pcInsideReport = arrOne.pcInsideReport || arrOne.pcInside || _initData;
        arrOne.pcOutsideReport = arrOne.pcOutsideReport || arrOne.pcOutside || _initData;
        arrOne.mobileInsideReport = arrOne.mobileInsideReport || arrOne.mobileInside || _initData;
        arrOne.mobileOutsideReport = arrOne.mobileOutsideReport || arrOne.mobileOutside || _initData;

        // 是否有全网数据
        isHasDay = isHasDay || false;
        if (isHasDay) {

            // 初始化全网数据
            _initWordBase = {
                cpc: 0,
                ctr: 0,
                pv: 0,
                click: 0,
                competition: 0,
                coverage: 0,
                payCount: 0
            };

            _temp = {
                'pcInsideWordBase': arrOne.pcInsideWordBase || _initWordBase,
                'pcOutsideWordBase': arrOne.pcOutsideWordBase || _initWordBase,
                'mobileInsideWordBase': arrOne.mobileInsideWordBase || _initWordBase,
                'mobileOutsideWordBase': arrOne.mobileOutsideWordBase || _initWordBase
            };

            arrOne.pcInsideReport = utils.unionObject(arrOne.pcInsideReport, _temp.pcInsideWordBase, 'day', _initData, _initWordBase);
            arrOne.pcOutsideReport = utils.unionObject(arrOne.pcOutsideReport, _temp.pcOutsideWordBase, 'day', _initData, _initWordBase);
            arrOne.mobileInsideReport = utils.unionObject(arrOne.mobileInsideReport, _temp.mobileInsideWordBase, 'day', _initData, _initWordBase);
            arrOne.mobileOutsideReport = utils.unionObject(arrOne.mobileOutsideReport, _temp.mobileOutsideWordBase, 'day', _initData, _initWordBase);

        }

        switch (type) {
            case '1':
                result = [
                    {
                        'id': id,
                        'type': type,
                        'title': 'ＰＣ数据',
                        'report': utils.getReport(utils.reportConcat([arrOne.pcInsideReport, arrOne.pcOutsideReport], config), config, custom)
                    },
                    {
                        'id': id,
                        'type': type,
                        'title': '无线数据',
                        'report': utils.getReport(utils.reportConcat([arrOne.mobileInsideReport, arrOne.mobileOutsideReport], config), config, custom)
                    }
                ];
                break;
            case '2':
                result = [
                    {
                        'id': id,
                        'type': type,
                        'title': '站内数据',
                        'report': utils.getReport(utils.reportConcat([arrOne.pcInsideReport, arrOne.mobileInsideReport], config), config, custom)
                    },
                    {
                        'id': id,
                        'type': type,
                        'title': '站外数据',
                        'report': utils.getReport(utils.reportConcat([arrOne.pcOutsideReport, arrOne.mobileOutsideReport], config), config, custom)
                    }
                ];
                break;
            case '3':
                result = [
                    {
                        'id': id,
                        'type': type,
                        'title': 'ＰＣ站内',
                        'report': utils.getReport(arrOne.pcInsideReport, config, custom)
                    },
                    {
                        'id': id,
                        'type': type,
                        'title': '无线站内',
                        'report': utils.getReport(arrOne.mobileInsideReport, config, custom)
                    },
                    {
                        'id': id,
                        'type': type,
                        'title': 'ＰＣ站外',
                        'report': utils.getReport(arrOne.pcOutsideReport, config, custom)
                    },
                    {
                        'id': id,
                        'type': type,
                        'title': '无线站外',
                        'report': utils.getReport(arrOne.mobileOutsideReport, config, custom)
                    }
                ];
                break;
            default:
                result = false;
                break;
        }

        return result;
    };


    /**
     *
     * @param target
     * @param data
     * @param highchartsConfigShow
     * @param reports
     * @param isFilter  是否过滤单价和销量 默认 false, 过滤
     * @returns {{options: {container: *, fromDate, toDate, series: Array, init: {visibleLegends: *}}, highchartsConfigShow: *}}
     */
    utils.highchart = function (target, data, highchartsConfigShow, reports, isFilter) {
        /*数据转化*/
        var obj = {
                data: [],
                name: '',
                unit: ''
            },
            dwData = [];
        var arr = _.keys(reports),
            i = 0,
            j = 0;
        for (i = 0; i < arr.length; i++) {
            // 过滤客单价和销量字段
            if ((arr[i] === 'price' || arr[i] === 'volume') && !isFilter) {
                continue;
            }
            for (j in data) {
                if (data.hasOwnProperty(j)) {
                    obj.data.push(data[j][arr[i]]);
                }
            }


            obj.name = reports[arr[i]].name;
            obj.unit = reports[arr[i]].unit;
            dwData.push(obj);
            obj = {
                data: [],
                name: '',
                unit: ''
            };
        }

        highchartsConfigShow = _.uniq(highchartsConfigShow);

        var fromdate = utils.getFromDate();

        // 处理未知原因导致的数组为空
        if (highchartsConfigShow.length <= 0) {
            highchartsConfigShow = ["成交额", "总花费"];
        }

        /*生成*/
        var options = {
            container: target,
            fromDate: fromdate,
            toDate: utils.getToData(),
            series: dwData,
            init: {
                visibleLegends: highchartsConfigShow
            }
        };

        return {
            options: options,
            highchartsConfigShow: highchartsConfigShow
        };
    };

    utils.highchartDiff = function (target, dwData) {
        var fromdate = utils.getFromDate();

        /*生成*/
        var options = {
            container: target,
            fromDate: fromdate,
            toDate: utils.getToData(),
            series: dwData
        };

        return options;
    };

    utils.getToData = function () {
        var diff = moment().diff(moment(app.cache.getParams('request', 'toDate')), 'day');
        if (diff === 0) {
            return moment().subtract(1, 'days').format('YYYY-MM-DD');
        }
        return app.cache.getParams('request', 'toDate');
    };

    utils.getFromDate = function () {
        var diffdays = moment(app.cache.getParams('request', 'toDate')).diff(moment(app.cache.getParams('request', 'fromDate')), 'day'),
            fromdate = '';
        if (Math.abs(diffdays) < 6) {
            if (moment().diff(moment(app.cache.getParams('request', 'toDate')), 'day') === 0) {
                fromdate = moment(app.cache.getParams('request', 'toDate')).subtract(7, 'days').format('YYYY-MM-DD');
            } else {
                fromdate = moment(app.cache.getParams('request', 'toDate')).subtract(6, 'days').format('YYYY-MM-DD');
            }
        } else {
            fromdate = app.cache.getParams('request', 'fromDate');
        }
        return fromdate;
    };

    utils.compare = function (prop) {
        return function (obj1, obj2) {
            var val1 = obj1[prop],
                val2 = obj2[prop],
                result = null;
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
            }
            if (val1 < 0 || val2 < 0) {
                if (val1 < val2) {
                    result = 1;
                } else if (val1 > val2) {
                    result = -1;
                } else {
                    result = 0;
                }
            } else {
                if (val1 < val2) {
                    result = -1;
                } else if (val1 > val2) {
                    result = 1;
                } else {
                    result = 0;
                }
            }
            return result;
        };
    };


    /**
     * 报表数据转化为数组
     * @param  {[Object]} report 报表对象
     * @param  {[Object]} conf   配置信息
     * @return {[Array]}         数组对象
     */
    utils.objToArr = function (report, conf) {
        var arr = [];

        var key;

        if (conf) {
            for (key in conf) {
                if (conf.hasOwnProperty(key)) {
                    arr.push($.extend({}, {
                        value: report[key]
                    }, conf[key]));
                }
            }
        } else {
            for (key in report) {
                if (report.hasOwnProperty(key)) {
                    arr.push($.extend({}, report[key], {'type': key}));
                }
            }
        }

        arr.sort(utils.compare('sortNum'));
        return arr;
    };


    utils.seriesCallback = function (o) {

        if (_.isArray(o)) {
            // 依赖回调, 串行回调
            //var len = o.length;
            //var next = 0;
            var iterate = function () {
                var sync = true;
                var key = 0;
                if (key === null) {
                    //return callback(null);
                }

                sync = false;
            };
            iterate();
        } else if (_.isObject(o)) {
            // 并行回调
            o.forEach(function (elem) {
                elem();
            });
        }
    };

    utils.parseDate = function (sDate) {
        if (/\s*(\d{1,4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})/.test(sDate)) { //start with yyyy-mm-dd or yyyy/mm/dd
            var m = sDate.match(/\d+/g);
            if (m) {
                if (m.length > 1) {
                    m[1] = parseInt(m[1], 10) - 1;
                }
                return new Date(m[0], m[1], m[2]).getTime();
            }
        } else {
            var ms = Date.parse(sDate);
            if (ms) {
                var d1970 = new Date(1970, 1, 1, 0, 0, 0);
                d1970.setTime(ms);
                return d1970;
            }
        }
    };

    //TODO 串和并后面有时间合并
    // 同时发送多个ajax
    /* 
     config = {
     ajax : [{
     ajax 的参数
     id : 可选 check的时候可以用
     check : function
     }]
     onBeforeSend: function
     onComplete: function
     timeout: 毫秒 超时
     }
     */

    utils.cbGroup = function (config) {
        var i, _cbO;
        var o = {
            data: {},
            load: {}
        };
        var que = [].concat(config.cb),
            wait = que.length,
        // 默认超时60秒
            isFinish = false;
        var _cb = function (callback, id) {
            return function (json) {
                // 数据合并
                if (json) {
                    o.data[id] = o.data[id] || {};
                    $.extend(true, o.data[id], json);
                }

                if (callback) {
                    callback(json);
                }
            };
        };
        var complete = function (callback, id) {
            return function () {
                if (callback) {
                    callback(o);
                }
                if (id) {
                    o.load[id] = true;
                }
                if (isFinish) {
                    return;
                }
                wait--;
                if (wait === 0 && config.complete) {
                    config.complete(o);
                    isFinish = true;
                }
                /* else {
                 checkQue();
                 }*/
            };
        };

        function checkQue() {
            if (que.length) {
                for (i = 0; i < que.length; i++) {
                    _cbO = que[i];
                    if (_cbO.check && _cbO.check(o) === false) {
                        // 暂不执行，保留在队列中
                        continue;
                    }

                    _cbO.fn(_cb(complete(_cbO.cb, _cbO.id), _cbO.id), _cbO.option);
                    que.splice(i, 1);
                    i--;
                }
            }
        }

        if (config.onBeforeSend) {
            config.onBeforeSend();
        }
        checkQue();
    };

    /*
     格式化数据为tweenBar使用的数据
     */
    utils.formatTweenData = function (data, isRealTime, config) {
        var list = ['cost', 'pay', 'impressions', 'click', 'ctr', 'cpc', 'payCount', 'realRoi', 'cvr', 'favCount', 'cartTotal'],
            arr = [],
            i = 0,
            _item = null,
            _value = null,
            _obj = null,
            _name = null;

        for (i = 0; i < list.length; i++) {
            _item = list[i];
            _value = data[_item] || '0';
            _obj = config[_item];
            _name = _obj.name;
            if (_obj) {
                // 产品要求 特殊文案
                if (isRealTime && _name === "总花费") {
                    _name = "实时花费";
                }
                arr.push({
                    'key': _item,
                    'descri': _name,
                    'value': _value + _obj.unit
                });
            } else {
                console.log("VARIABLE.campaignReports 数据缺失");
            }
        }
        return arr;
    };


    /**
     * 并发
     * @param config
     */
    utils.concurrent = function (config) {
        var o = {
            data: {},
            load: {}
        };

        var _cb = function (callback, id) {
            return function (json) {
                var pass = true;
                // 数据合并
                if (json) {
                    o.data[id] = o.data[id] || {};
                    $.extend(true, o.data[id], json);
                }

                if (callback) {
                    callback(json);
                }

                config.cb.forEach(function (elem) {
                    if (!o.data[elem.id]) {
                        pass = false;
                        return false;
                    }
                });

                if (pass) {
                    config.complete(o);
                }
            };
        };

        _.each(config.cb, function (elem, index) {
            console.log(index);
            if (elem.before) {
                elem.before();
            }
            if (config.data && !elem.data) {
                elem.fn({'data': config.data}, _cb(elem.cb, elem.id), elem.option);
            } else if (elem.data) {
                elem.fn({'data': elem.data}, _cb(elem.cb, elem.id), elem.option);
            } else {
                elem.fn(_cb(elem.cb, elem.id), elem.option);
            }
        });
    };


    //config = {
    //    ajax: [{
    //        api: '',
    //        id: '',
    //        check: fc,
    //        success: fc,
    //        complete: fc,
    //    }],
    //    onBeforeSend: fc,
    //    onComplete: fc
    //}

    utils.ajaxGroup = function (config) {
        // 缓存json数据
        var obj = {},
            que = [].concat(config.ajax),
            wait = que.length,
            timeoutHandler = 0,
        // 默认超时60秒
            timeout = config.hasOwnProperty('timeout') ? config.timeout : 60 * 1000,
            isFinish = false,
            onSuccess = function (callback) {
                return function (json) {
                    if (callback) {
                        callback(json);
                    }
                    // 数据合并
                    $.extend(true, obj, json);
                };
            },
            onComplete = function (callback, id) {
                return function () {
                    if (callback) {
                        callback();
                    }
                    if (id) {
                        obj.load[id] = true;
                    }
                    if (isFinish) {
                        return;
                    }
                    wait--;
                    if (wait === 0 && config.onComplete) {
                        config.onComplete(obj);
                        isFinish = true;
                        clearTimeout(timeoutHandler);
                    } else {
                        checkQue();
                    }
                };
            };
        obj.load = {};
        function checkQue() {
            if (que.length) {
                for (var i = 0; i < que.length; i++) {
                    var ajaxData = que[i];
                    if (ajaxData.check && ajaxData.check(obj) === false) {
                        // 暂不执行，保留在队列中
                        continue;
                    }
                    ajaxData.success = onSuccess(ajaxData.success);
                    ajaxData.complete = onComplete(ajaxData.complete, ajaxData.id);
                    app.connect.ajax(ajaxData);
                    que.splice(i, 1);
                    console.log(i);
                    i--;
                }
            }
        }

        if (config.onBeforeSend) {
            config.onBeforeSend();
        }
        checkQue();
        // 超时 强制结束
        if (timeout) {
            timeoutHandler = setTimeout(function () {
                if (config.onComplete) {
                    config.onComplete(obj);
                }
                isFinish = true;
            }, timeout);
        }
    };

    utils.getByteLen = function (val) {
        var len = 0,
            _len = 0,
            i = 0;
        for (i = 0; i < val.length; i++) {
            _len = val.charCodeAt(i);
            if (_len >= 0 && _len <= 128) {
                len += 1;
            } else {
                len += 2;
            }
        }
        return len;
    };
    utils.getCorsPic = function (arr, callback) {
        if (!arr instanceof Array) {
            var cache = app.cache.getParams('cors', arr);
            if (cache) {
                callback(cache);
                console.log('读取缓存成功');
                return;
            }
        }
        app.cache.addParams('request', {
            'srcs': arr
        });
        app.connect.ajax({
            'type': 'get',
            'context': this,
            'api': '/sources/imageFile/srcs',
            'data': ['srcs'],
            'success': function (json) {
                var re = json.data.imagePaths;
                if (re) {
                    callback(re);
                    // 加入缓存
                    var result = {};
                    if (re instanceof Array) {
                        for (var i = 0; i < re.length; i++) {
                            result[arr[i]] = re[i];
                        }
                    } else {
                        result[arr] = re;
                    }
                    app.cache.addParams('cors', result);
                } else {
                    throw new Error('图片地址不正确');
                }
            }
        });
    };

    utils.getPicUrlFromBase64 = function (url, callback, isShowLoading) {
        app.cache.addParams('request', {
            "string": url
        });
        app.connect.ajax({
            'type': 'post',
            'context': this,
            'api': '/sources/imageFile/base64',
            'data': ['string'],
            'beforeSend': function () {
                if (isShowLoading) {
                    Dialog.showLoading('正在上传');
                }
            },
            'success': function (json) {
                var p = json.data.imagePath;
                if (p) {
                    callback(p, url);
                } else {
                    throw new Error('图片上传失败(base64)');
                }
            },
            'complete': function () {
                if (isShowLoading) {
                    Dialog.closeLoading();
                }
            }
        });
    };

    utils.getTime = function () {
        return {
            fromDate: app.cache.getParams('fromDate') || moment().subtract(7, 'days').format('YYYY-MM-DD'),
            toDate: app.cache.getParams('toDate') || moment().subtract(1, 'days').format('YYYY-MM-DD')
        }
    };

    /**
     * js加法 解决精度问题  http://www.cnblogs.com/tugenhua0707/p/3511453.html
     */
    utils.mathAdd = function (arg1, arg2) {
        var firstArg,
            lastArg,
            differ,
            dm,
            m;
        try {
            firstArg = arg1.toString().split('.')[1].length;
        } catch (e) {
            firstArg = 0;
        }
        try {
            lastArg = arg2.toString().split('.')[1].length;
        } catch (e) {
            lastArg = 0;
        }
        differ = Math.abs(firstArg - lastArg);
        m = Math.pow(10, Math.max(firstArg, lastArg));
        if (differ > 0) {
            dm = Math.pow(10, differ);
            if (firstArg > lastArg) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * dm;
            } else {
                arg1 = Number(arg1.toString().replace(".", "")) * dm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
        } else {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m;
    };


    // 除
    utils.mathDiv = function (arg1, arg2) {
        var firstArg,
            lastArg,
            r1,
            r2;

        try {
            firstArg = arg1.toString().split(".")[1].length;
        } catch (e) {
            firstArg = 0;
        }

        try {
            lastArg = arg2.toString().split('.')[1].length;
        } catch (e) {
            lastArg = 0;
        }
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));

        return (r1 / r2) * Math.pow(10, lastArg - firstArg);
    };


    // 乘
    utils.mathMul = function (arg1, arg2) {
        var m = 0,
            firstArg,
            lastArg;
        firstArg = arg1.toString();
        lastArg = arg2.toString();

        try {
            m += firstArg.split('.')[1].length;
        }
        catch (e) {
        }

        try {
            m += lastArg.split('.')[1].length;
        }
        catch (e) {
        }

        return Number(firstArg.replace(".", "")) * Number(lastArg.replace(".", "")) / Math.pow(10, m);
    };

    // 减
    utils.mathSub = function (arg1, arg2) {
        var firstArg,
            lastArg,
            differ,
            m;
        try {
            firstArg = arg1.toString().split('.')[1].length;
        } catch (e) {
            firstArg = 0;
        }

        try {
            lastArg = arg2.toString().split('.')[1].length;
        }
        catch (e) {
            lastArg = 0;
        }
        differ = Math.pow(10, Math.max(firstArg, lastArg));
        m = (firstArg > lastArg) ? firstArg : lastArg;
        return ((arg1 * differ - arg2 * differ) / differ).toFixed(m);
    };

    /**
     * 实时数据和累计数据使用
     * @param arr
     * @private
     */
    utils._transData = function (arr) {
        var r = $.extend(true, [], arr);
        for (var i = 0; i < r.length - 1; i++) {
            if (arr[i] == null && arr[i + 1] != null) {
                r[i + 1] = null;
            }
        }
        return r;
    };

    utils.getValueByArr = function (o, arr) {
        var result = o;
        arr.forEach(function (elem) {
            if (result && !_.isUndefined(result[elem])) {
                result = result[elem];
            } else {
                result = null;
                return false;
            }
        });

        return result;
    };

    /*
     * Create By Crow on 2015年3月26日20:42:46
     * 数据分页函数
     * */
    utils.splitDatePage = function (arr, pageNo, everyPages) {
        var n = 0,
            result = [],
            start = (pageNo - 1) * everyPages,
            end = start + everyPages;

        for (n = start; n < end; n++) {
            if (arr[n]) {
                result.push(arr[n]);
            }
        }
        return result;
    };

    utils.getStatus = function (json, adGroup, str) {
        var j = json.data ? json.data.campaign : json;
        // 判断字符串是否存在
        var reason = j.settleReason ? j.settleReason.split(";") : '';
        var _html = '';
        if (typeof adGroup === 'string') {
            str = adGroup;
        }
        // 余额判断
        if (j.onlineStatus === "offline") {
            _html = '计划处于暂停推广中';
        } else if (adGroup && adGroup.onlineStatus === "offline") {
            _html = '宝贝处于暂停推广中';
        }
        if (reason && reason.indexOf("2") > -1) {
            _html = '计划花费达到日限额下线';
        }
        if (reason && reason.indexOf("1") > -1) {
            _html = '账户余额不足';
        }

        if (str && _html) {
            str = '<span class="hint hint--top hint--warning" data-hint="' + _html + '" style="color: red">' + str + '</span>';
        }
        //_html = '';
        return {text: _html, str: str};
    };

    utils.changeCSMode = function (bl, cb) {
        app.storage.add('csMode', bl);
        app.cache.addParams({
            'viewMode': bl ? '1' : '-1'
        });
        app.connect.ajax({
            'type': 'post',
            'context': this,
            'api': '/sources/cusService/change/viewMode',
            'data': ['viewMode'],
            'complete': function () {
                if (cb) {
                    cb();
                }
            }
        });
    };

    /**
     * 处理自定义报表数据
     * directPpr(Plus purchase rate) 直接加购率=直接购物车数/点击量
     * indirectPpr(Plus purchase rate) 间接加购率=间接购物车数/点击量
     * pprTotal(Plus purchase rate) 总加购率=总购物车数/点击量
     * favItemRate 宝贝收藏率=收藏宝贝数/点击量
     * favShopRate 店铺收藏率=收藏店铺数/点击量
     * favRate 总收藏率=总收藏数/点击量
     * directPprFavRate 直接加购收藏率（兴趣度）=（收藏宝贝数+直接购物车数）/点击量
     * @param report
     * @returns {Array}
     */
    utils.selfFormatData = function (report) {
        var key;
        for (key in report) {
            if (report.hasOwnProperty(key)) {
                if (+report.click) {
                    report.directPpr = +(report.directCartTotal / report.click * 100).toFixed(2);
                    report.indirectPpr = +(report.indirectCartTotal / report.click * 100).toFixed(2);
                    report.pprTotal = +(report.cartTotal / report.click * 100).toFixed(2);
                    report.favItemRate = +(report.favItemCount / report.click * 100).toFixed(2);
                    report.favShopRate = +(report.favShopCount / report.click * 100).toFixed(2);
                    report.favRate = +(report.favCount / report.click * 100).toFixed(2);
                    report.directPprFavRate = +((report.favItemCount + report.directCartTotal) / report.click * 100).toFixed(2);
                } else {
                    report.directPpr = 0;
                    report.indirectPpr = 0;
                    report.pprTotal = 0;
                    report.favItemRate = 0;
                    report.favShopRate = 0;
                    report.favRate = 0;
                    report.directPprFavRate = 0;
                }
            }
        }
        return report;
    };

    utils.moveDialog = function ($d) {
        var $w = $(document),
            $c = $('#content'),
            w1 = $c.offset().left + $c.outerWidth(),
            h1 = $c.offset().top + $c.outerHeight(),
            mt = parseInt($d.css('margin-top') || 0),
            ml = parseInt($d.css('margin-left') || 0);
        var w2 = $w.width(),
            h2 = $w.height(),
            w3, h3;
        if (w2 > w1) {
            w3 = w2 - w1;
            $d.css('margin-left', ml - w3);
            $d.data('ml', w3);
        } else {
            w3 = $d.data('ml');
            $d.css('margin-left', ml + w3);
        }
        if (h2 > h1) {
            h3 = h2 - h1;
            $d.css('margin-top', mt - h3);
            $d.data('mt', h3);
        } else {
            h3 = $d.data('mt');
            $d.css('margin-top', mt + h3);
        }
    };
    module.exports = utils;
});