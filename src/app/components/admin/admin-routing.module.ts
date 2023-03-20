import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './../../guards/admin.guard';
import { AddEditGameComponent } from './../admin/add-edit-game/add-edit-game.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'add-game',
        component: AddEditGameComponent,
        canActivate: [AdminGuard],
    },
    {
        path: 'edit-game/:id',
        component: AddEditGameComponent,
        canActivate: [AdminGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
