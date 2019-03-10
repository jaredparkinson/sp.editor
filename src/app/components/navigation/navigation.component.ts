import { Component, Input, OnInit } from '@angular/core';
import { Navigation } from '../../modelsJson/Chapter';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  @Input() public navigation: Navigation;
  @Input() public navigations: Navigation[];
  constructor(public navigationService: NavigationService) {}

  ngOnInit() {}
}
