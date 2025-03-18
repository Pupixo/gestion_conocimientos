import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// highlightjs
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

// modal
import { ModalModule } from 'angular-custom-modal';

// tippy
import { NgxTippyModule } from 'ngx-tippy-wrapper';

// headlessui
import { MenuModule } from 'headlessui-angular';

// icon
import { IconModule } from 'src/app/shared/icon/icon.module';

import { RegistroLineaTiempoComponent } from './registro_linea_tiempo/registro_linea_tiempo';
import { VistaLineaTiempoComponent } from './vista_linea_tiempo/vista_linea_tiempo';

import { NgxDocViewerModule } from 'ngx-doc-viewer';
// import { MatDocumentViewerModule } from '@angular/material/document-viewer';
import { ModalLineaTiempoComponent } from './registro_linea_tiempo/modal_editar/modal_editar';
import { ModalEventoComponent } from './registro_linea_tiempo/modal_editar/modal_evento/modal_evento';


// flatpicker
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

const routes: Routes = [
    { 
     path: 'linea_tiempo_noc',
     component: RegistroLineaTiempoComponent,
     title: 'Linea de tiempo| Sistema de Conocimientos' 
    },
    { 
        path: 'vista_linea',
        component: VistaLineaTiempoComponent,
        title: 'Linea de tiempo| Sistema de Conocimientos' 
       },
];


@NgModule({
    imports: [
        Ng2FlatpickrModule,NgxDocViewerModule,RouterModule.forChild(routes), 
        CommonModule, FormsModule, ReactiveFormsModule, HighlightModule, NgxTippyModule, MenuModule,
         IconModule,ModalModule],
    declarations: [
        RegistroLineaTiempoComponent,
        VistaLineaTiempoComponent,ModalLineaTiempoComponent,ModalEventoComponent
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
export class LineaTiempoModule {}
