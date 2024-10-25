import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import styles from 'styles';
import { times } from 'utils/tool';

interface SliderHandle {
  slideToPrev: () => void
  slideToNext: () => void
  slideTo: (index: number) => void
  length: number
  currentSlideIndex: number
}
interface CarouselProps {
  slides: Array<React.ReactElement>
  renderSlideWrapper?: (
    slide: this['slides'][number],
    slideValues: {
      currentSlideIndex: number
      slideIndex: number
    }
  ) => React.ReactNode
  className?: React.HTMLAttributes<HTMLDivElement>['className']
  initialSlideIndex?: number
  expandedSpacing?: number
  slideBy?: number
  perPage?: number
  loop?: boolean
  isSwipeable?: boolean
  rtl?: boolean
  onSlideChange?: (slideIndex: number) => void
  children?: (slider: React.ReactElement, sliderHandle: SliderHandle) => React.ReactElement
}

interface SwipeInfo {
  startX: number
  currentX: number
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(({
  slides: propSlides,
  renderSlideWrapper = (slide) => slide,
  className = '',
  initialSlideIndex = 0,
  slideBy = 1,
  perPage = 1,
  expandedSpacing: propExpandedSpacing = 0,
  loop: propLoop = false,
  isSwipeable: propIsSwipeable = true,
  rtl = false,
  onSlideChange,
  children,
}: CarouselProps, ref) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [transitionDisabled, setTransitionDisabled] = useState(false);

  const swipeRef = useRef<SwipeInfo>();
  const sliderRef = useRef<HTMLDivElement>(null);

  const { length: slidesLength } = propSlides;

  const canSlide = (slidesLength > perPage);

  const loop = (canSlide && propLoop);
  const isSwipeable = (canSlide && propIsSwipeable);
  const expandedSpacing = (canSlide ? propExpandedSpacing : 0);

  const clonedSlideCount = loop ? perPage + slideBy : 0;

  const clonedTailSlides = (
    times(clonedSlideCount).reverse()
      .map((v) => (slidesLength - v - 1) % slidesLength)
      .map((v) => (v < 0 ? v + slidesLength : v))
      .map((index) => React.cloneElement(propSlides[index]))
  );
  const clonedHeadSlides = (
    times(clonedSlideCount)
      .map((v) => v % slidesLength)
      .map((index) => React.cloneElement(propSlides[index]))
  );
  const slides = useMemo(() => (
    (loop
      ? [
        ...clonedTailSlides,
        ...propSlides,
        ...clonedHeadSlides,
      ]
      : propSlides
    ).map((slide, i) => (
      <div
        key={`soso-slider-slide-${i - clonedSlideCount}`}
        className={[
          styles.slide,
          className,
        ].join(' ').trimEnd()}
        style={{
          flex: `1 0 ${(1 / perPage) * 100}%`,
        }}
      >
        {renderSlideWrapper(slide, {
          currentSlideIndex,
          slideIndex: i - clonedSlideCount
        })}
      </div>
    ))
  ), [clonedSlideCount, propSlides]);

  const hasNext = !!slides[(loop ? currentSlideIndex + clonedSlideCount : currentSlideIndex) + perPage];
  const hasPrev = !!slides[(loop ? currentSlideIndex + clonedSlideCount : currentSlideIndex) - 1];

  const handleSlideChange = useCallback((slideIndex: number) => {
    const isValidSlideIndex = (propSlides[slideIndex] && propSlides[slideIndex + perPage - 1]);
    if (loop && !isValidSlideIndex && !swipeRef.current) {
      setTransitionDisabled(true);
      setCurrentSlideIndex((prevIndex) => prevIndex + (slideIndex < 0 ? 1 : -1) * slidesLength);
      setTimeout(() => {
        setTransitionDisabled(false);
        setCurrentSlideIndex(slideIndex + (slideIndex < 0 ? 1 : -1) * slidesLength);
      }, 0);
    } else if (loop || isValidSlideIndex) {
      setCurrentSlideIndex(slideIndex);
    } else {
      setCurrentSlideIndex(slideIndex < 0 ? 0 : slidesLength - perPage);
    }
    if (onSlideChange) {
      onSlideChange(
        slideIndex < 0
          ? (slideIndex % slidesLength) + slidesLength
          : (slideIndex % slidesLength),
      );
    }
  }, []);
  const slideToPrev = useCallback(() => {
    if (hasPrev) {
      handleSlideChange(currentSlideIndex - slideBy);
    }
  }, [currentSlideIndex]);
  const slideToNext = useCallback(() => {
    if (hasNext) {
      handleSlideChange(currentSlideIndex + slideBy);
    }
  }, [currentSlideIndex]);

  useEffect(() => {
    const handleSwipeStart = (e: PointerEvent) => {
      e.preventDefault();
      if (!swipeRef.current) {
        swipeRef.current = {
          startX: e.clientX,
          currentX: e.clientX,
        };
      }
    };
    const handleSwipeEnd = () => {
      const slideElement = sliderRef.current?.firstElementChild;
      if (!slideElement) return;

      const { width: slideWidth } = slideElement.getBoundingClientRect();
      const swipeThreshold = slideWidth / 2;

      if (swipeRef.current) {
        setTransitionDisabled(false);
        const distanceToSlide = Math.floor(Math.abs(swipeOffset) / (slideWidth * slideBy));
        const remainOffset = swipeOffset % (slideWidth * slideBy);
        const didSwipeToNext = (
          (rtl && swipeOffset > 0) ||
          (!rtl && swipeOffset < 0)
        );
        handleSlideChange(
          Math.abs(remainOffset) > swipeThreshold
            ? (
              didSwipeToNext
                ? currentSlideIndex + (distanceToSlide + 1) * slideBy
                : currentSlideIndex - (distanceToSlide + 1) * slideBy
            )
            : (
              didSwipeToNext
                ? currentSlideIndex + distanceToSlide * slideBy
                : currentSlideIndex - distanceToSlide * slideBy
            ),
        );
        swipeRef.current = undefined;
        setSwipeOffset(0);
      }
    };
    const handleSwipeMove = (e: PointerEvent) => {
      if (swipeRef.current) {
        swipeRef.current.currentX = e.pageX;
        const { startX, currentX } = swipeRef.current;
        const offset = currentX - startX;
        if (loop) {
          setCurrentSlideIndex((prevIndex) => {
            const shouldRepeatFromHead = (prevIndex < 0 && ((!rtl && offset > 0) || (rtl && offset < 0)));
            const shouldRepeatFromTail = (prevIndex >= slidesLength - slideBy && ((!rtl && offset < 0) || (rtl && offset > 0)));

            if (shouldRepeatFromHead) return prevIndex + slidesLength;
            else if (shouldRepeatFromTail) return prevIndex - slidesLength;
            else return prevIndex;
          });
        }
        setTransitionDisabled(true);
        setSwipeOffset(swipeRef.current.currentX - swipeRef.current.startX);
      }
    };

    const sliderElement = sliderRef.current!;
    sliderElement.addEventListener('pointerdown', handleSwipeStart);
    sliderElement.addEventListener('pointerup', handleSwipeEnd);
    sliderElement.addEventListener('pointermove', handleSwipeMove);
    sliderElement.addEventListener('pointerleave', handleSwipeEnd);
    return () => {
      sliderElement.removeEventListener('pointerdown', handleSwipeStart);
      sliderElement.removeEventListener('pointerup', handleSwipeEnd);
      sliderElement.removeEventListener('pointermove', handleSwipeMove);
      sliderElement.removeEventListener('pointerleave', handleSwipeEnd);
    };
  }, [currentSlideIndex, swipeOffset]);

  const sliderOffset = (
    !hasPrev
      ? (rtl ? 1 : -1) * expandedSpacing + swipeOffset
      : !hasNext
        ? (rtl ? -1 : 1) * expandedSpacing + swipeOffset
        : swipeOffset
  );

  const sliderHandle = {
    slideToPrev,
    slideToNext,
    slideTo: handleSlideChange,
    length: slidesLength,
    currentSlideIndex,
  };
  const slider = (
    <div
      className={[
        styles.sliderRoot,
        className,
      ].join(' ').trimEnd()}
      ref={ref}
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <div
        ref={sliderRef}
        className={[
          styles.slider,
          isSwipeable ? styles.sliderSwipeable : '',
          transitionDisabled ? styles.sliderDisabledTransition : '',
        ].join(' ').trimEnd()}
        style={{
          transform: (
            `translateX(calc(
              ${(rtl ? 1 : -1) * ((currentSlideIndex + (loop ? clonedSlideCount : 0)) / perPage) * 100}% +
              ${sliderOffset}px
            ))`
          ),
          margin: `0 ${expandedSpacing}px`,
        }}
      >
        {slides.map((slide, i) => (
          times(perPage).map((v) => v + currentSlideIndex)
            .includes(i - clonedSlideCount)
            ? React.cloneElement(slide, { className: `${slide.props.className} ${styles.slideVisible}` })
            : slide
        ))}
      </div>
    </div>
  );

  return children ? children(slider, sliderHandle) : slider;
});

export type { CarouselProps, SliderHandle };

export default Carousel;
