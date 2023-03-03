import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditGameComponent } from './add-edit-game/add-edit-game.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'add-game', component: AddEditGameComponent },
    { path: 'edit-game/:id', component: AddEditGameComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
