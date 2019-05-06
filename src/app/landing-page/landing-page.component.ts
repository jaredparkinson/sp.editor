import { Component, OnInit } from '@angular/core';

import { ChapterService } from '../services/chapter.service';
import { EditService } from '../services/EditService';
import { HeaderService } from '../services/header.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  public constructor(
    public chapterService: ChapterService,
    public editService: EditService,
    public headerService: HeaderService,
  ) {}

  public ngOnInit(): void {
    // this.dataService.chapter2 = new Chapter();
    this.headerService.pageName = 'One In Thine Hand';
    this.headerService.pageShortName = 'One In Thine Hand';
  }
}
