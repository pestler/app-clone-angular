import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DonatorsService } from './donators.service';

@Component({
  selector: 'app-donators',
  imports: [NgTemplateOutlet, AsyncPipe],
  templateUrl: './donators.component.html',
  styleUrl: './donators.component.scss',
})
export class DonatorsComponent {
  private readonly donatorsService = inject(DonatorsService);
  donators$ = this.donatorsService.getDonators();
}
