(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Avatars = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("./helper/canvas");
var objectAssign = require("object-assign");
var async = (typeof window !== "undefined" ? window['async'] : typeof global !== "undefined" ? global['async'] : null);
var chance_1 = (typeof window !== "undefined" ? window['window'] : typeof global !== "undefined" ? global['window'] : null);
var Avatars = (function () {
    function Avatars(spriteSet, options) {
        if (options === void 0) { options = {}; }
        this.spriteSet = spriteSet;
        this.options = options;
    }
    Avatars.prototype.create = function (token, callback, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var chance = new chance_1.Chance(token);
        this.spriteSet(chance, function (err, spriteSet) {
            async.each(spriteSet, function (sprite, next) {
                sprite.load(next);
            }, function (err) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var avatarOptions = objectAssign({
                    size: 20,
                    order: Object.keys(spriteSet)
                }, _this.options, options);
                var canvas = canvas_1.createCanvas();
                var context = canvas.getContext('2d');
                canvas.width = avatarOptions.size;
                canvas.height = avatarOptions.size;
                // Disable image smoothing
                context.imageSmoothingEnabled = false;
                context.mozImageSmoothingEnabled = false;
                context.oImageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;
                async.eachSeries(avatarOptions.order, function (spriteName, next) {
                    var sprite = spriteSet[spriteName];
                    if (sprite) {
                        sprite.create(chance, function (err, spriteCanvas) {
                            if (err) {
                                next(err);
                                return;
                            }
                            context.drawImage(spriteCanvas, 0, 0, canvas.width, canvas.height);
                            next();
                        });
                    }
                    else {
                        next(new Error('Sprite ' + spriteName + ' does not exist.'));
                    }
                }, function (err) {
                    callback(err, canvas);
                });
            });
        });
    };
    return Avatars;
}());
exports.default = Avatars;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./helper/canvas":4,"object-assign":9}],2:[function(require,module,exports){
(function (process){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color = (function () {
    function Color(colors) {
        this.pickedColors = {};
        this.colors = colors;
    }
    Color.prototype.getColor = function (chance, callback) {
        var _this = this;
        if (this.colors instanceof Array) {
            process.nextTick(function () {
                _this.pickedColors[chance.seed] = _this.pickedColors[chance.seed] || chance.pickone(_this.colors);
                callback(null, _this.pickedColors[chance.seed]);
            });
        }
        else {
            this.colors.getColor(chance, callback);
        }
    };
    return Color;
}());
exports.default = Color;

}).call(this,require('_process'))
},{"_process":10}],3:[function(require,module,exports){
(function (global){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../../color");
var OneColor = (typeof window !== "undefined" ? window['one']['color'] : typeof global !== "undefined" ? global['one']['color'] : null);
var BrighterOrDarkerThan = (function (_super) {
    __extends(BrighterOrDarkerThan, _super);
    function BrighterOrDarkerThan(colors, referenceColor, differenceBrightness, differenceDarkness) {
        var _this = _super.call(this, colors) || this;
        _this.referenceColor = referenceColor;
        _this.differenceBrightness = differenceBrightness ? differenceBrightness / 100 : 0;
        _this.differenceDarkness = differenceDarkness ? differenceDarkness / 100 : 0;
        return _this;
    }
    BrighterOrDarkerThan.prototype.getColor = function (chance, callback) {
        var _this = this;
        _super.prototype.getColor.call(this, chance, function (err, color) {
            _this.referenceColor.getColor(chance, function (err, referenceColor) {
                var hslColor = OneColor([color[0], color[1], color[2], 255]).hsl(); // 50
                var hslReferenceColor = OneColor([referenceColor[0], referenceColor[1], referenceColor[2], 255]).hsl(); // 45
                var minBrightness = hslReferenceColor.lightness() + _this.differenceBrightness; // 55
                var minDarkness = hslReferenceColor.lightness() - _this.differenceDarkness; // 35
                if (_this.differenceBrightness &&
                    minBrightness > hslColor.lightness() &&
                    (0 == _this.differenceDarkness || hslReferenceColor.lightness() < hslColor.lightness())) {
                    hslColor = hslColor.lightness(minBrightness);
                }
                if (_this.differenceDarkness &&
                    minDarkness < hslColor.lightness() &&
                    (0 == _this.differenceBrightness || hslReferenceColor.lightness() > hslColor.lightness())) {
                    hslColor = hslColor.lightness(minDarkness);
                }
                var rgbColor = hslColor.rgb();
                callback(err, [rgbColor.red() * 255, rgbColor.green() * 255, rgbColor.blue() * 255]);
            });
        });
    };
    return BrighterOrDarkerThan;
}(color_1.default));
exports.default = BrighterOrDarkerThan;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../color":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createCanvas() {
    return document.createElement('canvas');
}
exports.createCanvas = createCanvas;
function createImage() {
    return new Image();
}
exports.createImage = createImage;

},{}],5:[function(require,module,exports){
var avatars = require('./avatars').default;
avatars.SPRITE_SETS = {
    female: require('./spriteSets/female').default,
    male: require('./spriteSets/male').default
};
module.exports = avatars;

},{"./avatars":1,"./spriteSets/female":7,"./spriteSets/male":8}],6:[function(require,module,exports){
(function (process){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("./helper/canvas");
var Sprite = (function () {
    function Sprite(options) {
        this.image = null;
        this.imageError = null;
        this.imageSprites = null;
        this.createdCanvases = {};
        // Set default options
        options.size = options.size || 20;
        options.chance = options.chance || 100;
        this.options = options;
    }
    Sprite.prototype.load = function (callback) {
        var _this = this;
        if (null === this.image) {
            // Create HTMLImageElement
            this.image = canvas_1.createImage();
            this.image.addEventListener('load', function () {
                _this.imageSprites = Math.floor(_this.image.width / _this.options.size);
            });
            this.image.addEventListener('error', function (err) {
                _this.imageError = err.error;
            });
        }
        if (this.image.src && this.image.complete) {
            process.nextTick(function () { return callback(_this.imageError, _this.image); });
        }
        else {
            this.image.addEventListener('load', function () {
                callback(null, _this.image);
            });
            this.image.addEventListener('error', function (err) {
                callback(err.error, _this.image);
            });
        }
        if (!this.image.src) {
            this.image.src = this.options.src;
        }
    };
    Sprite.prototype.create = function (chance, callback) {
        var _this = this;
        if (!this.image.complete) {
            process.nextTick(function () { return callback(new Error('Sprite image not loaded.'), null); });
            return;
        }
        if (this.createdCanvases[chance.seed]) {
            process.nextTick(function () { return callback(null, _this.createdCanvases[chance.seed]); });
            return;
        }
        var canvas = canvas_1.createCanvas();
        var context = canvas.getContext('2d');
        canvas.width = this.options.size;
        canvas.height = this.options.size;
        if (chance.bool({ likelihood: this.options.chance })) {
            this.options.color.getColor(chance, function (err, color) {
                context.drawImage(_this.image, chance.natural({ min: 0, max: _this.imageSprites - 1 }) * _this.options.size * -1, 0);
                _this.tintCanvas(canvas, color, function (err) {
                    callback(null, canvas);
                });
            });
        }
        else {
            process.nextTick(function () { return callback(null, canvas); });
        }
    };
    Sprite.prototype.tintCanvas = function (canvas, color, callback) {
        var context = canvas.getContext('2d');
        var buffer = context.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < buffer.data.length; i += 4) {
            var r = i;
            var g = i + 1;
            var b = i + 2;
            var a = i + 3;
            if (a > 0) {
                buffer.data[r] = Math.round((buffer.data[r] - color[0]) * (buffer.data[r] / 255) + color[0]);
                buffer.data[g] = Math.round((buffer.data[g] - color[1]) * (buffer.data[g] / 255) + color[1]);
                buffer.data[b] = Math.round((buffer.data[b] - color[2]) * (buffer.data[b] / 255) + color[2]);
            }
        }
        context.putImageData(buffer, 0, 0);
        process.nextTick(function () { return callback(null); });
    };
    return Sprite;
}());
exports.default = Sprite;

}).call(this,require('_process'))
},{"./helper/canvas":4,"_process":10}],7:[function(require,module,exports){
(function (process){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var sprite_1 = require("../sprite");
var color_1 = require("../color");
var brighterOrDarkerThan_1 = require("../color/modifier/brighterOrDarkerThan");
var femaleSpriteSet = function (chance, callback) {
    process.nextTick(function () {
        var base64Prefix = 'data:image/png;base64,';
        var skinColor = new color_1.default([
            [255, 219, 172],
            [241, 194, 125],
            [224, 172, 105],
            [198, 134, 66],
            [141, 85, 36]
        ]);
        var hairColor = new brighterOrDarkerThan_1.default([
            [9, 8, 6],
            [44, 34, 43],
            [113, 99, 90],
            [183, 166, 158],
            [214, 196, 194],
            [202, 191, 177],
            [220, 208, 186],
            [255, 245, 225],
            [230, 206, 168],
            [229, 200, 168],
            [222, 188, 153],
            [184, 151, 120],
            [165, 107, 70],
            [181, 82, 57],
            [141, 74, 67],
            [145, 85, 61],
            [83, 61, 50],
            [59, 48, 36],
            [85, 72, 56],
            [78, 67, 63],
            [80, 68, 68],
            [106, 78, 66],
            [167, 133, 106],
            [151, 121, 97]
        ], skinColor, 12, 12);
        var spriteSet = {
            face: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAVElEQVQ4jdXTQQoAIAgEwK3//7muZSoqCuYx2CFRge41hPcVzXOgFWMNCnqxx5lBQKx08Gw52u5llf4Q6DiU8j30oqZLsaJsVgMlWM38N5R+e5gObtcgCxr27O7iAAAAAElFTkSuQmCC",
                color: skinColor
            }),
            eyes: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAAQQAAAAUCAYAAABrqUMlAAAAyElEQVR4nO3UQYqEMBAF0Mpl607eyTtlNgZcpII2Ts8I722E/lT6G6MRAAAAAAAAAM/rJ3eyt6435u78/ma9956Z5f5V2bdkZtlhlVV+4/xlZt/3vdy/WfatfmNu27byTFfZsmBElAVn2Wq9MXon+6TfKb57oKuZjx7Gk/s3RouZ22tlZo+IflwvZ2Wxh59vHPdUdPjzfmNm1mGVVY6Px7TDKlv1O174ab8qi4hoV/8E3ur8MrXW2tXsresBAAAAAAAAAAAA/E8/TXqYj63Qaq8AAAAASUVORK5CYII=",
                color: new color_1.default([
                    [118, 119, 139],
                    [105, 123, 148],
                    [100, 123, 144],
                    [91, 124, 139],
                    [88, 131, 135]
                ])
            }),
            eyebrows: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAAQQAAAAUCAYAAABrqUMlAAAAjUlEQVR4nO3UWwqEMAwAQO9/6for4qN5uKswAyKYtKY1dlkAAAAAgC8Zk89+bqaITKEdCx6bq5JzlJ+Nn43JxKI1ZGq7q+GfTTi7nsz3vdq/jj6szpWNR/LD9UVfHLXfwMr4jtwn1jt299lYtIbKHJ0/SGdDv73/np6v6q0HPQAAAAAAAAAAAAAAAMC5FfyBT7GLnPoYAAAAAElFTkSuQmCC",
                color: new brighterOrDarkerThan_1.default(new brighterOrDarkerThan_1.default(hairColor, skinColor, 0, 5), hairColor, 0, 7)
            }),
            mouth: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAAQQAAAAUCAYAAABrqUMlAAAAdElEQVR4nO3UQQqAMAxFQe+U+5+trgoiuvIXg86A20fSSrcNAAAAAAAAAAAAAODTxtsD3Bin77GqSu8am+2i26Fx1Ux2V51fSvt9u//Q7XvhR6H9vsHemELNUVXzPmIzLmjF9g00oJXOD9axCQAAAAAA8FM7aHY9KjKubf4AAAAASUVORK5CYII=",
                color: new brighterOrDarkerThan_1.default([
                    [219, 172, 152],
                    [210, 153, 133],
                    [201, 130, 118],
                    [227, 93, 106],
                    [227, 33, 83],
                    [222, 15, 13]
                ], skinColor, 0, 5)
            }),
            accessories: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAAFAAAAAUCAYAAAAa2LrXAAAAUUlEQVRYhe3QsQ3AMAgEQLKs99+AtC6SAkOT6E6isfSPRQQAANCSw9nRvrXWcd9DNrep6mTLiyazk3358l7pyoiI6/RHH7cfrnqDThYAgJ+4ASmZGFLEUrkXAAAAAElFTkSuQmCC",
                chance: 15,
                color: new color_1.default([
                    [218, 165, 32],
                    [255, 215, 0],
                    [238, 232, 170],
                    [250, 250, 210],
                    [211, 211, 211],
                    [169, 169, 169]
                ])
            }),
            glasses: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAAIwAAAAUCAYAAABf9dUQAAAApklEQVRoge3TUQ6DIBCEYfZK7pW8Vc/UM40vPFCKsE0Rm/T/EhJxYJQYUwIAAAAArKXGiGTRzk+yFWafd2qfu5frlOfDbFT2MtxdvWzUJ2nLY6/7WtnqPs4bP681eiXJ8/VmZo9iXS87U+5JZvY86auzO/r+4ryNexbI3iczChf01fvq9b1sRd/sDzz7/b7qiz4AcVf8IFdQ59m9DAAAAAAAAMCvOQDYlS61XG8FjAAAAABJRU5ErkJggg==",
                chance: 25,
                color: new color_1.default([
                    [95, 112, 92],
                    [67, 103, 125],
                    [94, 23, 45],
                    [255, 182, 122],
                    [160, 75, 93],
                    [25, 25, 25],
                    [50, 50, 50],
                    [75, 75, 75]
                ])
            }),
            clothes: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAAQQAAAAUCAYAAABrqUMlAAABlUlEQVR4nO3XQXLDIAyFYWWmN9KdlDOZO3EmurEcTAGDQzpZ/N9MN+RZTpGRWxEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIDv8qispQU1DqqaRERijK182nOy57r19vxVZjY7kpu5r+elck1rvSrfP1X1ffRrk6+N7p+ZnfobQnjMfN76fn7/Vj3v/2B/XSs7kimzX5lT1aSqoqryfD6r2W3bUoxR9p+Z/XOPgc+qX3Z2GLTqiMjrYRE5DYQ8n7KsZNneL726cZ5dPYhyrYYMHTaXH/yLtWrd8rCP6gyFUz0zO+X9fiGE8rqheo3sSKaVfTeXZ99+/lQ1ef9aQ6EYBv5S+Fh/f+4UuCN7u4kUDSgf6EG9A3pnY1bVq2Vb13eHjKpKCOHYn2IPjzUXYxQz+5MpVQ5olR/wUSEEMbPTgzl6r458j+6+sGq18rVVtW7VzPu1bVvyoVAOgysL9vr/BoLI7YPfs7LBn6j3NjM7DlrtrwGR1+CYPcCfUHsos39n7pZd2YOvHDDlUPC10WEgMj/AXd6zX//a6/txl4UqAAAAAElFTkSuQmCC",
                color: new color_1.default([
                    [209, 17, 65],
                    [0, 177, 89],
                    [0, 174, 219],
                    [243, 119, 53],
                    [255, 196, 37],
                    [116, 0, 1],
                    [174, 0, 1],
                    [238, 186, 48],
                    [150, 206, 180],
                    [255, 238, 173],
                    [255, 111, 105],
                    [255, 204, 92],
                    [136, 216, 176]
                ])
            }),
            hair: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAAQQAAAAUCAYAAABrqUMlAAACE0lEQVR4nO2a23LDIAxEk0z+/5fdlybjUoNuKxDjPS+ZKWi9ICzjmseDEEJ+ea424OAw9pfGeBe9Q9EHEROl6vzdQq8Vt4r1dFq0uujBSrqH0G7tn+VPimn7ofI6uqZHe1V+rdeukN8leqNF5RZtyHrCHZ3fUcxVm/XJ14tDz5+2GPT6Z/vzakbWSS/vV7roHdGs/GrnJ8Xf22Cox8iIx+TVjX3mKfy2fa03lgRaE1UwNb7Oc6spqA/h71pv5/6jwq2Zu16+ez4t+ZDm0Krb07IWg0/bOU57n4z45+OqIKDJvkHuhDSXngU9KqgWNN4yGI15dcHX5kOrqdEL+XsZglfCIlH7H8CVvSHxFphRm1UzuisYxryaBq9g9oJA6EvvYBZm3wCo66EXtFcTrRN9VVihhwbib5cdAoJdn2KVfVf2RhycC0JkW569pc/QrzzeO4LORyW9GUDGu8sOIeOVgcSovDtA5PqW66UtCN7PhDuA+o6+y3h3BJ0PpJ7lC070Wp4Yr78/ny9n7BAsJjV9q+uRGNXzu7IopI83+xwC6pNKa1w6lHEVI/XNOlZL7ETz4X2d0RysynhVQqw/j7/PruJ7/RkHkxBcbYesR4jbSUd+//XoSXEZi3onso6IR6g+t+GDWO+mYZYJK4hFUD2ZpC6aJ7gF9HmQqL/R0fWyfLY2s+LIPI7md1YsIYQQQgghhBA9P5+4njKanBJ6AAAAAElFTkSuQmCC",
                chance: 95,
                color: hairColor
            }),
        };
        callback(null, spriteSet);
    });
};
exports.default = femaleSpriteSet;

}).call(this,require('_process'))
},{"../color":2,"../color/modifier/brighterOrDarkerThan":3,"../sprite":6,"_process":10}],8:[function(require,module,exports){
(function (process){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var sprite_1 = require("../sprite");
var color_1 = require("../color");
var brighterOrDarkerThan_1 = require("../color/modifier/brighterOrDarkerThan");
var maleSpriteSet = function (chance, callback) {
    process.nextTick(function () {
        var base64Prefix = 'data:image/png;base64,';
        var skinColor = new color_1.default([
            [255, 219, 172],
            [241, 194, 125],
            [224, 172, 105],
            [198, 134, 66],
            [141, 85, 36]
        ]);
        var hairColor = new brighterOrDarkerThan_1.default([
            [9, 8, 6],
            [44, 34, 43],
            [113, 99, 90],
            [183, 166, 158],
            [184, 151, 120],
            [165, 107, 70],
            [181, 82, 57],
            [141, 74, 67],
            [145, 85, 61],
            [83, 61, 50],
            [59, 48, 36],
            [85, 72, 56],
            [78, 67, 63],
            [80, 68, 68],
            [106, 78, 66],
            [167, 133, 106],
            [151, 121, 97]
        ], skinColor, 12, 12);
        var spriteSet = {
            face: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAS0lEQVQ4jWNgGOyAEYf4f3L1YzOQWMOwmoFuIKmGYZjDRKYBOAHVDUT2MrneRTFraHmZgWHExTIMUDWnkGooUXmZkOF49YwWDpQDANohChvs8TZPAAAAAElFTkSuQmCC",
                color: skinColor
            }),
            eyes: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAAQQAAAAUCAYAAABrqUMlAAAAyElEQVR4nO3UQYqEMBAF0Mpl607eyTtlNgZcpII2Ts8I722E/lT6G6MRAAAAAAAAAM/rJ3eyt6435u78/ma9956Z5f5V2bdkZtlhlVV+4/xlZt/3vdy/WfatfmNu27byTFfZsmBElAVn2Wq9MXon+6TfKb57oKuZjx7Gk/s3RouZ22tlZo+IflwvZ2Wxh59vHPdUdPjzfmNm1mGVVY6Px7TDKlv1O174ab8qi4hoV/8E3ur8MrXW2tXsresBAAAAAAAAAAAA/E8/TXqYj63Qaq8AAAAASUVORK5CYII=",
                color: new color_1.default([
                    [118, 119, 139],
                    [105, 123, 148],
                    [100, 123, 144],
                    [91, 124, 139],
                    [88, 131, 135]
                ])
            }),
            eyebrows: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAHUlEQVQ4jWNgGAVDBvynkhrSFJKodhSMglEwkgEAp6ED/bRBxw4AAAAASUVORK5CYII=",
                color: new brighterOrDarkerThan_1.default(new brighterOrDarkerThan_1.default(hairColor, skinColor, 0, 5), hairColor, 0, 7)
            }),
            mustache: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAANwAAAAUCAYAAADm4VNYAAAA+ElEQVR4nO3ZwQ7CIAyA4Wp8bI+89zzNzM1BC4UV/b9kJ6FjQFcyRQAAAAAAAAAAABDAMqjPr0qD+qjdewYH8ImEi89SsahuR5aK1bW6iRwTbtlcJZq2HIl8aNejJG0uj7bhjmwN9xwyrkfmN6+Nv4jIzdB2ZrXj18yP99x4bbAkIs/B96zhce/aGO/5ySWcp9kTCXlXJtJUvr1ZrclRejt7x4su+vxZk6NUvbzjeQv1vGeLo11k76NibbKt8VuT9Wyc1rjR50+7abyPirXJtsZv7V/S/XmvqCb7zROtojG+NvvNOLqilUQf31/SfqkFTPgfDgAAAI1ePdA5SBvHuo0AAAAASUVORK5CYII=",
                chance: 50,
                color: new brighterOrDarkerThan_1.default(new brighterOrDarkerThan_1.default(hairColor, hairColor, 15, 0), skinColor, 0, 5)
            }),
            mouth: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAANwAAAAUCAYAAADm4VNYAAAAdklEQVR4nO3UywqAIBAF0Ab6/1+eNi2kRc8xg87ZiCDXK4rTBAAAAAAAAAAAAPBfMXDvHLz/G3qdMdexV/Zn7iUzs51HxNNubV7VOU9nzhcCKy8hj5fcyqvouO32JDOK83qo7tfjQVdqO1W86099UAAAAAAA+xYj7xMHNiFSXAAAAABJRU5ErkJggg==",
                color: new brighterOrDarkerThan_1.default([
                    [238, 193, 173],
                    [219, 172, 152],
                    [210, 153, 133]
                ], skinColor, 0, 5)
            }),
            glasses: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAYAAABGUvnzAAAAmElEQVRoge3V0Q3DIAxFUbxSvFK36kyd6fWHjxQ5Tqu6pEL3SEgRhkcQEWkNAAAAwGdswhpK1s1q72aO47PaDNX7rctzd/VJL83dldXO8iRtvd3GvKg2O2/l/UanLUnenzczu+/GZbUj+znNzB4HeWPtirzl9hsecND3H1dMnFlxRVfmVR/wV+93xT9qdb/4oAEAAAAAAPAEmLbyGT/XnVYAAAAASUVORK5CYII=",
                chance: 25,
                color: new color_1.default([
                    [95, 112, 92],
                    [67, 103, 125],
                    [94, 23, 45],
                    [255, 182, 122],
                    [160, 75, 93],
                    [25, 25, 25],
                    [50, 50, 50],
                    [75, 75, 75]
                ])
            }),
            clothes: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAAQQAAAAUCAYAAABrqUMlAAABe0lEQVR4nO3XbY7CIBCA4WmyN4Iz9VCcCc6EP7YY5GugsmtM3icxahmHj8KoIgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfFycvIbvFYvH0NFJsKKVY5SvjNfa/yWfMUZEREIIzXyD9iqfMUZCCHI9V/mU9hfe+2itFe+9WGubsTMxiTEmXvPIL6fPxCxOrrjp+9GajzEmdvrqjk9bm5mY5DzPaj8751JbFe+cm1q/JIQgMf5eOo7juW5Z++p+1iyNT1OOTztMs3qD3JpvdbKJtrGu1yl25n13vsVhn33uHnQRkXTYR/KYXlForV9xWKsNfcUs3Y8Ur7X38q0UhFG+UTHIYqrP9YpCqxh04qSIU89Ha90Hff3Z+fi5k+BTejfgnXyLheB5kFtuFoOpsVpr7090IB+DtikXcm7527ErT+48z+EvhBX5fRR53U+reWb7elfeVyvfVxWEuxt2dyEZ9bO7KIwKQb6hnXNTvySwV74n3y2o2pfSDtpZeAAqEzJHfLIZ6QAAAABJRU5ErkJggg==",
                color: new color_1.default([
                    [91, 192, 222],
                    [92, 184, 92],
                    [66, 139, 202],
                    [3, 57, 108],
                    [0, 91, 150],
                    [100, 151, 177],
                    [27, 133, 184],
                    [90, 82, 85],
                    [85, 158, 131],
                    [174, 90, 65],
                    [195, 203, 113],
                    [102, 101, 71],
                    [255, 226, 138]
                ])
            }),
            hair: new sprite_1.default({
                src: base64Prefix + "iVBORw0KGgoAAAANSUhEUgAAAQQAAAAUCAYAAABrqUMlAAABkklEQVR4nO2XWW7DMAwFlaL3v7L70aQIVIqbaFluZ4AgiS0/UgsXtwZQz/H8/FXe53cMrvf3JA1rjOd+KY+VxiDF0b736fXdBr9fB+fqPe0P8NX+VBMNUG3+Ea0l6ygZqZxwVNM76Z31+sCUtL0B3Ae7hZQwLHYM4B33Nxq8R/e/14rsq6Q94+tQQ3JUum4ZrlpIj+2+OmoansA4K+Nba6uN1Z7L2LbYpbtoTU5Q2h6t2t9R4tTOmOc8eGxbWpZub2OoNcpcEbwLIjk2GqvpWQsbmVP2/czTWUUPqqWZ6U7uhjVfqwCcxUwXJc0pmgx6rVGFjyaDX7Y/E04NxSbHz7RQM2SrqaQTCUhrfCa4s2u4E9p8rc7wbLLxUeXvS8ujp8VZG2l8JJyK0DtlLejs/apnsjyC9rTxd63yK4iuc4W9Ko1sd9CP9SROjw68kcncd6/AcD1H81d67flyzu4Qdmf3jgNgKf89IQBcyXbFhYQAAD+QEADuySndBQkBYD3bvSoAAAAAAAAAAAAAAAAAABTxBbb7ZiKCSz60AAAAAElFTkSuQmCC",
                chance: 95,
                color: hairColor
            }),
        };
        callback(null, spriteSet);
    });
};
exports.default = maleSpriteSet;

}).call(this,require('_process'))
},{"../color":2,"../color/modifier/brighterOrDarkerThan":3,"../sprite":6,"_process":10}],9:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],10:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[5])(5)
});