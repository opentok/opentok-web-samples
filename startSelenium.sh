#!/bin/bash

# Chrome uses the standalone ChromeDriver and IE runs on Sauce Labs
if [[ "$BROWSER" != "chrome" && "$BROWSER" != "ie" ]]; then
  if [ ! -f selenium-server-standalone-3.5.3.jar ]; then
    curl -O http://selenium-release.storage.googleapis.com/3.5/selenium-server-standalone-3.5.3.jar
  fi
  if [[ ! -f geckodriver && "$BROWSER" == "firefox" ]]; then
    if [[ $OSTYPE = darwin* ]]; then
      curl -L https://github.com/mozilla/geckodriver/releases/download/v0.16.0/geckodriver-v0.16.0-macos.tar.gz | tar xz
    else
      curl -L https://github.com/mozilla/geckodriver/releases/download/v0.16.0/geckodriver-v0.16.0-linux64.tar.gz | tar xz
    fi
  fi
  java -jar -Dwebdriver.gecko.driver=./geckodriver selenium-server-standalone-3.5.3.jar &
fi
