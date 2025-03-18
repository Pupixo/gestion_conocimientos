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

import { AnalisisReporteC7Component } from './reporte_c7/reporte_c7';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
// import { MatDocumentViewerModule } from '@angular/material/document-viewer';


// flatpicker
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

const routes: Routes = [
    { 
     path: 'reporte_c7',
     component: AnalisisReporteC7Component,
     title: 'Reporte C7| Sistema de Conocimientos' 
    },

];


@NgModule({
    imports: [
        Ng2FlatpickrModule,NgxDocViewerModule,RouterModule.forChild(routes), 
        CommonModule, FormsModule, ReactiveFormsModule, HighlightModule, NgxTippyModule, MenuModule,
         IconModule],
    declarations: [
        AnalisisReporteC7Component,
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
export class AnalisisDataExcelModule {}
