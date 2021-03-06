package tools;

// тест
public class Line {

    public Point p1;
    public Point p2;

    public Line(Point p1, Point p2) {

        this.p1 = p1;
        this.p2 = p2;
    }

    // =====================================
    //поиск точки пересечения
    private static Point crossPoint(double a1, double b1, double c1, double a2, double b2, double c2) {

        double d = a1 * b2 - b1 * a2;
        double dx = -c1 * b2 + b1 * c2;
        double dy = -a1 * c2 + c1 * a2;

        Point p = new Point();
        p.x = dx / d;
        p.y = dy / d;
        return p;
    }

    // =====================================
    //коэффициенты уравнения прямой вида: Ax + By + C = 0
//    private static int[] lineEquation(Line l) {
//
//        int a = l.p2.y - l.p1.y;
//        int b = l.p1.x - l.p2.x;
//        int c = -l.p1.x * (l.p2.y - l.p1.y) + l.p1.y * (l.p2.x - l.p1.x);
//        return new int[]{a, b, c};
//    }

    private static double[] lineEquation(Point p1, Point p2) {

        double a = p2.y - p1.y;
        double b = p1.x - p2.x;
        double c = -p1.x * (p2.y - p1.y) + p1.y * (p2.x - p1.x);
        return new double[]{a, b, c};
    }

    // =====================================
    // поиск точки пересечения линий
//    public static Point getCrossPoints(Line l1, Line l2) {
//
//        if (isCrossing(l1, l2) == true) {
//            int[] abc = lineEquation(l1);
//            int[] abc2 = lineEquation(l2);
//            return crossPoint(abc[0], abc[1], abc[2], abc2[0], abc2[1], abc2[2]);
//        }
//        return null;
//    }

    public static Point getCrossPoints(Point p1, Point p2, Point p3, Point p4) {

        if (isCrossing(p1, p2, p3, p4) == true) {
            double[] abc = lineEquation(p1, p2);
            double[] abc2 = lineEquation(p3, p4);
            return crossPoint(abc[0], abc[1], abc[2], abc2[0], abc2[1], abc2[2]);
        }
        return null;
    }

    // =====================================
    // Пересекаются ли линии?
//    public static boolean isCrossing(Line l1, Line l2) {
//
//        int v1 = Point.vm(Point.sub(l2.p2, l2.p1), Point.sub(l1.p1, l2.p1));
//        int v2 = Point.vm(Point.sub(l2.p2, l2.p1), Point.sub(l1.p2, l2.p1));
//        int v3 = Point.vm(Point.sub(l1.p2, l1.p1), Point.sub(l2.p1, l1.p1));
//        int v4 = Point.vm(Point.sub(l1.p2, l1.p1), Point.sub(l2.p2, l1.p1));
//        return (v1 * v2 < 0) && (v3 * v4 < 0);
//    }

    public static boolean isCrossing(Point p1, Point p2, Point p3, Point p4) {

        double v1 = Point.vm(Point.sub(p4, p3), Point.sub(p1, p3));
        double v2 = Point.vm(Point.sub(p4, p3), Point.sub(p2, p3));
        double v3 = Point.vm(Point.sub(p2, p1), Point.sub(p3, p1));
        double v4 = Point.vm(Point.sub(p2, p1), Point.sub(p4, p1));
        return (v1 * v2 < 0) && (v3 * v4 < 0);
    }
    // =====================================
}
