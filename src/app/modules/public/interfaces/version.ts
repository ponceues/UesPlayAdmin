import { License } from '@public/interfaces/license';

export interface Version {
    versionId:string;
    resourceId:string;
    description:string;
    version:string;
    fileName:string;
    langs:any[];
    platforms:any[];
    devices:any[];
    license:License;
}
