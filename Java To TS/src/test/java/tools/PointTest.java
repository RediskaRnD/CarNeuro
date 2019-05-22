package tools;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PointTest {
    @Test
    public void testPointClass() {
        Point point = new Point();
        point.x = 3;
        point.y = 4;

        assertEquals(point.x, 4);
        assertEquals(point.y, 3);
    }

}