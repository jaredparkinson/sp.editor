import { Injectable } from '@angular/core';
import { filter, find, merge, uniq } from 'lodash';
// import * as debug from 'pouchdb-debug';
import PouchDB from 'pouchdb';
import databaselist from '../../assets/data/database-list.json';

import { Chapter } from 'oith.models/dist';
import { Database } from './Database';
import { DatabaseItem } from './DatabaseItem';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  public databaseList: Database[];

  public db = new PouchDB(location.hostname);

  public remoteDB = new PouchDB(
    'https://sp_users:test@couch.parkinson.im/spec_test',
  );
  public sdb = new PouchDB('alpha_oneinthinehand_all_eng');

  public async bulkDocs(databaseName: string): Promise<void> {
    console.log(databaseName);
    console.log(this.remoteDB.name);

    // await this.remoteDB.createIndex({ index: { fields: ['testament'] } });

    const docs = await this.remoteDB.allDocs();

    const filteredDocs = filter(
      docs.rows,
      (doc): boolean => {
        return doc.id.endsWith(`-${databaseName.replace(/\_/g, '-')}`);
      },
    ).map(
      (doc): { id: string; rev: string } => {
        return { id: doc.id, rev: doc.value.rev };
      },
    );

    if (filteredDocs.length > 0) {
      // const filterDocs = await this.db.bulkGet({ docs: filteredDocsIDs });

      await PouchDB.replicate(this.remoteDB, this.db, {
        // eslint-disable-next-line @typescript-eslint/camelcase
        doc_ids: filteredDocs.map(
          (f): string => {
            return f.id;
          },
        ),
      });
    }

    return;

    await (PouchDB as any).replicate(
      `https://sp_users:test@couch.parkinson.im/${databaseName}`,
      this.db,
    );
  }

  public async compactDatabase(): Promise<void> {
    const verseDb = new PouchDB(
      'https://sp_users:test@couch.parkinson.im/verses',
    );

    try {
      await verseDb.compact();
    } catch (error) {
      console.log(error);
    }
    // verseDb
    //   .compact()
    //   .then(value => {
    //     console.log(value);
    //   })
    //   .catch(reason => {
    //     console.log(reason);
    //   });
  }
  public async get(
    id: string,
  ): Promise<(PouchDB.Core.IdMeta & PouchDB.Core.GetMeta) | undefined> {
    try {
      const allDocs = await this.db.allDocs();

      const chapter = allDocs.rows.find(
        (doc): boolean => {
          return doc.id.startsWith(id);
        },
      );

      console.log(chapter);

      if (chapter) {
        // return chapter.doc;
        return this.db.get(chapter.id);
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);

      return undefined;
    }
  }

  public async getRevision(id: string): Promise<string> {
    try {
      const rev = await this.db.get(id);

      return rev._rev as string;
    } catch {
      throw new Error('Item is not in the databawse');
    }
  }
  public async put(value: string): Promise<void | PouchDB.Core.Response> {
    const chaper = JSON.parse(value) as Chapter;

    chaper._rev = await this.getRevision(chaper._id);

    return this.db.put(chaper).catch((): void => {});
  }

  public async setDatabases(): Promise<void> {
    const tempDatabases = localStorage.getItem('database-list');

    if (tempDatabases) {
      this.databaseList = JSON.parse(tempDatabases);
    } else {
      this.databaseList = [];
    }

    const dataDatabase = databaselist as Database[];

    dataDatabase.forEach(
      (item): void => {
        const existingItem = find(
          this.databaseList,
          (d: Database): boolean => {
            return d.name === item.name;
          },
        );

        if (existingItem) {
          merge(existingItem.databaseItems, item.databaseItems);
          existingItem.databaseItems = uniq(existingItem.databaseItems);
          filter(
            existingItem.databaseItems,
            (i: DatabaseItem): boolean => {
              return !i.downloaded && i.downloading;
            },
          ).forEach(
            (i): void => {
              i.downloading = false;
            },
          );
        } else {
          this.databaseList.push(item);
        }
      },
    );

    localStorage.setItem('database-list', JSON.stringify(this.databaseList));
  }
}
