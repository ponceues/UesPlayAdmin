import { effect, Injectable, signal } from '@angular/core';
import { ResourceType } from '../../interfaces/resource-type';
import { BehaviorSubject, Subject } from 'rxjs';
export interface layoutConfig {
    preset?: string;
    primary?: string;
    surface?: string | undefined | null;
    darkTheme?: boolean;
    menuMode?: string;
}


@Injectable({
  providedIn: 'root'
})

export class LayoutService {
    _config: layoutConfig = {
        preset: 'Aura',
        primary: 'ues-play',
        surface: null,
        darkTheme: false,
        menuMode: 'static'
    };
    layoutConfig = signal<layoutConfig>(this._config);
    private configUpdate = new Subject<layoutConfig>();
    private resourceType:BehaviorSubject<any> = new BehaviorSubject<any>(null);
    resourceType$ = this.resourceType.asObservable();
    private initialized = false;
    constructor() {
        effect(() => {
            const config = this.layoutConfig();
            if (config) {
                this.onConfigUpdate();
            }
        });

        effect(() => {
            const config = this.layoutConfig();

            if (!this.initialized || !config) {
                this.initialized = true;
                return;
            }
        });

    }

    getSelectedResourceType() {
        return this.resourceType.value;
    }

    setSelectedResourceType(item: ResourceType): void {
        this.resourceType.next(item);
    }

    onConfigUpdate() {
        this._config = { ...this.layoutConfig() };
        this.configUpdate.next(this.layoutConfig());
    }
}
