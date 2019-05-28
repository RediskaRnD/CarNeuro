package tools;

public class Point {
    public int x = 0;
    public int y = 0;
    public static Point sub (Point p1, Point p2) {
        Point point = new Point();
        point.x = p1.x - p2.x;
        point.y = p2.y - p2.y;
        return point;
    }
    public static Point sum (Point p1, Point p2) {
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
}
