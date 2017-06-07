OpenTok.js Archiving Sample
===========================

This sample application shows how to record an OpenTok session.

*Important:* Read the following sections of the main README file for the repository to set up
and test the application:

* [Setting up the test web service](../README.md#setting-up-the-test-web-service)
* [Configuring the application](../README.md#configuring-the-application)
* [Testing the application](../README.md#testing-the-application)

For this application, click the Start Archive button (in the bottom-lefthand corner of the page)
to start recording the OpenTok session. Then click the Stop Archive button to stop recording the
session. Then click the View Archive to view the archive.

## Recording the session to an archive

The OpenTok archiving API lets you record a session's audio-video streams to MP4 files. You use
server-side code to start and stop archive recordings. In the `config.js` file, you set the
`SAMPLE_SERVER_BASE_URL` variable to the base URL of the web service the app calls to start archive
recording, stop recording, and play back the recorded video.

To start recording the video stream, the user clicks the Start Archive button which invokes the
`startArchive()` method in app.js. This method in turn sends an XHR (or Ajax) request to server.
The session ID of the session that needs to be recorded is passed as a URL parameter to the server.
As soon as the `startArchive()` method is called, the Start Recording button is hidden and the Stop
Recording button is displayed.

    function startArchive() {
      $.post(SAMPLE_SERVER_BASE_URL + '/archive/start', {'sessionId': sessionId}, null, 'json');
      $('#start').hide();
      $('#stop').show();
    }

To stop the recording, the user clicks the Stop Archive button, which invokes the `stopArchive()`
method. This method is similar to the `startArchive()` method in that it sends an Ajax request to
the server to stop the archive. The only difference is that this method passes the archive ID of
the archive that needs to be stopped as a URL parameter instead of the sessionId. The Stop
Recording button is hidden and the View Archive button is enabled.

    function stopArchive() {
      $.post(SAMPLE_SERVER_BASE_URL + '/archive/' + archiveID + '/stop');
      $('#stop').hide();
      $('#view').prop('disabled', false);
      $('#stop').show();
    }

To download the archive that has just been recorded, the user clicks View Archive button which
invokes the `viewArchive()` method. This method is similar to the `startArchive()` and
`stopArchive()` methods in that it sends an Ajax request to the server. The server code has the
logic to check if the archive is available for download or not. If it is available, the application
is redirected to the archive page. If not, a new page is loaded which continuously checks whether
the archive is available for download or not and loads it when it is available.

*Notes:*

* In most applications, control of the archive recording would not be granted to each
end-user.

* You can have automatically archived sessions, which are recorded whenever a client
starts publishing a stream.

* You will want to set up an Amazon S3 or Microsoft Azure target
for storage of your archive recordings.

For more information, see the [OpenTok archiving developer
guide](https://tokbox.com/developer/guides/archiving/).
