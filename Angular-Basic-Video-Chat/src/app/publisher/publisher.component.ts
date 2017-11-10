import { Component, ElementRef, AfterViewInit, ViewChild, Input } from '@angular/core';
import * as OT from '@opentok/client';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.css']
})

export class PublisherComponent implements AfterViewInit {
  @ViewChild('publisherDiv') publisherDiv: ElementRef;
  @Input() session: OT.Session;

  constructor() { }

  ngAfterViewInit() {
    const publisher = OT.initPublisher(this.publisherDiv.nativeElement);
    if (this.session) {
      this.session.on('sessionConnected', () => {
        this.session.publish(publisher, (err) => {
          if (err) {
            alert(err.message);
          }
        });
      });
    }
  }

}
