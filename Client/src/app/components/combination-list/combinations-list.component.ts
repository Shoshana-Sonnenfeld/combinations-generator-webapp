import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Combination } from '../../core/models/domain/combination.model';

@Component({
  selector: 'app-combinations-list',
  standalone: true,
  templateUrl: './combinations-list.component.html',
  styleUrls: ['./combinations-list.component.scss'],
  imports: [CommonModule],
})
export class CombinationsListComponent {
  @Input() combinations: Combination[] | null = null;
}
