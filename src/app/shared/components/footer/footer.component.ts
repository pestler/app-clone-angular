import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DonatorsComponent } from './donators/donators.component';
import { FOOTER_SECTIONS, FooterSection, SOCIAL_LINKS } from './footer-links';

@Component({
  selector: 'app-footer',
  imports: [DatePipe, CommonModule, DonatorsComponent, MatButtonModule, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  sections: FooterSection[] = FOOTER_SECTIONS;
  socials = SOCIAL_LINKS;
  today = new Date();
}
