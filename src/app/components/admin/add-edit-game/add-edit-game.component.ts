import { Component, OnInit } from '@angular/core';
import { GamesService } from './../../../services/games.service';
import Games from './../../../models/Games';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-edit-game',
    templateUrl: './add-edit-game.component.html',
    styleUrls: ['./add-edit-game.component.scss'],
})
export class AddEditGameComponent implements OnInit {
    game: Games = new Games();

    edit: boolean = false;
    fileData: any;

    constructor(
        private gameService: GamesService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private toastrService: ToastrService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            if (params['id']) {
                this.edit = true;
                const id = params['id'];
                this.gameService.getGameById(id).subscribe((data) => {
                    this.game = data;
                });
            }
        });
    }

    saveGame() {
        if (this.edit) {
            this.gameService
                .updateGame(this.game, this.game.id)
                .subscribe((data) => {
                    if (data.success) {
                        this.toastrService.success('Game updated!');
                        this.router.navigateByUrl('/games');
                    }
                });
        } else {
            this.gameService.insertGame(this.game).subscribe((data) => {
                if (data.success) {
                    this.toastrService.success('Game inserted!');
                    this.router.navigateByUrl('/games');
                }
            });
        }
    }

    setUploadedImage(ev: any) {
        console.log(`OVO JE ev ${ev}`);
        this.fileData = ev.target.files[0];
    }

    uploadImage() {
        let formData = new FormData();
        formData.append('img', this.fileData);
        this.gameService.uploadImage(formData).subscribe((response: any) => {
            console.log(`ovo je response ${response}`);
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
