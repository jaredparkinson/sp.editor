import * as _ from 'underscore';
import { BookConvert } from './BookCovert';
export class UrlBuilder {
  private books = [
    ['Genesis', 'Gen.', 'gen'],
    ['Exodus', 'Ex.', 'ex'],
    ['Leviticus', 'Lev.', 'lev '],
    ['Numbers', 'Num.', 'num'],
    ['Deuteronomy', 'Deut.', 'deut'],
    ['Joshua', 'Josh.', 'josh'],
    ['Judges', 'Judg.', 'judg'],
    ['Ruth', 'Ruth', 'ruth'],
    ['1 Samuel', '1 Sam.', '1-sam'],
    ['2 Samuel', '2 Sam.', '2-sam'],
    ['1 Kings', '1 Kgs.', '1-kgs'],
    ['2 Kings', '2 Kgs.', '2-kgs'],
    ['1 Chronicles', '1 Chr.', '1-chr'],
    ['1 Chronicles', '1 Chron.', '2-chr'],
    ['2 Chronicles', '2 Chr.', '1-chr'],
    ['2 Chronicles', '2 Chron.', '2-chr'],
    ['Ezra', 'Ezra', 'ezra'],
    ['Nehemiah', 'Neh.', 'neh'],
    ['Esther', 'Esth.', 'esth'],
    ['Job', 'Job', 'job'],
    ['Psalms', 'Ps.', 'ps'],
    ['Psalm', 'Ps.', 'ps'],
    ['Proverbs', 'Prov.', 'prov'],
    ['Ecclesiastes', 'Eccl.', 'eccl'],
    ['Song of Solomon', 'Song', 'song'],
    ['Isaiah', 'Isa.', 'isa'],
    ['Jeremiah', 'Jer.', 'jer'],
    ['Lamentations', 'Lam.', 'lam'],
    ['Ezekiel', 'Ezek.', 'ezek'],
    ['Daniel', 'Dan.', 'dan'],
    ['Hosea', 'Hosea', 'hosea'],
    ['Joel', 'Joel', 'joel'],
    ['Amos', 'Amos', 'amos'],
    ['Obadiah', 'Obad.', 'obad'],
    ['Jonah', 'Jonah', 'jonah'],
    ['Micah', 'Micah', 'micah'],
    ['Nahum', 'Nahum', 'nahum'],
    ['Habakkuk', 'Hab.', 'hab'],
    ['Habbakuk', 'Hab.', 'hab'],
    ['Zephaniah', 'Zeph.', 'zeph'],
    ['Haggai', 'Hag.', 'hag'],
    ['Hagai', 'Hag.', 'hag'],
    ['Zechariah', 'Zech.', 'zech'],
    ['Malachi', 'Mal.', 'mal'],
    ['Matthew', 'matthew', 'Matt.', 'matt'],
    ['Mark', 'Mark', 'mark'],
    ['Luke', 'Luke', 'luke'],
    ['John', 'John', 'john'],
    ['Acts', 'Acts', 'acts'],
    ['Romans', 'Rom.', 'rom'],
    ['1 Corinthians', '1 Cor.', '1-cor'],
    ['2 Corinthians', '2 Cor.', '2-cor'],
    ['Galatians', 'Gal.', 'gal'],
    ['Ephesians', 'Eph.', 'eph'],
    ['Philippians', 'Philip.', 'philip'],
    ['Colossians', 'Col.', 'col'],
    ['1 Thessalonians', '1 Thes.', '1-thes'],
    ['2 Thessalonians', '2 Thes.', '2-thes'],
    ['1 Timothy', '1 Tim.', '1-tim'],
    ['2 Timothy', '2 Tim.', '2-tim'],
    ['Titus', 'Titus', 'titus'],
    ['Philemon', 'Philem.', 'philem'],
    ['Hebrews', 'Heb.', 'heb'],
    ['James', 'James', 'james'],
    ['1 Peter', '1 Pet.', '1-pet'],
    ['1 Peter', '1 Pt.', '1-pet'],
    ['2 Peter', '2 Pet.', '2-pet'],
    ['2 Peter', '2 Pt.', '2-pet'],
    ['1 John', '1 Jn.', '1-jn'],
    ['2 John', '2 Jn.', '2-jn'],
    ['3 John', '3 Jn.', '3-jn'],
    ['Jude', 'Jude', 'jude'],
    ['Revelations', 'Rev.', 'rev'],
    ['1 Nephi', '1 Ne.', '1 Ne', '1-ne'],
    ['2 Nephi', '2 Ne.', '2 Ne', '2-ne'],
    ['Jacob', 'Jacob', 'jacob'],
    ['Enos', 'Enos', 'enos'],
    ['Jarom', 'Jarom', 'jarom'],
    ['Omni', 'Omni', 'omni'],
    ['Words of Mormon', 'W of M', 'w-of-m', 'Words of Mormon', 'WofM'],
    ['Mosiah', 'mosiah', 'Mosiah'],
    ['Alma', 'Alma', 'alma'],
    ['Helaman', 'Hel.', 'hel'],
    ['3 Nephi', '3 Ne.', '3 Ne', '3-ne'],
    ['4 Nephi', '4 Ne.', '4 Ne', '4-ne'],
    ['Mormon', 'Morm.', 'morm'],
    ['Ether', 'Ether', 'ether'],
    ['Moroni', 'Moro.', 'moro'],
    ['bofm'],
    ['Doctrine and Covenants', 'DC', 'Doctrine and Covenants', 'D&C', 'dc'],
    ['Official Declaration', 'OD', 'od'],
    ['Moses', 'pgp', 'Moses', 'moses'],
    ['Abraham', 'Abr.', 'abr'],
    [
      'Joseph Smith— Matthew',
      'JS—M',
      'js-m',
      'Joseph Smith–Matthew',
      'JS–M',
      'js-m',
      'Joseph Smith-Matthew',
      'JS-M',
      'js-m',
      'Joseph Smith Matthew',
      'JSM',
      'js-m'
    ],
    [
      'Joseph Smith—History',
      'JS—H',
      'js-h',
      'Joseph Smith–History',
      'JS–H',
      'js-h',
      'Joseph Smith-History',
      'JS-H',
      'js-h',
      'Joseph Smith History',
      'JSH',
      'js-h'
    ],
    [
      'Articles of Faith',
      'A of F',
      'a-of-f',
      'Articles of Faith',
      'AofF',
      'a-of-f'
    ]
  ];
  public bookConvert: BookConvert[] = [];

  constructor() {
    _.each(this.books, book => {
      this.bookConvert.push(new BookConvert(book));
    });

    // console.log(this.bookConvert.length);
  }

  public urlParser(url: string): string {
    // console.log('asdfklajsdf');
    let outUrl = '';
    console.log(url);

    _.each(this.bookConvert, book => {
      // console.log(book.names);

      _.each(book.names, b => {
        if (url.includes(b)) {
          outUrl = url.replace(b, book.convertTo);
          console.log(outUrl);
        }
      });
    });
    return outUrl;
  }
}
