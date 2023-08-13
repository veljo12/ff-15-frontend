import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { AddEditGameComponent } from './add-edit-game/add-edit-game.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
    declarations: [HomeComponent, AddEditGameComponent, DashboardComponent],
    imports: [CommonModule, AdminRoutingModule, FormsModule],
})
export class AdminModule {}
