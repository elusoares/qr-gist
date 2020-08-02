import UserData from '../shared/authentication/user-data';
import GistComment from './gist-comment';
import GistFile from './gist-file';

export default class GistData {
    owner: UserData;
    created_at: Date;
    files: Array<GistFile>;
    file_title: string;
    comments: Array<GistComment>;

}