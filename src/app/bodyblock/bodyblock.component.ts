import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../navigation.service';
import { ChapterService } from '../shared/chapter.service';

@Component({
  selector: 'app-bodyblock',
  templateUrl: './bodyblock.component.html',
  styleUrls: ['./bodyblock.component.scss']
})
export class BodyblockComponent implements OnInit {
  constructor(
    private fileManager: NavigationService,
    private httpClient: HttpClient,
    // private activatedRoute: ActivatedRoute,
    private chapterService: ChapterService,
    private navService: NavigationService
  ) {}

  ngOnInit() {}
}
