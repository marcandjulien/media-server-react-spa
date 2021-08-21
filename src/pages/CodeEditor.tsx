import { ImageList, ImageListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FC, ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
// components
import PageTitle from '../components/PageTitle';
// constants
import { APP_TITLE, PAGE_TITLE_CODE } from '../utils/constants';

// define css-in-js
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  // root: {
  //   flex: 1,
  //   display: "flex",
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  // },
  imageList: {
    // width: 500,
    // height: 450,
    // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
}));

const CodeEditor: FC<{}> = (): ReactElement => {
  const classes = useStyles();

  const itemData = [
    {
      img: 'http://127.0.0.1:3000/image/a1b0741e-d1c9-45b5-ae9b-3f5cea1bccf2.png',
      title: '',
    },
    {
      img: 'http://127.0.0.1:3000/image/13982da7-06b0-4e2a-876c-b0759f327fda.png',
      title: '',
    },
    {
      img: 'http://127.0.0.1:3000/image/190b4482-c0fc-4fd7-9071-e042472498f8.png',
      title: '',
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_CODE} | {APP_TITLE}
        </title>
      </Helmet>
      <div className={classes.root}>
        <PageTitle title={PAGE_TITLE_CODE} />
        <ImageList gap={0} rowHeight="auto" cols={1} className={classes.imageList}>
          {itemData.map((item) => (
            <ImageListItem key={item.img} cols={1}>
              <img src={item.img} alt={item.title} />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </>
  );
};

export default CodeEditor;
