import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';

import User from './../../../models/User';
import { UserService } from './../../../services/user.service';
import { ChatsService } from './../../../services/chats.service';
import { AuthService } from './../../../services/auth.service';
import { filter } from 'rxjs/operators';
import Notifications from './../../../models/Notifications';
import Chats from './../../../models/Chats';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [DatePipe],
})
export class HeaderComponent implements OnInit {
    user: User = new User();

    lastFiveNot: Notifications[] = [];
    lastFiveMessages: Chats[] = [];
    allMessagesBetweenTwoUsers: Chats[] = [];

    headerVariable = true;
    searchVariable = true;
    showDiv = false;
    showDivNot = false;
    showDivChats = false;
    showBottomChat = false;
    showBottomChatHeader = false;
    isLoggedIn = false;
    statusOfTheMessage = false;
    sendingMessage = false;

    senderId: number;
    unreadNotificationNumber: number;
    unreadMessagesNumber: number;
    index: number;
    senderImageForBottomChatUser: string;
    senderUsernameForBottomChat: string;
    messageToBeSent: string;
    senderImages: string[] = [];
    senderImagesForChat: string[] = [];

    formattedTimes: string[] = [];

    constructor(
        private datePipe: DatePipe,
        private elementRef: ElementRef,
        private authService: AuthService,
        private userService: UserService,
        private chatsService: ChatsService,
        private router: Router
    ) {
        this.chatsService.showDiv$.subscribe((show) => {
            this.showBottomChat = show;
        });
    }

    ngOnInit(): void {
        this.isLoggedIn = this.authService.isLoggedIn();

        this.authService.getLoggedInSubject().forEach((ev) => {
            // isLoggedIn is changed
            this.isLoggedIn = ev;

            if (ev === true) {
                this.user = this.authService.getLoggedInUserData();
                this.getUserData(this.user.id);

                this.chatsService
                    .getUnreadMessagesNumber(this.user.id)
                    .subscribe((data) => {
                        this.unreadMessagesNumber = data;
                    });

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

                this.chatsService
                    .getLastFiveMessages(this.user.id)
                    .subscribe((response) => {
                        this.lastFiveMessages = response;

                        this.lastFiveMessages.forEach((data) => {
                            const receiverId = data.receiver_id;

                            this.chatsService
                                .senderImagesForChat(receiverId)
                                .subscribe((images) => {
                                    this.senderImagesForChat = images;
                                });
                            const formattedTime = this.datePipe.transform(
                                data.message_time,
                                'dd.MM.yyyy, HH:mm'
                            );
                            this.formattedTimes.push(formattedTime);
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

        this.chatsService
            .getUnreadMessagesNumber(this.user.id)
            .subscribe((data) => {
                this.unreadMessagesNumber = data;
            });

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

        this.chatsService
            .getLastFiveMessages(this.user.id)
            .subscribe((response) => {
                const index = parseInt(localStorage.getItem('index'), 10);
                this.lastFiveMessages = response;

                this.lastFiveMessages.forEach((data) => {
                    const receiverId = data.receiver_id;

                    this.chatsService
                        .senderImagesForChat(receiverId)
                        .subscribe((images) => {
                            this.senderImagesForChat = images;
                            this.senderImageForBottomChatUser =
                                this.senderImagesForChat[index];
                        });
                    const formattedTime = this.datePipe.transform(
                        data.message_time,
                        'dd.MM.yyyy, HH:mm'
                    );
                    this.formattedTimes.push(formattedTime);
                });
                this.senderId = this.lastFiveMessages[index].sender_id;
                this.senderUsernameForBottomChat =
                    this.lastFiveMessages[index].sender_username;

                this.chatsService
                    .getMessagesBetweenTwoUsers(this.senderId, this.user.id)
                    .subscribe((response) => {
                        this.allMessagesBetweenTwoUsers = response;

                        this.showBottomChat = true;
                        this.showBottomChatHeader = false;
                    });
            });

        this.hideDivWhenChangeRoute();
    }

    //////////

    showMessages(index: number) {
        this.senderId = this.lastFiveMessages[index].sender_id;
        this.senderImageForBottomChatUser = this.senderImagesForChat[index];
        this.senderUsernameForBottomChat =
            this.lastFiveMessages[index].sender_username;

        localStorage.setItem('index', index.toString());

        this.chatsService
            .getMessagesBetweenTwoUsers(this.senderId, this.user.id)
            .subscribe((response) => {
                this.allMessagesBetweenTwoUsers = response;

                this.showBottomChat = true;
                this.showBottomChatHeader = false;
            });
    }

    sendMessage() {
        if (this.sendingMessage) {
            return;
        }

        this.sendingMessage = true;

        this.chatsService
            .sendMessage(this.user.id, this.senderId, this.messageToBeSent)
            .subscribe(
                (response: any) => {
                    this.messageToBeSent = response.message;
                    this.sendingMessage = false;
                    this.ngOnInit();
                },
                (error) => {
                    console.error('Error sending message:', error);
                    this.sendingMessage = false;
                }
            );
    }

    getUserData(id: number) {
        this.userService.getUserById(id).subscribe((data) => {
            this.user = data;
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
        this.showDivChats = false;
    }
    toggleDivNot() {
        this.showDivNot = !this.showDivNot;
        this.showDiv = false;
        this.showDivChats = false;
    }
    toggleDivChats() {
        this.showDivChats = !this.showDivChats;
        this.showDivNot = false;
        this.showDiv = false;
    }

    toggleBottomChat() {
        this.showBottomChat = !this.showBottomChat;
    }
    toggleBottomChatHeader() {
        this.showBottomChatHeader = !this.showBottomChatHeader;
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
                if (this.showDiv || this.showDivNot || this.showDivChats) {
                    // Hide the hidden div
                    this.showDiv = false;
                    this.showDivNot = false;
                    this.showDivChats = false;
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
            this.showDivChats = false;
        }
    }
}
