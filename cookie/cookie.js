/**
 * Created by No98342 on 2017/4/6.
 */

var settingCookie = function () {

    var instance;

    var createInstance = function () {
        if (instance) {
            console.warn('More than one instance');
            return instance;
        }
        instance = {};
        return loadCookie(instance);
    };

    var notEmpty = function (val) {
        if (!val || val.length === 0) return false;
        return val;
    };

    var loadCookie = function () {
        var tempArr = document.cookie.split('; '), obj = {};
        for (; tempArr.length > 0;) {
            var property = tempArr.shift().split('=');
            var key = property[0], val = property[1];
            if (key.length !== 0) obj[key] = val;
        }
        instance = new Observer(obj);
        return instance.data;
    };

    function Observer(obj) {
        this.data = obj;
        this.addMethod(obj);
    }

    function setCookie(key, value, expires, path, domain, secure) {
        var tmp = key.toString() + '=' + value.toString();
        if (expires) {
            var date = new Date();
            date.setTime(parseInt(expires) * 1000 + date.getTime());
            tmp += '; expires=' + date.toUTCString();
        }
        if(path) {
            tmp += '; domain=' + path;
        }
        if(domain) {
            tmp += '; domain=' + domain;
        }
        if(secure) {
            tmp += '; domain=' + secure;
        }
        document.cookie = tmp;
    }

    Observer.prototype = {
        addMethod: function (obj) {
            let val = null;
            this.method();
            for (let i in obj) {
                if (obj.hasOwnProperty(i)) {
                    val = obj[i];
                    if (typeof val === 'object') new Observer(val);
                    this.convert(i, val);
                }
            }
        },
        convert: function (key, value) {
            Object.defineProperty(this.data, key, {
                enumerable: true,
                configurable: true,
                get: function () {
                    return value;
                },
                set: function (data) {
                    var newVal, expires, path, domain, secure;
                    if (data instanceof Object) {
                        newVal = data.value || null;
                        expires = data.expires || null;
                        path = data.path || null;
                        domain = data.domain || null;
                        secure = data.secure || null;
                    } else {
                        newVal = data.toString();
                    }
                    setCookie(key, newVal, expires, path, domain, secure);
                    value = newVal;
                }
            })
        },
        method: function () {
            Object.defineProperties(this.data,
                {
                    'remove': {
                        value: function (key) {
                            if (this.hasOwnProperty(key)) {
                                setCookie(key, '', -1);
                                delete this[key];
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    'set': {
                        value: function () {
                            if (arguments.length === 0) return false;
                            var key, value, expires, path, domain, secure;
                            if (arguments[0] instanceof Object) {
                                let tempObj = arguments[0];
                                key = tempObj.name || null;
                                value = tempObj.value || null;
                                expires = tempObj.expires || null;
                                path = tempObj.path || null;
                                domain = tempObj.expires || null;
                                secure = tempObj.secure || null;
                            } else if (arguments.length > 1) {
                                key = arguments[0] || null;
                                value = arguments[1] || null;
                                expires = arguments[2] || null;
                                path = arguments[3] || null;
                                domain = arguments[4] || null;
                                secure = arguments[5] || null;
                            } else {
                                return false;
                            }
                            if (!notEmpty(key) || !notEmpty(value)) {
                                return false;
                            }
                            this[key] = value;
                            setCookie(key, value, expires, path, domain, secure);
                            instance.convert(key, value);
                        }
                    }
                }
            );
        }
    };

    return {
        init: function () {
            return createInstance();
        }
    }
}();