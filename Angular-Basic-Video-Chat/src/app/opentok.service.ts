import { Injectable } from '@angular/core';

import * as OT from '@opentok/client';
import config from '../config';

@Injectable()
export class OpentokService {

  session: OT.Session;

  constructor() { }

  getOT() {
    return OT;
  }

  connectSession() {
    if (config.API_KEY && config.TOKEN && config.SESSION_ID) {
      return this.connect(config.API_KEY, config.SESSION_ID, config.TOKEN);
    } else {
      return fetch(config.SAMPLE_SERVER_BASE_URL + '/session')
        .then((data) => data.json())
        .then((json) => this.connect(json.apiKey, json.sessionId, json.token));
    }
  }

  connect(apiKey, sessionId, token) {
    return new Promise((resolve, reject) => {
      this.session = this.getOT().initSession(apiKey, sessionId);
      this.session.connect(token, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.session);
        }
      })
    });
  }
}
