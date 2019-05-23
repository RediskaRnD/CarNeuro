package rediska;


import org.junit.Assert;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.awt.*;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Properties;


class ToolsTest {

    private Properties cachedData = new Properties();
    private final String FILE_NAME =  "C:\\temp\\java\\ToolsTest.txt";
    private final String COMMENTS = "No Comments";

    @BeforeEach
    void setUp() {
        try (InputStream reader = Files.newInputStream(Path.of(FILE_NAME))){
            cachedData.load(reader);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @AfterEach
    void tearDown() {
        try (OutputStream writer = Files.newOutputStream(Path.of(FILE_NAME))){
            cachedData.store(writer, COMMENTS);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    @Test
    public void lineToAngle() {
        final Object[][] args = {
                {new Point(1,8), (float) 1.0, (float)3.0},
                {new Point(1,5), (float) 3.1, (float) 1,9}};


        for (Object[] arg : args) {
            final Point point = Tools.lineToAngle((Point) arg[0], (float) arg[1], (float) arg[2]);

            String computedStringValue = convertToString(point);
            String testName = Thread.currentThread().getStackTrace()[1].getMethodName();
            String key = Arrays.toString(arg) + testName;

            String cachedValue = getCachedValue(key, computedStringValue);
            if (cachedValue == null) {
                continue;
            }
            Assert.assertTrue(cachedValue.equals(computedStringValue));
        }
    }
    @Test
    public void lineToAngle2() {
        expect(Tools.lineToAngle(new Point(1,8), 1, 3), "1");
    }

    private <T> void expect(T object, String uniqueNumber) {
        String testMethodName = Thread.currentThread().getStackTrace()[2].getMethodName();
        String valueAsString = convertToString(object);
        String key = testMethodName + "_" + uniqueNumber;

        String cachedValue = getCachedValue(key, valueAsString, );
        if (cachedValue == null) {
            return;
        }
        Assert.assertTrue(cachedValue.equals(valueAsString));
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

    private String lastTestName = null;

    private <R,T>  String getCachedValue(String key, String computedResult) {
        String value = cachedData.getProperty(key);
        if (value == null) cachedData.setProperty(key, computedResult);
        return value;
    }
}