import { Component, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalComponent } from 'angular-custom-modal';
import { NgScrollbar } from 'ngx-scrollbar';
import { Store } from '@ngrx/store';

import { ChatbotService } from 'src/app/services/chatbot/chatbot.service';
import { ChatbotGenericService } from 'src/app/services/chatbot/chatbot_generic.service';


interface Message {
    text: string;
    isUser: boolean;
  }

@Component({
    moduleId: module.id,
    selector: 'app-chatbot',
    templateUrl: './chatbot.html',
    styleUrls: ['./chatbot.css'],

    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class ChatbotComponent {
    constructor(
        public storeData: Store<any>,
        private chatbot: ChatbotService,
        private chatbotgenerico: ChatbotGenericService

    ){
        this.initStore();
    }
    store: any;
    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }
        
    isChatboxOpen: boolean = true;
    userMessage: string = '';
    messages: Message[] = [
        { text: 'Buenas noches ', isUser: false },
        { text: 'Ingresa tu codigo C# y E#.', isUser: false },
    ];
    isSending: boolean = false; // New variable to track sending state

    toggleChatbox() {
        this.isChatboxOpen = !this.isChatboxOpen;
    }

    getLastBotMessage():  string {

        const botMessages = this.messages.filter(message => !message.isUser);
        return botMessages.length > 0 ? botMessages[botMessages.length - 1].text : ''; // Default to empty string if no bot messages    
    
    }

    sendMessage() {
        if (this.userMessage.trim() !== '') {
            this.isSending = true; // Set sending state to true

            var  lastMessageBot = this.getLastBotMessage();
            console.log("🚀 ~ ChatbotComponent ~ sendMessage ~ lastMessageBot:", lastMessageBot)
            this.addUserMessage(this.userMessage);
            this.respondToUser(this.userMessage,lastMessageBot);
            this.userMessage = '';
            this.isSending = false; // Reset sending state

        }
    }

    addUserMessage(message: string) {
        this.messages.push({ text: message, isUser: true });
        this.scrollToBottom();
    }

    addBotMessage(message: string) {
        this.messages.push({ text: message, isUser: false });
        this.scrollToBottom();
    }

    respondToUser(userMessage: string,botLastMessage: string) {
        console.log("🚀 ~ ChatbotComponent ~ respondToUser ~ userMessage:", userMessage)
        const formData = new FormData();
        formData.append('mensaje_usu',userMessage);
        formData.append('mensaje_bot',botLastMessage);

        // const respuesta_bot = this.chatbot.enviarMensajeUsuario(formData).toPromise();
        this.chatbot.enviarMensajeUsuario(formData).subscribe(response => {
            console.log("🚀 ~ ChatbotComponent ~ this.chatbot.enviarMensajeUsuario ~ response:", response)
            // Maneja la respuesta del servidor Django
            this.addBotMessage(response.response);  // Asegúrate de que 'response.response' coincida con el formato de respuesta del servidor
        }, error => {
            console.error('Error:', error);
            this.addBotMessage('Hubo un problema al contactar al servidor.');  // Mensaje de error
            this.addBotMessage('Ingresa tu codigo C# y E#.');  // Mensaje de error            
        });
    }

    scrollToBottom() {
        const chatbox = document.getElementById('chatbox');
        if (chatbox) {
            setTimeout(() => {
                chatbox.scrollTop = chatbox.scrollHeight;
            }, 100);
        }
    }

   
}
