import React, { DragEvent } from 'react';
import { DropEvent, useDropzone } from 'react-dropzone';
import './Dropzone.css';

/**
 * One of the big question of this functionality is, should we make it with
 * the File System Access API (https://web.dev/file-system-access/) developed
 * by Google or use the non standard File and Directory Entries API
 * (https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API)
 * This first iteration use File and Directory Entries API because it was supported by
 * the most browser. It should be revised in the future.
 */

// Drop handler function to get all files
async function getAllFileEntries(dataTransferItemList: any): Promise<FileEntry[]> {
  let fileEntries = [];
  // Use BFS to traverse entire directory/file structure
  let queue = [];
  // Unfortunately dataTransferItemList is not iterable i.e. no forEach
  for (let i = 0; i < dataTransferItemList.length; i++) {
    queue.push(dataTransferItemList[i].webkitGetAsEntry());
  }
  while (queue.length > 0) {
    let entry = queue.shift();
    if (entry.isFile) {
      fileEntries.push(entry);
    } else if (entry.isDirectory) {
      let reader = entry.createReader();
      queue.push(...(await readAllDirectoryEntries(reader)));
    }
  }
  return fileEntries;
}

// Get all the entries (files or sub-directories) in a directory by calling readEntries until it returns empty array
async function readAllDirectoryEntries(directoryReader: DirectoryReader) {
  let entries = [];
  let readEntries = await readEntriesPromise(directoryReader);
  while (readEntries && readEntries.length > 0) {
    entries.push(...readEntries);
    readEntries = await readEntriesPromise(directoryReader);
  }
  return entries;
}

async function readEntriesPromise(
  directoryReader: DirectoryReader,
): Promise<FileSystemEntry[] | undefined> {
  try {
    return await new Promise((resolve, reject) => {
      directoryReader.readEntries(resolve, reject);
    });
  } catch (err) {
    console.log(err);
  }
}

async function getFilePromise(fileEntry: FileEntry): Promise<File | undefined> {
  try {
    return await new Promise((resolve, reject) => fileEntry.file(resolve, reject));
  } catch (err) {
    console.log(err);
  }
}

async function myCustomFileGetter(event: DropEvent) {
  console.log('event : ' + event.type);

  let files: File[] = [];
  if (
    (event as DragEvent).dataTransfer &&
    (event as DragEvent).dataTransfer?.items &&
    event.type === 'drop'
  ) {
    const fileEntries = await getAllFileEntries((event as DragEvent).dataTransfer.items);
    for (let i = 0; i < fileEntries.length; i++) {
      const file = await getFilePromise(fileEntries[i]);
      if (file) {
        Object.defineProperty(file, 'fullPath', {
          value: fileEntries[i].fullPath,
        });
        files.push(file);
      }
    }
  }
  return files;
}

export default function Dropzone(props: any) {
  const { onChange } = props;
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    getFilesFromEvent: (event) => myCustomFileGetter(event),
    onDrop: (acceptedFiles) => {
      onChange(acceptedFiles);
    },
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
    </div>
  );
}
