import ky from 'ky';
import Chapter from '../model/Chapter.model';

export async function createStory(title: string, mediaType: string) {
  const json: any = await ky
    .post('http://localhost:3000/image/stories', { json: { title, mediaType }, timeout: false })
    .json();
  return json.uuid;
}

export async function createChapter(
  storyUuid: string,
  chapter: Chapter,
  updateProgress: (success: boolean, key: string) => void,
) {
  const { title, number, pages } = chapter;
  const { uuid: chapterUuid } = await ky
    .post('http://localhost:3000/image/chapters', {
      json: { title, number, storyUuid },
      timeout: false,
    })
    .json();
  updateProgress(true, chapter.title);

  for (const page of pages) {
    const body = createPageBody(page.number, storyUuid, chapterUuid, page.file);
    await ky.post('http://localhost:3000/image/pages', { body, timeout: false });
    updateProgress(true, chapter.title);
  }
}

export function createPageBody(number: string, storyUuid: string, chapterUuid: string, file: any) {
  const body = new FormData();
  body.append('number', number);
  body.append('storyUuid', storyUuid);
  body.append('chapterUuid', chapterUuid);
  body.append('file', file);
  return body;
}
