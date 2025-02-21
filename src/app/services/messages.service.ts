import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private messagesSubject = new BehaviorSubject<any[]>([
    { text: 'Hello! How can I help you?', sender: 'bot' },
    { text: 'Hi, I need assistance.', sender: 'user' },
    { text: 'Sure, let me know more about the topic, how can i assist you with?', sender: 'bot'}
  ]);
  
  messages$ = this.messagesSubject.asObservable();

  addMessage(message: any) {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }
}
