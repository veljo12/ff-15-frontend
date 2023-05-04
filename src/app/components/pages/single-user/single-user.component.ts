import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import User from './../../../models/User';
import { UserService } from './../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../../services/auth.service';

@Component({
    selector: 'app-single-user',
    templateUrl: './single-user.component.html',
    styleUrls: ['./single-user.component.scss'],
})
export class SingleUserComponent implements OnInit {
    constructor(
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private toastrService: ToastrService
    ) {}

    user: User = new User();
    loggedUser: User = new User();
    showButtons: boolean;
    fileData: any;
    status: string;
    sender: boolean;
    showDiv = false;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            if (params['id']) {
                const id = params['id'];
                this.userService.getUserById(id).subscribe((data) => {
                    this.user = data;
                    this.loggedUser = this.authService.getLoggedInUserData();
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
    }

    toggleDiv() {
        this.showDiv = !this.showDiv;
    }
    closeHiddenDiv() {
        this.showDiv = false;
    }

    uploadCoverForUser(ev: any) {
        console.log(`OVO JE ev ${ev}`);
        this.fileData = ev.target.files[0];
        let formData = new FormData();

        formData.append('img', this.fileData);
        this.userService.uploadImage(formData).subscribe((response: any) => {
            console.log(`ovo je response ${response}`);
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
        console.log(`OVO JE ev ${ev}`);
        this.fileData = ev.target.files[0];
        let formData = new FormData();
        formData.append('img', this.fileData);
        console.log('SLIKA', this.fileData);

        this.userService.uploadImage(formData).subscribe((response: any) => {
            console.log(JSON.stringify(response));

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
                    .subscribe((notResponse) => {
                        console.log('OVO JE NOT RESPONSE', notResponse);
                    });
                this.ngOnInit();
            });
    }
}
