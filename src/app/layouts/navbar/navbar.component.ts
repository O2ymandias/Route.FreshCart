import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule, isPlatformBrowser, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  public readonly _authService: AuthService = inject(AuthService);
  public readonly _platformId: object = inject(PLATFORM_ID);
  private readonly _flowbiteService: FlowbiteService = inject(FlowbiteService);
  private readonly _wishlistService: WishlistService = inject(WishlistService);
  private readonly _cartService: CartService = inject(CartService);

  userName!: string;
  isLoggedIn!: boolean;
  numberOfItemsInWishlist!: number;

  userNameSubscription: Subscription | null = null;
  isLoggedInSubscription: Subscription | null = null;

  ngOnInit() {
    // Init Flowbite
    this._flowbiteService.loadFlowbite((flowbite) => {});

    if (isPlatformBrowser(this._platformId)) {
      this.isLoggedInSubscription = this._authService.isLoggedIn.subscribe(
        (value) => (this.isLoggedIn = value),
      );
      this.userNameSubscription = this._authService.userName.subscribe(
        (value) => (this.userName = value),
      );
    }
    // Get the number of items in the wishlist
    this._wishlistService.numberOfItems.subscribe(
      (res) => (this.numberOfItemsInWishlist = res),
    );
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
