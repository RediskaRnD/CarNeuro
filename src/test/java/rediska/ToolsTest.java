package rediska;


import org.apache.commons.io.FileUtils;
import org.junit.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.Properties;


public class ToolsTest {

    private Properties cachedData = new Properties();
    private final String FILE_NAME =  "C:\\temp\\java\\" + getClass().getSimpleName() + ".txt";
    private final String COMMENTS = "No Comments";


    @BeforeMethod
    void setUp() {
        final File path = new File(FILE_NAME);
        if(!path.exists()) return;
        try (InputStream reader = FileUtils.openInputStream(path)){
            cachedData.load(reader);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @AfterMethod
    void tearDown() {
        final File path = new File(FILE_NAME);
        try (OutputStream writer = FileUtils.openOutputStream(path)){
            cachedData.store(writer, COMMENTS);
        } catch (IOException e) {
            e.printStackTrace();
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
        expect(Tools.lineToAngle(new Point(10,-11), 100, (float)3.3), "2");
        expect(Tools.lineToAngle(new Point(1,8), 1, 3), "1");

    }
    @org.testng.annotations.Test
    public void lineToAngle3() {
        Assert.assertTrue(true);
    }

    private <T> void expect(T object, String uniqueNumber) {
        String testMethodName = Thread.currentThread().getStackTrace()[2].getMethodName();
        String valueAsString = convertToString(object);
        String key = testMethodName + "_" + uniqueNumber;

        String cachedValue = getCachedValue(key, valueAsString);
        if (cachedValue == null) {
            return;
        }
        Assert.assertTrue(String.format("test number %s", uniqueNumber), cachedValue.equals(valueAsString));
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