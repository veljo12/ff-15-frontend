import { Component, OnInit } from '@angular/core';
import { MatchService } from './../../../services/match.service';
import Match from './../../../models/Match';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    matches: Match[] = [];
    constructor(private matchService: MatchService) {}
    ngOnInit(): void {
        this.matchService.getAllMatches().subscribe((data) => {
            this.matches = data;
        });
    }
    user1(m: Match) {
        this.matchService.user1Win(m.id).subscribe(() => {
            console.log('uspesno');
            this.ngOnInit();
        });
    }
    user2(m: Match) {
        this.matchService.user2Win(m.id).subscribe(() => {
            console.log('uspesno');
            this.ngOnInit();
        });
    }
}
