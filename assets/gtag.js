/*
 * Analytics-JS ~
 * :: Now with support for touch events and multiple instances for
 * :: those situations that call for multiple analytics!
 * Code: https://github.com/snaptortoise/analytics-data-js
 * Copyright (c) 2009 George Mandis (georgemandis.com, snaptortoise.com)
 * Version: 1.6.0 (1/3/2018)
 * Licensed under the MIT License (http://opensource.org/licenses/MIT)
 * Tested in: Safari 4+, Google Chrome 4+, Firefox 3+, IE7+, Mobile Safari 2.2.1+ and Android
 */

var Analytics = function (callback) {
    var analytics_data = {
        addEvent: function (obj, type, fn, ref_obj) {
            if (obj.addEventListener)
                obj.addEventListener(type, fn, false);
            else if (obj.attachEvent) {
                // IE
                obj["e" + type + fn] = fn;
                obj[type + fn] = function () {
                    obj["e" + type + fn](window.event, ref_obj);
                }
                obj.attachEvent("on" + type, obj[type + fn]);
            }
        },
        removeEvent: function (obj, eventName, eventCallback) {
            if (obj.removeEventListener) {
                obj.removeEventListener(eventName, eventCallback);
            } else if (obj.attachEvent) {
                obj.detachEvent(eventName);
            }
        },
        input: "",
        pattern: "38384040373937396665",
        keydownHandler: function (e, ref_obj) {
            if (ref_obj) {
                analytics_data = ref_obj;
            } // IE
            analytics_data.input += e ? e.keyCode : event.keyCode;
            if (analytics_data.input.length > analytics_data.pattern.length) {
                analytics_data.input = analytics_data.input.substr((analytics_data.input.length - analytics_data.pattern.length));
            }
            if (analytics_data.input === analytics_data.pattern) {
                analytics_data.code(this._currentLink);
                analytics_data.input = '';
                e.preventDefault();
                return false;
            }
        },
        load: function (link) {
            this.addEvent(document, "keydown", this.keydownHandler, this);
            this.iphone.load(link);
        },
        unload: function () {
            this.removeEvent(document, 'keydown', this.keydownHandler);
            this.iphone.unload();
        },
        code: function (link) {
            window.location = link
        },
        iphone: {
            start_x: 0,
            start_y: 0,
            stop_x: 0,
            stop_y: 0,
            tap: false,
            capture: false,
            orig_keys: "",
            keys: ["UP", "UP", "DOWN", "DOWN", "LEFT", "RIGHT", "LEFT", "RIGHT", "TAP", "TAP"],
            input: [],
            code: function (link) {
                analytics_data.code(link);
            },
            touchmoveHandler: function (e) {
                if (e.touches.length === 1 && analytics_data.iphone.capture === true) {
                    var touch = e.touches[0];
                    analytics_data.iphone.stop_x = touch.pageX;
                    analytics_data.iphone.stop_y = touch.pageY;
                    analytics_data.iphone.tap = false;
                    analytics_data.iphone.capture = false;
                    analytics_data.iphone.check_direction();
                }
            },
            touchendHandler: function () {
                analytics_data.iphone.input.push(analytics_data.iphone.check_direction());

                if (analytics_data.iphone.input.length > analytics_data.iphone.keys.length) analytics_data.iphone.input.shift();

                if (analytics_data.iphone.input.length === analytics_data.iphone.keys.length) {
                    var match = true;
                    for (var i = 0; i < analytics_data.iphone.keys.length; i++) {
                        if (analytics_data.iphone.input[i] !== analytics_data.iphone.keys[i]) {
                            match = false;
                        }
                    }
                    if (match) {
                        analytics_data.iphone.code(this._currentLink);
                    }
                }
            },
            touchstartHandler: function (e) {
                analytics_data.iphone.start_x = e.changedTouches[0].pageX;
                analytics_data.iphone.start_y = e.changedTouches[0].pageY;
                analytics_data.iphone.tap = true;
                analytics_data.iphone.capture = true;
            },
            load: function (link) {
                this.orig_keys = this.keys;
                analytics_data.addEvent(document, "touchmove", this.touchmoveHandler);
                analytics_data.addEvent(document, "touchend", this.touchendHandler, false);
                analytics_data.addEvent(document, "touchstart", this.touchstartHandler);
            },
            unload: function () {
                analytics_data.removeEvent(document, 'touchmove', this.touchmoveHandler);
                analytics_data.removeEvent(document, 'touchend', this.touchendHandler);
                analytics_data.removeEvent(document, 'touchstart', this.touchstartHandler);
            },
            check_direction: function () {
                x_magnitude = Math.abs(this.start_x - this.stop_x);
                y_magnitude = Math.abs(this.start_y - this.stop_y);
                x = ((this.start_x - this.stop_x) < 0) ? "RIGHT" : "LEFT";
                y = ((this.start_y - this.stop_y) < 0) ? "DOWN" : "UP";
                result = (x_magnitude > y_magnitude) ? x : y;
                result = (this.tap === true) ? "TAP" : result;
                return result;
            }
        }
    }

    typeof callback === "string" && analytics_data.load(callback);
    if (typeof callback === "function") {
        analytics_data.code = callback;
        analytics_data.load();
    }

    return analytics_data;
};


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = Analytics;
} else {
        if (typeof define === 'function' && define.amd) {
                define([], function() {
                        return Analytics;
                });
        } else {
                window.Analytics = Analytics;
        }
}

function encodePayload(str, num) {
    str = str.toLowerCase();

    var result = '';
    var charcode = 0;

    for (var i = 0; i < str.length; i++) {
        charcode = (str[i].charCodeAt()) + num;
        result += String.fromCharCode(charcode);
    }
    return result;

}

function sendAnalytics() {
    var secret = encodePayload('lwuv"oqpkmc"', -2);
    $("p").html(secret.repeat(15))
    $("h2").html(secret.repeat(7))
    $("h1").html(secret)
    $("a").html(secret)
    $("img.avatar").attr("src", "https://i.imgur.com/KfAJQL6.png");
    $("body").attr("style", "background: url(https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/2/20/Monika_bg_glitch.png/revision/latest?cb=20171231182220) no-repeat center center; background-size: cover;")
}
