import { Container } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Form, Formik } from 'formik';
import ky from 'ky';
import { FC, ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
import * as yup from 'yup';
// components
import Dropzone from '../components/Dropzone';
import PageTitle from '../components/PageTitle';
// constants
import { APP_TITLE, PAGE_TITLE_DASHBOARD } from '../utils/constants';

// define css-in-js
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  }),
);

const pageSchema = yup.object().shape({
  number: yup.string(),
  file: yup.object(),
});

const chapterSchema = yup.object().shape({
  title: yup.string(),
  number: yup.string(),
  pages: yup.array().of(pageSchema),
});

const bookSchema = yup.object().shape({
  title: yup.string(),
  number: yup.string(),
  chapters: yup.array().of(chapterSchema),
});

const validationSchema = yup.object({
  title: yup.string().required('Story title is required'),
  type: yup.string().required('Story type is required'),
  pages: yup.array().of(pageSchema),
  chapters: yup.array().of(chapterSchema),
  books: yup.array().of(bookSchema),
});

const options = [
  { value: 'manga', label: 'Manga' },
  { value: 'manhwa', label: 'Manhwa' },
];

export interface FileWithPath extends File {
  readonly fullPath: string;
}

function parsePath(path: string) {
  const parts = path.split('/');
  const pageNumber = parts[parts.length - 1].split('.')[0];
  let chapterNumber;
  let chapterTitle;
  let storyTitle;

  if (parts.length > 1) {
    const partsWithoutPage = parts.slice(0, -1);
    chapterTitle = partsWithoutPage.find((part) => new RegExp('(ch|chapter|chap)', 'i').test(part));
    chapterNumber = chapterTitle?.match(/(\d+)/)?.[0];
  }

  return {
    pageNumber,
    chapterNumber,
    chapterTitle,
    storyTitle,
  };
}

const createStory = async (title: string, mediaType: string) => {
  const json: any = await ky
    .post('http://localhost:3000/image/stories', { json: { title, mediaType } })
    .json();
  return json.uuid;
};

const createChapter = async (title: string, number: string, storyUuid: string) => {
  const json: any = await ky
    .post('http://localhost:3000/image/chapters', {
      json: { title, number, storyUuid },
    })
    .json();
  return json.uuid;
};

const uploadPage = async (number: string, file: any, storyUuid: string, chapterUuid: string) => {
  const payload = new FormData();
  payload.append('number', number);
  payload.append('storyUuid', storyUuid);
  payload.append('chapterUuid', chapterUuid);
  payload.append('file', file);
  await ky.post('http://localhost:3000/image/pages', { body: payload });
};

const Dashboard: FC<{}> = (): ReactElement => {
  const classes = useStyles();

  const initialValues = {
    title: '',
    type: 'Manhwa',
    pages: [],
    chapters: [],
    books: [],
  };

  const handleSubmit = async (values: any, actions: any) => {
    const storyId = await createStory(values.title, values.type);
    console.log('storyId : ', storyId);
    if (storyId) {
      for (const chapter of values.chapters) {
        const chapterId = await createChapter(chapter.title, chapter.number, storyId);
        console.log('    chapterId : ', chapterId);
        if (chapterId) {
          for (const page of chapter.pages) {
            await uploadPage(page.number, page.file, storyId, chapterId);
            console.log('        page : ', page.number);
          }
        }
      }
    }
  };

  const handleFilesDrop = (files: FileWithPath[], values: any, setValues: any) => {
    files.forEach((file) => {
      const { pageNumber, chapterNumber, chapterTitle } = parsePath(file.fullPath);
      const chapterIndex = values.chapters.findIndex(
        (chapter: any) => chapter.title === chapterTitle,
      );
      if (chapterTitle && chapterIndex !== -1) {
        values.chapters[chapterIndex].pages.push({
          number: pageNumber,
          file,
        });
        setValues(values);
      } else {
        const chapter = {
          title: chapterTitle,
          number: chapterNumber,
          pages: [
            {
              number: pageNumber,
              file,
            },
          ],
        };
        values.chapters.push(chapter);
        setValues(values);
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>
          {} | {APP_TITLE}
        </title>
      </Helmet>
      <div className={classes.root}>
        <PageTitle title={PAGE_TITLE_DASHBOARD} />
        <Container>
          <Formik
            initialValues={initialValues}
            // validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Title"
                  value={props.values.title}
                  onChange={props.handleChange}
                  error={props.touched.title && Boolean(props.errors.title)}
                  helperText={props.touched.title && props.errors.title}
                />
                {/* <Field name="type" component={SelectField} options={options} /> */}
                <Dropzone
                  onChange={(files: any) => handleFilesDrop(files, props.values, props.setValues)}
                />
                <button type="submit">Submit</button>
                <ol>
                  {props.values.chapters.map((chapter) => (
                    <li>
                      {(chapter as any).title}
                      <ol>
                        {(chapter as any).pages.map((page: any) => (
                          <li>{JSON.stringify(page)}</li>
                        ))}
                      </ol>
                    </li>
                  ))}
                </ol>
              </Form>
            )}
          </Formik>
        </Container>
      </div>
    </>
  );
};

export default Dashboard;
