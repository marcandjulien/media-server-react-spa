import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  title: {
    textTransform: 'uppercase',
  },
}));

interface PageTitleProps {
  title: string;
}

const PageSectionTitle = ({ title }: PageTitleProps) => {
  const classes = useStyles();
  return (
    <Typography variant="h3" className={classes.title} color="textSecondary">
      {title}
    </Typography>
  );
};

export default PageSectionTitle;
