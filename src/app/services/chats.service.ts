import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Chats from '../models/Chats';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChatsService {
    apiUrl = 'http://localhost:3000/users/chats';

    private showDivSource = new Subject<boolean>();

    constructor(private httpClient: HttpClient) {}

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

    getLastFiveMessages = (id: number) => {
        return this.httpClient.get<Chats[]>(`${this.apiUrl}/last/${id}`);
    };

    getUnreadMessagesNumber = (id: number) => {
        return this.httpClient.get<number>(`${this.apiUrl}/unread/${id}`);
    };

    senderImagesForChat = (id: number) => {
        return this.httpClient.get<string[]>(
            `${this.apiUrl}/last/images/${id}`
        );
    };

    getMessagesBetweenTwoUsers = (sender_id: number, receiver_id: number) => {
        return this.httpClient.get<Chats[]>(
            `${this.apiUrl}/${sender_id}/message/${receiver_id}`
        );
    };
}
