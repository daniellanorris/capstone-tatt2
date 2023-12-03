import * as React from "react";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import { LightboxButton, Paragraph } from "@/components";
import {
  Settings,
  SliderFilter,
  CheckboxFilter,
} from "@/components/playground";

import slides from "@/data/slides";

export default function ZoomPlugin() {
  const [open, setOpen] = React.useState(false);
  const [animationDuration, setAnimationDuration] = React.useState(500);
  const [maxZoomPixelRatio, setMaxZoomPixelRatio] = React.useState(1);
  const [zoomInMultiplier, setZoomInMultiplier] = React.useState(2);
  const [doubleTapDelay, setDoubleTapDelay] = React.useState(300);
  const [doubleClickDelay, setDoubleClickDelay] = React.useState(300);
  const [doubleClickMaxStops, setDoubleClickMaxStops] = React.useState(2);
  const [keyboardMoveDistance, setKeyboardMoveDistance] = React.useState(50);
  const [wheelZoomDistanceFactor, setWheelZoomDistanceFactor] =
    React.useState(100);
  const [pinchZoomDistanceFactor, setPinchZoomDistanceFactor] =
    React.useState(100);
  const [scrollToZoom, setScrollToZoom] = React.useState(false);

  return (
    <>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        plugins={[Zoom]}
        animation={{ zoom: animationDuration }}
        zoom={{
          maxZoomPixelRatio,
          zoomInMultiplier,
          doubleTapDelay,
          doubleClickDelay,
          doubleClickMaxStops,
          keyboardMoveDistance,
          wheelZoomDistanceFactor,
          pinchZoomDistanceFactor,
          scrollToZoom,
        }}
      />

      <LightboxButton onClick={() => setOpen(true)} />

      <Settings>
        <SliderFilter
          label="animation.zoom"
          min={0}
          max={3000}
          step={100}
          value={animationDuration}
          onChange={(value) => setAnimationDuration(value)}
        />

        <SliderFilter
          label="maxZoomPixelRatio"
          min={1}
          max={10}
          value={maxZoomPixelRatio}
          onChange={(value) => setMaxZoomPixelRatio(value)}
        />

        <SliderFilter
          label="zoomInMultiplier"
          min={2}
          max={5}
          value={zoomInMultiplier}
          onChange={(value) => setZoomInMultiplier(value)}
        />

        <SliderFilter
          label="doubleTapDelay"
          min={100}
          max={1000}
          step={50}
          value={doubleTapDelay}
          onChange={(value) => setDoubleTapDelay(value)}
        />

        <SliderFilter
          label="doubleClickDelay"
          min={100}
          max={1000}
          step={50}
          value={doubleClickDelay}
          onChange={(value) => setDoubleClickDelay(value)}
        />

        <SliderFilter
          label="doubleClickMaxStops"
          min={1}
          max={5}
          value={doubleClickMaxStops}
          onChange={(value) => setDoubleClickMaxStops(value)}
        />

        <SliderFilter
          label="keyboardMoveDistance"
          min={5}
          max={200}
          step={5}
          value={keyboardMoveDistance}
          onChange={(value) => setKeyboardMoveDistance(value)}
        />

        <SliderFilter
          label="wheelZoomDistanceFactor"
          min={5}
          max={200}
          step={5}
          value={wheelZoomDistanceFactor}
          onChange={(value) => setWheelZoomDistanceFactor(value)}
        />

        <SliderFilter
          label="pinchZoomDistanceFactor"
          min={5}
          max={200}
          step={5}
          value={pinchZoomDistanceFactor}
          onChange={(value) => setPinchZoomDistanceFactor(value)}
        />

        <CheckboxFilter
          label="scrollToZoom"
          checked={scrollToZoom}
          onChange={(checked) => setScrollToZoom(checked)}
        />
      </Settings>
    </>
  );
}
