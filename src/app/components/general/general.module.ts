import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { GamesSliderComponent } from './games-slider/games-slider.component';
import { TestemonialsComponent } from './testemonials/testemonials.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        GamesSliderComponent,
        TestemonialsComponent,
    ],
    imports: [CommonModule, RouterModule],

    exports: [
        HeaderComponent,
        FooterComponent,
        GamesSliderComponent,
        TestemonialsComponent,
    ],
})
export class GeneralModule {}
