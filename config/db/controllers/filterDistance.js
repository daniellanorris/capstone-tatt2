import React, {useState} from 'react';
import ReactSlider from 'react-slider';
import '../../../public/styles/slider.css'; 

export default function FilterDistance({ onFilterDistance }) {
    const [sliderValue, setSliderValue] = useState(0);
  function filterDistance(value) {
    console.log('distance filtered', value);
    setSliderValue(value)

    if (onFilterDistance) {
      onFilterDistance(value);
    }
  }

  return (
    <div>
      <label id="slider-label">
          <h2> Set a distance </h2></label>
      <ReactSlider
    
        defaultValue={0}
        ariaLabelledby="slider-label"
        max={1000}
        onAfterChange={filterDistance}
        orientation="horizontal"
        className="customSlider"
        trackClassName="customSlider-track"
        thumbClassName="customSlider-thumb"
        markClassName="customSlider-mark"
        marks={100}

      />
          <h3   value={sliderValue}> {sliderValue} miles </h3> 
    </div>
  );
}