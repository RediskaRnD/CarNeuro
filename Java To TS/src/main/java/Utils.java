import org.w3c.dom.Element;
import sun.plugin.dom.core.Document;

public class Utils {

    private static Document document;
    private static Element log = document.getElementById("log");

    public static Integer requestAnimationId = null;
    public static Track track;

    static void debug(String str) {

        // проверка положения скрола
//        if (Math.abs(log.scrollTop + log.clientHeight - log.scrollHeight) < 1) {
//            log.innerText += str + '\n';
//            log.scrollTop = log.scrollHeight;
//        } else {
//            log.innerText += str + '\n';
//        }
        log.setTextContent(log.getTextContent() + str + '\n');
        // const d = log.innerText.length - 200;
        // if (d > 0) {
        //     log.innerText = log.innerText.substring(d + str.length, 201 + str.length) + str + '\n';
        // } else {
        //     log.innerText += str + '\n';
        // }
    }
}
