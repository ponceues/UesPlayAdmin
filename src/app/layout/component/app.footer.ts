import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        © {{ currentYear }} Universidad de El Salvador
    </div>`
})
export class AppFooter {
    currentYear = new Date().getFullYear();
}
