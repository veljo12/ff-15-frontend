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
    filteredUsers: User[];
    user: User = new User();

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.userService.getAllUsers().subscribe((data) => {
            this.users = data;

            // Filter out current user and admin
            this.filteredUsers = this.users.filter(
                (u) => u.username !== this.user.username && !u.isAdmin
            );
        });

        this.user = this.authService.getLoggedInUserData();
        this.getUserData(this.user.id);
    }

    getUserData(id: number) {
        this.userService.getUserById(id).subscribe((data) => {
            this.user = data;
        });
    }
}
