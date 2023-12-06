
# Tatt(2) Web Application

This project was created as part of the Capstone course for the UF Masters in Mass Communication - Web Design program. 

## Link to the live site

https://capstone-tatt2-4c6ws3n0r-daniellanorris.vercel.app/

## Purpose 

This application is meant to provide a method of communication for tattoo seekers and tattoo artists. With two different login statuses, artists are able to upload photographs of their tattoos, profile information, and other relevant information that links to booking.

The look and feel of the application is risographic and artistic, meant to differentiate this application from cold-feeling, mass produced sites.

Tattoo seekers are able to search artists near them, most popular artists, and artists by style. Additionally, users are  able to save their favorite artists to a 'saved artists' page and
upload a profile picture.

Tatt(2) seeks to provide a singular platform for this tattoo artist finding, and eliminate the need to use other platforms that were not intended for this purpose. 

## Database Type

MongoDB is used to store information related to artist and tattoo seeker profiles. User and Artist Schemas are structured as follows:
## Artist

``` js
const ArtistSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        maxlength: [40, 'Username cannot be more than 40 characters'],
    },
    password: {
        type: String,
        required: [true, 'Password needs to be added'],
        maxlength: [100, 'Password cannot be more than 100 characters'],
    },
    firstname: {
        type: String,
        required: true,
        maxlength: [20],
    },
    lastname: {
        type: String,
        required: true,
        maxlength: [20],
    },
    tattooStyle: [
        {
            type:  String,
        },
    ],
    image: [
        {
            type: String,
        },
    ],
    profilePicture: {
        type: String,
    },
    location: {
        type: String,
    },
    bio: {
        type: String,
    },
    bookingUrl: {
        type: String,
    },
    address: {
        type: String,
    }
});
```

These structurs showcase the differences between user and artist permissions, with the chief importance being for Artists to upload more information than users are able to.

## User 

``` js 
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        maxlength: [40, 'Username cannot be more than 40 characters']
    },
    password: {
        type: String,
        required: [true, 'Password needs to be added'],
        maxlength: [100, 'Password cannot be more than 100 characters']
    },
    firstname: {
        type: String,
        required: true,
        maxlength: [20]
    },
    lastname: {
        type: String,
        required: true,
        maxlength: [20]
    },
    savedArtists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist', 
        required: false, 
        unique: [true, 'same artist cannot be saved twice']
    }], 
    profileUrl: {
        type: String
    },
    location: [
        {
            latitude: {
                type: Number, 
                required: true,

            }, 
            longitude: {
                type: Number, 
                required: true
            }
        }
    ]
});
```

## API / SDK references

Tatt(2) uses the Radar Geodata SDK and the Amazon SDK API reference. 

The Radar SDK converts users' IP address to a geolocation; my code takes the IP address and stores the latitude and longitude derived from this in both the User and 
Artist database.

The Amazon AWS S3 bucket stores uploaded images, which are then returned to the Tatt(2) Mongo database and stored as URLS. These URLS are then used in img elements to render the images 
associated with specific Artists and Users. 

To clone this repo, you'll need to register for a Radar account here, and create an API key: https://radar.com/dashboard
Additionally, to utilize the image functionality associated with this application, you'll need to create an Amazon AWS account, generate a User with Read / Write permissions, and create an S3 bucket for uploaded images to be sent to. Within this bucket, create an /uploads folder for the images to be sorted into. If you reside in a different region than us-east-1, adjust the code accordingly.

Here is where you can sign up for an account: https://aws.amazon.com/
And here is some information related to creating an S3 bucket for use with JS. https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html

## Deployment 
This application is deployed on Vercel, with the MongoDB integration aa the database solution. Vercel is specifically configured with Next.js, so process.env variables in my code are prepended with 
NEXT_PUBLIC_.  

