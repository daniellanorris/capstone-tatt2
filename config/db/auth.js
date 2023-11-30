
import User from '../../models/User'
import Artist from '../../models/Artist'
import dbConnect from '../db/utils/dbConnect'
import bcrypt from 'bcrypt'


export async function loginForUser(username, password) {
    if (!(username && password))
        throw new Error('Must include username and password');

   await dbConnect();

   await dbConnect().catch(error => {
    console.error('Error connecting to the database:', error);
    throw new Error('Database connection error');
});

    const user = await User.findOne({username}).lean()

    if (!user)
        throw new Error('User not found');

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
        throw new Error('Password is incorrect');

    return user;
}

export async function loginForArtist(username, password) {
    if (!(username && password))
        throw new Error('Must include username and password');

    await dbConnect();

    await dbConnect().catch(error => {
        console.error('Error connecting to the database:', error);
        throw new Error('Database connection error');
    });

    const artist = await Artist.findOne({ username }).lean();


    if (!artist)
        throw new Error('Artist not found');

    const isPasswordCorrect = await bcrypt.compare(password, artist.password);
   

    if (!isPasswordCorrect)
        throw new Error('Password is incorrect');

    return artist;
}