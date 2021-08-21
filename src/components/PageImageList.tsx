import IconButton from '@material-ui/core/IconButton';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    imageList: {
      //   width: 500,
      //   height: 450,
    },
    icon: {
      color: 'white',
    },
    title: {
      //   color: theme.palette.primary.light,
    },
  }),
);

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const itemData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
export default function PageImageList(props: any) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ImageList rowHeight="auto" className={classes.imageList} cols={6}>
        {props?.pages?.map((page: any, index: number) => (
          <ImageListItem key={page.uuid}>
            <img
              src={`http://localhost:3000/image/pages/${page.uuid}/download/${
                page.number
              }.png?width=${256}&height=${360}`}
              alt={page.number}
            />
            <ImageListItemBar
              title={page.number}
              subtitle={<span>tags: {page.tags}</span>}
              actionIcon={
                <IconButton
                  aria-label="Select this page"
                  className={classes.icon}
                  onClick={() => props.onSelection(page.uuid)}
                >
                  {props.selected.includes(page.uuid) ? (
                    <CheckCircleOutlineIcon className={classes.title} />
                  ) : (
                    <RadioButtonUncheckedIcon className={classes.title} />
                  )}
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}
