package tools;

public class Point {
    public int x = 0;
    public int y = 0;

    public static int vm(Point p1, Point p2) {
        return p1.x * p2.y - p2.x * p1.y;
    }

    public static Point sub(Point p1, Point p2) {
        Point point = new Point();
        point.x = p1.x - p2.x;
        point.y = p2.y - p2.y;
        return point;
    }

    public static Point sum(Point p1, Point p2) {
        Point point = new Point();
        point.x = p1.x + p2.x;
        point.y = p2.y + p2.y;
        return point;
    }

    public static double angleByPoints(Point p1, Point p2) {
        final int dx = p2.x - p1.x;
        final int dy = p2.y - p1.y;
        final double a = (Math.atan2(dy, dx));
        return a > 0 ? a : 2 * Math.PI + a;
    }

    // =====================================
    // угол растёт по часовой стрелке
    public static Point getPointByAngle(Point p, double length, double angle) {
        Point p2 = new Point();
        p2.x = p.x + (int) (length * Math.cos(angle));
        p2.y = p.y + (int) (length * Math.sin(angle));
        return p2;
    }

    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
//        return String.format("(%d, %d)", x, y);
    }
}
