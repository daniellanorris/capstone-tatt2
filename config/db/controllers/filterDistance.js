import React, {useState} from 'react';
import ReactSlider from 'react-slider';
import '../../../public/styles/slider.css'; 

export default function FilterDistance({ onFilterDistance }) {
    const [sliderValue, setSliderValue] = useState(100);
  function filterDistance(value) {
    setSliderValue(value)
    console.log(sliderValue)

    if (onFilterDistance) {
      onFilterDistance(value);
    }
  }

  return (
    <div>
      <label id="slider-label">
          <h2> Set a distance </h2></label>
          <h1 style={{color:"#8a2be2"}} value={sliderValue}> {sliderValue} miles </h1> 
      <ReactSlider
    
        defaultValue={100}
        ariaLabelledby="slider-label"
        max={1000}
        onAfterChange={filterDistance}
        orientation="horizontal"
        className="customSlider"
        trackClassName="customSlider-track"
        thumbClassName="customSlider-thumb"
        style={{padding: "20px"}}

      />

    </div>
  );
}