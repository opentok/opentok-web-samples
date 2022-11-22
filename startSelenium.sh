#!/bin/bash

# Chrome uses the standalone ChromeDriver
if [[ "$BROWSER" != "chrome" ]]; then
  if [ ! -f selenium-server-standalone-4.0.0-alpha-1.jar ]; then
    curl -O https://selenium-release.storage.googleapis.com/4.0/selenium-server-standalone-4.0.0-alpha-1.jar
  fi
  if [[ ! -f geckodriver && "$BROWSER" == "firefox" ]]; then
    if [[ $OSTYPE = darwin* ]]; then
      curl -L https://github.com/mozilla/geckodriver/releases/download/v0.16.0/geckodriver-v0.16.0-macos.tar.gz | tar xz
    else
      curl -L https://github.com/mozilla/geckodriver/releases/download/v0.16.0/geckodriver-v0.16.0-linux64.tar.gz | tar xz
    fi
  fi
  java -jar -D webdriver.gecko.driver=./geckodriver selenium-server-standalone-4.0.0-alpha-1.jar &
fi
