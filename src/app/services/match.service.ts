import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Match from '../models/Match';

@Injectable({
    providedIn: 'root',
})
export class MatchService {
    apiUrl = 'http://localhost:3000/users/match';

    constructor(private httpClient: HttpClient) {}

    addNewMatch = (
        sender_id: number,
        receiver_id: number,
        name_of_the_game: string,
        total_stake: number
    ) => {
        return this.httpClient.post<Match>(
            `${this.apiUrl}/${sender_id}/${receiver_id}`,
            {
                name_of_the_game,
                total_stake,
            }
        );
    };

    getMatchByNotificationId = (notification_id: number) => {
        return this.httpClient.get<Match>(`${this.apiUrl}/${notification_id}`);
    };

    rejectChallenge = (notification_id: number) => {
        return this.httpClient.post<Match>(
            `${this.apiUrl}/${notification_id}`,
            { notification_id }
        );
    };
    acceptChallenge = (notification_id: number) => {
        return this.httpClient.put<Match>(`${this.apiUrl}/${notification_id}`, {
            notification_id,
        });
    };

    getAllMatches = () => {
        return this.httpClient.get<Match[]>(`${this.apiUrl}/all`);
    };

    user1Win = (id: number) => {
        return this.httpClient.put<Match>(`${this.apiUrl}/user1-win/${id}`, {
            id,
        });
    };
    user2Win = (id: number) => {
        return this.httpClient.put<Match>(`${this.apiUrl}/user2-win/${id}`, {
            id,
        });
    };
}
