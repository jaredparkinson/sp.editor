import { Component, Input, OnInit } from '@angular/core';
import { Navigation } from '../../modelsJson/Chapter';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  @Input() public navigation: Navigation;
  constructor() {}

  ngOnInit() {}
}
