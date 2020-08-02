export default class GistFile {
    file_name: string;
    type: string;

    constructor(file_name: string, type: string) {
        this.file_name = file_name;
        this.type = type;
    }
}