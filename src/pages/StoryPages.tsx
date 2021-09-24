import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FC, ReactElement, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import PageImageList from '../components/PageImageList';
// components
import PageTitle from '../components/PageTitle';
import { useGetStoryByUuidQuery } from '../services/storiesApi';
// constants
import { APP_TITLE, PAGE_TITLE_CHAPTER } from '../utils/constants';

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

const StoryPages: FC<{}> = (): ReactElement => {
  const classes = useStyles();

  const [tag, setTag] = useState<string>('');
  const [searchTag, setSearchTag] = useState<string>('');
  const { storyUuid } = useParams<{ storyUuid: string }>();
  const { data: story, refetch } = useGetStoryByUuidQuery({
    uuid: storyUuid,
    populate: ['pages'],
    filter: searchTag
      ? {
          pagesTags: {
            $in: searchTag,
          },
        }
      : undefined,
  });

  const [updatePage] = usePatchPageMutation();

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleAddTag = async () => {
    const promises = Array.from(selected).map((uuid) =>
      updatePage({ uuid, tags: [...tag.split(',')] }),
    );
    await Promise.all(promises);
    refetch();
  };

  const handleFilterTag = () => {
    setSearchTag(tag);
  };

  const filesUrl =
    story?.chapters?.map((chapter: any) => chapter?.pages?.map((page: any) => page))?.flat() || [];

  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_CHAPTER} | {APP_TITLE}
        </title>
      </Helmet>
      <div className={classes.root}>
        <PageTitle title={story?.title} />
        <Link to={`/story/${story?.uuid}`}>Go to story</Link>
        <Link to={`/reader?type=story&uuid=${story?.uuid}`}>Read Chapter</Link>
        <div>
          <TextField
            id="standard-basic"
            label="Tag"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
          />
          <Button variant="contained" onClick={handleAddTag}>
            Update tag
          </Button>
          <Button variant="contained" onClick={handleFilterTag}>
            Update tag
          </Button>
        </div>

        <PageImageList pages={filesUrl} setSelected={setSelected} />
      </div>
    </>
  );
};

export default StoryPages;
function usePatchPageMutation(): [any] {
  throw new Error('Function not implemented.');
}
