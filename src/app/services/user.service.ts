import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User from '../models/User';
import Notifications from '../models/Notifications';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    apiUrl = 'http://localhost:3000/users';

    userImage: BehaviorSubject<any> = new BehaviorSubject(null); // BehaviorSubject with an initial value of null

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

    getUserImageAsObservable() {
        return this.userImage.asObservable();
    }

    updateUserImage(newImage: string) {
        this.userImage.next(newImage);
    }

    //////////////////////

    sendFriendRequest = (user1_id: number, user2_id: number) => {
        return this.httpClient
            .post<User>(`${this.apiUrl}/${user1_id}/friends/${user2_id}`, {
                user1_id,
                user2_id,
            })
            .pipe(
                map((response) => {
                    return {
                        senderId: user1_id,
                        receiverId: user2_id,
                        ...response,
                    };
                })
            );
    };

    cancelFriendRequest = (user1_id: number, user2_id: number) => {
        return this.httpClient.delete(
            `${this.apiUrl}/${user1_id}/friends/${user2_id}`
        );
    };

    acceptFriendRequest = (user1_id: number, user2_id: number) => {
        return this.httpClient.put<User>(
            `${this.apiUrl}/${user1_id}/friends/${user2_id}`,
            {}
        );
    };

    checkFriendshipStatus = (user1_id: number, user2_id: number) => {
        return this.httpClient.get(
            `${this.apiUrl}/${user1_id}/friends/${user2_id}/status`
        );
    };

    areFriends = (user1_id: number, user2_id: number) => {
        return this.httpClient.get<boolean>(
            `${this.apiUrl}/${user1_id}/friends/${user2_id}`
        );
    };

    // Notifications

    getUnreadNotifications(id: number): Observable<number> {
        return this.httpClient.get<number>(
            `${this.apiUrl}/notifications/unread/${id}`
        );
    }

    sendFriendRequestNotification = (
        sender_id: number,
        receiver_id: number
    ) => {
        return this.httpClient.post(
            `${this.apiUrl}/notifications/${sender_id}/send/${receiver_id}`,
            { sender_id, receiver_id }
        );
    };

    deleteFriendRequestNotifications = (
        sender_id: number,
        receiver_id: number
    ) => {
        return this.httpClient.delete(
            `${this.apiUrl}/notifications/${sender_id}/send/${receiver_id}`
        );
    };

    sendAcceptedFriendRequestNotification = (
        sender_id: number,
        receiver_id: number
    ) => {
        return this.httpClient.post(
            `${this.apiUrl}/notifications/${sender_id}/accept/${receiver_id}`,
            { sender_id, receiver_id }
        );
    };

    getAllNotifications = (id: number) => {
        return this.httpClient.get<Notifications[]>(
            `${this.apiUrl}/notifications/${id}`
        );
    };

    getLastFiveNotifications = (id: number) => {
        const result = this.httpClient.get<Notifications[]>(
            `${this.apiUrl}/notifications/last/${id}`
        );

        return result;
    };
    markNotificationsAsRead = (id: number) => {
        return this.httpClient.put(`${this.apiUrl}/notifications/${id}`, {});
    };

    getSenderImages = (id: number) => {
        return this.httpClient.get<string[]>(
            `${this.apiUrl}/notifications/last/images/${id}`
        );
    };

    getAllNotificationImages = (id: number) => {
        return this.httpClient.get<string[]>(
            `${this.apiUrl}/notifications/images/${id}`
        );
    };
}
