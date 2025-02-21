import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private subject: Subject<any> | undefined;
  public connectedSubject: Subject<boolean> = new Subject();
  timeOut: any;
  ws!: WebSocket;
  constructor(private router: Router ) {
    this.isVisible = true;

    document?.addEventListener('visibilitychange', () => {
      this.isVisible = !document?.hidden;
      if (!document?.hidden) {
        if (this.ws?.readyState == this.ws?.CLOSED || this.ws?.readyState == this.ws?.CLOSING) {
          this.count = 0;
          this.reConnect(this.url);
        }
      }
    });
    
    document.addEventListener('online', () => {
      if (this.ws?.readyState == this.ws?.CLOSED || this.ws?.readyState == this.ws?.CLOSING) {
        this.count = 0;
        this.reConnect(this.url);
      }
    });
  }
  url: string = environment.websocket;
  public connect() {
    if (!this.subject) {
      this.create();
    }
  }
  public reConnect(url: string, reconnet: boolean = true) {
    this.url = url;
    this.create(reconnet);
  }
  message: Subject<any> = new Subject();
  public closeSocket() {
    this.ws.close();
    this.ws.removeEventListener('close', () => {});
    this.ws.removeEventListener('open', () => {});
    this.ws.removeEventListener('message', () => {});
    this.ws.removeEventListener('error', () => {});
  }
  isOpen: boolean = false;
  isVisible: boolean = false;
  count: number = 0;

  private create(reconnet: boolean = true) {
    var url = environment.websocket;
    const token = localStorage.getItem("userKeyNumber")
    if (token) {
      this.ws = new WebSocket(url + `${token}` + "/");
      this.ws.onopen = (e: any) => {
        this.count = 0;
      };
      this.ws.onclose = (e: any) => {
        this.connectedSubject.next(this.ws.readyState == this.ws.OPEN);
        this.isOpen = false;
        if (reconnet && this.isVisible) {
          if (this.timeOut) {
            clearTimeout(this.timeOut);
            this.timeOut = null;
          }

          if (this.count < 10) {
            setTimeout(
              () => {
                this.isOpen = true;
                this.reConnect(url);
              },
              Math.min(Math.pow(2, this.count) * 1000),
              600000
            );
          } else {
            setTimeout(() => {
              if ((this.ws.readyState == this.ws.CLOSED || this.ws.readyState == this.ws.CLOSING) && this.isVisible) {
                this.count = 0;
                this.reConnect(this.url);
              }
            }, 60000);
          }
          this.count++;
        }
      };

      this.ws.onopen = () => {
        this.count = 0;
        this.connectedSubject.next(this.ws.readyState == this.ws.OPEN);
      };
      this.ws.onerror = function (err) {
        // ws.close()
      };
      this.ws.onmessage = (res: any) => {
        this.message.next(res);
      };

    }
    // return null;
  }

  sendMessage(message: any) {
    if (this.ws && message) {
      this.ws.send(JSON.stringify(message));
    }
  }
  getMessages() {
    return this.message.asObservable();
  }

}
