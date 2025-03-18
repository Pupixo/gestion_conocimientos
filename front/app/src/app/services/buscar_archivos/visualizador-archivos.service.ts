// convert.service.ts
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import 'jspdf-autotable'; // Import jsPDF plugin for table support
import jsPDF from 'jspdf';
import * as mammoth from 'mammoth';
import html2canvas from 'html2canvas';
// import * as jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class WordToPdfService {

  constructor() { }

  convertWordToPDF(wordDocURL: string): void {
    this.downloadFile(wordDocURL, (wordDocBlob) => {
      this.convertToPDF(wordDocBlob);
    });
  }

  private downloadFile(url: string, callback: (blob: Blob) => void): void {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status === 200) {
        callback(xhr.response);
      } else {
        console.error('Failed to download the file. Error code: ' + xhr.status);
      }
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  private convertToPDF(wordDocBlob: Blob): void {
    const reader = new FileReader();
    reader.onload = function (e) {
      const docText = e.target!.result as string;
      const pdf = new jsPDF(); // Initialize jsPDF
      pdf.text(docText, 10, 10); // Example: Add text from the Word doc to the PDF
      pdf.save('converted_document.pdf'); // Save PDF
    };
    reader.readAsText(wordDocBlob);
  }

}


