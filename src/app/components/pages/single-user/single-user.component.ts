import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import User from './../../../models/User';
import Games from './../../../models/Games';
import { UserService } from './../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../../services/auth.service';
import { ChatsService } from './../../../services/chats.service';
import { GamesService } from './../../../services/games.service';
import { MatchService } from './../../../services/match.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-single-user',
    templateUrl: './single-user.component.html',
    styleUrls: ['./single-user.component.scss'],
})
export class SingleUserComponent implements OnInit {
    constructor(
        private userService: UserService,
        private gamesService: GamesService,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private toastrService: ToastrService,
        private chatService: ChatsService,
        private matchService: MatchService
    ) {}

    user: User = new User();
    games: Games[] = [];
    loggedUser: User = new User();

    form: FormGroup;

    tokens: number;

    loggerUserImage: string;
    showButtons: boolean;
    fileData: any;
    status: string;
    sender: boolean;
    nameOfTheGame = 'Select Game';

    showDiv = false;
    isShrink = false;
    challengeDiv = false;
    selectGameDropdown = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            if (params['id']) {
                const id = params['id'];
                this.userService.getUserById(id).subscribe((data) => {
                    this.user = data;

                    this.loggedUser = this.authService.getLoggedInUserData();
                    this.userService
                        .getUserById(this.loggedUser.id)
                        .subscribe((data) => {
                            this.loggedUser = data;
                        });

                    this.showButtons = this.loggedUser.id == this.user.id;
                    this.userService
                        .checkFriendshipStatus(this.user.id, this.loggedUser.id)
                        .subscribe((response: any) => {
                            this.status = response.status;
                            this.sender =
                                response.sender_id == this.loggedUser.id;
                        });
                });
            }
        });
        this.gamesService.getAllGames().subscribe((response) => {
            this.games = response;
        });
    }
    chatWithUser() {
        this.chatService.setUserToChatWith(this.user);
        this.chatService.showDiv(true);
    }

    toggleDiv() {
        this.showDiv = !this.showDiv;
    }
    closeHiddenDiv() {
        this.showDiv = false;
    }

    uploadCoverForUser(ev: any) {
        this.fileData = ev.target.files[0];
        let formData = new FormData();

        formData.append('img', this.fileData);
        this.userService.uploadImage(formData).subscribe((response: any) => {
            if (response.status === 0) {
                this.userService
                    .addCoverForUser(this.user.id, response.fileName)
                    .subscribe((addImageResponse) => {
                        this.toastrService.success('Cover uploaded!');
                        this.ngOnInit();
                    });
            }
        });
    }

    uploadImageForUser(ev: any) {
        this.fileData = ev.target.files[0];
        let formData = new FormData();
        formData.append('img', this.fileData);

        this.userService.uploadImage(formData).subscribe((response: any) => {
            if (response.status === 0) {
                this.userService
                    .addImageForUser(this.user.id, response.fileName)
                    .subscribe((addImageResponse) => {
                        this.toastrService.success('Image uploaded!');
                        this.userService.updateUserImage(response.fileName);
                        this.ngOnInit();
                    });
            }
        });
    }

    sendFriendRequest() {
        this.userService
            .sendFriendRequest(this.loggedUser.id, this.user.id)
            .subscribe((response) => {
                this.sender = response.senderId == this.loggedUser.id;
                this.toastrService.success(
                    'The friend request was successfully sent.'
                );
                this.userService
                    .sendFriendRequestNotification(
                        this.loggedUser.id,
                        response.receiverId
                    )
                    .subscribe();

                this.ngOnInit();
            });
    }

    cancelFriendRequest() {
        this.userService
            .cancelFriendRequest(this.loggedUser.id, this.user.id)
            .subscribe((response) => {
                this.userService
                    .deleteFriendRequestNotifications(
                        this.loggedUser.id,
                        this.user.id
                    )
                    .subscribe();
                this.showDiv = false;

                this.ngOnInit();
            });
    }

    acceptFriendRequest() {
        this.userService
            .acceptFriendRequest(this.loggedUser.id, this.user.id)
            .subscribe((response) => {
                this.userService
                    .sendAcceptedFriendRequestNotification(
                        this.loggedUser.id,
                        this.user.id
                    )
                    .subscribe((notResponse) => {});
                this.ngOnInit();
            });
    }

    challenge() {
        if (this.nameOfTheGame != 'Select Game' && this.tokens > 0) {
            this.matchService
                .addNewMatch(
                    this.loggedUser.id,
                    this.user.id,
                    this.nameOfTheGame,
                    this.tokens
                )
                .subscribe(() => {});

            this.challengeDiv = false;
            this.tokens = null;
            this.nameOfTheGame = 'Select Game';
            this.toastrService.success('Challenge sent successfully!');
        } else {
            this.challengeDiv = false;
            this.tokens = null;
            this.nameOfTheGame = 'Select Game';
            this.toastrService.error(
                'Please specify both the game and the stake to proceed...'
            );
        }
    }

    numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    shrinkElement() {
        this.isShrink = true;
    }

    resetElement() {
        this.isShrink = false;
    }
    cancelChalenge() {
        this.challengeDiv = false;
        this.nameOfTheGame = 'Select Game';
    }
    toggleGameDropdown() {
        this.selectGameDropdown = !this.selectGameDropdown;
    }
    challengePlayer() {
        this.challengeDiv = !this.challengeDiv;
    }
    selectGame(index: number) {
        this.nameOfTheGame = this.games[index].name_of_the_game;
        this.selectGameDropdown = false;
    }
}
