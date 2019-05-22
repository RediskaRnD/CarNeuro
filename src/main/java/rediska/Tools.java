package rediska;

import java.awt.*;
import java.util.UUID;

public class Tools {

    // угол растёт по часовой стрелке
    static public Point lineToAngle(Point p, float length, float angle) {
        return new Point(p.x + (int) (length * Math.cos(angle)), p.y + (int) (length * Math.sin(angle)));
    }
}
