import {Meta} from './meta';

export interface Envelop<T> {
    meta:Meta;
    roles:T[];
    users:T[];
    menus:T[];
    permissions:T[];
    types:T[];
    platforms:T[];
    devices:T[];
    states:T[];
    areas:T[];
    resources:T[];
    authors:T[];
    versions:T[];
    languages:T[];
    files:T[];
    licenses:T[];
    mediaTypes:T[];
    mediaGenres:T[];
    comments:T[];
}
