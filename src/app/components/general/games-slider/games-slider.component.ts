import { Component, OnInit } from '@angular/core';
import Game from 'src/app/models/Games';
import { GamesService } from 'src/app/services/games.service';

@Component({
    selector: 'app-games-slider',
    templateUrl: './games-slider.component.html',
    styleUrls: ['./games-slider.component.scss'],
})
export class GamesSliderComponent implements OnInit {
    games: Game[] = [];

    constructor(private gamesService: GamesService) {}

    ngOnInit(): void {
        this.gamesService.getAllGames().subscribe((data) => {
            this.games = data;
        });
    }
}
