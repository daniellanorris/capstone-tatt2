import { compare } from 'bcrypt'
import User from '../../models/User'
import dbConnect from '../db/utils/dbConnect'

export async function loginArtist(username, password) {
    if (!(username && password))
        throw new Error('Must include username and password')

    await dbConnect()
    const artist = await Artist.findOne({ username }).lean()

    if (!artist)
        throw new Error('User not found')

    const isPasswordCorrect = await compare(password, artist.password)

    if (!isPasswordCorrect)
        throw new Error('Password is incorrect')

    return artist
}


export async function loginUser(username, password) {
    if (!(username && password))
        throw new Error('Must include username and password')

    await dbConnect()
    const user = await User.findOne({ username }).lean()

    if (!user)
        throw new Error('User not found')

    const isPasswordCorrect = await compare(password, user.password)

    if (!isPasswordCorrect)
        throw new Error('Password is incorrect')

    return user
}