import { IconButton, ImageList, ImageListItem, ImageListItemBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import { FC, ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
// components
import PageTitle from '../components/PageTitle';
import { useGetStoriesQuery } from '../services/storiesApi';
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
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  a: {
    display: 'block',
    height: '100%',
  },
}));

const ComicSearch: FC<{}> = (): ReactElement => {
  const classes = useStyles();

  const { data: stories } = useGetStoriesQuery({});

  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_STORIES} | {APP_TITLE}
        </title>
      </Helmet>
      <div className={classes.root}>
        <PageTitle title={PAGE_TITLE_STORIES} />
        <ImageList cols={6} rowHeight={480}>
          {stories?.map((story: any) => (
            <ImageListItem key={story.uuid}>
              <Link to={`/story/${story.uuid}`} className={classes.a}>
                <img src={story.cover?.fileUrl} alt={story.title} />
                <ImageListItemBar
                  title={story.title}
                  subtitle={<span>by: {story.author}</span>}
                  actionIcon={
                    <IconButton aria-label={`info about ${story.title}`} className={classes.icon}>
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </Link>
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </>
  );
};

export default ComicSearch;
