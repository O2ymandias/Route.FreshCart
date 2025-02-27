import { DarkModeService } from './../../core/services/dark-mode.service';
import {
  Component,
  computed,
  inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AppTranslationService } from '../../core/services/app-translation.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  public readonly _authService: AuthService = inject(AuthService);
  public readonly _platformId: object = inject(PLATFORM_ID);
  private readonly _flowbiteService: FlowbiteService = inject(FlowbiteService);
  private readonly _wishlistService: WishlistService = inject(WishlistService);
  readonly appTranslationService: AppTranslationService = inject(
    AppTranslationService,
  );
  private readonly _cartService: CartService = inject(CartService);
  private readonly _darkModeService: DarkModeService = inject(DarkModeService);

  userName!: string;
  isLoggedIn!: boolean;
  numberOfItemsInWishlist!: number;
  currentLanguage = computed(() => this.appTranslationService.currentLang());
  numberOfItemsInCart = computed(() => this._cartService.numberOfItems());

  ngOnInit() {
    // Init Flowbite
    this._flowbiteService.loadFlowbite((flowbite) => {});

    if (isPlatformBrowser(this._platformId)) {
      this._authService.isLoggedIn.subscribe(
        (value) => (this.isLoggedIn = value),
      );
      this._authService.userName.subscribe((value) => (this.userName = value));
    }
    // Get the number of items in the wishlist
    this._wishlistService.numberOfItems.subscribe(
      (res) => (this.numberOfItemsInWishlist = res),
    );
  }

  darkModeOn(): void {
    this._darkModeService.DarkModeOn();
  }
  darkModeOff(): void {
    this._darkModeService.DarkModeOff();
  }
}
