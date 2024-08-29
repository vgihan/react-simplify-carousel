# react-simplify-carousel
React Simplify Carousel is light-weight slider UI library. The purpose of this Carousel is to allow it to be expanded and used in other Carousels to suit each service.

### Interface

The main module is 'Carousel', it has below interface. The 'children' render prop can be render function for rendering slider & your carousel controller elements

```typescript
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
```