import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Navigation } from '../modelsJson/Navigation';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationLoaderService {
  constructor(private navService: NavigationService) {}
}
