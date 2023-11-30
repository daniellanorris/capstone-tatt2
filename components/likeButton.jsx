import React, { useState, useEffect } from 'react';
import useAddLikes from '../config/db/controllers/addLikes.js';

export default function LikeButton({ artistId, userId, likes, setLikes }) {
   const { addLikes, isLoading } = useAddLikes();
 
   async function handleLikeClick(event) {
      event.preventDefault();
      try {
        await addLikes(artistId, userId);
        setLikes((prevLikes) => prevLikes + 1);
      } catch (error) {
        console.error('Error liking the artist:', error);
      }
    }
 
   return (
     <div>
       <button onClick={handleLikeClick} disabled={isLoading}>
         {likes} Likes
       </button>
       <img src="./heart.png" width="60px" height="auto" alt="Heart Icon" />
     </div>
   );
 }