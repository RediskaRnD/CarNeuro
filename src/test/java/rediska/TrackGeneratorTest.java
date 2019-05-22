package rediska;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import tools.Point;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Properties;


public class TrackGeneratorTest {
    Point point;

    @Before
    public void setUp() throws Exception {
        point = new Point();
        point.x = 3;
        point.y = 4;
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void getTrack() {
        Properties expected = new Properties();
        expect(liaw(1,200,5), "1"));
        expect(liaw(1,200,10), "2"));
        expect(liaw(1,200,5),));
        Assert.assertEquals(liaw(1,0,5), expected.get(2));
        Assert.assertEquals(liaw(100,2,15), expected.get(3));
    }
    @Test
    public void PoinTest() {
        Properties expected = new Properties();
        expect(liaw(1,200,5), "5"));
        expect(liaw(1,200,10), "2"));
        expect(liaw(1,200,5),));
        Assert.assertEquals(liaw(1,0,5), expected.get(2));
        Assert.assertEquals(liaw(100,2,15), expected.get(3));
    }

    private boolean expect(double liaw, String s) {
        Properties properties = new Properties();
        try {
            properties.load(Files.newInputStream(Path.of("get_track.txt")));
            String result = properties.getProperty(s);
            if(result == null) {
                properties.setProperty(s, String.valueOf(liaw));
                return true;
            }
            return result == String.valueOf(liaw);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }



    private double liaw(int a, int b, int c) {
        return a/b+c;
    }

}