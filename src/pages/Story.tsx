import { Box, Button, ImageList, ImageListItem, ImageListItemBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FC, ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import PageSectionTitle from '../components/PageSectionTitle';
// components
import PageTitle from '../components/PageTitle';
import { useDeleteStoryByUuidMutation, useGetStoryByUuidQuery } from '../services/storiesApi';
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
  const { data: story } = useGetStoryByUuidQuery({ uuid: storyUuid });

  const [deleteStory] = useDeleteStoryByUuidMutation();

  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_STORIES} | {APP_TITLE}
        </title>
      </Helmet>
      <div className={classes.root}>
        <Box>
          <PageTitle title={PAGE_TITLE_STORIES} />
          <Link to={`/story/${storyUuid}/newchapter`}>New chapter</Link>
          <Button variant="contained" component="span" onClick={() => deleteStory(storyUuid)}>
            Delete story
          </Button>
          <span>Find a way to update a chapter.</span>
        </Box>

        <PageSectionTitle title="Chapters" />
        <ImageList cols={6} rowHeight={480}>
          <ImageListItem key={story?.uuid}>
            <Link to={`/storypages/${story?.uuid}`}>
              <img src={story?.cover?.fileUrl} alt={story?.title} />
              <ImageListItemBar title={story?.title} />
            </Link>
          </ImageListItem>
          {story?.chapters?.map((chapter: any) => (
            <ImageListItem key={chapter.uuid}>
              <Link to={`/chapter/${chapter.uuid}`}>
                <img src={chapter.cover?.fileUrl} alt={chapter.title} />
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
