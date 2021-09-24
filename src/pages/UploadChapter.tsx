import { Box, Container, Theme, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Form, Formik } from 'formik';
import { FC, ReactElement, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// components
import Dropzone from '../components/Dropzone';
import { LinearProgressWithStatus } from '../components/LinearProgressWithStatus';
import PageTitle from '../components/PageTitle';
import { createChapter } from '../services/upload';
// constants
import { APP_TITLE, PAGE_TITLE_DASHBOARD } from '../utils/constants';
import { FileWithPath, parseChapterFolder } from '../utils/path-parser';

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
  number: '',
  pages: [],
};

const UploadChapter: FC<{}> = (): ReactElement => {
  const classes = useStyles();

  const { storyUuid } = useParams<{ storyUuid: string }>();
  const [progress, setProgress] = useState<{ progress: number; total: number }>({
    progress: 0,
    total: 0,
  });

  const updateProgress = (success: boolean) => {
    if (success) {
      setProgress({ total: progress.total, progress: progress.progress + 1 });
    }
  };

  const handleSubmit = async (values: any, formikBag: any) => {
    await createChapter(storyUuid, values, updateProgress);
  };

  const handleFilesDrop = (
    files: FileWithPath[],
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
  ) => {
    const { title, number, pages } = parseChapterFolder(files);
    setProgress({ total: pages.length + 1, progress: 0 });
    setFieldValue('title', title);
    setFieldValue('number', number);
    setFieldValue('pages', pages);
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
                <TextField
                  fullWidth
                  id="number"
                  name="number"
                  label="number"
                  value={values.number}
                  onChange={handleChange}
                  error={touched.number && Boolean(errors.number)}
                  helperText={touched.number && errors.number}
                />
                {/* <Field name="type" component={SelectField} options={options} /> */}
                <Dropzone onChange={(files: any) => handleFilesDrop(files, setFieldValue)} />
                <button type="submit">Submit</button>
              </Form>
            )}
          </Formik>
          <Box className={classes.tasklist}>
            <Typography variant="h5">Tasks</Typography>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2">{`${progress.total - 1} pages`}</Typography>
              </Box>
              <LinearProgressWithStatus value={(progress.progress / progress.total) * 100} />
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default UploadChapter;
