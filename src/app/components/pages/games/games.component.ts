import { Component, OnInit } from '@angular/core';
import { GamesService } from './../../../services/games.service';
import Games from './../../../models/Games';
import User from './../../../models/User';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../../services/auth.service';

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

        this.checkUser();
    }

    checkUser() {
        this.isLoggedIn = this.authService.isLoggedIn();
        // Provjeravamo da li je logovan
        if (this.isLoggedIn) {
            const userData = (this.user =
                this.authService.getLoggedInUserData());
            // Provjeravamo da li je user
            if (userData.isAdmin === 1) {
                this.user.isAdmin = true;
            }
        }
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
