"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var lodash_1 = require("lodash");
var DEFAULT_CUSTOM_MAPPING = {
    is: 'eq',
    like: 'regex'
};
var WILL_PARSED_TO_REGEX = ['like'];
exports.parseFilter = function (filter, sanitizedField, customMapping, transformToRegexMap) {
    if (filter === void 0) { filter = {}; }
    if (sanitizedField === void 0) { sanitizedField = []; }
    if (customMapping === void 0) { customMapping = {}; }
    if (transformToRegexMap === void 0) { transformToRegexMap = []; }
    if (lodash_1.isEmpty(filter)) {
        return filter;
    }
    var resultMapping = __assign({}, DEFAULT_CUSTOM_MAPPING, customMapping);
    var regexMapping = WILL_PARSED_TO_REGEX.concat(transformToRegexMap);
    var sanitiziedFilter = lodash_1.pickBy(filter, function (_, key) { return sanitizedField.indexOf(key) === -1; });
    var filterKey = Object.keys(sanitiziedFilter);
    filterKey.forEach(function (filterName) {
        var parseJSON = lodash_1.mapValues(sanitiziedFilter[filterName], function (value, key) {
            try {
                var parsed = void 0;
                if (regexMapping.indexOf(key) > -1) {
                    parsed = new RegExp(value, 'gmi');
                }
                else {
                    parsed = JSON.parse(value);
                }
                return parsed;
            }
            catch (error) {
                return value;
            }
        });
        var changeKey = lodash_1.mapKeys(parseJSON, function (_, nestedKey) {
            var key = nestedKey;
            if (resultMapping[nestedKey]) {
                key = resultMapping[nestedKey];
            }
            return "$" + key;
        });
        sanitiziedFilter[filterName] = changeKey;
    });
    return sanitiziedFilter;
};
