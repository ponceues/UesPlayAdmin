import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ResourceFile } from '@admin/interfaces/resource-file';
import { SharedModule } from '@shared/shared.module';
import { NgIf } from '@angular/common';
import { AppStorageService } from '@shared/services/app-storage/app-storage.service';

@Component({
    selector: 'app-file',
    imports: [SharedModule, NgIf],
    templateUrl: './file.component.html',
    styleUrl: './file.component.scss'
})
export class FileComponent {
    @Input() file!: ResourceFile | null;
    @Output() removeFile: EventEmitter<ResourceFile> = new EventEmitter<ResourceFile>();
    private appStorageService: AppStorageService = inject(AppStorageService);
    permissions: string[] = [];

    ngOnInit() {
        this.permissions = this.appStorageService.getPermissions().filter((x) => x.includes('resources'));
    }

    onRemoveFile() {
        this.removeFile.emit(this.file!);
    }
}
