import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Chats from '../models/Chats';
import { Subject } from 'rxjs';
import User from './../models/User';

@Injectable({
    providedIn: 'root',
})
export class ChatsService {
    apiUrl = 'http://localhost:3000/users/chats';

    private showDivSource = new Subject<boolean>();
    private userToChatWith = new Subject<any>();

    constructor(private httpClient: HttpClient) {}

    setUserToChatWith(user: User) {
        this.userToChatWith.next(user);
    }

    getUserToChatWith() {
        return this.userToChatWith.asObservable();
    }

    showDiv$ = this.showDivSource.asObservable();

    showDiv(show: boolean) {
        this.showDivSource.next(show);
    }

    sendMessage = (sender_id: number, receiver_id: number, message: string) => {
        return this.httpClient.post<string>(
            `${this.apiUrl}/${sender_id}/message/${receiver_id}`,
            { message }
        );
    };

    getAllMessages = (id: number) => {
        return this.httpClient.get<Chats[]>(`${this.apiUrl}/messages/${id}`);
    };

    getUnreadMessagesNumber = (id: number) => {
        return this.httpClient.get<number>(`${this.apiUrl}/unread/${id}`);
    };

    senderImagesForChat = (id: number) => {
        return this.httpClient.get(`${this.apiUrl}/last/images/${id}`, {
            responseType: 'text',
        });
    };

    getMessagesBetweenTwoUsers = (sender_id: number, receiver_id: number) => {
        return this.httpClient.get<Chats[]>(
            `${this.apiUrl}/${sender_id}/message/${receiver_id}`
        );
    };

    markMessagesAsRead = (id: number) => {
        return this.httpClient.put(`${this.apiUrl}/messages/${id}`, {});
    };
}
