import {
    Component,
    OnInit,
    HostListener,
    ElementRef,
    AfterViewChecked,
    ViewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';

import User from './../../../models/User';
import { UserService } from './../../../services/user.service';
import { ChatsService } from './../../../services/chats.service';
import { AuthService } from './../../../services/auth.service';
import { filter } from 'rxjs/operators';
import Notifications from './../../../models/Notifications';
import Chats from './../../../models/Chats';
import Match from './../../../models/Match';
import { firstValueFrom } from 'rxjs';
import { MatchService } from './../../../services/match.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [DatePipe],
})
export class HeaderComponent implements OnInit, AfterViewChecked {
    user: User = new User();
    sender: User = new User();
    match: Match = new Match();
    lastFiveNot: Notifications[] = [];
    lastFiveMessages: Chats[] = [];
    allMessagesBetweenTwoUsers: Chats[] = [];

    headerVariable = true;
    searchVariable = true;
    challengeDiv = false;
    tournamentCodeDiv = false;
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
    messageStatusForChallenge: boolean;
    tournamentCode = 'NAX5-GH12-JN45-ACAB-FKb3-hjkl-KJks-00pl-GH12-JN45-ACAB';
    copy = 'Copy';
    senderImageForBottomChatUser: string;

    senderUsernameForBottomChat: string;
    messageToBeSent: string;

    senderImages: string[] = [];
    senderImagesForChat: string[] = [];
    formattedTimes: string[] = [];

    @ViewChild('messageContainer') private messageContainer: ElementRef;
    @ViewChild('myText') myText: ElementRef;

    constructor(
        private datePipe: DatePipe,
        private elementRef: ElementRef,
        private authService: AuthService,
        private userService: UserService,
        private chatsService: ChatsService,
        private matchService: MatchService,
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

                this.copy = 'Copy';

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
                            console.log(data.status);
                            if (data.status == 1) {
                                this.statusOfTheMessage = true;
                            }

                            this.userService
                                .getSenderImages(receiverId)
                                .subscribe((images) => {
                                    this.senderImages = images;
                                });
                        });
                    });
                this.lastFiveMessages = [];

                this.chatsService
                    .getAllMessages(this.user.id)
                    .subscribe((response) => {
                        response.forEach((data) => {
                            if (this.user.id == data.sender_id) {
                                const switchId = data.receiver_id;
                                data.receiver_id = data.sender_id;
                                data.sender_id = switchId;
                                data.sender_username = data.receiver_username;
                            }
                            this.lastFiveMessages.push(data);
                        });
                        let groupBySenderId: any = {};
                        this.lastFiveMessages.forEach((message) => {
                            // If this is the first message from this sender, or if this message's id is larger than the previous one stored,
                            // update the stored message for this sender.
                            if (
                                !groupBySenderId[message.sender_id] ||
                                groupBySenderId[message.sender_id].id <
                                    message.id
                            ) {
                                groupBySenderId[message.sender_id] = message;
                            }
                        });

                        this.lastFiveMessages = Object.values(groupBySenderId);

                        this.lastFiveMessages.sort((a, b) => b.id - a.id);

                        this.lastFiveMessages = this.lastFiveMessages.slice(
                            0,
                            5
                        );

                        // Fetch and format images
                        const getSenderImages = async () => {
                            let senderImages = [];
                            for (let data of this.lastFiveMessages) {
                                try {
                                    const images = await firstValueFrom(
                                        this.chatsService.senderImagesForChat(
                                            data.sender_id
                                        )
                                    );
                                    senderImages.push(images);
                                } catch (error) {
                                    console.error(
                                        'Error getting images:',
                                        error
                                    );
                                }
                            }
                            return senderImages;
                        };

                        getSenderImages().then((senderImages) => {
                            this.senderImagesForChat = senderImages;
                        });

                        // Format times
                        this.lastFiveMessages.forEach((data) => {
                            const formattedTime = this.datePipe.transform(
                                data.message_time,
                                'dd.MM.yyyy, HH:mm'
                            );
                            this.formattedTimes.push(formattedTime);
                        });

                        this.chatsService
                            .getMessagesBetweenTwoUsers(
                                this.senderId,
                                this.user.id
                            )
                            .subscribe((response) => {
                                this.allMessagesBetweenTwoUsers = response;
                            });
                    });
            } else {
                this.showBottomChat = false;
            }
        });
        // Retrieve user information when page is refreshed

        this.user = this.authService.getLoggedInUserData();
        this.getUserData(this.user.id);

        this.userService.getUserImageAsObservable().subscribe((image) => {
            this.user.image = image;
        });

        // Change from single-user component

        this.chatsService.showDiv$.subscribe((show) => {
            this.showBottomChat = show;
        });
        // Message user from single-user component

        this.chatsService.getUserToChatWith().subscribe((user) => {
            this.senderImageForBottomChatUser = user.image;
            this.senderId = user.id;
            this.senderUsernameForBottomChat = user.username;
            this.chatsService
                .getMessagesBetweenTwoUsers(this.senderId, this.user.id)
                .subscribe((response) => {
                    this.allMessagesBetweenTwoUsers = response;
                });
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

                    if (data.status == 1) {
                        this.statusOfTheMessage = true;
                    }
                    this.userService
                        .getSenderImages(receiverId)
                        .subscribe((images) => {
                            this.senderImages = images;
                        });
                });
            });

        this.lastFiveMessages = [];
        this.index = parseInt(localStorage.getItem('index'), 10);

        this.chatsService.getAllMessages(this.user.id).subscribe((response) => {
            response.forEach((data) => {
                if (this.user.id == data.sender_id) {
                    const switchId = data.receiver_id;
                    data.receiver_id = data.sender_id;
                    data.sender_id = switchId;
                    data.sender_username = data.receiver_username;
                }
                this.lastFiveMessages.push(data);
            });
            let groupBySenderId: any = {};
            this.lastFiveMessages.forEach((message) => {
                // If this is the first message from this sender, or if this message's id is larger than the previous one stored,
                // update the stored message for this sender.
                if (
                    !groupBySenderId[message.sender_id] ||
                    groupBySenderId[message.sender_id].id < message.id
                ) {
                    groupBySenderId[message.sender_id] = message;
                }
            });

            this.lastFiveMessages = Object.values(groupBySenderId);

            this.lastFiveMessages.sort((a, b) => b.id - a.id);

            this.lastFiveMessages = this.lastFiveMessages.slice(0, 5);

            // Fetch and format images
            const getSenderImages = async () => {
                let senderImages = [];
                for (let data of this.lastFiveMessages) {
                    try {
                        const images = await firstValueFrom(
                            this.chatsService.senderImagesForChat(
                                data.sender_id
                            )
                        );
                        senderImages.push(images);
                    } catch (error) {
                        console.error('Error getting images:', error);
                    }
                }
                return senderImages;
            };

            getSenderImages().then((senderImages) => {
                this.senderImagesForChat = senderImages;
                this.senderImageForBottomChatUser =
                    this.senderImagesForChat[this.index];
            });

            // Format times
            this.lastFiveMessages.forEach((data) => {
                const formattedTime = this.datePipe.transform(
                    data.message_time,
                    'dd.MM.yyyy, HH:mm'
                );
                this.formattedTimes.push(formattedTime);
            });

            this.senderId = this.lastFiveMessages[this.index].sender_id;
            this.senderUsernameForBottomChat =
                this.lastFiveMessages[this.index].sender_username;

            this.chatsService
                .getMessagesBetweenTwoUsers(this.senderId, this.user.id)
                .subscribe((response) => {
                    this.allMessagesBetweenTwoUsers = response;
                    this.showBottomChat =
                        localStorage.getItem('showBottomChat') === 'true';
                });
        });

        this.hideDivWhenChangeRoute();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    // Functions

    scrollToBottom(): void {
        try {
            this.messageContainer.nativeElement.scrollTop =
                this.messageContainer.nativeElement.scrollHeight;
        } catch (err) {}
    }

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
                localStorage.setItem(
                    'showBottomChat',
                    this.showBottomChat.toString()
                );
            });
    }

    sendMessage() {
        if (this.sendingMessage) {
            return;
        }

        // Check if the message to be sent is empty or consists only of whitespace.
        if (!this.messageToBeSent || !this.messageToBeSent.trim()) {
            console.warn('Cannot send an empty message.');
            return;
        }

        this.sendingMessage = true;
        this.chatsService
            .sendMessage(this.user.id, this.senderId, this.messageToBeSent)
            .subscribe({
                next: (response: any) => {
                    this.messageToBeSent = response.message;
                    this.sendingMessage = false;
                    this.index = 0;
                    localStorage.setItem('index', this.index.toString());

                    this.ngOnInit();
                    this.showBottomChat = true;
                },
                error: (error) => {
                    console.error('Error sending message:', error);
                    this.sendingMessage = false;
                },
            });
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
    markMessageAsRead() {
        this.chatsService.markMessagesAsRead(this.user.id).subscribe(() => {
            this.unreadMessagesNumber = 0;
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
    closeBottomChat() {
        this.showBottomChat = !this.showBottomChat;
        localStorage.removeItem('showBottomChat');
    }
    toggleBottomChatHeader() {
        this.showBottomChatHeader = !this.showBottomChatHeader;
    }

    copied() {
        if (this.copy == 'Copy') {
            const range = document.createRange();
            range.selectNodeContents(this.myText.nativeElement);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
        this.copy = 'Copied';
    }
    openChallenge(n: Notifications) {
        if (n.status == 3) {
            this.challengeDiv = true;
            this.userService.getUserById(n.sender_id).subscribe((user) => {
                this.sender = user;
            });
            this.matchService
                .getMatchByNotificationId(n.id)
                .subscribe((result) => {
                    this.match = result;
                });
            localStorage.setItem('nId', n.id.toString());
            this.showDivNot = false;
        } else if (n.status == 4) {
            this.showDivNot = false;
            this.tournamentCodeDiv = true;
        } else {
            this.router.navigate(['/users', n.sender_id]);
        }
    }

    rejectChallenge() {
        let id = parseInt(localStorage.getItem('nId'), 10);
        this.matchService.rejectChallenge(id).subscribe(() => {
            this.challengeDiv = false;
        });
    }

    acceptChallenge() {
        let id = parseInt(localStorage.getItem('nId'), 10);
        this.matchService.acceptChallenge(id).subscribe(() => {
            this.challengeDiv = false;
            this.tournamentCodeDiv = true;
            this.userService
                .sendAcceptedChallengeNotification(this.user.id, this.sender.id)
                .subscribe(() => {});
        });
    }
    closeHiddenDiv() {
        this.challengeDiv = false;
    }
    closeTournamentCode() {
        this.tournamentCodeDiv = false;
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
