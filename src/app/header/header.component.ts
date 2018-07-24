import { Component, OnInit } from '@angular/core';

import {
  faBars,
  faBookOpen,
  faListUl,
  faParagraph,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { HelperService } from '../shared/helper.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  faBars = faBars;
  faParagraph = faParagraph;
  faBookOpen = faBookOpen;
  faPlus = faPlus;
  faListUl = faListUl;
  leftPaneNav: HTMLElement;
  constructor(private helperService: HelperService) {
    this.leftPaneNav = document.getElementById('leftPaneNav');
  }

  ngOnInit() {}

  toggleNotes() {
    console.log('test');
  }
  toggleNavigation() {
    console.log('test');
    this.helperService.toggleDisplay('leftPaneNav', 'grid', 'none');
  }
}
