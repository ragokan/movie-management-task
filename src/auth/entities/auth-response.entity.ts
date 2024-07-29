export class AuthResponse {
    access_token: string;

    constructor(data: AuthResponse) {
        Object.assign(this, data);
    }
}
