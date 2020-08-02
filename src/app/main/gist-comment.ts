import UserData from '../shared/authentication/user-data';

export default class GistComment {
    body: Text;
    user: UserData;
    created_at: Date;

    constructor(body: Text, user: UserData, created_at: Date) {
        this.body = body;
        this.user = user;
        this.created_at = created_at;
    }
}