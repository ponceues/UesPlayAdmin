import { Component, ElementRef, inject,OnInit, resource, ViewChild } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { Resource } from '@public/interfaces/resource';
import { ResourcesService } from '@public/services/resources/resources.service';
import { ActivatedRoute } from '@angular/router';
import { Chip } from 'primeng/chip';
import { TableModule } from 'primeng/table';
import { SharedModule } from '@shared/shared.module';
import { Filter } from '@shared/interfaces/filter';
import { ResourceFile }  from '@public/interfaces/ResourceFile';
import { Ripple } from 'primeng/ripple';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { Tooltip } from 'primeng/tooltip';
import { Dialog } from 'primeng/dialog';
import { FormBuilder, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Rating } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-resource',
    imports: [
        NgIf,
        Avatar,
        Button,
        CarouselModule,
        NgForOf,
        TableModule,
        Chip,
        SharedModule,
        Ripple,
        FooterComponent,
        Tooltip,
        DatePipe,
        Dialog,
        ReactiveFormsModule,
        InputText,
        Rating,
        TextareaModule
    ],
  templateUrl: './resource.component.html',
  styleUrl: './resource.component.scss'
})

export class ResourceComponent {
    private route: ActivatedRoute = inject(ActivatedRoute);
    private resourceService: ResourcesService = inject(ResourcesService);
    private formBuilder = inject(FormBuilder);
    private messageService: MessageService = inject(MessageService);


    resource!:Resource;
    avatar!:ResourceFile;
    banner!:ResourceFile;
    resourceImages:any[]=[];
    relatedResources: Resource[]=[];

    @ViewChild('nameInput') nameInput!: ElementRef;
    loadingComments: boolean = false;
    comments:any[]=[];
    showCreateDialog:boolean = false;
    commentForm!: FormGroup;
    httpLoading: boolean = false;

    ngOnInit() {
        const resourceId = this.route.snapshot.queryParams['resourceId'];
        if (resourceId) {
            this.buildComponents(resourceId);
        }
    }

    buildComponents(resourceId:string):void {
        this.resourceService.find(resourceId).subscribe({
            next: (res) => {
                this.resource = res;
                this.resourceImages = res.files.filter(x => x.option === 'media' && x.type === 'image' );
                this.avatar = res.files.filter(x=>x.option === 'avatar')[0];
                this.banner = res.files.filter(x=>x.option === 'banner')[0];
                this.fetchRelatedResources();
                this.fetchComments();
                this.buildCommentForm();
            }
        });

    }

    fetchRelatedResources() :void{
        let quickFilter = new Filter();
        quickFilter.typeId = this.resource.typeId;
        quickFilter.pageSize = 6;

        this.resourceService.search(quickFilter).subscribe({
            next: (res) => {
                this.relatedResources = res.resources;
            }
        });
    }

    fetchComments() :void{
        this.loadingComments = true;
        let quickFilter = new Filter();
        quickFilter.pageSize = 25;

        this.resourceService.searchComments(quickFilter,this.resource.resourceId ).subscribe({
            next: (res) => {
                this.comments = res.comments;
            }
        });
    }

    addComment(): void{
        let request = this.commentForm.value;
        this.httpLoading = true;
        this.resourceService.createComment(request, this.resource.resourceId).subscribe({
            next: (res) => {
                this.httpLoading = false;
                this.showCreateDialog = false;
                this.fetchComments();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Completado',
                    detail: 'Comentario agregado correctamente, se envio para su revisión.',
                    key: 'main'
                });
            },
            error: (err) => {
                this.httpLoading = false;
            }
        })
    }

    downloadVersion(): void {
        this.resourceService.downloadVersion(this.resource.resourceId, this.resource.version.versionId).subscribe({
            next: (blob) => {
                // Intentar obtener el nombre del archivo desde la metadata, si existe


                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = this.resource.version.fileName || 'download';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                this.resource.downloads += 1;
            },
            error: (err) => {
                console.error('Error al descargar el archivo', err);
            }
        });
    }

    getAvatarUrl(resource: Resource): string  {
        if (!resource?.files) return 'assets/icons/default-avatar.png';
        const avatarFile = resource.files.find(file => file.option === 'avatar');
        return avatarFile?.url || 'assets/icons/default-avatar.png';
    }

    getRandomColor(name: string): string {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 65%, 50%)`;
    }

    getStarsArray(score: number): number[] {
        return Array(score).fill(1);
    }

    buildCommentForm(): void {
        this.commentForm = this.formBuilder.group({
            resourceId  : [this.resource.resourceId],
            comment: ['', [Validators.required]],
            score: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
            commentedBy: ['', [Validators.required]],
            commentersEmail: ['', [Validators.required, Validators.email]]
        });
    }

    openDialog() {
        this.showCreateDialog = true;
        setTimeout(() => {
            this.nameInput?.nativeElement?.focus();
            console.log("Input focused");
        }, 200);
    }
}
