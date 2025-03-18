import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { WordToPdfService } from 'src/app/services/buscar_archivos/visualizador-archivos.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import Fuse from 'fuse.js';
import * as JSZip from 'jszip';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

import { FlatpickrOptions } from 'ng2-flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';

import { UsuariosCrudService } from 'src/app/services/usuarios/usuarios-crud.service';
import { ReporteExcelService } from 'src/app/services/reportesexcel/reportesexcel.service';
import { ReporteExcelGenericService } from 'src/app/services/reportesexcel/reportesexcel_generic.service';
import * as moment from 'moment';
import 'moment/locale/es';
import { slideDownUp } from '../../shared/animations';


interface Message {
  text: string;
  isUser: boolean;
}

@Component({
  moduleId: module.id,
  selector: 'app-linea_de_tiempo',
  templateUrl: './linea_de_tiempo.html',
  styleUrls: ['./linea_de_tiempo.css'],

  animations: [slideDownUp,
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
  ],
})
export class LineaTiempoComponent {

  codeArr: any = [];
  toggleCode = (name: string) => {
      if (this.codeArr.includes(name)) {
          this.codeArr = this.codeArr.filter((d: string) => d != name);
      } else {
          this.codeArr.push(name);
      }
  };
  aplicacion:any = 1;


  fileData!: File;
  fileDatatxt!: File;

  formulario!: FormGroup;
  isLoading = true;
  store: any;

  constructor(
    private wordToPdfService: WordToPdfService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public storeData: Store<any>,
    private usuarioscrudService: UsuariosCrudService,
    private reporteexcel: ReporteExcelService,
    private reporteexcelgenerico: ReporteExcelGenericService
  ) { }


  isChatboxOpen: boolean = false;
  userMessage: string = '';
  messages: Message[] = [
    { text: 'Buenas noches ', isUser: false },
    { text: 'Ingresa tu codigo C# y E#.', isUser: false },
  ];

  // { text: 'this example of chat', isUser: true },
  // { text: 'This is a response from the chatbot.', isUser: false },
  // { text: 'design with tailwind', isUser: true },
  // { text: 'This is a response from the chatbot.', isUser: false },

  toggleChatbox() {
    this.isChatboxOpen = !this.isChatboxOpen;
  }

  sendMessage() {
    if (this.userMessage.trim() !== '') {
      this.addUserMessage(this.userMessage);
      this.respondToUser(this.userMessage);
      this.userMessage = '';
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

  respondToUser(userMessage: string) {
    // Replace this with your chatbot logic
    setTimeout(() => {
      this.addBotMessage('Bienvenido Estimado.');
    }, 500);
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