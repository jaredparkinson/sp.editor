import * as lodash from 'lodash';
import { browser, by, element } from 'protractor';
// import * as _ from 'underscore';
import { UrlBuilder } from '../src/app/files/UrlBuilder';
import { AngularElectronPage } from './app.po';
import { UrlData } from './UrlData';
describe('sp-editor App', () => {
  let page: AngularElectronPage;

  beforeEach(() => {
    page = new AngularElectronPage();
  });

  // it('should display message saying App works !', () => {
  //   page.navigateTo('/');
  //   expect(element(by.tagName('header')).getText()).toMatch(
  //     'The Holy Bible Containing the Old and New Testaments The ' +
  //       'Book of Mormon Another Testament of Jesus Christ The Doctrine ' +
  //       'and Covenants of The Chruch of Jesus Christ of Latter-day Saints The Pearl of Great Price'
  //   );
  // });

  it('Natural text should produce the correct urls', () => {
    const urlBuilder = new UrlBuilder();

    const urlData = new UrlData();
    lodash.each(urlData.urls, url => {
      expect(urlBuilder.urlParser(url[0]).toLowerCase()).toMatch(url[1]);
    });

    //   expect(urlBuilder.urlParser('1 Nephi 1:1 (1)')).toMatch('1-ne/1.1.1');
    //   expect(urlBuilder.urlParser('Abraham 2:9-11, 15-16, 23 (9-24)')).toMatch(
    //     'abr/2.9-11,15-16,23.9-24'
    //   );
    //   expect(urlBuilder.urlParser('Abr 2:9–11, 15–16, 23 (9–24)')).toMatch(
    //     'abr/2.9-11,15-16,23.9-24'
    //   );

    //   expect(urlBuilder.urlParser('Ex. 24:13 ')).toMatch('ex/24.13');
    //   expect(urlBuilder.urlParser('Ex 24:13 ')).toMatch('ex/24.13');
    //   expect(urlBuilder.urlParser('Exodus 28:1')).toMatch('ex/28.1');
    //   expect(urlBuilder.urlParser('Num. 4:12, 47')).toMatch('num/4.12,47');
    //   expect(urlBuilder.urlParser('Num 4:12, 47')).toMatch('num/4.12,47');
    //   expect(urlBuilder.urlParser('Numbers 4:12, 47')).toMatch('num/4.12,47');
    //   expect(urlBuilder.urlParser('Hosea 12:10 (9–11)')).toMatch(
    //     'hosea/12.10.9-11'
    //   );
    //   expect(urlBuilder.urlParser('Hosea 12:10 (9-11)')).toMatch(
    //     'hosea/12.10.9-11'
    //   );
    //   expect(urlBuilder.urlParser('Acts 1:25')).toMatch('acts/1.25');
    //   expect(urlBuilder.urlParser('1 Ne. 9:3–4')).toMatch('1-ne/9.3-4');
    //   expect(urlBuilder.urlParser('1 Nephi 9:3–4')).toMatch('1-ne/9.3-4');
    //   expect(urlBuilder.urlParser('1 Ne. 9:3-4')).toMatch('1-ne/9.3-4');
    //   expect(urlBuilder.urlParser('1 Nephi 9:3-4')).toMatch('1-ne/9.3-4');
    //   expect(urlBuilder.urlParser('3 Ne 10:19')).toMatch('3-ne/10.19');
    // });
  });
});
