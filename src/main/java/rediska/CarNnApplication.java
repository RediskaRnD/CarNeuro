package rediska;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableMBeanExport;
import org.springframework.scheduling.annotation.EnableScheduling;

import static org.springframework.boot.SpringApplication.run;

@SpringBootApplication
@EnableMBeanExport
@EnableScheduling
public class CarNnApplication {
//
    public static void main(String[] args) {
        run(CarNnApplication.class, args);
    }
}
