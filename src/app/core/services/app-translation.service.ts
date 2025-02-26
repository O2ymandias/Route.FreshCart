import { isPlatformBrowser } from '@angular/common';
import {
  Inject,
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
  signal,
  WritableSignal,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AppTranslationService {
  constructor(
    private readonly _translateService: TranslateService,
    @Inject(PLATFORM_ID) private readonly _platformId: object,
    private readonly _rendererFactory2: RendererFactory2,
  ) {
    // Creating a renderer2 instance
    this.renderer2 = this._rendererFactory2.createRenderer(null, null);

    // Setting fallback language
    this._translateService.setDefaultLang(this.currentLang());

    // Setting the language to use
    if (isPlatformBrowser(this._platformId)) {
      // Getting the language from localStorage
      const lang: string = localStorage.getItem('lang') ?? this.currentLang();

      this.updateLanguage(lang);
    }
  }

  renderer2: Renderer2;
  currentLang: WritableSignal<string> = signal('en');

  changePageDirection(): void {
    switch (this.currentLang()) {
      case 'ar':
        this.renderer2.setAttribute(document.documentElement, 'dir', 'rtl');
        this.renderer2.setAttribute(document.documentElement, 'lang', 'ar');
        break;
      case 'en':
        this.renderer2.setAttribute(document.documentElement, 'dir', 'ltr');
        this.renderer2.setAttribute(document.documentElement, 'lang', 'en');
        break;
    }
  }

  changeLanguage(language: string): void {
    // Setting the new language on localStorage
    localStorage.setItem('lang', language);

    this.updateLanguage(language);
  }

  private updateLanguage(language: string): void {
    // Updating the current language
    this.currentLang.set(language);

    // Setting the language to translate
    this._translateService.use(language);

    // Changing the page direction
    this.changePageDirection();
  }
}
