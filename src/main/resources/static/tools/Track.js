define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Track {
        constructor(track) {
            this.len = 0;
            this.xMin = 0;
            this.xMax = 0;
            this.yMin = 0;
            this.yMax = 0;
            if (this.p === undefined)
                this.p = null;
            this.p = track;
            this.len = track[0].length;
            for (let i = 0; i < this.len; i++) {
                {
                    this.xMin = this.xMin < track[0][i].x ? this.xMin : track[0][i].x;
                    this.yMin = this.yMin < track[0][i].y ? this.yMin : track[0][i].y;
                    this.xMax = this.xMax > track[0][i].x ? this.xMax : track[0][i].x;
                    this.yMax = this.yMax > track[0][i].y ? this.yMax : track[0][i].y;
                }
                ;
            }
        }
    }
    exports.Track = Track;
    Track["__class"] = "tools.Track";
});
//# sourceMappingURL=Track.js.map