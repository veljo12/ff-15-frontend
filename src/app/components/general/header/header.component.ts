import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import User from './../../../models/User';
import { UserService } from './../../../services/user.service';
import { AuthService } from './../../../services/auth.service';
import { filter } from 'rxjs/operators';
import Notifications from './../../../models/Notifications';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    user: User = new User();
    lastFiveNot: Notifications[] = [];

    headerVariable = true;
    searchVariable = true;
    showDiv = false;
    showDivNot = false;
    isLoggedIn = false;
    unreadNotificationNumber: number;
    senderImages: string[] = [];
    statusOfTheMessage = false;

    constructor(
        private elementRef: ElementRef,
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.isLoggedIn = this.authService.isLoggedIn();

        this.authService.getLoggedInSubject().forEach((ev) => {
            // isLoggedIn is changed
            this.isLoggedIn = ev;

            if (ev === true) {
                this.user = this.authService.getLoggedInUserData();
                this.getUserData(this.user.id);

                this.userService
                    .getUnreadNotifications(this.user.id)
                    .subscribe((data) => {
                        this.unreadNotificationNumber = data;
                    });

                this.userService
                    .getLastFiveNotifications(this.user.id)
                    .subscribe((response) => {
                        this.lastFiveNot = response;
                        this.lastFiveNot.forEach((data) => {
                            const receiverId = data.receiver_id;
                            if ((data.status = 1)) {
                                this.statusOfTheMessage = true;
                            }

                            this.userService
                                .getSenderImages(receiverId)
                                .subscribe((images) => {
                                    this.senderImages = images;
                                });
                        });
                    });
            }
        });
        // Retrieve user information when page is refreshed

        this.user = this.authService.getLoggedInUserData();
        this.getUserData(this.user.id);

        this.userService.getUserImageAsObservable().subscribe((image) => {
            this.user.image = image;
        });

        this.userService
            .getUnreadNotifications(this.user.id)
            .subscribe((data) => {
                console.log(data);

                this.unreadNotificationNumber = data;
            });

        this.userService
            .getLastFiveNotifications(this.user.id)
            .subscribe((response) => {
                this.lastFiveNot = response;
                this.lastFiveNot.forEach((data) => {
                    const receiverId = data.receiver_id;
                    if ((data.status = 1)) {
                        this.statusOfTheMessage = true;
                    }
                    this.userService
                        .getSenderImages(receiverId)
                        .subscribe((images) => {
                            this.senderImages = images;
                        });
                });
            });

        this.hideDivWhenChangeRoute();
    }

    //////////

    getUserData(id: number) {
        this.userService.getUserById(id).subscribe((data) => {
            this.user = data;

            console.log(this.user);
        });
    }

    markNotificationsAsRead() {
        this.userService.markNotificationsAsRead(this.user.id).subscribe(() => {
            this.unreadNotificationNumber = 0;
        });
    }

    logout() {
        this.authService.logout();
    }

    toggleDiv() {
        this.showDiv = !this.showDiv;
        this.showDivNot = false;
    }
    toggleDivNot() {
        this.showDivNot = !this.showDivNot;
        this.showDiv = false;
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
                if (this.showDiv || this.showDivNot) {
                    // Hide the hidden div
                    this.showDiv = false;
                    this.showDivNot = false;
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
            this.showDivNot = false;
        }
    }
}

// this.lastFiveNot.forEach((notification) => {
//     const senderId = notification.sender_id;
//     const obs =
//         this.userService.getSenderImage(senderId);
//     this.observables.push(obs);
// });
// forkJoin(this.observables).subscribe(
//     (images: string[]) => {
//         this.senderImage = images;
//     }
// );
