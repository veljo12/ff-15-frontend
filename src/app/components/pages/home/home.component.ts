import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    isLoggedIn = false;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.isLoggedIn = this.authService.isLoggedIn();
        this.authService.getLoggedInSubject().forEach((ev) => {
            this.isLoggedIn = ev;
            // Da singup dugme nestane bez refresha
        });
    }
}
