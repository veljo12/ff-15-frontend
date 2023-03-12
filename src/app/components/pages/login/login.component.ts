import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import User from './../../../models/User';
import { AuthService } from './../../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    user: User = new User();

    constructor(
        private authService: AuthService,
        private tostrService: ToastrService,
        private router: Router
    ) {}
    ngOnInit(): void {}

    login() {
        if (!this.user.username || !this.user.username) {
            this.tostrService.error('Please insert all details!');
            return;
        } else {
            this.authService.login(this.user).subscribe((data: any) => {
                if (data.success) {
                    localStorage.setItem('ff-15-token', data.token);
                    this.authService.loggedInSuccess();
                    this.tostrService.success('Logged in!');
                    this.router.navigateByUrl('');
                } else {
                    this.tostrService.error('Not valid credentials!');
                }
            });
        }
    }
}
