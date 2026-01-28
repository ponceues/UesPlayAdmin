import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Carousel} from 'primeng/carousel';
import { Resource } from '@public/interfaces/resource';
import { ResourcesService } from '@public/services/resources/resources.service';
import { ActivatedRoute } from '@angular/router';
import { Chip } from 'primeng/chip';
import { Menu } from 'primeng/menu';
import { SharedModule } from '@shared/shared.module';
import { Filter } from '@shared/interfaces/filter';
import { ResourceFile }  from '@public/interfaces/ResourceFile';
import { Ripple } from 'primeng/ripple';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { Tooltip } from 'primeng/tooltip';
import { LucideAngularModule } from 'lucide-angular';
import { Comment} from '@admin/interfaces/comment';
import { CommentService } from '@admin/services/comments/comment.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-preview',
    imports: [
        Avatar,
        Button,
        Carousel,
        Chip,
        FooterComponent,
        LucideAngularModule,
        NgForOf,
        NgIf,
        Ripple,
        Tooltip,
        SharedModule,
        DatePipe,
        Menu
    ],
    templateUrl: './preview.component.html',
    styleUrl: './preview.component.scss'
})
export class PreviewComponent implements OnInit {
    private route: ActivatedRoute = inject(ActivatedRoute);
    private resourceService: ResourcesService = inject(ResourcesService);
    private commentService: CommentService = inject(CommentService);

    resource!: Resource;
    avatar!: ResourceFile;
    banner!: ResourceFile;
    resourceImages: any[] = [];
    comments: Comment[] = [];
    relatedResources: Resource[] = [];
    commentMenusCache: Map<string, MenuItem[]> = new Map();

    ngOnInit() {
        const resourceId = this.route.snapshot.queryParams['resourceId'];
        if (resourceId) {
            this.buildComponents(resourceId);
        }
    }

    getCommentMenus(comment: Comment): MenuItem[] {
        // Verificar si ya existe en caché
        if (this.commentMenusCache.has(comment.commentId)) {
            return this.commentMenusCache.get(comment.commentId)!;
        }

        // Crear el menú según el estado del comentario
        let menuItems: MenuItem[];

        if (comment.status === 'CREATED') {
            menuItems = [
                {
                    label: 'Opciones',
                    items: [
                        {
                            label: 'Publicar comentario',
                            icon: 'pi pi-eye',
                            command: () => this.updateComment(comment, 'PUBLISHED')
                        },
                        {
                            label: 'Ocultar comentario',
                            icon: 'pi pi-eye-slash',
                            command: () => this.updateComment(comment, 'REJECTED')
                        }
                    ]
                }
            ];
        } else {
            menuItems = [
                {
                    label: 'Opciones',
                    items: [
                        {
                            label: 'Ocultar comentario',
                            icon: 'pi pi-eye-slash',
                            command: () => this.updateComment(comment, 'REJECTED')
                        }
                    ]
                }
            ];
        }

        // Guardar en caché
        this.commentMenusCache.set(comment.commentId, menuItems);
        return menuItems;
    }

    buildComponents(resourceId: string): void {
        this.resourceService.find(resourceId).subscribe({
            next: (res) => {
                this.resource = res;
                this.resourceImages = res.files.filter((x) => x.option === 'media' && x.type === 'image');
                this.avatar = res.files.filter((x) => x.option === 'avatar')[0];
                this.banner = res.files.filter((x) => x.option === 'banner')[0];
                this.fetchRelatedResources();
                this.fetchComments();
            }
        });
    }

    fetchRelatedResources(): void {
        let quickFilter = new Filter();
        quickFilter.typeId = this.resource.typeId;
        quickFilter.pageSize = 6;

        this.resourceService.search(quickFilter).subscribe({
            next: (res) => {
                this.relatedResources = res.resources;
            }
        });
    }

    fetchComments(): void {
        let filter = new Filter();
        filter.pageSize = 10;
        this.commentService.search(filter, this.resource.resourceId).subscribe({
            next: (res) => {
                this.comments = res.comments;
            }
        });
    }

    downloadVersion(): void {
        this.resourceService.downloadVersion(this.resource.resourceId, this.resource.version.versionId).subscribe({
            next: (blob) => {
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

    getAvatarUrl(resource: Resource): string {
        if (!resource?.files) return 'assets/icons/default-avatar.png';
        const avatarFile = resource.files.find((file) => file.option === 'avatar');
        return avatarFile?.url || 'assets/icons/default-avatar.png';
    }

    updateComment(comment: Comment, state: 'REJECTED'|'PUBLISHED'): void {
        comment.status = state;
        this.commentService.update(comment, this.resource.resourceId).subscribe({
            next: () => {
                this.fetchComments();
            }
        });
    }

    toggleMenu(event: Event, menu: any): void {
        event.stopPropagation();
        menu.toggle(event);
    }

}
