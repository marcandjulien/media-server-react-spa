import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FC, ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
// components
import PageTitle from '../components/PageTitle';
import useQuery from '../hooks/useQuery';
import { useGetChapterByUuidQuery } from '../services/chaptersApi';
import { useGetStoryByUuidQuery } from '../services/storiesApi';
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

function useGetPages(type: any, uuid: any) {
  const { data: story } = useGetStoryByUuidQuery(
    { uuid, populate: ['pages'] },
    {
      skip: type !== 'story',
    },
  );

  const { data: chapter } = useGetChapterByUuidQuery(
    { uuid },
    {
      skip: type !== 'chapter',
    },
  );

  let pages;
  if (type === 'story') {
    pages =
      story?.chapters?.map((chapter: any) => chapter?.pages?.map((page: any) => page))?.flat() ||
      [];
  } else if (type === 'chapter') {
    pages = chapter?.pages || [];
  }

  return pages;
}

const Reader: FC<{}> = (): ReactElement => {
  const classes = useStyles();
  const query = useQuery();
  const pages = useGetPages(query.get('type'), query.get('uuid'));

  console.log(pages);
  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_STORIES} | {APP_TITLE}
        </title>
      </Helmet>
      <div className={classes.root}>
        <PageTitle title={PAGE_TITLE_STORIES} />
        <Container>
          {query ? (
            pages?.length > 0 ? (
              <>
                {pages?.map((page: any) => (
                  <img
                    src={page.fileUrl}
                    alt={page.number}
                    className={classes.img}
                    loading="lazy"
                  />
                ))}
              </>
            ) : (
              'No page found.'
            )
          ) : (
            'No reading media selected.'
          )}
        </Container>
      </div>
    </>
  );
};

export default Reader;
