import { cloneDeep, first, last } from 'lodash';
import { Paragraph, Verse, W, WType } from 'oith.models';
function getfirstLast(ids: number[]) {
  const f = first(ids);
  const l = last(ids);
  if (f && l) {
    return { first: f, last: l };
  }

  return undefined;
}
function mergeWTags(wTags: W[], userWTags: W[]) {
  return;
  wTags.forEach(wTag => {
    if (wTag.cWTags) {
      const tempW: W[] = [];
      const userWTag = userWTags.find(uW => {
        return uW.verseId === wTag.verseId;
      });
      if (userWTag) {
        wTag.cWTags.forEach(w => {
          if (w.ids) {
            const bounds = getfirstLast(w.ids);
            if (bounds) {
              for (let x = bounds.first; x <= bounds.last; x++) {
                const n = cloneDeep(w);

                n.ids = [x];
                tempW.push(n);
              }
            }
          }
        });
      }
    }
  });
}

function addTextToWTag(verse: Verse, wTag: W) {
  if (wTag.cWTags) {
    wTag.cWTags.forEach(w => {
      switch (w.wType) {
        case WType.A: {
          if (w.cWTags) {
            w.cWTags.forEach(c => {
              addWText(c, verse);
            });
          }
          break;
        }
        case WType.Default: {
          addWText(wTag, verse);
          break;
        }
        default:
      }
    });
  }
}
function addWText(c: W, verse: Verse) {
  if (c.ids) {
    const bounds = getfirstLast(c.ids);
    if (bounds) {
      c.text = verse.text.slice(bounds.first, bounds.last);
    }
  }
}

function addTextToWTags(verses: Verse[], wTags: W[]) {
  wTags.forEach(wTag => {
    const verse = verses.find(v => {
      return v.verseID === wTag.verseId;
    });
    if (verse && wTag.cWTags) {
      addTextToWTag(verse, wTag);
    }
  });
}

function addWTagsToParagraphs(paragraphs: Paragraph[], wTags: W[]) {
  paragraphs.forEach(paragraph => {
    if (paragraph.verseIds) {
      paragraph.verseIds.forEach(vID => {
        const wTag = wTags.find(w => {
          return w.verseId === vID;
        });

        if (wTag) {
          if (!paragraph.wTags) {
            paragraph.wTags = [];
          }
          paragraph.wTags.push(wTag);
        }
      });
    }
  });
}

export async function buildChapter(
  paragraphs: Paragraph[] | undefined,
  verses: Verse[] | undefined,
  wTags: W[] | undefined,
  userWTags: W[] | undefined,
) {
  if (paragraphs && verses && wTags) {
    if (userWTags) {
      mergeWTags(wTags, userWTags);
    }

    addTextToWTags(verses, wTags);

    addWTagsToParagraphs(paragraphs, wTags);
  }
}
