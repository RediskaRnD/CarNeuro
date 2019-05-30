package tools;
import def.sprintf.Globals;

public class Point {

    public double x = 0;
    public double y = 0;

    public static double vm(Point p1, Point p2) {

        return p1.x * p2.y - p2.x * p1.y;
    }

    public static Point sub(Point p1, Point p2) {

        Point point = new Point();
        point.x = p1.x - p2.x;
        point.y = p1.y - p2.y;
        return point;
    }

    public static Point sum(Point p1, Point p2) {

        Point point = new Point();
        point.x = p1.x + p2.x;
        point.y = p1.y + p2.y;
        return point;
    }

    public static double angleByPoints(Point p1, Point p2) {

        final double dx = p2.x - p1.x;
        final double dy = p2.y - p1.y;
        final double a = (Math.atan2(dy, dx));
        return a > 0 ? a : 2 * Math.PI + a;
    }

    // =====================================
    // угол растёт по часовой стрелке
    public static Point getPointByAngle(Point p, double length, double angle) {

        Point p2 = new Point();
        p2.x = p.x + length * Math.cos(angle);
        p2.y = p.y + length * Math.sin(angle);
        return p2;
    }

    @Override
    public String toString() {
//        return "(" + x + ", " + y + ")";
//        return String.format("(%d, %d)", x, y);
        return Globals.sprintf(("liaw"));
    }
}
