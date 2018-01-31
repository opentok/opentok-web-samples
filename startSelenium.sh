#!/bin/bash

if [ "$BROWSER" != 'chrome' ]; then
  # Chrome uses the standalone ChromeDriver
  curl -O http://selenium-release.storage.googleapis.com/3.5/selenium-server-standalone-3.5.3.jar
  curl -L https://github.com/mozilla/geckodriver/releases/download/v0.16.0/geckodriver-v0.16.0-linux64.tar.gz | tar xz
  java -jar -Dwebdriver.gecko.driver=./geckodriver selenium-server-standalone-3.5.3.jar &
fi
