import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { UserService } from './../../../services/user.service';
import { ChatsService } from './../../../services/chats.service';

import User from './../../../models/User';
import Chats from './../../../models/Chats';

import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-all-chats',
    templateUrl: './all-chats.component.html',
    styleUrls: ['./all-chats.component.scss'],
})
export class AllChatsComponent implements OnInit {
    user: User = new User();
    allMessagesForThisUser: Chats[] = [];
    allMessagesBetweenTwoUsers: Chats[] = [];
    senderImagesForChat: string[] = [];

    activeMessage = 0;

    sendingMessage = false;

    senderId: number;

    senderImage: string;
    senderUsername: string;
    messageToBeSent: string;

    @ViewChild('messageContainer') private messageContainer: ElementRef;

    constructor(
        private userService: UserService,
        private chatsService: ChatsService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            if (params['id']) {
                const id = params['id'];
                this.userService.getUserById(id).subscribe((data) => {
                    this.user = data;

                    this.chatsService
                        .getAllMessages(this.user.id)
                        .subscribe((messages) => {
                            messages.forEach((data) => {
                                if (this.user.id == data.sender_id) {
                                    const switchId = data.receiver_id;
                                    data.receiver_id = data.sender_id;
                                    data.sender_id = switchId;
                                    data.sender_username =
                                        data.receiver_username;
                                }
                                this.allMessagesForThisUser.push(data);
                            });
                            let groupBySenderId: any = {};
                            this.allMessagesForThisUser.forEach((message) => {
                                if (
                                    !groupBySenderId[message.sender_id] ||
                                    groupBySenderId[message.sender_id].id <
                                        message.id
                                ) {
                                    groupBySenderId[message.sender_id] =
                                        message;
                                }
                            });
                            this.allMessagesForThisUser =
                                Object.values(groupBySenderId);

                            this.allMessagesForThisUser.sort(
                                (a, b) => b.id - a.id
                            );

                            // Fetch and format images
                            const getSenderImages = async () => {
                                let senderImages = [];
                                for (let data of this.allMessagesForThisUser) {
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
                                this.senderImage = this.senderImagesForChat[0];
                            });
                            this.senderId =
                                this.allMessagesForThisUser[0].sender_id;

                            this.senderUsername =
                                this.allMessagesForThisUser[0].sender_username;

                            console.log(this.senderId);

                            this.chatsService
                                .getMessagesBetweenTwoUsers(
                                    this.senderId,
                                    this.user.id
                                )
                                .subscribe((response) => {
                                    this.allMessagesBetweenTwoUsers = response;
                                });
                        });
                });
            }
        });
    }
    ngAfterViewChecked() {
        this.scrollToBottom();
    }
    // Functions:

    showMessages(index: number) {
        this.senderId = this.allMessagesForThisUser[index].sender_id;
        this.senderImage = this.senderImagesForChat[index];
        this.senderUsername =
            this.allMessagesForThisUser[index].sender_username;

        this.chatsService
            .getMessagesBetweenTwoUsers(this.senderId, this.user.id)
            .subscribe((data) => {
                this.allMessagesBetweenTwoUsers = data;
            });
    }

    scrollToBottom(): void {
        try {
            this.messageContainer.nativeElement.scrollTop =
                this.messageContainer.nativeElement.scrollHeight;
        } catch (err) {}
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
                    this.ngOnInit();

                    this.activeMessage = 0;
                },
                error: (error) => {
                    console.error('Error sending message:', error);
                    this.sendingMessage = false;
                },
            });
    }
}
