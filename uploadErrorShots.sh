#!/bin/bash

# Upload error images to imgur and post them as a github comment on the PR
if [[ "$TRAVIS_PULL_REQUEST" != "false" && -d ./errorShots ]] ; then
  curl https://raw.githubusercontent.com/tremby/imgur.sh/master/imgur.sh > imgur.sh
  chmod u+x imgur.sh

  for file in `ls errorShots/`; do
    echo "Uploading: $file"
    output=`./imgur.sh errorShots/$file`
    echo $output
    imgURL=`echo $output | grep "\.png$"`

    curl -H "Authorization: token ${GITHUB_TOKEN}" -X POST \
      -d "{\"body\": \"${BROWSER} ${BVER} failed ![errorShot](${imgURL})\"}" \
      "https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments"
  done
fi
