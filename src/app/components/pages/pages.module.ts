import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { GamesComponent } from './games/games.component';
import { SingleGameComponent } from './single-game/single-game.component';
import { RankingComponent } from './sg-pages/ranking/ranking.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';

@NgModule({
    declarations: [
        GamesComponent,
        SingleGameComponent,
        RankingComponent,
        LoginComponent,
        RegisterComponent,
    ],
    imports: [CommonModule, PagesRoutingModule, FormsModule],
})
export class PagesModule {}
