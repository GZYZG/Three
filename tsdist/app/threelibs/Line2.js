"use strict";
/**
 * @author WestLangley / http://github.com/WestLangley
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var LineSegments2_js_1 = require("./LineSegments2.js");
var LineGeometry_js_1 = require("./LineGeometry.js");
var LineMaterial_js_1 = require("./LineMaterial.js");
var Line2 = function (geometry, material) {
    LineSegments2_js_1.LineSegments2.call(this);
    this.type = 'Line2';
    this.geometry = geometry !== undefined ? geometry : new LineGeometry_js_1.LineGeometry();
    this.material = material !== undefined ? material : new LineMaterial_js_1.LineMaterial({ color: Math.random() * 0xffffff });
};
exports.Line2 = Line2;
Line2.prototype = Object.assign(Object.create(LineSegments2_js_1.LineSegments2.prototype), {
    constructor: Line2,
    isLine2: true
});
