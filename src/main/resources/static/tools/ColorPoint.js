define(["require", "exports", "./Point"], function (require, exports, Point_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ColorPoint extends Point_1.Point {
        constructor() {
            super();
            if (this.color === undefined)
                this.color = null;
        }
    }
    exports.ColorPoint = ColorPoint;
    ColorPoint["__class"] = "tools.ColorPoint";
});
//# sourceMappingURL=ColorPoint.js.map