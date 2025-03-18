import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
    moduleId: module.id,
    templateUrl: './cover-login.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class CoverLoginComponent {
    store: any;
    currYear: number = new Date().getFullYear();

    
    username!: string;
    password!: string;

    captchaForm: FormGroup;


    constructor(
        private authService: AuthService,
        public translate: TranslateService, 
        public storeData: Store<any>, 
        public router: Router,
        private appSetting: AppService,
        private fb: FormBuilder

    ){
        this.initStore();

        this.captchaForm = this.fb.group({
            recaptcha: ['', Validators.required]
        });

          

    }
    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }

    changeLanguage(item: any) {
        this.translate.use(item.code);
        this.appSetting.toggleLanguage(item);
        if (this.store.locale?.toLowerCase() === 'es') {
            this.storeData.dispatch({ type: 'toggleRTL', payload: 'rtl' });
        } else {
            this.storeData.dispatch({ type: 'toggleRTL', payload: 'ltr' });
        }
        window.location.reload();
    }

    login(): void {
        localStorage.setItem('user', this.username);
        localStorage.setItem('pass', this.password);
        
        if (typeof  this.username === "undefined" || this.username  === '') {
            this.showMessage('Ingrese su nombre de usuario', 'top')
            return;
        }
        if (typeof  this.password === "undefined" || this.password  === '') {
            this.showMessage('Ingrese su contraseña', 'top')
            return;
        }

        this.authService.login(this.username, this.password).subscribe((data) => {

                if (this.authService.isLoggedIn()){
                    localStorage.setItem('usuario', this.username);
                    localStorage.setItem('password', this.password);

                    console.log("🚀 ~ CoverLoginComponent ~ this.authService.login ~ localStorage:", localStorage)

                    // const formData = new FormData();
                    // formData.append('usuario', this.username);
                    // formData.append('password', this.password);

                    this.router.navigate(['intranet']);
                    console.log("aquiiiii")

                }
            },
            (error) => {
            this.showMessage('Usuario y/o contraseña invalido', 'top')
            return;
            }
        )
   
    }

    
    showMessage(msg = 'Example notification text.', position = 'bottom-start', showCloseButton = true, duration = 3000) {
        const toast = Swal.mixin({
            toast: true,
            position: <any>(position || 'bottom-start'),
            showConfirmButton: false,
            timer: duration,
            showCloseButton: showCloseButton,
        });
        toast.fire({
            title: msg,
        });
    }

    onSubmit() {
        if (this.captchaForm.valid) {
          console.log('Form Submitted!');
          // Aquí puedes manejar la lógica de envío del formulario
        }
      }


}
