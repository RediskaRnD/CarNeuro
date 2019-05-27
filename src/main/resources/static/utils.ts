// =====================================================================================================================
import {Track} from "./tools/Track";

export class Utils {
    private static log: any = document.getElementById("log");
    public static requestAnimationId: number | undefined;
    // Дорога
    public static track: Track;
    static debug(str: string): void {

        // проверка положения скрола
        if (Math.abs(this.log.scrollTop + this.log.clientHeight - this.log.scrollHeight) < 1) {
            this.log.innerText += str + '\n';
            this.log.scrollTop = this.log.scrollHeight;
        } else {
            this.log.innerText += str + '\n';
        }

        // const d = log.innerText.length - 200;
        // if (d > 0) {
        //     log.innerText = log.innerText.substring(d + str.length, 201 + str.length) + str + '\n';
        // } else {
        //     log.innerText += str + '\n';
        // }
    }
}