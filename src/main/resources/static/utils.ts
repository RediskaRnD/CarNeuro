// =====================================================================================================================
export class Utils {
    static log: HTMLElement = <HTMLElement>document.getElementById("liaw");

    static getLog(): HTMLElement {
        return this.log;
    }
    static debug(str: string): void {

        // проверка положения скрола
        if (Math.abs(this.log.scrollTop + this.log.clientHeight - this.log.scrollHeight) < 1) {
            this.log.innerText += str + '\n';
            this.log.scrollTop = this.log.scrollHeight;
        } else {
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