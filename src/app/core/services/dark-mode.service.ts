import { isPlatformBrowser } from '@angular/common';
import {
  Inject,
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  constructor(
    rendererFactory2: RendererFactory2,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    // Creating a renderer2 instance
    this.renderer2 = rendererFactory2.createRenderer(null, null);

    if (isPlatformBrowser(platformId)) {
      const theme = localStorage.getItem('theme') ?? 'light';
      if (theme === 'dark') this.DarkModeOn();
      else this.DarkModeOff();
    }
  }

  renderer2: Renderer2;

  DarkModeOn(): void {
    this.renderer2.addClass(document.documentElement, 'dark');
    localStorage.setItem('theme', 'dark');
  }

  DarkModeOff(): void {
    this.renderer2.removeClass(document.documentElement, 'dark');
    localStorage.setItem('theme', 'light');
  }
}
