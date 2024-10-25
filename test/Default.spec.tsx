import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Carousel from '../src';
import styles from './styles';

const slides = Array(10).fill(null).map((_, i) => (
  <div style={{ width: 300, height: 300 }}>{i}</div>
));

describe('Default carousel spec test', () => {
  const initialSlideIndex = 5;
  const slideTarget = 7;
  beforeEach(() => {
    render(
      <Carousel slides={slides} initialSlideIndex={initialSlideIndex}>
        {(slider, { slideToNext, slideToPrev, slideTo }) => (
          <>
            {slider}
            <button onClick={slideToNext}>
              next button
            </button>
            <button onClick={slideToPrev}>
              prev button
            </button>
            <button onClick={() => slideTo(slideTarget)}>
              target button
            </button>
          </>
        )}
      </Carousel>
    );
  });
  it('should move to next when click slideToNext button', async () => {
    const nextButton = await screen.findByText('next button');
    await userEvent.click(nextButton);

    const slide = (await screen.findByText(initialSlideIndex + 1)).closest(`.${styles.slide}`)!;
    expect(Array.from(slide.classList).includes(styles.slideVisible)).toBe(true);
  });
  it('should move to previous when click slideToPrev button', async () => {
    const nextButton = await screen.findByText('prev button');
    await userEvent.click(nextButton);

    const slide = (await screen.findByText(initialSlideIndex - 1)).closest(`.${styles.slide}`)!;
    expect(Array.from(slide.classList).includes(styles.slideVisible)).toBe(true);
  });
  it('should move to slide target when click target button', async () => {
    const targetButton = await screen.findByText('target button');
    await userEvent.click(targetButton);

    const slide = (await screen.findByText(slideTarget)).closest(`.${styles.slide}`)!;
    expect(Array.from(slide.classList).includes(styles.slideVisible)).toBe(true);
  })
});