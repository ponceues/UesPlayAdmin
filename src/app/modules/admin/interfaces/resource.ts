import { Area } from '@admin/interfaces/area';
import { ResourceState } from '@admin/interfaces/resource-state';
import { ResourceType } from '@admin/interfaces/resource-type';
import { Author } from '@admin/interfaces/author';

export interface Resource {
    resourceId: string;
    userId: string;
    typeId: string;
    areaId: string;
    stateId: string;
    mediaTypeId: string;
    genreId: string;
    title: string;
    description: string;
    downloads: number;
    area: Area | null;
    state: ResourceState | null;
    type: ResourceType;
    authors: Author[];
    createdAt: Date;
    updatedAt: Date;
}
