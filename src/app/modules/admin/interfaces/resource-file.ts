export interface ResourceFile {
    fileId:string;
    resourceId:string;
    name:string;
    option: 'avatar'|'banner'|'media';
    type:string;
    extension:string;
    createdAt:Date;
}
