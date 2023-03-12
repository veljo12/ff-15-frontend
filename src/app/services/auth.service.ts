import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import User from '../models/User';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private loggedIn: Subject<boolean> = new Subject();

    constructor(private http: HttpClient, private router: Router) {}

    login = (user: User) => {
        return this.http.post('http://localhost:3000/login', user);
    };

    register = (user: User) => {
        return this.http.post('http://localhost:3000/register', user);
    };

    loggedInSuccess = () => {
        //subject
        this.loggedIn.next(true);
    };

    logout = () => {
        localStorage.removeItem('ff-15-token');
        this.loggedIn.next(false);
        this.router.navigateByUrl('');
    };

    getLoggedInSubject = () => {
        return this.loggedIn.asObservable(); //subject
    };

    isLoggedIn = () => {
        if (localStorage.getItem('ff-15-token')) return true;
        return false;
    };
}
