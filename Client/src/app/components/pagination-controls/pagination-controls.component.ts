import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination-controls',
  standalone: true,
  templateUrl: './pagination-controls.component.html',
  styleUrls: ['./pagination-controls.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class PaginationControlsComponent {
  @Input() hasNext: boolean = false;
  @Input() hasPrevious: boolean = false;
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;

  @Output() nextPage = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<void>();
  @Output() firstPage = new EventEmitter<void>();
  @Output() lastPage = new EventEmitter<void>();
  @Output() goToPage = new EventEmitter<number>();

  targetPage: number = 1;

  goToNextPage(): void {
    if (this.hasNext) {
      this.nextPage.emit();
    }
  }

  goToPreviousPage(): void {
    if (this.hasPrevious) {
      this.previousPage.emit();
    }
  }

  goToFirstPage(): void {
    if (this.currentPage > 1) {
      this.firstPage.emit();
    }
  }

  goToLastPage(): void {
    if (this.currentPage < this.totalPages) {
      this.lastPage.emit();
    }
  }

  goToSpecificPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.goToPage.emit(page);
    } else {
      console.warn(`Invalid page number: ${page}`);
    }
  }
}
