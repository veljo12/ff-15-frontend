import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { AddEditGameComponent } from './add-edit-game/add-edit-game.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [HomeComponent, AddEditGameComponent],
    imports: [CommonModule, AdminRoutingModule, FormsModule],
})
export class AdminModule {}
