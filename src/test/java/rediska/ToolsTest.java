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
            String computedResult = convertToString(Tools.lineToAngle((Point) arg[0], (float) arg[1], (float) arg[2]));
            String cachedResult = getCachedResult(computedResult, arg);
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

    private <R,T>  String getCachedResult(String computedResult, T... args ) {
        String testName = Thread.currentThread().getStackTrace()[2].getMethodName();
        if (! testName.equals(lastTestName)) {
            lastTestName = testName;
            counter = 0;
        }

        String key = testName + "_" + Arrays.toString(args) + "_" + counter.toString();
        counter = counter + 1;

        String value = cachedData.getProperty(key);
        if (value == null) cachedData.setProperty(key, computedResult);
        return value;
    }
}