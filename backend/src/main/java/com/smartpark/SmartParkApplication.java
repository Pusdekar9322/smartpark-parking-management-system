package com.smartpark;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class SmartParkApplication {

    public static void main(String[] args) {
        // Set Default TimeZone to Indian Standard Time (Asia/Kolkata)
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        SpringApplication.run(SmartParkApplication.class, args);
    }
}
