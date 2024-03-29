import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { GamesComponent } from './games/games.component';
import { HomeComponent } from './home/home.component';

import { SingleGameComponent } from './single-game/single-game.component';
import { RankingComponent } from './sg-pages/ranking/ranking.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UsersComponent } from './users/users.component';
import { SingleUserComponent } from './single-user/single-user.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AllChatsComponent } from './all-chats/all-chats.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'games', component: GamesComponent },
    { path: 'single-game/:id', component: SingleGameComponent },
    { path: 'single-game/:id/ranking', component: RankingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'users', component: UsersComponent },
    { path: 'users/:id', component: SingleUserComponent },
    { path: 'users/notifications/:id', component: NotificationsComponent },
    { path: 'users/all-chats/:id', component: AllChatsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
