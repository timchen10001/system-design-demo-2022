import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor() { }

  add(message: string, type: 'default' | 'error' | 'verbose') {
  const logger = (() => {
      switch (type) {
        case 'verbose':
          return console.debug;
        case 'error':
          return console.error;
        case 'default':
        default:
          return console.log;
      }
    })();

    logger(message);
  }
}
