import { debounce, isMuiElement, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as React from 'react';

export const styles = {
  /* Styles applied to the root element. */
  root: {
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  /* Styles applied to the `div` element that wraps the children. */
  item: {
    position: 'relative',
    display: 'block', // In case it's not rendered with a div.
    height: '100%',
    overflow: 'hidden',
  },
  /* Styles applied to an `img` element child, if needed to ensure it covers the item. */
  imgFullHeight: {
    height: '100%',
    transform: 'translateX(-50%)',
    position: 'relative',
    left: '50%',
  },
  /* Styles applied to an `img` element child, if needed to ensure it covers the item. */
  imgFullWidth: {
    width: '100%',
    position: 'relative',
    transform: 'translateY(-50%)',
    top: '50%',
  },
};

const fit = (imgEl, classes) => {
  if (!imgEl || !imgEl.complete) {
    return;
  }

  if (
    imgEl.width / imgEl.height >
    imgEl.parentElement.offsetWidth / imgEl.parentElement.offsetHeight
  ) {
    // I always want max width in webtoon viewing
    imgEl.classList.remove(...classes.imgFullHeight.split(' '));
    imgEl.classList.add(...classes.imgFullWidth.split(' '));
    // Original fit fonction
    // imgEl.classList.remove(...classes.imgFullWidth.split(' '));
    // imgEl.classList.add(...classes.imgFullHeight.split(' '));
  } else {
    imgEl.classList.remove(...classes.imgFullHeight.split(' '));
    imgEl.classList.add(...classes.imgFullWidth.split(' '));
  }
};

function ensureImageCover(imgEl, classes) {
  if (!imgEl) {
    return;
  }

  if (imgEl.complete) {
    fit(imgEl, classes);
  } else {
    imgEl.addEventListener('load', () => {
      fit(imgEl, classes);
    });
  }
}

const ImageListItemWebtoon = React.forwardRef(function ImageListItem(props, ref) {
  // cols rows default values are for docs only
  const {
    children,
    classes,
    className,
    // eslint-disable-next-line no-unused-vars
    cols = 1,
    component: Component = 'li',
    // eslint-disable-next-line no-unused-vars
    rows = 1,
    ...other
  } = props;

  const imgRef = React.useRef(null);

  React.useEffect(() => {
    ensureImageCover(imgRef.current, classes);
  });

  React.useEffect(() => {
    const handleResize = debounce(() => {
      fit(imgRef.current, classes);
    });

    window.addEventListener('resize', handleResize);
    return () => {
      handleResize.clear();
      window.removeEventListener('resize', handleResize);
    };
  }, [classes]);

  return (
    <Component className={clsx(classes.root, className)} ref={ref} {...other}>
      <div className={classes.item}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) {
            return null;
          }

          if (child.type === 'img' || isMuiElement(child, ['Image'])) {
            return React.cloneElement(child, {
              ref: imgRef,
            });
          }

          return child;
        })}
      </div>
    </Component>
  );
});

ImageListItemWebtoon.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * While you can pass any node as children, the main use case is for an img.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * Width of the item in number of grid columns.
   */
  cols: PropTypes.number,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes /* @typescript-to-proptypes-ignore */.elementType,
  /**
   * Height of the item in number of grid rows.
   */
  rows: PropTypes.number,
};

export default withStyles(styles, { name: 'MuiImageListItem' })(ImageListItemWebtoon);
