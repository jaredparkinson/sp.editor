import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { find } from 'lodash';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  public pageNumber: number;
  public searchResults: Array<{ id: string; text: string }> = [];
  private currentSearch: string = '';
  // public verses: Array<{ id: string; text: string }>;
  private lunrResults: lunr.Index.Result[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService,
    private httpClient: HttpClient,
  ) {}
  public getSearchText(id: string) {
    return find(this.searchService.verses, v => {
      return v.id === id;
    }).text;
  }

  public ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const search: string = params['search'];
      const pageNumber: number = params['pageNumber'];
      console.log(pageNumber);

      if (search === this.currentSearch) {
        this.searchPagination(pageNumber ? pageNumber : 0);
      } else {
        this.currentSearch = search;
        this.searchService
          .search(search)
          .then(searchResults => {
            this.lunrResults = searchResults;
            this.searchPagination(pageNumber ? pageNumber : 0);
          })
          .catch(() => {
            this.lunrResults = [];
            this.searchResults = [];
          });
      }
    });
  }
  public searchPagination(pageNumber: number = 0) {
    this.searchResults = [];
    this.pageNumber = pageNumber;

    const slice = this.pageNumber * 100;

    this.lunrResults
      .slice(this.pageNumber * 100, slice + 100)
      .forEach(searchResult => {
        this.searchResults.push(
          find(this.searchService.verses, v => {
            return v.id === searchResult.ref;
          }),
        );
      });
    console.log(this.searchResults.length);
  }
}
