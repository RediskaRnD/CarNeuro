package rediska;


import org.junit.Assert;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import java.awt.*;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Arrays;
import java.util.Properties;


class ToolsTest {

    private Properties cachedData = new Properties();
    private final String FILE_NAME =  "C:\\temp\\java\\" + getClass().getSimpleName() + ".txt";
    private final String COMMENTS = "No Comments";

    @BeforeMethod
    void setUp() {
        final Path path = Path.of(FILE_NAME);
        try (InputStream reader = Files.newInputStream(path, StandardOpenOption.CREATE_NEW)){
            cachedData.load(reader);
        } catch (IOException e) {
//            throw new RuntimeException(e.getCause());
            e.printStackTrace();
        }
    }

    @AfterMethod
    void tearDown() {
        final Path path = Path.of(FILE_NAME);
        try (OutputStream writer = Files.newOutputStream(path)){
            cachedData.store(writer, COMMENTS);
        } catch (IOException e) {
            throw new RuntimeException(e.getCause());
        }

    }

    @org.testng.annotations.Test
    public void lineToAngle() {
        final Object[][] args = {
                {new Point(1,19), (float) 1.0, (float)3.0},
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
    @org.testng.annotations.Test
    public void lineToAngle2() {
        expect(Tools.lineToAngle(new Point(1,8), 1, 3), "1");
        expect(Tools.lineToAngle(new Point(10,-11), 100, (float)3.3), "2");
    }

    private <T> void expect(T object, String uniqueNumber) {
        String testMethodName = Thread.currentThread().getStackTrace()[2].getMethodName();
        String valueAsString = convertToString(object);
        String key = testMethodName + "_" + uniqueNumber;

        String cachedValue = getCachedValue(key, valueAsString);
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

    private <R,T>  String getCachedValue(String key, String computedResult) {
        String value = cachedData.getProperty(key);
        if (value == null) cachedData.setProperty(key, computedResult);
        return value;
    }

//    @org.testng.annotations.BeforeMethod
//    public void setUp() {
//    }
//
//    @org.testng.annotations.AfterMethod
//    public void tearDown() {
//    }
//
//    @org.testng.annotations.Test
//    public void testLineToAngle1() {
//    }
}