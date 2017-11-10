import { Component, OnInit } from '@angular/core';
import * as OT from '@opentok/client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular Basic Video Chat';
  session: OT.Session;
  streams: Array<OT.Stream> = [];

  ngOnInit () {
    this.session = OT.initSession('1127', '1_MX4xMTI3fn4xNTEwMjE0NTMwMjE0fk4wa3RUKzh5U1hGUkFzVm9rUVdSOFNUZX5-');
    this.session.connect('T1==cGFydG5lcl9pZD0xMTI3JnNpZz1mZjU0YTE1YTEyMTllYzNlNWM5MWYzZGU3NjIyYWE5MjZiMWFjMThhOnNlc3Npb25faWQ9MV9NWDR4TVRJM2ZuNHhOVEV3TWpFME5UTXdNakUwZms0d2EzUlVLemg1VTFoR1VrRnpWbTlyVVZkU09GTlVaWDUtJmNyZWF0ZV90aW1lPTE1MTAyMTQ1MzAmbm9uY2U9MC42OTYwMDYzMjY0NjY3Mzg5JnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE1MTI4MDY1MzA=', (err) => {
      if (err) {
        alert(err.name);
      }
    });
    this.session.on('streamCreated', (event) => {
      this.streams.push(event.stream);
    });
    this.session.on('streamDestroyed', (event) => {
      const idx = this.streams.indexOf(event.stream);
      if (idx > -1) {
        this.streams.splice(idx, 1);
      }
    });
  }
}
