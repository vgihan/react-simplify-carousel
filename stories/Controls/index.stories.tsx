import React, { useRef } from 'react';

import Slider, { SliderHandle } from '../../src';
import "src/index.css"

const Template = () => {
  const carouselHandleRef = useRef<SliderHandle>(null);
  const carouselRef = useRef(null);

  return (
    <div
      style={{
        width: "100%",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 100,
      }}
    >
      <Slider
        slides={[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
          <div
            style={{
              width: "100%",
              padding: "0 5px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                height: 250,
                backgroundColor: 'GrayText',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <p style={{ fontSize: 30 }}>{v}</p>
            </div>
          </div>
        ))}
        perPage={3}
        expandedSpacing={0}
        ref={carouselRef}
        handleRef={carouselHandleRef}
      />
    </div>
  )
}

export default {
  title: 'Example/Controls',
  component: Template,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Controls = {};
