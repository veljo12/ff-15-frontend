import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { GamesComponent } from './games/games.component';
import { SingleGameComponent } from './single-game/single-game.component';
import { RankingComponent } from './sg-pages/ranking/ranking.component';

@NgModule({
    declarations: [GamesComponent, SingleGameComponent, RankingComponent],
    imports: [CommonModule, PagesRoutingModule],
})
export class PagesModule {}
