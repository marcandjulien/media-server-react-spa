import IconButton from '@material-ui/core/IconButton';
import ImageList from '@material-ui/core/ImageList';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import React, { useEffect, useState } from 'react';
import useSelection from '../hooks/useSelection';
import useSmartPress from '../hooks/useSmartPress';
import ImageListItemWebtoon from './ImageListItemWebtoon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

interface ImageItemProps {
  page: any;
  index: number;
  isSelected: boolean;
  selectMode: boolean;
  toggleSelectMode: () => void;
  add: (index: number) => void;
  select: (index: number) => void;
  addRangeFromLast: (index: number) => void;
}

const ImageItem = ({
  page,
  index,
  isSelected,
  selectMode,
  toggleSelectMode,
  add,
  select,
  addRangeFromLast,
}: ImageItemProps) => {
  const classes = useStyles();

  const smartPressHandler = useSmartPress({
    onClick: () => select(index),
    onLongPress: toggleSelectMode,
    onCtrlClick: () => add(index),
    onShiftClick: () => addRangeFromLast(index),
  });

  return (
    <ImageListItemWebtoon key={page.uuid}>
      <img
        src={`${page.fileUrl}?width=${256}&height=${360}`}
        alt={page.number}
        loading="lazy"
        width={256}
        height={360}
        {...(selectMode ? smartPressHandler : {})}
      />
      <ImageListItemBar
        title={page.number}
        subtitle={<span>tags: {page?.tags?.map((t: any) => t.name).join(', ')}</span>}
        actionIcon={
          <IconButton aria-label="Select this page" className={classes.icon} {...smartPressHandler}>
            {isSelected ? (
              <CheckCircleOutlineIcon className={classes.title} />
            ) : (
              <RadioButtonUncheckedIcon className={classes.title} />
            )}
          </IconButton>
        }
      />
    </ImageListItemWebtoon>
  );
};

interface PageImageListProps {
  pages: any;
  setSelected: (arg0: Set<string>) => void;
}

export default function PageImageList({ pages, setSelected }: PageImageListProps) {
  const classes = useStyles();

  const [selectMode, setSelectMode] = useState(false);
  const { selected, add, select, addRangeFromLast } = useSelection();

  useEffect(() => {
    const selectedUuids = new Set<string>();
    selected.forEach((value) => {
      selectedUuids.add(pages[value].uuid);
    });

    setSelected(selectedUuids);
  }, [pages, selected, setSelected]);

  return (
    <ImageList rowHeight="auto" className={classes.imageList} cols={6}>
      {pages?.map((page: any, index: number) => (
        <ImageItem
          key={page.uuid}
          page={page}
          index={index}
          selectMode={selectMode}
          isSelected={selected.has(index)}
          toggleSelectMode={() => setSelectMode(!selectMode)}
          add={add}
          select={select}
          addRangeFromLast={addRangeFromLast}
        />
      ))}
    </ImageList>
  );
}
