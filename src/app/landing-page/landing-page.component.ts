import { Component, OnInit } from '@angular/core';
import { Chapter2 } from '../modelsJson/Chapter';
import { ChapterService } from '../services/chapter.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  constructor(public chapterService: ChapterService) {}

  ngOnInit() {
    this.chapterService.chapter2 = new Chapter2();
  }
}
