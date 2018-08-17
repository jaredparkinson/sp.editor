import { Book } from './Book';

export class NavLinks {
  // public link: string;
  // public paras: string[] = [];

  // constructor(link: string) {
  //   this.paras = link.replace('.html', '').split('/');

  //   while (this.paras.length > 2) {
  //     this.paras.shift();
  //   }

  //   if (this.paras[0] === 'tg') {
  //     this.paras[0] = this.paras[1];
  //     this.paras[1] = '';
  //   }

  //   // while (this.paras.length > 3) {
  //   //   this.paras.push('');
  //   // }
  //   this.link = link.replace('.html', '');
  // }
  public text: string;
  public folder: string;
  public books: Book[];
  constructor(text: string, folder: string) {
    this.folder = folder;
    this.text = text;
  }
}
