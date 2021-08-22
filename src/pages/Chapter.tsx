import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FC, ReactElement, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import PageImageList from '../components/PageImageList';
// components
import PageTitle from '../components/PageTitle';
import { imageApi, usePatchPageMutation } from '../services/imageApi';
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
  const { data: chapter, error, isLoading } = imageApi.useGetChapterByUuidQuery(chapterUuid);
  const [updatePage, { isLoading: isUpdating }] = usePatchPageMutation();

  const [selected, setSelected] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');

  const handleSelection = (uuid: string) => {
    if (selected.includes(uuid)) {
      setSelected(selected.filter((s) => s !== uuid));
    } else {
      setSelected([...selected, uuid]);
    }
  };

  // const handleAddTag = async () => {
  //   await Promise.all(selected.map((s) => updatePage({ uuid: s, tags: [tag] })));
  // };

  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_CHAPTER} | {APP_TITLE}
        </title>
      </Helmet>
      <div className={classes.root}>
        <PageTitle title={PAGE_TITLE_CHAPTER} />
        <Link to={`/reader?type=chapter&uuid=${chapterUuid}`}>Read Chapter</Link>
        <div>
          <TextField
            id="standard-basic"
            label="Tag"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
          />
          {/* <Button variant="contained" onClick={handleAddTag}>
            Add tag
          </Button> */}
        </div>

        <PageImageList pages={chapter?.pages} selected={selected} onSelection={handleSelection} />
        {/* <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
          {chapter?.pages.map((page: any) => (
            <Grid item xs={4} lg={2} key={page.uuid}>
              <PageCard
                number={page.number}
                url={`http://localhost:3000/image/pages/${page.uuid}/download/${page.number}.png`}
              />
            </Grid>
          ))}
        </Grid> */}

        {/* <ImageList>
          {chapter?.pages.map((page: any) => (
            <ImageListItem key={page.uuid}>
              <img
                src={`http://localhost:3000/image/pages/${page.uuid}/download/${page.number}.png`}
                alt={page.number}
              />
              <ImageListItemBar title={page.number} />
            </ImageListItem>
          ))}
        </ImageList> */}
      </div>
    </>
  );
};

export default Chapter;
