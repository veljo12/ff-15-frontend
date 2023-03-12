import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../services/auth.service';
import User from './../../../models/User';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    user: User = new User();

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastrService: ToastrService
    ) {}

    ngOnInit(): void {}

    register() {
        if (!this.user.username || !this.user.username) {
            this.toastrService.error('Please insert all data!');
            return;
        }

        if (this.user.password !== this.user.confirmPassword) {
            this.toastrService.error('Passwords do not match!');
            return;
        }

        this.authService.register(this.user).subscribe((data: any) => {
            if (data.success) {
                this.toastrService.success('Registered successfully!');
                localStorage.setItem('ff-15-token', data.token);
                this.router.navigateByUrl('');
            } else {
                this.toastrService.error('Error while registering!');
            }
        });
    }
}
