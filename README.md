# react-simplify-slider
React Simple Slider is light-weight slider UI library

### Interface

The main module is 'Slider', it has below interface. Slider props have handleRef can control Slider's inner state.

```typescript
interface SliderHandle {
  slideToPrev: () => void
  slideToNext: () => void
  slideTo: (index: number) => void
  length: number
  currentSlideIndex: number
}
interface SliderProps {
  slides: Array<React.ReactElement>
  renderSlideWrapper?: (
    slide: this['slides'][number],
    slideValues: {
      currentSlideIndex: number
      slideIndex: number
    }
  ) => React.ReactNode
  className?: string
  initialSlideIndex?: number
  expandedSpacing?: number
  slideBy?: number
  perPage?: number
  loop?: boolean
  isSwipeable?: boolean
  rtl?: boolean
  onSlideChange?: (slideIndex: number) => void
  handleRef?: React.RefObject<SliderHandle>
}
```