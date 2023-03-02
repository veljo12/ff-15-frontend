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
      this.gameService.updateGame(this.game, this.game.id).subscribe((data) => {
        if (data.success) {
          this.toastrService.success('Game updated!')
          this.router.navigateByUrl('/games');
        }
      });
    } else {
      this.gameService.insertGame(this.game).subscribe((data) => {
        if (data.success) {
          this.toastrService.success('Game inserted!')
          this.router.navigateByUrl('/games');
        }
      });
    }
  }
}
