import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
  imports: [CommonModule],
})
export class ErrorMessageComponent {
  @Input() message: string | null = null;
}
