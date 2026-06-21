export class Filter {
    page:number;
    pageSize:number;
    Id:string|null;
    status:string|null;
    available:boolean|null;
    state:string|null;
    text:string|null;
    areaId:string|null;
    typeId:string|null;
    platformId:string|null;
    deviceId:string|null;
    stateId:string|null;
    enabled:boolean|null;
    genreId:string|null;

    constructor() {
        this.page = 0;
        this.pageSize = 10;
        this.Id = null;
        this.status = null;
        this.available = null;
        this.state = null;
        this.text = null;
        this.areaId = null;
        this.typeId = null;
        this.platformId = null;
        this.deviceId = null;
        this.stateId = null;
        this.enabled = null;
        this.genreId = null;
    }
}
