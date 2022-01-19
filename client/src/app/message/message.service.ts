import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor() { }

  add(message: string, type: 'default' | 'error' | 'verbose') {
    const trigger = (() => {
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

    trigger(message);
  }
}
