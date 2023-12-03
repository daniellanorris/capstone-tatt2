import React, {useState, useEffect} from 'react'


export default function FixedCard() {


  
    useEffect(() => {
        const handleScroll = () => {
          setScrollPosition(prevPosition => {
            const currentPosition = window.scrollY;
            setScrollDirection(currentPosition > prevPosition ? 'down' : 'up');
            return currentPosition;
          });
        };
      
        window.addEventListener('scroll', handleScroll);
      
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, [scrollPosition, scrollDirection]);
      
}