import { ImageList, ImageListItem, ImageListItemBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FC, ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import PageSectionTitle from '../components/PageSectionTitle';
// components
import PageTitle from '../components/PageTitle';
import { useGetStoryByUuidQuery } from '../services/imageApi';
// constants
import { APP_TITLE, PAGE_TITLE_STORIES } from '../utils/constants';

// define css-in-js
const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    width: 400,
    height: 800,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

const Story: FC<{}> = (): ReactElement => {
  const classes = useStyles();

  const { storyUuid } = useParams<{ storyUuid: string }>();
  const { data, error, isLoading } = useGetStoryByUuidQuery(storyUuid);

  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_STORIES} | {APP_TITLE}
        </title>
      </Helmet>
      <div className={classes.root}>
        <PageTitle title={PAGE_TITLE_STORIES} />

        <PageSectionTitle title="Chapters" />
        <ImageList cols={6} rowHeight={480}>
          {data?.chapters?.map((chapter: any) => (
            <ImageListItem key={chapter.uuid}>
              <Link to={`/chapter/${chapter.uuid}`}>
                <img
                  src={`http://localhost:3000/image/pages/${chapter.pages?.[0].uuid}/download/${chapter.pages?.[0].number}.png`}
                  alt={chapter.title}
                />
                <ImageListItemBar title={chapter.title} />
              </Link>
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </>
  );
};

export default Story;
