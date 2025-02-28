import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-pagination',
  imports: [TranslatePipe],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  pageNumber: InputSignal<number> = input.required();
  pageChange: OutputEmitterRef<number> = output<number>();

  moveToPage(pageNumber: number): void {
    this.pageChange.emit(pageNumber);
  }
}
