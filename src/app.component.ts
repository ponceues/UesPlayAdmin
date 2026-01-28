import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, Toast],
    template: `<p-toast key="main" position="top-right"></p-toast> <router-outlet></router-outlet>`
})
export class AppComponent {}
