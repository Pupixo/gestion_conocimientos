import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
@Component({
    moduleId: module.id,
    selector: 'icon-watch-time',
    template: `
        <ng-template #template>
     
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" [ngClass]="class">
                <path   d="M12 8V12L14.5 14.5" 
                        stroke="currentColor"
                        stroke-width="1.5" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                />

                <path   d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" 
                        stroke="currentColor"
                        stroke-width="1.5" 
                        stroke-linecap="round"
                />
            </svg>

        </ng-template>
    `,
})
export class IconWatchTimeComponent {
    @Input() class: any = '';
    @ViewChild('template', { static: true }) template: any;
    constructor(private viewContainerRef: ViewContainerRef) {}
    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template);
        this.viewContainerRef.element.nativeElement.remove();
    }
}
