import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Games from './../../../models/Games';
import { GamesService } from './../../../services/games.service';

@Component({
  selector: 'app-single-game',
  templateUrl: './single-game.component.html',
  styleUrls: ['./single-game.component.scss'],
})
export class SingleGameComponent implements OnInit {
  game: Games = new Games();

  constructor(
    private gamesService: GamesService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        console.log('aaaaaaaa');
        
        console.log(params);
        
        const id = params['id'];
       
        
        this.gamesService.getGameById(id).subscribe((data) => {
          this.game = data;
          console.log(this.game);
          
        });
      }
    });
  }
}
