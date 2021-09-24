import { Box, Container, Theme, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PromisePool from '@supercharge/promise-pool/dist';
import { Form, Formik } from 'formik';
import { FC, ReactElement, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// components
import Dropzone from '../components/Dropzone';
import { LinearProgressWithStatus } from '../components/LinearProgressWithStatus';
import PageTitle from '../components/PageTitle';
import Chapter from '../model/Chapter.model';
import { createChapter, createStory } from '../services/upload';
// constants
import { APP_TITLE, PAGE_TITLE_DASHBOARD } from '../utils/constants';
import { FileWithPath, parseStoryFolder } from '../utils/path-parser';

// define css-in-js
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    tasklist: {
      marginTop: theme.spacing(2),
    },
  }),
);

const initialValues = {
  title: '',
  type: 'Manhwa',
  pages: [],
  chapters: [],
  books: [],
};

const Dashboard: FC<{}> = (): ReactElement => {
  const classes = useStyles();

  const [progress, setProgress] = useState<Map<string, { progress: number; total: number }>>(
    new Map(),
  );

  const updateProgress = (success: boolean, key: string) => {
    if (success && progress.has(key)) {
      const currentProgress = progress.get(key);
      const newProgress = {
        total: currentProgress!.total,
        progress: currentProgress!.progress + 1,
      };
      setProgress(new Map(progress.set(key, newProgress)));
    }
  };

  const handleSubmit = async (values: any, formikBag: any) => {
    const storyUuid = await createStory(values.title, values.type);
    await PromisePool.for<Chapter>(values.chapters)
      .withConcurrency(5)
      .process(async (chapter) => {
        await createChapter(storyUuid, chapter, updateProgress);
      });
  };

  const handleFilesDrop = (
    files: FileWithPath[],
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
  ) => {
    const { chapters, title } = parseStoryFolder(files);
    setProgress(
      new Map(
        chapters.map(({ title, pages }: any) => [title, { total: pages.length + 1, progress: 0 }]),
      ),
    );
    setFieldValue('title', title);
    setFieldValue('chapters', chapters);
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
            {({ values, handleChange, touched, errors, setFieldValue }) => (
              <Form>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Title"
                  value={values.title}
                  onChange={handleChange}
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                />
                {/* <Field name="type" component={SelectField} options={options} /> */}
                <Dropzone onChange={(files: any) => handleFilesDrop(files, setFieldValue)} />
                <button type="submit">Submit</button>
              </Form>
            )}
          </Formik>
          <Box className={classes.tasklist}>
            <Typography variant="h5">Tasks</Typography>
            {Array.from(progress).map(([title, { total, progress }]: any) => (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2">{`${title} - ${total - 1} pages`}</Typography>
                </Box>
                <LinearProgressWithStatus value={(progress / total) * 100} />
              </Box>
            ))}
          </Box>
        </Container>
      </div>
    </>
  );
};

export default Dashboard;
