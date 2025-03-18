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

import { BusquedaArchivoComponent } from './buscar-file/busqueda_archivo';
import { RutasArchivosComponent } from './rutas-file/rutas_archivo';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
// import { MatDocumentViewerModule } from '@angular/material/document-viewer';

import { SubCarpetaArbolComponent } from './rutas-file/subcarpetaarbol/sub-carpetas-arbol';
import { PdfViewerModule } from 'ng2-pdf-viewer';

const routes: Routes = [
    { 
     path: 'search_files',
     component: BusquedaArchivoComponent,
     title: 'Busqueda Archivo | Sistema de Conocimientos' 
    },
    {
     path: 'routes_files',
     component: RutasArchivosComponent,
     title: 'Rutas de Documentos |   Sistema de Conocimientos' 
    }
];


@NgModule({
    imports: [NgxDocViewerModule,RouterModule.forChild(routes), CommonModule, FormsModule, ReactiveFormsModule, HighlightModule, NgxTippyModule, MenuModule, IconModule,PdfViewerModule],
    declarations: [
        BusquedaArchivoComponent,
        RutasArchivosComponent,
        SubCarpetaArbolComponent,
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
export class ManagmentFilesModule {}
