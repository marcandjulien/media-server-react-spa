import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FC, ReactElement, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import PageImageList from '../components/PageImageList';
// components
import PageTitle from '../components/PageTitle';
import { useDeleteChapterByUuidMutation, useGetChapterByUuidQuery } from '../services/chaptersApi';
import { usePatchPageByUuidMutation } from '../services/pagesApi';
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

const Chapter: FC<{}> = (): ReactElement => {
  const classes = useStyles();

  const { chapterUuid } = useParams<{ chapterUuid: string }>();
  const [filter, setFilter] = useState<any>(undefined);
  const { data: chapter, refetch } = useGetChapterByUuidQuery({
    uuid: chapterUuid,
    filter,
  });
  const [updatePage] = usePatchPageByUuidMutation();

  const [deleteChapter] = useDeleteChapterByUuidMutation();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tag, setTag] = useState<string>('');

  const handleAddTag = async () => {
    const promises = Array.from(selected).map((uuid) =>
      updatePage({ uuid, tags: [...tag.split(',')] }),
    );
    await Promise.all(promises);
    refetch();
  };

  const handleFilterTag = () => {
    setFilter(tag ? { pagesTags: tag } : undefined);
  };

  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_CHAPTER} | {APP_TITLE}
        </title>
      </Helmet>
      <div className={classes.root}>
        <PageTitle title={`${PAGE_TITLE_CHAPTER} ${chapter?.number}`} />
        <span>Find a way to update a chapter.</span>
        <Link to={`/story/${chapter?.story.uuid}`}>Go to story</Link>
        <Link to={`/reader?type=chapter&uuid=${chapterUuid}`}>Read Chapter</Link>
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
            Filter
          </Button>
          <Button variant="contained" onClick={() => deleteChapter(chapter.uuid)}>
            Delete Chapter
          </Button>
        </div>

        <PageImageList pages={chapter?.pages} setSelected={setSelected} />
      </div>
    </>
  );
};

export default Chapter;
