export interface FileWithPath extends File {
  readonly fullPath: string;
}

interface ParsedPage {
  number: string;
  file: any;
}

interface ParsedChapterFolder {
  title: string;
  number?: string;
  pages: ParsedPage[];
}

interface ParsedStoryFolder {
  title: string;
  chapters: ParsedChapterFolder[];
}

/**
 * Extract the first part of a path.
 */
function extractTitle(path: string): string {
  const pathParts = path.split('/').filter((part) => !!part);
  return pathParts[0];
}

/**
 * Extract chapter information from a path.
 */
function extractChapter(path: string): { title: string; number: string | undefined } {
  const pathParts = path.split('/').filter((part) => !!part);

  //   if (pathParts.length > 1) {
  const title = pathParts.slice(-2, -1)[0];
  const number = title?.match(/(\d+)/)?.[0];
  return { title, number };
  //   }

  //   return undefined;
}

/**
 * Extract page information from a path.
 */
function extractPage(path: string): { number: string } {
  const pathParts = path.split('/').filter((part) => !!part);
  const number = pathParts[pathParts.length - 1].split('.')[0];
  return { number };
}

/**
 * Parse a list of path that were extract from a file drop.
 * This version of the function is curated for story folder.
 * A story folder has this structure :
 *    - /<story title>/<chapter title>/<page number>
 */
export function parseStoryFolder(files: FileWithPath[]): ParsedStoryFolder {
  const title = extractTitle(files[0].fullPath);

  const chapters: ParsedChapterFolder[] = [];

  for (const file of files) {
    const chapter = extractChapter(file.fullPath);

    let index = chapters.findIndex((ch) => ch.title === chapter?.title);
    if (index === -1 && chapter) {
      index = chapters.push({ ...chapter, pages: [] }) - 1;
    }

    const page = extractPage(file.fullPath);
    chapters[index].pages.push({ ...page, file });
  }

  chapters.sort((a: any, b: any) =>
    a.title.localeCompare(b.title, undefined, {
      numeric: true,
      sensitivity: 'base',
    }),
  );

  return { title, chapters };
}

/**
 * Parse a list of path that were extract from a file drop.
 * This version of the function is curated for chapter folder.
 * A chapter folder has this structure :
 *    - /<chapter title>/<page number>
 */
export function parseChapterFolder(files: FileWithPath[]): ParsedChapterFolder {
  const { title, number } = extractChapter(files[0].fullPath);

  const pages: ParsedPage[] = [];

  for (const file of files) {
    const page = extractPage(file.fullPath);
    pages.push({ ...page, file });
  }

  return { title, pages, number };
}
