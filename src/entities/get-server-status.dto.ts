export class GetServerStatusDto {
    status: string;
    version: string;

    constructor(data: GetServerStatusDto) {
        Object.assign(this, data);
    }
}