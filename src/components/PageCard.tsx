import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles({
  root: {
    // width: 360,
    // height: 256,
  },
  media: {
    // height: '25%',
    // paddingTop: '56.25%', // 16:9,
    // height: 256,
    // paddingTop: '100%', // 1:1,
    paddingTop: '140%', // 16:9
  },
});

interface PageProps {
  number: string;
  url: string;
}

export default function PageCard(props: PageProps) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={`${props.url}?width=${256}&height=${360}`}
        title={props.number}
      />
    </Card>
  );
}
