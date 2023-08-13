import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Games from './../../../models/Games';
import { GamesService } from './../../../services/games.service';
import { AuthService } from './../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import User from './../../../models/User';

@Component({
    selector: 'app-single-game',
    templateUrl: './single-game.component.html',
    styleUrls: ['./single-game.component.scss'],
})
export class SingleGameComponent implements OnInit {
    constructor(
        private gameService: GamesService,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private toastrService: ToastrService
    ) {}

    game: Games = new Games();
    user: User = new User();
    fileData: any;
    isLoggedIn = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            if (params['id']) {
                const id = params['id'];
                this.gameService.getGameById(id).subscribe((data) => {
                    this.game = data;
                });
            }
        });

        this.isLoggedIn = this.authService.isLoggedIn();
        this.user = this.authService.getLoggedInUserData();
    }

    uploadCoverForGame(ev: any) {
        this.fileData = ev.target.files[0];
        let formData = new FormData();
        formData.append('img', this.fileData);
        this.gameService.uploadImage(formData).subscribe((response: any) => {
            if (response.status === 0) {
                this.gameService
                    .addCoverForGame(this.game.id, response.fileName)
                    .subscribe((addImageResponse) => {
                        this.toastrService.success('Cover uploaded!');
                        this.ngOnInit();
                    });
            }
        });
    }

    uploadImageForGame(ev: any) {
        this.fileData = ev.target.files[0];
        let formData = new FormData();
        formData.append('img', this.fileData);
        this.gameService.uploadImage(formData).subscribe((response: any) => {
            if (response.status === 0) {
                this.gameService
                    .addImageForGame(this.game.id, response.fileName)
                    .subscribe((addImageResponse) => {
                        this.toastrService.success('Image uploaded!');
                        this.ngOnInit();
                    });
            }
        });
    }
}
