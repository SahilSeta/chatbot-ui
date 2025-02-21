import { Component, ElementRef, ViewChild } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { MessagesService } from '../../services/messages.service';
import { FormsModule } from '@angular/forms';
import { MessageComponent } from '../message/message.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, MessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messages: any[] = [];
  userInput: string = '';

  constructor(private messageService: MessagesService, private websocketService: WebsocketService) {}
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  ngOnInit() {
    this.messageService.messages$.subscribe(msgs => this.messages = msgs);
    // this.websocketService.getMessages().subscribe(msg => this.messageService.addMessage(msg));
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ sender: 'user', text: this.userInput });
      this.userInput = '';

      setTimeout(() => {
        this.messages.push({ sender: 'bot', text: 'Sure! What do you need help with?' });
        this.scrollToBottom();
      }, 1000);

      this.scrollToBottom();
    }
  }
  closeChat() {
      console.log("Closing....")
  }
  scrollToBottom() {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
