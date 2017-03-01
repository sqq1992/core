/**
 * @fileOverview
 * @author Crow
 * @version 0.0.1
 * @time 2015/12/27
 */


/*global define, require, exports, module, app, _, $, console, moment*/
define(function (require, exports, module) {
    'use strict';


    var Model = require('model');
    var utils = require('utils');
    var dialog = require('Dialog');

    var model = new Model('getStatus');
    model.api = '/sources/hostingCampaigns';
    model.type = 'put';
    // ???????
    model.requestParams = {
        'campaignId': 'Number',
        'engineNo': 'Number',
        'engineType': 'Number'
    };


    /**
     * ???????????????¦Ë???????§Ø?????????????????
     * @private
     */
    model._initRequestParams = function (requestParams) {
        requestParams = utils.formatOptionalParams(requestParams);
        if (!requestParams.campaignId) {
            throw new window.Error("API.newEngine.put: *????????campaignId");
        }

        app.cache.addParams('request', requestParams);
    };

    model._success = function (json, cb) {
        if (json.success) {
            var _data = json;

            if (_.isFunction(cb)) {
                cb(_data);
            }
        } else {
            if (json.subMsg) {
                dialog.showConfirm({
                    'okBtn': false,
                    'content': json.subMsg
                });
            }
            if (_.isFunction(cb)) {
                cb({success: false});
            }
        }
    };

    module.exports = model.entry;
});