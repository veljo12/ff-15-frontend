import { Component, OnInit } from '@angular/core';
import User from './../../../models/User';
import { UserService } from './../../../services/user.service';
import { AuthService } from './../../../services/auth.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
    users: User[] = [];
    withoutAdmin: User[];
    filteredUsers: User[];
    user: User = new User();
    isLoggedIn = false;

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.userService.getAllUsers().subscribe((data) => {
            this.users = data;

            // Without admin
            this.withoutAdmin = this.users.filter((u) => !u.isAdmin);

            // Filter out current user and admin
            this.filteredUsers = this.users.filter(
                (u) => u.username !== this.user.username && !u.isAdmin
            );
        });
        this.isLoggedIn = this.authService.isLoggedIn();

        if (this.isLoggedIn) this.user = this.authService.getLoggedInUserData();
        this.getUserData(this.user.id);
    }

    getUserData(id: number) {
        this.userService.getUserById(id).subscribe((data) => {
            this.user = data;
        });
    }
}
