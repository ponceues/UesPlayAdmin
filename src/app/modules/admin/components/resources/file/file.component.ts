import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResourceFile } from '@admin/interfaces/resource-file';
import { SharedModule } from '@shared/shared.module';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-file',
    imports: [SharedModule, NgIf],
    templateUrl: './file.component.html',
    styleUrl: './file.component.scss'
})
export class FileComponent {
    @Input() file!: ResourceFile | null;
    @Output() removeFile:EventEmitter<ResourceFile> = new EventEmitter<ResourceFile>();

    ngOnInit() {
    }

    onRemoveFile() {
        this.removeFile.emit(this.file!);
    }

}
