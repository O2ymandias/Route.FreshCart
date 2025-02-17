import { Component, input, InputSignal } from '@angular/core';
import { ICategory } from '../../interfaces/icategory';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-category-slider',
  imports: [Carousel, ButtonModule],
  templateUrl: './category-slider.component.html',
  styleUrl: './category-slider.component.scss',
})
export class CategorySliderComponent {
  categories: InputSignal<ICategory[]> = input.required();

  responsiveOptions = [
    {
      breakpoint: '1280px',
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '640px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
}
