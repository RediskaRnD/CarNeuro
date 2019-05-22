define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // =====================================================================================================================
    class Utils {
        static getLog() {
            return this.log;
        }
        static debug(str) {
            // проверка положения скрола
            if (Math.abs(this.log.scrollTop + this.log.clientHeight - this.log.scrollHeight) < 1) {
                this.log.innerText += str + '\n';
                this.log.scrollTop = this.log.scrollHeight;
            }
            else {
                this.log.innerText += str + '\n';
            }
            log.debug();
            liaw.debug();
            // const d = log.innerText.length - 200;
            // if (d > 0) {
            //     log.innerText = log.innerText.substring(d + str.length, 201 + str.length) + str + '\n';
            // } else {
            //     log.innerText += str + '\n';
            // }
        }
    }
    Utils.log = document.getElementById("liaw");
    exports.Utils = Utils;
});
//# sourceMappingURL=utils.js.map