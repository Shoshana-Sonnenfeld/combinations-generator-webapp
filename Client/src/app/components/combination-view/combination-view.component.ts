import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Combination } from '../../core/models/domain/combination.model';
import { NextPermutation } from '../../core/models/domain/next-permutation.model';

@Component({
  selector: 'app-combination-view',
  standalone: true,
  templateUrl: './combination-view.component.html',
  styleUrls: ['./combination-view.component.scss'],
  imports: [CommonModule],
})
export class CombinationViewComponent {
  @Input() combination: NextPermutation | null = null;
}
