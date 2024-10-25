import { render, screen } from "@testing-library/react";
import React from "react";
import Carousel from "../src";
import userEvent from "@testing-library/user-event";
import styles from "./styles";

const slidesLength = 10;

const slides = Array(slidesLength).fill(null).map((_, i) => (
  <div style={{ width: 300, height: 300 }}>{i}</div>
));

describe('Loop carousel spec test', () => {
  it('should move to 0 when click next button on last visible slide', async () => {
    render(
      <Carousel loop slides={slides} initialSlideIndex={slidesLength - 1}>
        {(slider, { slideToNext }) => (
          <>
            {slider}
            <button onClick={slideToNext}>
              next button
            </button>
          </>
        )}
      </Carousel>
    );
    const nextButton = await screen.findByText('next button');
    await userEvent.click(nextButton);

    const slideContents = await screen.findAllByText(0);
    const slide = slideContents[0].closest(`.${styles.slide}`)!;

    expect(Array.from(slide.classList).includes(styles.slideVisible)).toBe(true);
  });
  it('should move to last index when click prev button on first visible slide', async () => {
    render(
      <Carousel loop slides={slides} initialSlideIndex={0}>
        {(slider, { slideToPrev }) => (
          <>
            {slider}
            <button onClick={slideToPrev}>
              prev button
            </button>
          </>
        )}
      </Carousel>
    );
    const prevButton = await screen.findByText('prev button');
    await userEvent.click(prevButton);

    const slideContents = await screen.findAllByText(slides.length - 1);
    const slide = slideContents[slideContents.length - 1].closest(`.${styles.slide}`)!;

    expect(Array.from(slide.classList).includes(styles.slideVisible)).toBe(true);
  });
})