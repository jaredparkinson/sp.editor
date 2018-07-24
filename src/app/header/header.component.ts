import { Component, OnInit } from '@angular/core';

import {
  faBars,
  faBookOpen,
  faParagraph,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
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
  constructor() {}

  ngOnInit() {}
}
