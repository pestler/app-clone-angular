import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { donatorsMock } from '../../../../core/mocks/donators.mock';

@Component({
  selector: 'app-donators',
  imports: [NgTemplateOutlet],
  templateUrl: './donators.component.html',
  styleUrl: './donators.component.scss',
})
export class DonatorsComponent {
  donators = donatorsMock;
}
