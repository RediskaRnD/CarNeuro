package rediska;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import tools.Point;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Properties;


public class TrackGeneratorTest {

    @Before
    public void setUp() throws Exception {

    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void getTrack() {
        final Object[][] args = {{1, 2}, {100, 3.1}};

        final TrackGenerator trackGenerator = new TrackGenerator();
        for (Object[] arg : args) {
            String computedResult = convertToString(trackGenerator.getTrack());
            String cachedResult = getCachedResult(computedResult);
            if (cachedResult == null) {
                continue;
            }
            Assert.assertTrue(cachedResult.equals(computedResult));

        }
    }

    private <T> String convertToString(T object) {
        return object.toString();
    }
    private <T> String convertToString(T[] object) {
        return Arrays.deepToString(object);
    }
    private <T> String convertToString(int[] object) {
        return Arrays.toString(object);
    }
    private <T> String convertToString(double[] object) {
        return Arrays.toString(object);
    }

    private Integer counter = 0;
    private String lastTestName = null;
    private Properties cachedData = new Properties();
    private <R,T>  String getCachedResult(String computedResult, T... args ) {
        String testName = Thread.currentThread().getStackTrace()[1].getMethodName();
        if (! testName.equals(lastTestName)) {
            lastTestName = testName;
            counter = 0;
        }
        String key = args.toString();
        String value = cachedData.getProperty(key);
        if (value == null) cachedData.setProperty(key, computedResult);
        return value;
    }

}