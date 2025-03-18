import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { slideDownUp } from '../shared/animations';

// userme
import { UsuariosCrudService } from 'src/app/services/usuarios/usuarios-crud.service';

@Component({
    moduleId: module.id,
    selector: 'sidebar',
    templateUrl: './sidebar.html',
    animations: [slideDownUp],
})
export class SidebarComponent {
    active = false;
    store: any;
    activeDropdown: string[] = [];
    parentDropdown: string = '';



    // userme
    PrimerNombre!: string;
    SegundoNombre!: string;
    Rol!: string;
    RolId!: number;

    nombreVal!: boolean;
    foto_header!: string;



    allowedRolesusuario = [1, 2,3]; // Puedes cambiar los valores según tus necesidades
    allowedRolesadmin = [3]; // Puedes cambiar los valores según tus necesidades
    allowedRolesprofesor = [4,3]; // Puedes cambiar los valores según tus necesidades


    constructor(
        private usuarioInfoService: UsuariosCrudService,
        public translate: TranslateService, 
        public storeData: Store<any>, 
        public router: Router
    ) 
    {
        this.initStore();
    }


    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }

    ngOnInit() {
        this.setActiveDropdown();
        this.UserMe();
    }

    // userme
    UserMe(){
        const formData = new FormData();
        formData.append("user", localStorage.getItem("usuario") ?? '');
        formData.append("pass", localStorage.getItem("password") ?? '');
            this.usuarioInfoService.CurrentUser(formData).subscribe(
                (data) => {
                    const parseado_data=JSON.stringify(data)
                    const obj = JSON.parse(parseado_data);
                    const texto_print:any[] = obj;
                    this.nombreVal=  texto_print[0].user_data[0].is_superuser;
                    this.PrimerNombre=  texto_print[0].user_data[0].first_name;
                    this.SegundoNombre=  texto_print[0].user_data[0].last_name;
                    this.Rol=  texto_print[0].rol_data[0].role_name;     
                    this.RolId=  texto_print[0].rol_data[0].id;     

                    
                    this.foto_header=  texto_print[0].foto;
                    localStorage.setItem('current_user', texto_print[0].user);
                },
                (error) => {
                    if(error.status == 401){
                    this.logout();
                    }
                }
            )    
    }

    // userme
    logout(){
        localStorage.clear();
        this.router.navigate(['/auth/login/login-noc-conocimientos']);
    }

    isRoleInArrayUsu(role: number): boolean {
        return this.allowedRolesusuario.includes(role);
    }
    
    isRoleInArrayProfesor(role: number): boolean {
        return this.allowedRolesprofesor.includes(role);
    }

    setActiveDropdown() {
        const selector = document.querySelector('.sidebar ul a[routerLink="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }

    toggleMobileMenu() {
        if (window.innerWidth < 1024) {
            this.storeData.dispatch({ type: 'toggleSidebar' });
        }
    }

    toggleAccordion(name: string, parent?: string) {
        if (this.activeDropdown.includes(name)) {
            this.activeDropdown = this.activeDropdown.filter((d) => d !== name);
        } else {
            this.activeDropdown.push(name);
        }
    }
}
