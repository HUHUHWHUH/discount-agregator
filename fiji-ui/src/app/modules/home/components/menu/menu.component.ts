import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthenticationService} from '../../../../services/auth/services/authentication.service';
import {CommonModule, DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  isUserAuthenticated: boolean = true;
  userName: string | null | undefined = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getAuthStatus();
    //this.isUserAuthenticated = false
    //console.log(this.userName, 'isUserAuthenticated:', this.isUserAuthenticated);
    this.userName = this.authService.getUserName()?.split(" ")[0];

    const linkColor = this.document.querySelectorAll('.nav-link');
    linkColor.forEach(link => {
      if (typeof window !== 'undefined' && window.location.href.endsWith(link.getAttribute('href') || '')) {
        this.renderer.addClass(link, 'active');
      }
      this.renderer.listen(link, 'click', () => {
        linkColor.forEach(l => this.renderer.removeClass(l, 'active'));
        this.renderer.addClass(link, 'active');
      });
    });
  }

  login() {
    this.router.navigate(["/auth/login"]);
  }

  async logout() {
    // await this.keycloakService.logout();
  }

  profile() {
    this.router.navigate(["/profile"]);
  }
}
