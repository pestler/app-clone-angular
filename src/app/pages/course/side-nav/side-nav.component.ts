import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { sideNavItems, SideNavProps } from './side-nav.data';

@Component({
  selector: 'app-side-nav',
  imports: [MatIconModule, NgStyle],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {
  items: SideNavProps[] = sideNavItems;
}
