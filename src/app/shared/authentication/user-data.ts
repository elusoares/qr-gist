export default class UserData {
    name: string;
    avatar_url: string;

    setData(name: string, avatar_url: string) {
        this.name = name;
        this.avatar_url = avatar_url;
    }
}