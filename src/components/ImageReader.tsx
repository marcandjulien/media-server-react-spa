import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FC, ReactElement } from 'react';
import useQuery from '../hooks/useQuery';
import { useGetChapterByUuidQuery } from '../services/chaptersApi';
import { useGetStoryByUuidQuery } from '../services/storiesApi';

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
  imageList: {
    // overflow: 'hidden',
    // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
    transform: 'translateZ(0)',
  },
  img: {
    verticalAlign: 'top',
    width: '100%',
  },
}));

function useGetPages(type: any, uuid: any, skipTags: string[]) {
  const { data: story } = useGetStoryByUuidQuery(
    { uuid, skipTags },
    {
      skip: type !== 'story',
    },
  );

  const { data: chapter } = useGetChapterByUuidQuery(
    { uuid, skipTags },
    {
      skip: type !== 'chapter',
    },
  );

  let pages;
  if (type === 'story') {
    pages = story?.pages;
  } else if (type === 'chapter') {
    pages = chapter?.pages;
  }

  return pages;
}

const ImageReader: FC<{}> = (): ReactElement => {
  const classes = useStyles();
  const query = useQuery();
  const pages = useGetPages(query.get('type'), query.get('uuid'), ['Test']);

  return (
    <Container className={classes.root}>
      {query
        ? pages?.length > 0
          ? pages?.map((page: any) => (
              <img
                src={`http://localhost:3000/image/pages/${page.uuid}/download/${page.number}.png`}
                alt={page.number}
                className={classes.img}
              />
            ))
          : 'No page found.'
        : 'No reading media selected.'}
    </Container>
  );
};

export default ImageReader;
