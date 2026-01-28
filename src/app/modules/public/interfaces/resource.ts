import { ResourceType } from './resource-type';
import { ResourceFile } from './ResourceFile';
import { Comment } from './comment';
import { Area } from '@admin/interfaces/area';
import { Author } from '@public/interfaces/author';
import { Version } from '@public/interfaces/version';

export interface Resource {
    resourceId: string;
    typeId: string;
    title: string;
    files:ResourceFile[];
    comments:Comment[];
    description: string;
    downloads:number;
    rating:number;
    type?:ResourceType;
    area:Area;
    authors:Author[];
    version:Version;
    createdAt: Date;
    updatedAt: Date;
}
