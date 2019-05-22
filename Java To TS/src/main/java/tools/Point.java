package tools;

import java.util.Objects;

public class Point {
    public int x = 0;
    public int y = 0;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Point p = (Point) o;
        return x == p.x &&
                y == p.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }
}
