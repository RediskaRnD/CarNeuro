package tools;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class LineTest {

    @Test
    void getCrossPoints() {
        Point p1 = new Point(0, 0);
        Point p2 = new Point(10, 10);
//        Point p3 = new Point(0, 10);
//        Point p4 = new Point(0, 20);

        Point p3 = new Point(100, 100);
        Point p4 = new Point(200, 201);

        double[] abc = Line.Equation(p1, p2);
        double[] abc2 = Line.Equation(p3, p4);
        Point p = Line.crossPoint(abc[0], abc[1], abc[2], abc2[0], abc2[1], abc2[2]);
        // если линии параллельны, то вернёт точку (NaN, NaN)
        //Point p = Line.getCrossPoints(p1, p2, p3, p4);
        assertTrue(p.x == 0 && p.y == 0);
    }

    @Test
    void isCrossing() {
        Point p1 = new Point(0, 0);
        Point p2 = new Point(10, 10);
        Point p3 = new Point(0, 10);
        Point p4 = new Point(10, 0);

        assertTrue(Line.isCrossing(p1, p2, p3, p4));
    }
}