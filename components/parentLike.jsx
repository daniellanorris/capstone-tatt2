
import React, { useState, useEffect } from 'react';
import LikeButton from './LikeButton';

export default function ArtistDetails({ artistId, userId }) {
  const [likes, setLikes] = useState(0);
  console.log(artistId, userId)

  useEffect(() => {
    async function fetchLikesData() {
      try {
        const res = await fetch(`/api/artist/${artistId}/likes`);
        const data = await res.json();
        console.log(data.data.likes.length)
        setLikes(data.data.likes.length);
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    }

    fetchLikesData();
  }, [artistId]);

  return (
    <div>
      <LikeButton artistId={artistId} userId={userId} likes={likes} setLikes={setLikes} />
    </div>
  );
}