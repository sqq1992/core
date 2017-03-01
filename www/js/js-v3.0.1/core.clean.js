/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2016/2/24
 */


if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisp*/){
        var len = this.length;
        if (typeof fun != "function"){
            throw new TypeError();
        }
        var res = new Array();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++){
            if (i in this){
                var val = this[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, this)) {
                    res.push(val);
                }
            }
        }
        return res;
    };
}

if (!Array.prototype.forEach) {
    Array.prototype.forEach= function(action, that) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}

if(!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

//http://stackoverflow.com/questions/18500942/array-map-function-not-supported-in-ie8-standards
if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
        var T, A, k;
        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        if (thisArg) {
            T = thisArg;
        }
        A = new Array(len);

        k = 0;
        while(k < len) {
            var kValue, mappedValue;

            if (k in O) {

                kValue = O[ k ];
                mappedValue = callback.call(T, kValue, k, O);
                A[ k ] = mappedValue;
            }
            k++;
        }
        return A;
    };
}

// http://www.cnblogs.com/JustRun1983/archive/2013/04/02/2996650.html
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/)
    {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++)
        {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}
/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/11/3
 */
/*global _*/
(function (window) {
    'use strict';
    var app = {
        version: '3.0.1'
    };
    // 加载
    app.load = {};
    // 缓存
    app.cache = {};
    // 路由
    app.route = {};
    // 控制
    app.control = {};
    // 通信
    app.connect = {};
    // 公共方法
    app.util = {};

    window.app = app;
}(window));
/**
 * Created by Crow on 2014/9/25.
 *
 * QC._cache 缓存区
 *
 * QC.cache 有三个方法
 * addParams : 向缓存区增加参数
 * getParams : 从缓存区获得参数
 * removeParams : 从缓存区删除参数
 */
/*global jQuery, app, _*/
(function (app) {
    'use strict';
    app = app || {};


    /*变量缓存区*/
    var _cache = {};

    app._cache = _cache;
    app.cache = {
        addParams: function (type, params) {
            if (arguments.length === 1) {
                params = arguments[0];
                type = 'request';
            }
            var i = 0;
            _cache[type] = !_cache[type] ? {} : _cache[type];
            for (i in params) {
                if (params.hasOwnProperty(i)) {
                    _cache[type][i] = params[i];
                }
            }
        },
        getParams: function (type, key) {
            if (arguments.length === 1) {
                key = arguments[0];
                type = 'request';
            }
            var result = null;
            if (_.isUndefined(key)) {
                result = _cache[type];
            } else {
                result = _.isUndefined(_cache[type]) ? undefined : _.isUndefined(_cache[type][key]) ? undefined : _cache[type][key];
            }
            return result;
        },
        removeParams: function (type, params) {
            if (arguments.length === 1) {
                params = arguments[0];
                type = 'request';
            }
            var i = 0;
            if (_.isUndefined(_cache[type])) {
                return 0;
            }
            if (params === 'all') {
                for (i in _cache[type]) {
                    if (_cache[type].hasOwnProperty(i)) {
                        delete _cache[type][i];
                    }
                }
            } else {
                if (!_.isArray(params)) {
                    params = [params];
                }
                for (i in params) {
                    if (params.hasOwnProperty(i)) {
                        delete _cache[type][params[i]];
                    }
                }
            }
        }
    };
}(app));
/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/11/20
 */
/*global quiCloud*/
(function (app) {

    var _config = {

    };


    app.config = function(o) {

    }

}(app));
/**
 * Created by Crow on 2014/9/25.
 * Updated by Crow on 2015-1-22 10:20:33.
 * 加入 ajax 请求数组，解决 hashChange 时，停止之前相同的 ajax请求，
 * Updated by Crow on 2015-1-22 14:40:20.
 * Updated by Crow on 2015年10月13日19:59:15
 * 代码重构
 */

/*global jQuery, app, window, monitor, _, console*/
(function ($, app) {
    'use strict';
    app = app || {};
    /**
     * params : {type, api, data, beforeSend, success, error, complete}
     * params : {
     *      type : get/post,
     *      api : name,
     *      data : ['param1', 'param2', 'param3'...],
     *      isRepeat: false,    // 是否重复请求
     *      beforeSend : function(){},
     *      success : function(){},
     *      error : function(){},
     *      complete : function(){}
     * }
     *
     * */

    /**
     * Updated by Crow on 2015-1-22 10:20:33.
     * 使用 ajQueue 在 beforeSend 记录当前请求信息，在 complete 删除对应的请求信息，
     * 当在相同的请求多次发送时，abort 前一个请求，解决页面重复请求或者 hash 值改变出现之前请求返回问题。
     * */

    /**
     * Updated by Crow on 2015-1-22 14:42:07.
     * 加入过滤添加，exceptUrl 数据包含不需要处理重复提交 ajax 类型，去掉过滤
     * */
    var ajQueue = [];
    //var exceptUrl = [];


    /**
     * @desc 获得简单的JSON字符串
     * @param data
     * @private
     */
    function _getJSONSingle(data) {
        var _data = data || '';
        return JSON.stringify(_data);
    }


    /**
     * @desc 获得面向后端LIST风格的JSON字符串, 其中含有一个参数值为数组
     * @param data
     * @private
     */
    function _getJSONList(data) {
        var item, arr, n;
        var result = [];
        for (item in data) {
            if (data.hasOwnProperty(item)) {
                if (_.isArray(data[item])) {
                    arr = data[item];
                    for (n = 0; n < arr.length; n++) {
                        data[item] = arr[n];
                        result.push(_.clone(data));
                    }

                    if (arr.length === 0) {
                        data[item] = '';
                        result.push(_.clone(data));
                    }
                    delete data[item];
                }
            }
        }
        return JSON.stringify(result);
    }

    /**
     * @desc 获得面向后端LIST风格的JSON字符串, 其中含有一个以及以上参数值为数组
     * @param data
     * @private
     */
    function _getJSONLists(data) {
        var item, str, lastItem, n;
        var temp = {};
        var result = [];
        //先将对象中的多个数据存入 temp 对象中
        for (item in data) {
            if (data.hasOwnProperty(item)) {
                if (_.isArray(data[item])) {
                    temp[item] = data[item];
                    lastItem = item;
                }
            }
        }

        //遍历temp任意一个数据，这里遍历最后一个数据元素，在遍历对象中的元素，组合成 data 单数据元素，最后 push 到 adgroupIdArr 数组里面
        for (n = 0; n < temp[lastItem].length; n++) {
            for (str in temp) {
                if (temp.hasOwnProperty(str)) {
                    data[str] = temp[str][n];
                    if (temp[lastItem].length === 0) {
                        data[str] = '';
                    }
                }

            }
            result.push(_.clone(data));

        }
        return JSON.stringify(result);
    }

    /**
     * @desc 躲避浏览器广告插件
     * @param str
     * @return {string}
     * @private
     */
    function _filterAd(str) {
        var result = str || '';
        return result.replace(/adgroup/g, 'ddgroup');
    }


    /**
     * TODO 统一把arr改成list
     * @desc 根据数据和类型，返回可传输数据和协议
     * @param data
     * @param type
     * @return {{}}
     * @private
     */
    function _getDataType(data, type) {
        var _type;
        var _data = data || {};
        var result = {};
        if (_.size(_data) > 0) {
            switch (type) {
            case 'post':
                _type = 'post';
                _data = _getJSONSingle(_data);
                break;
            case 'delete':
                _type = 'delete';
                _data = _getJSONSingle(_data);
                break;
            case 'put':
                _type = 'put';
                _data = _getJSONSingle(_data);
                break;
            case 'post-arr':
                _type = 'post';
                _data = _getJSONList(_data);
                break;
            case 'delete-arr':
                _type = 'delete';
                _data = _getJSONList(_data);
                break;
            case 'put-arr':
                _type = 'put';
                _data = _getJSONList(_data);
                break;
            case 'post-arrs':
                _type = 'post';
                _data = _getJSONLists(_data);
                break;
            case 'delete-arrs':
                _type = 'delete';
                _data = _getJSONLists(_data);
                break;
            case 'put-arrs':
                _type = 'put';
                _data = _getJSONLists(_data);
                break;
            }
        }

        result.type = _type;
        result.data = _data;
        return result;
    }


    /**
     * @desc 处理参数，由于接口是采用rest风格，所以这里有一部分处理api中参数
     *      支持data从缓存中取或者直接赋值
     * @param url {String}
     * @param arr {Array}
     * @param type {String}
     * @return {{url: *, data: {}, type: String}}
     * @private
     */
    function _getUrlDataType(url, data, type) {
        var i, temp, value, element, dataType;
        var len;
        var _data = {};
        var _url = url;

        if (_.isArray(data)) {
            len = data.length;
            // 判断是否有参数
            if (len > 0) {
                for (i = 0; i < len; i++) {
                    element = data[i];
                    value = app.cache.getParams('request', element);

                    // 判断参数是否有值
                    if (value !== 'undefined') {

                        // TODO 这个方法可以提出
                        // 处理url中的参数，否则放到json中
                        if (_url.indexOf('{' + element + '}') >= 0) {
                            _url = _url.replace('{' + element + '}', value);
                        } else {
                            /*
                             * Updated by Crow on 2015年4月7日15:22:56
                             * 躲避浏览器广告拦截插件
                             * */
                            if (element.indexOf('adgroup') >= 0 && type === 'get') {
                                temp = _filterAd(data[i]);
                                _data[temp] = value;
                            } else {
                                _data[element] = value;
                            }

                        }
                    }
                }
            }
        } else if (_.isObject(data)) {
            for (i in data) {
                if (data.hasOwnProperty(i)) {
                    element = data[i];
                    if (_url.indexOf('{' + i + '}') >= 0) {
                        _url = _url.replace('{' + i + '}', element);
                    } else {
                        /*
                         * Updated by Crow on 2015年4月7日15:22:56
                         * 躲避浏览器广告拦截插件
                         * */
                        if (i.indexOf('adgroup') >= 0 && type === 'get') {
                            temp = _filterAd(i);
                            _data[temp] = data[i];
                        } else {
                            _data[i] = data[i];
                        }

                    }
                }
            }
        }

        dataType = _getDataType(_data, type);

        _data = dataType.data || '';
        type = dataType.type || type || 'get';

        // 目前只屏蔽get请求的广告拦截
        _url = _filterAd(_url);

        return {api: _url, data: _data, type: type};
    }


    /**
     * 删除对应的请求
     * @param cb
     * @private
     */
    function _delQueue(params) {
        // 相同请求，abort() 之前请求并删除队列对应存储
        ajQueue.forEach(function (elem, index) {
            // update by dyy 增加 data 判断，有时候需要两个相同的 ajax 请求，但是 data 参数值不一样
            if (elem && elem.api === params.api && _.isEqual(elem.data, params.data) && elem.type === params.type) {
                ajQueue.splice(index, 1);
                return false;
            }
        });
    }


    /**
     * 判断队列中是否有相同的请求，并返回位置
     * @param params
     * @returns {number}
     * @private
     */
    function _whereQueue(params) {
        var result = -1;
        // 相同请求，abort() 之前请求并删除队列对应存储
        ajQueue.forEach(function (elem, index) {
            // update by dyy 增加 data 判断，有时候需要两个相同的 ajax 请求，但是 data 参数值不一样
            if (elem && elem.api === params.api && _.isEqual(elem.data, params.data) && elem.type === params.type) {
                result = index;
            }
        });
        return result;
    }

    /**
     * 加入队列中
     * @param params
     * @param cb
     * @private
     */
    function _addQueue(jqXHR, params, success) {
        var obj = {
            'xhr': jqXHR,
            'data': params.data,
            'api': params.api,
            'type': params.type,
            'cb': []
        };
        if (success) {
            obj.cb = [success];
        }
        ajQueue.push(obj);
    }

    /**
     * 加入回调队列
     * @param index
     * @param cb
     * @private
     */
    function _addQueueCb(index, cb) {
        ajQueue[index].cb.push(cb);
    }

    /**
     * @desc 调用后端统一接口
     * @param params
     */
    app.connect.ajax = function (params) {
        var cache = true;
        // udt: url data type
        var udt = _getUrlDataType(params.api, params.data, params.type);

        if (udt.type === 'get') {
            cache = false;
        }

        $.ajax({
            type: udt.type,                         //String，默认：get, HTTP请求方法
            url: udt.api,                           //String，发送请求地址
            context: params.context,
            data: udt.data,                         //Object/String,发送到服务器的数据
            dataType: 'json',                       //String，预期服务器返回的数据类型
            async: params.async || true,            //Boolean, 默认，true，是否异步
            headers: {
                'X-HTTP-Method-Override': udt.type,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            cache: cache,                           //Boolean，默认：true,是否从浏览器缓存中加载请求信息
            beforeSend: function (jqXHR) {

                // 检查队列中是否有这个请求
                var num = _whereQueue(udt);
                if (num != -1) {
                    _addQueueCb(num, params.success);
                    
                    jqXHR.abort();
                } else {
                    _addQueue(jqXHR, udt, params.success);
                }

                if (params.beforeSend) {
                    params.beforeSend();
                }
            },//Function，参数：XMLHttpRequest 发送请求前执行
            success: function (json) {
                //var sThis = this;
                // session超时跳转
                if (json.sessionTimeout) {
                    window.location.href = "/www/home/index.html";
                    return;
                }
                var num = _whereQueue(udt);
                ajQueue[num].cb.forEach(function (elem) {
                    elem(json);
                });
            },//Function，参数：data,textStatus  请求成功后回调函数
            error: function (error, setts) {
                if (params.error) {
                    params.error(error, setts);
                }
            },//Function，参数:XMLHttpRequest, textStatus, errorThrown
            complete: function (jqXHR) {
                // 完成删除队列请求
                _delQueue(udt);
                if (params.complete) {
                    params.complete(jqXHR);
                }
            }
        });
    };

    app.connect.socket = {

    };

}(jQuery, app));

/**
 * Created by Crow on 2014/9/26.
 * app.control 组件控制模块
 */

/*global jQuery, app, _*/
(function (app) {
    'use strict';
    //初始化control
    app = app || {};

    var _cache = null;

    function addCache(arr) {
        var n;
        _cache = _cache || {};
        for (n = 0; n < arr.length; n++) {
            _cache[arr[n]] = _cache[arr[n]] || {};
            _cache[arr[n]].status = 1;
        }
    }

    function reduceCache(arr) {
        var n;
        _cache = _cache || {};
        for (n = 0; n < arr.length; n++) {
            delete _cache[arr[n]];
        }
    }

    function getRender(arr) {
        var n;
        var result = [];
        if (!_cache) {
            return arr;
        }

        _cache = _cache || {};
        for (n = 0; n < arr.length; n++) {
            if (_cache[arr[n]] === undefined) {
                result.push(arr[n]);
            }
        }
        return result;
    }

    function getDestroy(arr) {
        var i;
        var result = [];
        if (!_cache) {
            return result;
        }

        _cache = _cache || {};
        for (i in _cache) {
            if (_cache.hasOwnProperty(i)) {
                if (_.indexOf(arr, i) < 0) {
                    result.push(i);
                }
            }
        }
        return result;
    }

    function getHas(arr) {
        var n;
        var result = [];
        if (!_cache) {
            return result;
        }

        _cache = _cache || {};
        for (n = 0; n < arr.length; n++) {
            if (_cache[arr[n]]) {
                result.push(arr[n]);
            }
        }
        return result;
    }

    app.control = {
        updateModules: function (route, hashSearch, diffPath) {
            var arr = route.modules;
            var cb = route.handler;
            var _render = getRender(arr);
            var _destroy = getDestroy(arr);
            var _has = getHas(arr);
            var _temp = app.url.getHashSearchObj();

            // 如果路径没有改变，则不删除全部的参数
            if (diffPath) {
                app.cache.removeParams('all');
            }

            app.cache.addParams(_temp);

            //销毁
            if (_destroy.length) {
                _destroy.forEach(function (elem) {
                    if (_cache[elem].status) {
                        _cache[elem].fn.destroy();
                        //delete _cache[elem];
                    }
                });
            }

            //初次渲染模块
            app.load.use(_render, function () {
                var i;
                for (i in arguments) {
                    if (arguments.hasOwnProperty(i)) {
                        _cache[_render[i]] = _cache[_render[i]] || {};
                        if (!_cache[_render[i]].fn) {
                            _cache[_render[i]].fn = new arguments[i];
                        }
                        _cache[_render[i]].fn.render();
                    }
                }
            });

            //更新
            if (_has.length) {
                app.load.use(_has, function () {
                    var i, j, str, isUpdate;
                    var _dependence = [];
                    for (i in arguments) {
                        if (arguments.hasOwnProperty(i)) {
                            isUpdate = false;
                            if (_.isArray(_cache[_has[i]].fn.dependence)) {
                                for (j = 0; j < _cache[_has[i]].fn.dependence.length; j++) {

                                    str = _cache[_has[i]].fn.dependence[j];

                                    // 是否有依赖参数、是否有搜索参数、是否等于上一次、这个参数是否在依赖参数里面
                                    if (_cache[_has[i]].fn.dependence && (!hashSearch || hashSearch[str] !== _temp[str]) && _.indexOf(_cache[_has[i]].fn.dependence, str) > -1) {
                                        isUpdate = true;
                                        _dependence.push(str);
                                    }
                                }
                            }

                            if (_cache[_has[i]].fn.dependence === 'hash') {
                                isUpdate = true;
                            }

                            if (isUpdate) {
                                _cache[_has[i]].fn.update(_dependence);           // 更新模块
                            }
                        }
                    }
                });
            }

            // 这边先执行
            addCache(_render);
            reduceCache(_destroy);
            cb();

        },
        load: function (route, hashSearch, diffPath) {
            if (route) {
                this.updateModules(route, hashSearch, diffPath);
            }
        }
    };

}(app));
/*global window, _*/
(function (app, win) {
    'use strict';
    app = app || {};

    var modMap = {};
    var moduleMap = {};

    var slice = [].slice;

    var doc = document;
    var head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement;
    var docCharset = doc.charset;
    var docUrl = location.href.split('?')[0];//去除问号之后部分
    var baseUrl = docUrl;

    var gid = 0;
    var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
    var cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;
    var interactiveScript = null;
    var currentlyAddingScript = null;
    var curExecModName = null;

    var idPrefix = 'load-js-';

    var o = {};

    function _getGid() {
        return gid++;
    }


    /**
     * 处理类似IE11问题
     * http://www.cnblogs.com/diligenceday/p/4504160.html
     * @returns {*}
     */
    function getCurrentNode() {
        if (document.currentScript) {
            return document.currentScript
        }
        var arrScript = document.getElementsByTagName("script");
        var len = arrScript.length;
        for(var i= 0; i<len; i++) {
            if(arrScript[i].readyState === "interactive") {
                return arrScript[i];
            }
        }

        //IE11的特殊处理;
        var path = getCurrentPath();
        for(var i= 0; i<len; i++) {
            if(path.indexOf(arrScript[i].src)!==-1) {
                return arrScript[i];
            }
        }
        throw new Error("getCurrentNode error");
    }

    function getCurrentPath() {
        var repStr = function(str) {
            return (str || "").replace(/[\&\?]{1}[\w\W]+/g,"") || "";
        };
        if (doc.currentScript) {
            return repStr(doc.currentScript.src);
        }

        //IE11没有了readyState属性， 也没有currentScript属性;
        // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
        var stack;
        try {
            a.b.c() //强制报错,以便捕获e.stack
        } catch (e) { //safari的错误对象只有line,sourceId,sourceURL
            stack = e.stack
            if (!stack && window.opera) {
                //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
                stack = (String(e).match(/of linked script \S+/g) || []).join(" ")
            }
        }
        if (stack) {
            /**e.stack最后一行在所有支持的浏览器大致如下:
             *chrome23:
             *firefox17:
             *opera12:http://www.oldapps.com/opera.php?system=Windows_XP
             *IE10:
             * //firefox4+ 可以用document.currentScript
             */
            stack = stack.split(/[@ ]/g).pop(); //取得最后一行,最后一个空格或@之后的部分
            stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, ""); //去掉换行符
            return stack.replace(/(:\d+)?:\d+$/i, ""); //去掉行号与或许存在的出错字符起始位置
        }
        //实在不行了就走这里;
        var node = getCurrentNode();
        //IE>=8的直接通过src可以获取，IE67要通过getAttriubte获取src;
        return repStr(document.querySelector ? node.src : node.getAttribute("src", 4)) || "";

        throw new Error("getCurrentPath error!");
    }

    function _loadJs(src, success, error, option) {
        var d = _.extend({
            charset: docCharset
        }, option);
        var node = doc.createElement('script');
        node.src = src + '?' + app.version;
        node.id = idPrefix + _getGid();
        node.charset = d.charset;
        if ('onload' in node) {
            node.onload = success;
            node.onerror = error;
        } else {
            node.onreadystatechange = function () {
                if (/loaded|complete/.test(node.readyState)) {
                    success();
                }
            };
        }
        //currentlyAddingScript = node;
        head.appendChild(node);
    }

    function getCurSrc() {
        if (doc.currentScript) {
            return doc.currentScript.src;
        }
        if (currentlyAddingScript) {
            return currentlyAddingScript.src;
        }
        // For IE6-9 browsers, the script onload event may not fire right
        // after the script is evaluated. Kris Zyp found that it
        // could query the script nodes and the one that is in "interactive"
        // mode indicates the current script
        // ref: http://goo.gl/JHfFW
        if (interactiveScript && interactiveScript.readyState === "interactive") {
            return interactiveScript.src;
        }

        var scripts = head.getElementsByTagName("script");
        for (var i = scripts.length - 1; i >= 0; i--) {
            var script = scripts[i];
            if (script.readyState === "interactive") {
                interactiveScript = script;
                return interactiveScript.src;
            }
        }

        return getCurrentPath();
    }

    function isUrl(url) {
        return url.search(/^(http:\/\/|https:\/\/|\/\/)/) !== -1;
    }

    function fixUrl(url) {
        return url.replace(/([^:])\/+/g, '$1/');
    }

    function getUrl(path, url) {
        //绝对网址
        if (isUrl(path)) {
            return fixUrl(path);
        }

        var rootUrl;
        //修复url
        if (rootUrl = url.match(/[^\/]*\/\/[^\/]*\//)) {
            //http://yanhaijing.com/abc
            url = url.slice(0, url.lastIndexOf('/') + 1);
            rootUrl = rootUrl[0];
        } else {
            //http://yanhaijing.com
            rootUrl = url = url + '/';
        }

        // /开头
        if (path.search(/^\//) !== -1) {
            return fixUrl(rootUrl + path);
        }

        // ../开头
        if (path.search(/^\.\.\//) !== -1) {
            while (path.search(/^\.\.\//) !== -1) {
                if (url.lastIndexOf('/', url.length - 2) !== -1) {
                    path = path.slice(3);
                    url = url.slice(0, url.lastIndexOf('/', url.length - 2) + 1);
                } else {
                    throw new Error('url错误');
                }
            }

            return fixUrl(url + path);
        }
        // ./
        path = path.search(/^\.\//) !== -1 ? path.slice(2) : path;

        return fixUrl(url + path);
    }

    function fixSuffix(url, suffix) {
        var reg = new RegExp('\\.' + suffix + '$', 'i');
        return url.search(reg) !== -1 ? url : url + '.' + suffix;
    }

    function  replacePath(id) {
        var ids = id.split('/');
        // id中不包含路径 并 查找路径失败
        if (ids.length < 2 && !(ids[0] in o.path)) {
            return id;
        }
        ids[0] = o.path[ids[0]];
        return ids.join('/');
    }

    function getDepUrl(id, url) {
        var pathId = replacePath(id);
        //找到path 基于baseUrl
        if (pathId !== id) {
            url = o.baseUrl;
        }
        return fixSuffix(getUrl(pathId, url || o.baseUrl), 'js');
    }

    function getIdUrl(id) {
        //没有id的情况
        if (!id) {
            return getCurSrc();
        }
        //id不能为相对路径,amd规定此处也不能带后缀，此处放宽限制。
        if (id.search(/^\./) !== -1) {
            throw new Error('资源路径：' + id + '必须是绝对定位');
        }
        return fixSuffix(getUrl(id, o.baseUrl), 'js');
    }

    function require(id, url) {
        var url = getDepUrl(id, url || curExecModName);
        return moduleMap[url] && moduleMap[url].exports;
    }

    function fixPath(path) {
        //path是网址
        if (isUrl(path)) {
            return getUrl('./', path).slice(0, -1);
        }
        return path;
    }

    function config(option) {
        if (!_.isObject(option)) {
            return _.extend({}, o);
        }

        //处理baseUrl
        if (option.baseUrl) {
            option.baseUrl = getUrl(option.baseUrl, docUrl);
        }

        //处理path
        if (_.isObject(option.path)) {
            for (var key in option.path) {
                option.path[key] = fixPath(option.path[key]);
            }
        }
        o = _.extend(o, option);

        //fix keywords
        o.path.BASEURL = fixPath(option.baseUrl || o.baseUrl);
        o.path.DOCURL = fixPath(docUrl);
        return _.extend({}, o);
    }

    function execMod(modName, callback, params) {
        //判断定义的是函数还是非函数
        if (!params) {
            moduleMap[modName].exports = modMap[modName].callback;
        } else {
            curExecModName = modName;
            //commonjs
            var exp = modMap[modName].callback.apply(null, params);
            curExecModName = null;
            //amd和返回值的commonjs
            if (exp) {
                moduleMap[modName].exports = exp;
            }
        }
        //执行回调函数
        callback(moduleMap[modName].exports);

        //执行complete队列
        execComplete(modName);
    }

    function execComplete(modName) {
        //模块定义完毕 执行load函数,当加载失败时，会不存在module
        for (var i = 0; i < modMap[modName].oncomplete.length; i++) {
            modMap[modName].oncomplete[i](moduleMap[modName] && moduleMap[modName].exports);
        }
        //释放内存
        modMap[modName].oncomplete = [];
    }

    function loadMod(id, callback, option) {
        //commonjs
        if (id === 'require') {
            callback(require);
            return -1;
        }
        if (id === 'exports') {
            var exports = moduleMap[option.baseUrl].exports = {};
            callback(exports);
            return -2;
        }
        if (id === 'module') {
            callback(moduleMap[option.baseUrl]);
            return -3;
        }
        var modName = getDepUrl(id, option.baseUrl);
        //未加载
        if (!modMap[modName]) {
            modMap[modName] = {
                status: 'loading',
                oncomplete: []
            };
            //
            _loadJs(modName, function () {
                if (!_.isFunction(modMap[modName].callback)) {
                    execMod(modName, callback);
                    return 0;
                }
                //
                //define的是函数
                use(modMap[modName].deps, function () {
                    execMod(modName, callback, slice.call(arguments, 0));
                }, {baseUrl: modName});
                return 1;
            }, function () {
                modMap[modName].status === 'error';
                callback();
                execComplete(modName);//加载失败执行队列
            });
            return 0;
        }

        //加载失败
        if (modMap[modName].status === 'error') {
            callback();
            return 1;
        }
        //正在加载
        if (modMap[modName].status === 'loading') {
            modMap[modName].oncomplete.push(callback);
            return 1;
        }

        //加载完成
        //尚未执行完成
        if (!moduleMap[modName].exports) {
            //如果define的不是函数
            if (!_.isFunction(modMap[modName].callback)) {
                execMod(modName, callback);
                return 2;
            }

            //define的是函数
            use(modMap[modName].deps, function () {
                execMod(modName, callback, slice.call(arguments, 0));
            }, {baseUrl: modName});
            return 3;
        }

        //已经执行过
        callback(moduleMap[modName].exports);
        return 4;
    }

    function use(deps, callback, option) {
        if (arguments.length < 2) {
            throw new Error('load.use arguments miss');
            return 0;
        }

        if (typeof deps === 'string') {
            deps = [deps];
        }

        if (!_.isArray(deps) || !_.isFunction(callback)) {
            throw new Error('load.use arguments type error');
            return 1;
        }
        //默认为当前脚本的路径或baseurl
        if (!_.isObject(option)) {
            option = {};
        }
        option.baseUrl = option.baseUrl || o.baseUrl;

        if (deps.length === 0) {
            callback();
            return 2;
        }
        var depsCount = deps.length;
        var params = [];
        for (var i = 0; i < deps.length; i++) {
            (function (j) {
                loadMod(deps[j], function (param) {
                    depsCount--;
                    params[j] = param;
                    if (depsCount === 0) {
                        callback.apply(null, params);
                    }
                }, option);
            }(i));
        }

        return 3;
    }

    function define(name, deps, callback) {
        //省略模块名
        if (typeof name !== 'string') {
            callback = deps;
            deps = name;
            name = null;
        }

        //无依赖
        if (!_.isArray(deps)) {
            callback = deps;
            deps = [];
        }

        //支持commonjs
        if (deps.length === 0 && _.isFunction(callback)) {
            callback
                .toString()
                .replace(commentRegExp, '')
                .replace(cjsRequireRegExp, function (match, dep) {
                    deps.push(dep);
                });
            var arr = ['require'];
            if (callback.length > 1) {
                arr.push('exports');
            }
            if (callback.length > 2) {
                arr.push('module');
            }
            deps = arr.concat(deps);
        }

        var modName = getIdUrl(name).split('?')[0];//fix 后缀
        modMap[modName] = modMap[modName] || {};
        modMap[modName].deps = deps;
        modMap[modName].callback = callback;
        modMap[modName].status = 'loaded';
        modMap[modName].oncomplete = modMap[modName].oncomplete || [];
        moduleMap[modName] = {};

        return 0;
    }

    function debug() {
        
    }

    function getData() {
        return o;
    }

    var load = {
        use: use,
        _loadJs: _loadJs,
        config: config,
        define: define,
        require: require,
        debug: debug,
        getData: getData
    };

    load.config({
        baseUrl: baseUrl,
        path: {}
    });
    win.define = define;
    app.load = load;
}(app, window));

/**
 * Created by Crow on 2014/9/25.
 */
/*global quiCloud*/
(function (app) {
    'use strict';
    app = app || {};
    app.modules = {};
}(app));
/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/11/11
 */


/*global app, _, console*/
(function (app) {
    'use strict';

    /**
     * @desc 盒子
     * @type {Object}
     */
    var PB = {};

    /**
     * @desc 存储 不公开
     * @type {Object}
     */
    var _storage = {};

    /**
     * @desc 订阅者（观察者）
     * @param  {String|Array}   types     订阅类型
     * @param  {Function|Array} functions 订阅者
     * @return {void}
     */
    PB.subscribe = function (types, functions) {
        if (_.isString(types)) {
            types = [types];
        }
        if (_.isFunction(functions)) {
            functions = [functions];
        }

        types.forEach(function (name) {
            if (!_storage[name]) {
                _storage[name] = [];
            }
            functions.forEach(function (fn) {
                if (_.isFunction(fn)) {
                    _storage[name].push(fn);
                }
            });
        });
    };

    /**
     * @desc 取消订阅
     * @param  {String|Array}   types     订阅的类型
     * @param  {Function|Array} functions 订阅者
     * @return {void}
     */
     // TODO unSubscribe 一个单词 unsubscribe
    PB.unSubscribe = function (types, functions) {
        var index;

        if (_.isString(types)) {
            types = [types];
        }
        if (_.isFunction(functions)) {
            functions = [functions];
        }

        types.forEach(function (name) {
            if (!_storage[name]) {
                
            } else {
                if (functions) {
                    functions.forEach(function(fn) {
                        index = _storage[name].indexOf(fn);
                        _storage[name].splice(index, 1);
                    });
                } else {
                    _storage[name] = [];
                }
            }
        });
    };

    /**
     * @desc 订阅(被观察者)
     * @param  {String|Array} types 类型
     * @param  {Object}       data  数据
     * @return {void}
     */
    PB.publish = function (types, data) {

        if (_.isString(types)) {
            types = [types];
        }

        types.forEach(function (name) {
            if (!_storage[name] || _storage[name].constructor !== Array) {
                _storage[name] = [];
            }

            _storage[name].forEach(function (fn) {
                fn(data);
            });
        });
    };

    PB.get = function () {
        return _storage;
    };

    app.pb = PB;
}(app, _));
/**
 *
 * Created by Crow on 2014/9/27.
 *
 * Recently by Crow on 2014/12/22.
 *
 */

/*global app, _hmt, _, window, console*/
(function (app) {
    'use strict';
    app = app || {};

    app.route = {
        routes: {},     //缓存以保存当前已经注册的路由
        mode: null,     //取值有两项： hash和history，用来判断是否使用history URL_PATH
        root: '/',      //应用的根路径
        config: function (options) {
            this.mode = options && options.mode && options.mode === 'history' && !!(window.history.pushState) ? 'history' : 'hash';
            this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
            return this;
        },
        clearSlashes: function (path) {
            return path.toString().replace(/\/$/, '').replace(/^\//, '');
        },
        add: function (re, mols, handler) {
            if (_.isArray(re)) {
                mols = re;
                handler = mols;
            }
            if (_.isFunction(re)) {
                
                return false;
            }
            if (this.routes[re]) {
                
                return false;
            }

            this.routes[re] = {
                modules: mols,
                handler: handler || new Function()
            };
            return this;
        },
        remove: function (key) {
            if (this.routes[key]){
                delete this.routes[key];
            }
            return this;
        },
        flush: function () {
            this.routes = {};
            this.mode = null;
            this.root = '/';
            return this;
        },
        check: function (f) {
            // 处理路径是否改变，默认改变
            var diffPath = true;

            var _path = app.url.getHashPath();
            var _search = f ? app.url.getSearchObj(f) : app.url.getHashSearchObj();

            if (f) {
                diffPath = _path !== app.url.getHashPath(f);
            }
            app.control.load(this.routes[_path], _search, diffPath);

            return this;
        },
        /**
         * revise by Crow on 2014/12/18
         * 将计时器改为 hashchange 事件监听
         * */
        listen: function () {
            var self = app.route;
            var current = app.url.getHash();

            // 绑定前先检查当前路由
            self.check();
            window.onhashchange = function () {
                if (current !== app.url.getHash()) {
                    self.check(current);
                    current = app.url.getHash();
                }
            };
            return self;
        },
        navigate: function (path) {
            path = path || '';
            if (this.mode === 'history') {
                window.history.pushState(null, null, this.root + this.clearSlashes(path));
            } else {
                window.location.href.match(/#(.*)$/);
                window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
            }
            this.check();
            return this;
        }
    };

    app.listen = app.route.listen;

}(app));
/**
 * @fileOverview 公共函数，没有依赖库
 * @author Crow
 * @version 0.0.1
 *
 * url:
 *
 *      window.location.href : 整个URL
 *      window.location.protocol : URL 协议
 *      window.location.host : URL的主机部分
 *      window.location.port : URL端口
 *      window.location.pathname : URL文件路径
 *      window.location.hash : 锚点
 */
/*global window, quiCloud*/
(function (win, app) {
    'use strict';

    var obj = {
        'href': '',             //整个URL
        'protocol': '',         //URL 协议
        'host': '',             //URL的主机部分
        'hostName': '',         //URL的主机名
        'port': '',             //URL端口
        'pathname': '',         //URL文件路径
        'hash': '',             //锚点
        'search': ''
    };

    app.url = app.url || {};

    /**
     * 获得当前完整的 URL
     * @extends {Url}
     * @returns {string|string}
     */
    app.url.getHref = function() {
        return decodeURI(win.location.href) || '';
    };

    /**
     * 获得当前 URL 的协议
     * @extends {Url}
     * @returns {string|string}
     */
    app.url.getProtocol = function() {
        return decodeURI(win.location.protocol) || '';
    };

    /**
     * 获得当前 URL 的主机名和端口号
     * @extends {Url}
     * @returns {string|string}
     */
    app.url.getHost = function() {
        return decodeURI(win.location.host) || '';
    }

    /**
     * 获得当前 URL 的主机名
     * @extends {Url}
     * @returns {string|string}
     */
    app.url.getHostName = function() {
        return decodeURI(win.location.hostname) || '';
    }

    /**
     * 获得当前 URL 的端口号
     * @extends {Url}
     * @returns {string|string}
     */
    app.url.getPort = function() {
        return encodeURI(win.location.port) || '';
    }

    /**
     * 获得当前 URL 的路径
     * @extends {Url}
     * @returns {string|string}
     */
    app.url.getPathname = function() {
        return decodeURI(win.location.pathname) || '';
    }

    /**
     * 获得当前 URL hash
     * @extends {Url}
     * @returns {string|string}
     */
    app.url.getHash = function() {
        return decodeURI(win.location.hash) || '';
    }

    /**
     * 获得当前 URL 的查询字串
     * @extends {Url}
     * @returns {string|string}
     */
    app.url.getSearch = function() {
        return decodeURI(win.location.search) || '';
    };

    /**
     * 获得当前 URL 的对象
     * @extends {Url}
     * @returns {{}}
     */
    app.url.getAll = function() {
        var i = '',
            o = {};

        o = this.obj || {};

        for (i in o) {
            if (o.hasOwnProperty(i)) {
                o[i] = win.location[i] || '';
            }
        }
        return o;
    };

    /**
     * 获得当前 URL 的 hash path
     * @extends {Url}
     * @returns {*}
     */
    app.url.getHashPath = function(str) {
        var _hash = str || this.getHash(),
            hashPath = null;

        if (_hash) {
            _hash = _hash.split('?')[0];
            hashPath = _hash.replace('#', '');
        } else {
            hashPath = '';
        }

        return hashPath;
    };

    /**
     * 获得当前 URL hash search的某一个值
     * @extends {Url}
     * @param key
     * @returns {*}
     */
    app.url.getHashSearchObj = function(key) {
        var hash = this.getHash(),
            result = {},
            arr = [];

        var i, temp, search;

        if (/\?/.test(hash)) {
            search = hash.split('?')[1];
            arr = search.split('&');

            for (i = 0; i < arr.length; i++) {
                temp = arr[i].split('=');
                if (key) {
                    if (temp[0] === key) {
                        result = temp[1];
                        break;
                    }
                } else {
                    result[temp[0]] = temp[1];
                }
            }
        } else {
            result = '';
        }

        return result;
    };


    app.url.getSearchObj = function (o) {
        var hash = o,
            result = {},
            arr = [];

        var i, temp, search;

        if (/\?/.test(hash)) {
            search = hash.split('?')[1];
            arr = search.split('&');

            for (i = 0; i < arr.length; i++) {
                temp = arr[i].split('=');
                result[temp[0]] = temp[1];
            }
        } else {
            result = '';
        }

        return result;
    };

    /**
     * 设置当前 URL
     * @extends {Url}
     * @param str
     */
    app.url.setHref = function(str) {
        win.location.href = encodeURI(str);
    };

    /**
     * 设置当前 URL 协议
     * @extends {Url}
     * @param str
     */
    app.url.setProtocol = function(str) {
        win.location.protocol = encodeURI(str);
    };

    app.url.setHost = function(str) {
        win.location.host = encodeURI(str);
    };

    app.url.setHostName = function(str) {
        win.location.hostname = encodeURI(str);
    };

    app.url.setPort = function(str) {
        win.location.port = encodeURI(str);
    };

    app.url.setPathname = function(str) {
        win.location.pathname = encodeURI(str);
    };

    app.url.setHash = function(str) {
        win.location.hash = encodeURI(str);
    };

    app.url.setSearch = function(str) {
        win.location.search = encodeURI(str);
    };


    /**
     * 设置当前 URL hash search值
     * @extends {Url}
     * @param object
     */
    app.url.setHashSearch = function(object) {
        var hashSearch = this.getHash(),
            search = '',
            hash = '',
            obj = {},
            i = 0,
            key = null,
            temp = null,
            str = null,
            arr = [],
            hashArr = [];
        if (/\?/.test(hashSearch)) {
            hashArr = hashSearch.split('?');
            search = hashArr[1];
            if (object.HASH) {
                hash = object.HASH;
                delete object.HASH;
            } else {
                hash = hashArr[0];
            }


            arr = search.split('&');

            for (i = 0; i < arr.length; i++) {
                temp = arr[i].split('=');
                obj[temp[0]] = temp[1];
            }
            for (key in object) {
                if (object.hasOwnProperty(key)) {
                    obj[key] = object[key];
                }
            }
            hash += '?';
            for (str in obj) {
                if (obj.hasOwnProperty(str)) {
                    hash += (str + '=' + obj[str] + '&');
                }
            }
            hash = hash.replace(/&$/, '');
            app.url.setHash(hash);
        } else {
            if (object.HASH) {
                hash = object.HASH;
                delete object.HASH;
            } else {
                hash = hashSearch;
            }

            hash = hash + '?';
            for (i in object) {
                if (object.hasOwnProperty(i)) {
                    hash = hash + i + '=' + object[i] + '&';
                }
            }
            hash = hash.replace(/&$/, '');
            app.url.setHash(hash);
        }


    };

    app.url.delHashSearch = function(arg) {
        var hashSearch = this.getHash(),
            search = '',
            hash = '',
            obj = {},
            i = 0,
            key = null,
            temp = null,
            str = null,
            arr = [],
            hashArr = [];

        hashArr = hashSearch.split('?');
        search = hashArr[1];
        hash = hashArr[0];
        arr = search.split('&');

        for (i = 0; i < arr.length; i++) {
            temp = arr[i].split('=');
            obj[temp[0]] = temp[1];
        }

        if (_.isArray(arg)) {
            for (i = 0; i < arg.length; i++) {
                if (obj[arg[i]]) {
                    delete obj[arg[i]];
                }
            }
        } else {
            if (obj[arg]) {
                delete obj[arg];
            }
        }
        hash += '?';
        for (str in obj) {
            if (obj.hasOwnProperty(str)) {
                hash += (str + '=' + obj[str] + '&');
            }
        }
        hash = hash.replace(/&$/, '');
        app.url.setHash(hash);
    };


    /**
     * 格式化字符串url
     * @param url
     * @returns {{}}
     */
    app.url.parseUrl = function(url) {
        var tmp, res = {},
            p = null,
            r = {
                protocol: /([^\/]+:)\/\/(.*)/i,
                host: /(^[^\:\/]+)((?:\/|:|$)?.*)/,
                port: /\:?([^\/]*)(\/?.*)/,
                pathname: /([^\?#]+)(\??[^#]*)(#?.*)/
            };
        res.href = url;
        for (p in r) {
            if (r.hasOwnProperty(p)) {
                tmp = r[p].exec(url);
                res[p] = tmp ? tmp[1] : '';
                url = tmp ? tmp[2] : '';
                if (url === "") {
                    url = "/";
                }
                if (p === "pathname") {
                    res.pathname = tmp[1];
                    res.search = tmp[2];
                    res.hash = tmp[3];
                }
            }
        }
        return res;
    };

    /**
     * 比较两个域名是否相同
     * @param i {String}    url 必须是合理的url，或者只是pathname,eq: http://www.e.com/sdf
     * @param j {String}    url 必须是合理的url，或者只是pathname, eq: /sdfs/asdf/sdf?sdfsdf=123。有host必须带有protocol
     * @param m {boolean}   是否判断端口、和协议
     * @returns {boolean}
     */
    app.url.isEqualHost = function(i, j, m) {
        var b = true,
            iO = parseUrl(i),
            jO = parseUrl(j);

        iO.protocol = iO.protocol || win.location.protocol;
        iO.host = iO.host || win.location.host;
        iO.port = iO.port || win.location.port;
        jO.protocol = jO.protocol || win.location.protocol;
        jO.host = jO.host || win.location.host;
        jO.port = jO.port || win.location.port;

        // 针对localhost 处理
        if (iO.host === '127.0.0.1') {
            iO.host = 'localhost';
        }
        if (jO.host === '127.0.0.1') {
            iO.host = 'localhost';
        }

        // 是否判断端口
        if (m) {
            b = iO.protocol === jO.protocol && iO.host === jO.host && iO.port === jO.port;
        } else {
            b = iO.host === jO.host;
        }

        return b;
    };

}(window, app));
/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/7/23
 */

/*global window, jQuery, app*/
(function (win, $, app) {
    'use strict';

    /**
     * @description 本地储存
     * @constructor
     */
    var Stg = function () {
        this.cookieExpires = 30;
        this.isHasLocalStorage = win.localStorage || false;
    };

    /**
     * @description 增加数据
     * @param key
     * @param str   必须是字符串
     */
    Stg.prototype.add = function (key, str) {
        if (this.isHasLocalStorage) {
            win.localStorage.setItem(key, str);
        } else {
            // cookie 目前只是简单的存储30天
            $.cookie(key, str, {expires: this.cookieExpires});
        }
    };

    /**
     * @description 目前根据key，获得数据
     * @param key
     * @return {*}
     */
    Stg.prototype.get = function (key) {
        var result = null;
        if (this.isHasLocalStorage) {
            result = win.localStorage.getItem(key);
        } else {
            result = $.cookie(key);
        }

        // 处理 undefined
        if (result === 'undefined') {
            this.del(key);
            result = null;
        }

        // TODO  临时处理
        if (result == 'true' || result == 'false') {
            return JSON.parse(result);
        }
        return result;
    };

    /**
     * @description 目前根据key，删除数据
     * @param key
     */
    Stg.prototype.del = function (key) {
        if (this.isHasLocalStorage) {
            win.localStorage.removeItem(key);
        } else {
            // cookie 暂时设置空，将在浏览器关闭时处理
            $.cookie(key, '');
        }
    };

    app.storage = new Stg();

}(window, jQuery, app));