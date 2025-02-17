import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IUserData } from '../../shared/interfaces/iuser-data';
import { CommonModule, isPlatformBrowser, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  public readonly _authService: AuthService = inject(AuthService);
  public readonly _platformId: object = inject(PLATFORM_ID);

  userName!: string;
  isLoggedIn!: boolean;

  userNameSubscription: Subscription | null = null;
  isLoggedInSubscription: Subscription | null = null;

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this.isLoggedInSubscription = this._authService.isLoggedIn.subscribe(
        (value) => (this.isLoggedIn = value),
      );
      this.userNameSubscription = this._authService.userName.subscribe(
        (value) => (this.userName = value),
      );
    }
  }

  ngOnDestroy(): void {
    this.userNameSubscription?.unsubscribe();
    this.isLoggedInSubscription?.unsubscribe();
  }

  darkModeOn(): void {
    document.documentElement.classList.add('dark');
  }
  darkModeOff(): void {
    document.documentElement.classList.remove('dark');
  }
}
