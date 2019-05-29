package tools;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LineTest {

    @Test
    void getCrossPoints() {
    }

    @Test
    void isCrossing() {
        Point p1 = new Point();
        Point p2 = new Point();
        Point p3 = new Point();
        Point p4 = new Point();
        p1.x = 0;
        p1.y = 0;
        p2.x = 10;
        p2.y = 10;
        p3.x = 0;
        p3.y = 10;
        p4.x = 10;
        p4.y = 0;
        assertTrue(Line.isCrossing(p1, p2, p3, p4));
    }
}