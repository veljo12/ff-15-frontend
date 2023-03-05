import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Games from './../../../models/Games';
import { GamesService } from './../../../services/games.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-single-game',
    templateUrl: './single-game.component.html',
    styleUrls: ['./single-game.component.scss'],
})
export class SingleGameComponent implements OnInit {
    game: Games = new Games();
    fileData: any;

    constructor(
        private gameService: GamesService,
        private activatedRoute: ActivatedRoute,
        private toastrService: ToastrService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            if (params['id']) {
                console.log('aaaaaaaa');

                console.log(params);

                const id = params['id'];

                this.gameService.getGameById(id).subscribe((data) => {
                    this.game = data;
                    console.log(this.game);
                });
            }
        });
    }

    uploadCoverForGame(ev: any) {
        console.log(`OVO JE ev ${ev}`);
        this.fileData = ev.target.files[0];
        let formData = new FormData();
        formData.append('img', this.fileData);
        this.gameService.uploadImage(formData).subscribe((response: any) => {
            console.log(`ovo je response ${response}`);
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
        console.log(`OVO JE ev ${ev}`);
        this.fileData = ev.target.files[0];
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
