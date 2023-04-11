import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import User from './../../../models/User';
import { UserService } from './../../../services/user.service';
import { AuthService } from './../../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    user: User = new User();

    headerVariable = true;
    searchVariable = true;
    showDiv = false;
    isLoggedIn = false;

    constructor(
        private elementRef: ElementRef,
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.isLoggedIn = this.authService.isLoggedIn();

        this.authService.getLoggedInSubject().forEach((ev) => {
            console.log('isLoggedIn is changed', ev);
            this.isLoggedIn = ev;

            if (ev === true) {
                this.user = this.authService.getLoggedInUserData();
                this.getUserData(this.user.id);
                console.log('ALO BRE: ', this.user);
            }
        });
        // Retrieve user information when page is refreshed

        this.user = this.authService.getLoggedInUserData();
        this.getUserData(this.user.id);

        this.userService.getUserImageAsObservable().subscribe((image) => {
            this.user.image = image;
        });

        this.hideDivWhenChangeRoute();
    }

    getUserData(id: number) {
        this.userService.getUserById(id).subscribe((data) => {
            this.user = data;

            console.log('brit', this.user);
        });
    }

    logout() {
        this.authService.logout();
    }

    toggleDiv() {
        this.showDiv = !this.showDiv;
    }

    hideDivWhenChangeRoute() {
        this.router.events
            .pipe(
                filter(
                    (event): event is NavigationStart =>
                        event instanceof NavigationStart
                )
            )
            .subscribe(() => {
                // Check if the hidden div is visible
                if (this.showDiv) {
                    // Hide the hidden div
                    this.showDiv = false;
                }
            });
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        if (window.pageYOffset >= 100) {
            this.headerVariable = false;
            this.searchVariable = false;
        } else {
            this.headerVariable = true;
            this.searchVariable = true;
        }
    }
    // Hide the hidden div on click
    @HostListener('document:click', ['$event.target'])
    onClick(targetElement: any): void {
        const clickedInside =
            this.elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.showDiv = false;
        }
    }
}
