import { UserState } from '@admin/interfaces/user-state';
import { Area } from '@admin/interfaces/area';

export interface User {
    userId: string;
    rolId:string;
    stateId:string;
    name: string;
    email: string;
    state:UserState;
    verifiedAt?: Date;
    areas?: Area[];
    areasCodes?: string[];
    createdAt: Date;
    updatedAt: Date;
}
