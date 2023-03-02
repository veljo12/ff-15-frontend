import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Games from './../models/Games';

@Injectable({
  providedIn: 'root',
})
export class GamesService {

  apiUrl = 'http://localhost:3000/games';

  constructor(private httpClient: HttpClient) {}

  getAllGames = () => {
    const a = this.httpClient.get<Games[]>(this.apiUrl);
    console.log(`getallgames = ${a}`);
    return a;
  };

  getGameById = (id: number) => {
    const a = this.httpClient.get<Games>(`${this.apiUrl}/${id}`);
    console.log(a);
    return a;
  };

  insertGame = (game: Games) => {
    return this.httpClient.post<any>(this.apiUrl, game);
  };

  updateGame = (game: Games, id: number) =>{
    return this.httpClient.put<any>(`${this.apiUrl}/${id}`, game)
  };

  deleteGame = (id: number) =>{
    return this.httpClient.delete<any>(`${this.apiUrl}/${id}`);
  }

  getImagesForGame = (id: number) =>{
    return this.httpClient.get<any>(`${this.apiUrl}/images/${id}`)
  }
}
