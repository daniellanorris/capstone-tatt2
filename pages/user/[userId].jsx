import React from 'react';


export default async function userProfile() {

    const getUserData = await fetch('/api/user/[userId]/savedArtists')

    console.log(getUserData)
    

    return (
        <>
            <div> test </div>
            <div>Saved artists
                <div> {}</div>

            </div> 
        </>
    )

}