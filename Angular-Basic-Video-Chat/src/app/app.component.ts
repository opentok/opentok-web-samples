import { Component, OnInit } from '@angular/core';
import { OpentokService } from './opentok.service';
import * as OT from '@opentok/client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ OpentokService ]
})
export class AppComponent implements OnInit {
  title = 'Angular Basic Video Chat';
  session: OT.Session;
  streams: Array<OT.Stream> = [];

  constructor(private opentokService: OpentokService) {}

  ngOnInit () {
    this.opentokService.connectSession().then((session: OT.Session) => {
      this.session = session;
    }).catch((err) => {
      alert('Unable to connect. Make sure you have updated the config.ts file with your OpenTok details.');
    });

    this.session = this.opentokService.session;

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
