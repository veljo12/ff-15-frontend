import { Component, OnInit } from '@angular/core';
import { GamesService } from './../../../services/games.service';
import Games from './../../../models/Games';
import User from './../../../models/User';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../../services/auth.service';
import { UserService } from './../../../services/user.service';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
    games: Games[] = [];
    user: User = new User();
    isLoggedIn = false;

    constructor(
        private authService: AuthService,
        private gamesService: GamesService,
        private tostrService: ToastrService
    ) {}

    ngOnInit(): void {
        this.gamesService.getAllGames().subscribe((data) => {
            this.games = data;
        });

        this.isLoggedIn = this.authService.isLoggedIn();
        // If the user is logged in get information about role
        if (this.isLoggedIn) this.user = this.authService.getLoggedInUserData();
    }

    deleteGame(id: number) {
        const result = confirm('Are you sure you want to delete this game?');
        if (result) {
            this.gamesService.deleteGame(id).subscribe((data) => {
                if (data.success) {
                    this.tostrService.success('Game deleted!');
                    this.gamesService.getAllGames().subscribe((gameData) => {
                        this.games = gameData;
                    });
                } else {
                    this.tostrService.error('Error while deleting game!');
                }
            });
        }
    }
}
