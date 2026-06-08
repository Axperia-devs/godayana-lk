package com.godayana.otp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan(basePackages = {"com.godayana.otp", "com.godayana.exception"})
public class OtpServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OtpServiceApplication.class, args);
    }
}