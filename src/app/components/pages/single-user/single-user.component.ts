import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import User from './../../../models/User';
import { UserService } from './../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-single-user',
    templateUrl: './single-user.component.html',
    styleUrls: ['./single-user.component.scss'],
})
export class SingleUserComponent implements OnInit {
    constructor(
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private toastrService: ToastrService
    ) {}

    user: User = new User();
    fileData: any;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            if (params['id']) {
                console.log('aaaaaaaa');
                console.log(params);
                const id = params['id'];
                this.userService.getUserById(id).subscribe((data) => {
                    this.user = data;
                    console.log('brit', this.user);
                });
            }
        });
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
        this.userService.uploadImage(formData).subscribe((response: any) => {
            console.log(`ovo je response ${response}`);
            if (response.status === 0) {
                this.userService
                    .addImageForUser(this.user.id, response.fileName)
                    .subscribe((addImageResponse) => {
                        this.toastrService.success('Image uploaded!');
                        this.ngOnInit();
                    });
            }
        });
    }
}
