import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User from '../models/User';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    apiUrl = 'http://localhost:3000/users';
    constructor(private httpClient: HttpClient) {}

    getAllUsers = () => {
        return this.httpClient.get<User[]>(this.apiUrl);
    };

    getUserById = (id: number) => {
        const a = this.httpClient.get<User>(`${this.apiUrl}/${id}`);

        return a;
    };

    uploadImage(formData: any) {
        return this.httpClient.post('http://localhost:3000/upload', formData);
    }

    addImageForUser(id: number, image: string) {
        return this.httpClient.post(`${this.apiUrl}/add-image`, { id, image });
    }

    addCoverForUser(id: number, cover: string) {
        return this.httpClient.post(`${this.apiUrl}/add-cover`, { id, cover });
    }
}
