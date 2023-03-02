import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { GamesComponent } from './games/games.component';
import { HomeComponent } from './home/home.component';
import { SingleGameComponent } from './single-game/single-game.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'games', component: GamesComponent },
  { path: 'single-game/:id', component: SingleGameComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
