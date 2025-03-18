import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// highlightjs
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

// tippy
import { NgxTippyModule } from 'ngx-tippy-wrapper';

// headlessui
import { MenuModule } from 'headlessui-angular';

// icon
import { IconModule } from 'src/app/shared/icon/icon.module';

import { LineaTiempoComponent } from './linea_de_tiempo/linea_de_tiempo';
import { ChatbotComponent } from './chatbot/chatbot';


import { NgxDocViewerModule } from 'ngx-doc-viewer';
// flatpicker
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
// modal
import { ModalModule } from 'angular-custom-modal';

// perfect-scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';
// quill editor
import { QuillModule } from 'ngx-quill';
// sortable
import { SortablejsModule } from '@dustfoundation/ngx-sortablejs';
// datatable
import { DataTableModule } from '@bhplugin/ng-datatable';
// CommonModule


const routes: Routes = [
    { 
     path: 'linea_tiempo',
     component: LineaTiempoComponent,
     title: 'Linea de Tiempo | STATUS NOC' 
    },
    { 
    path: 'chatbot',
    component: ChatbotComponent, 
    title: 'ChatBot | STATUS NOC' 
    },
];


@NgModule({
    imports: [
        RouterModule.forChild(routes), 
        CommonModule, 
        FormsModule, 
        ReactiveFormsModule,
        ModalModule,
        SortablejsModule,
        MenuModule,
        NgScrollbarModule.withConfig({
            visibility: 'hover',
            appearance: 'standard',
        }),
        QuillModule.forRoot(),
        NgxTippyModule,
        Ng2FlatpickrModule,
        NgxDocViewerModule,
        HighlightModule, 
        DataTableModule,
        IconModule,
    ],
    declarations: [
        LineaTiempoComponent,
        ChatbotComponent
    ],
    
    providers: [
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                languages: {
                    json: () => import('highlight.js/lib/languages/json'),
                    typescript: () => import('highlight.js/lib/languages/typescript'),
                    xml: () => import('highlight.js/lib/languages/xml'),
                },
            },
        },
    ],


})
export class ActualStatusNocModule {}
