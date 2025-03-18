import { Routes } from '@angular/router';

// dashboard
import { IndexComponent } from './index';
// import { AnalyticsComponent } from './analytics';
// import { FinanceComponent } from './finance';
// import { CryptoComponent } from './crypto';
// import { ManagmentFilesModule } from './managment_file/managment_file';

// // widgets
// import { WidgetsComponent } from './widgets';

// // tables
// import { TablesComponent } from './tables';

// // font-icons
// import { FontIconsComponent } from './font-icons';

// // charts
// import { ChartsComponent } from './charts';

// // dragndrop
// import { DragndropComponent } from './dragndrop';

// layouts
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';

// pages
// import { KnowledgeBaseComponent } from './pages/knowledge-base';
// import { FaqComponent } from './pages/faq';

// logeo principal
import {CoverLoginComponent} from './auth/cover-login'


export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'auth/login/login-noc-conocimientos' },
    
    {
        path: 'intranet',
        component: AppLayout,
        children: [
            { path: '', component: IndexComponent, title: 'Inicio | Sistema de Conocimientos' },
            { path: 'managment_file', loadChildren: () => import('./managment_file/managment_file').then((d) => d.ManagmentFilesModule) },
            { path: 'plataform_learn_file', loadChildren: () => import('./plataform_learn/plataform_learn_file').then((d) => d.PlataformLearnModule) },
            { path: 'analisis_excel', loadChildren: () => import('./analisis_data_excel/analisis_data_excel_file').then((d) => d.AnalisisDataExcelModule) },
            { path: 'linea_tiempo', loadChildren: () => import('./linea_tiempo_noc/linea_tiempo_file').then((d) => d.LineaTiempoModule) },
            // { path: 'analytics', component: AnalyticsComponent, title: 'Analytics Admin | Sistema de Conocimientos' },
            // { path: 'finance', component: FinanceComponent, title: 'Finance Admin | Sistema de Conocimientos' },
            // { path: 'crypto', component: CryptoComponent, title: 'Crypto Admin | Sistema de Conocimientos' },
            //apps
            // { path: '', loadChildren: () => import('./apps/apps.module').then((d) => d.AppsModule) },
            // widgets
            // { path: 'widgets', component: WidgetsComponent, title: 'Widgets | Sistema de Conocimientos' },
            // components
            // { path: '', loadChildren: () => import('./components/components.module').then((d) => d.ComponentsModule) },
            // // elements
            // { path: '', loadChildren: () => import('./elements/elements.module').then((d) => d.ElementsModule) },
            // // forms
            // { path: '', loadChildren: () => import('./forms/form.module').then((d) => d.FormModule) },
            // // users
            { path: '', loadChildren: () => import('./users/user.module').then((d) => d.UsersModule) },
            // tables
            // { path: 'tables', component: TablesComponent, title: 'Tables | Sistema de Conocimientos' },
            // { path: '', loadChildren: () => import('./datatables/datatables.module').then((d) => d.DatatablesModule) },
            { path: '', loadChildren: () => import('./pages/pages.module').then((d) => d.PagesModule) },
            // // font-icons
            // { path: 'font-icons', component: FontIconsComponent, title: 'Font Icons | Sistema de Conocimientos' },
            // // charts
            // { path: 'charts', component: ChartsComponent, title: 'Charts | Sistema de Conocimientos' },
            // // dragndrop
            // { path: 'dragndrop', component: DragndropComponent, title: 'Dragndrop | Sistema de Conocimientos' },
            // // pages
            // { path: 'pages/knowledge-base', component: KnowledgeBaseComponent, title: 'Knowledge Base | Sistema de Conocimientos' },
            // { path: 'pages/faq', component: FaqComponent, title: 'FAQ | Sistema de Conocimientos' },
        ],
    },

    
    {
        path: 'status_noc',
        component: AuthLayout,
        children: [
            { path: 'current_status_noc', loadChildren: () => import('./actual_status_noc/actual_status_noc_file').then((d) => d.ActualStatusNocModule) },
        ],
    },


    {
        path: 'auth',
        component: AuthLayout,
        children: [
            // pages
            { path: '', loadChildren: () => import('./pages/pages.module').then((d) => d.PagesModule) },
            // auth
            { path: 'login', loadChildren: () => import('./auth/auth.module').then((d) => d.AuthModule) },
        ],
    },

    // { path: '**', redirectTo: 'auth/login/cover-login' },

];


