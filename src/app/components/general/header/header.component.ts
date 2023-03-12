import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    headerVariable = true;
    isLoggedIn = false;

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.isLoggedIn = this.authService.isLoggedIn();

        this.authService.getLoggedInSubject().forEach((ev) => {
            console.log('isLoggedIn is changed', ev);
            this.isLoggedIn = ev;
            // Zato sto se ne mijenjaju dugmad u hederu za logout
        });
    }
    logout() {
        this.authService.logout();
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        if (window.pageYOffset >= 100) {
            this.headerVariable = false;
        } else this.headerVariable = true;
    }
}
