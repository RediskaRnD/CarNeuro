package tools;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PointTest {
    @Test
    public void testPointClass() {
        Point point = new Point(3, 4);

        assertEquals(point.x, 4);
        assertEquals(point.y, 3);
    }

}