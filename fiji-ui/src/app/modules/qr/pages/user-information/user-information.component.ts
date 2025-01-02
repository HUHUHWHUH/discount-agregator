import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  standalone: true,
  styleUrls: ['./user-information.component.scss']
})
export class UserInformationComponent implements OnInit {
  email: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.email = params['email'];
    });
  }
}
