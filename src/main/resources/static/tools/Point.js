define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* Generated from Java with JSweet 2.3.0-SNAPSHOT - http://www.jsweet.org */
    class Point {
        constructor() {
            this.x = 0;
            this.y = 0;
        }
        static vm(p1, p2) {
            return p1.x * p2.y - p2.x * p1.y;
        }
        static sub(p1, p2) {
            let point = new Point();
            point.x = p1.x - p2.x;
            point.y = p1.y - p2.y;
            return point;
        }
        static sum(p1, p2) {
            let point = new Point();
            point.x = p1.x + p2.x;
            point.y = p1.y + p2.y;
            return point;
        }
        static angleByPoints(p1, p2) {
            let dx = p2.x - p1.x;
            let dy = p2.y - p1.y;
            let a = (Math.atan2(dy, dx));
            return a > 0 ? a : 2 * Math.PI + a;
        }
        static getPointByAngle(p, length, angle) {
            let p2 = new Point();
            p2.x = p.x + ((length * Math.cos(angle)) | 0);
            p2.y = p.y + ((length * Math.sin(angle)) | 0);
            return p2;
        }
        /**
         *
         * @return {string}
         */
        toString() {
            return "(" + this.x + ", " + this.y + ")";
        }
    }
    exports.Point = Point;
    Point["__class"] = "tools.Point";
});
//# sourceMappingURL=Point.js.map