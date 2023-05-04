import { Component, OnInit } from '@angular/core';
import { UserService } from './../../../services/user.service';
import { AuthService } from './../../../services/auth.service';
import User from './../../../models/User';
import Notifications from './../../../models/Notifications';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
    user: User = new User();
    notifications: Notifications[] = [];
    notificationImages: string[] = [];

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.user = this.authService.getLoggedInUserData();
        this.userService.getUserById(this.user.id).subscribe((data) => {
            this.user = data;
        });

        this.userService
            .getAllNotifications(this.user.id)
            .subscribe((notifications) => {
                this.notifications = notifications;
                this.notifications.forEach((data) => {
                    const receiverId = data.receiver_id;
                    this.userService
                        .getAllNotificationImages(receiverId)
                        .subscribe((images) => {
                            this.notificationImages = images;
                            console.log(this.notificationImages);
                        });
                });
            });
    }
}
