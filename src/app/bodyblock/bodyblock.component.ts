import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-bodyblock',
  templateUrl: './bodyblock.component.html',
  styleUrls: ['./bodyblock.component.scss']
})
export class BodyblockComponent implements OnInit, OnChanges {
  constructor(
    private fileManager: NavigationService,
    private httpClient: HttpClient,
    // private activatedRoute: ActivatedRoute,
    private navService: NavigationService
  ) {}

  ngOnInit() {}
  ngOnChanges() {
    console.log('test');
  }
}
