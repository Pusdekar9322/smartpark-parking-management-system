@echo off
title SmartPark Spring Boot Backend
echo Starting SmartPark Backend on http://localhost:8080 ...
set "MAVEN_CMD=C:\Users\hp\.m2\wrapper\dists\apache-maven-3.9.9-bin\33b4b2b4\apache-maven-3.9.9\bin\mvn.cmd"
if exist "%MAVEN_CMD%" (
    "%MAVEN_CMD%" spring-boot:run
) else (
    mvn spring-boot:run
)
pause
