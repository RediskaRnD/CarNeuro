package rediska;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableMBeanExport;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableMBeanExport
@EnableScheduling
public class CarNnApplication {
//
    public static void main(String[] args) {
        SpringApplication.run(CarNnApplication.class, args);
    }
}
