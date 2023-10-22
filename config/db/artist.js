import Artist from './models/artist'
import dbConnect from '../db/utils/dbConnect'

export async function create(username, password) {
    if (!(username && password))
        throw new Error('Must include username and password')

    await dbConnect()

    const artist = await Artist.create({ username, password })

    if (!artist)
        throw new Error('Error inserting User')

    return artist
}