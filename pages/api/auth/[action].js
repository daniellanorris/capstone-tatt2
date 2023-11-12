import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../../config/session"
import {loginForUser, loginForArtist} from '../../../config/db/auth'


export default withIronSessionApiRoute(

    function handler(req, res) {
        const { action } = req.query;
        if (req.method !== 'POST')
            return res.status(404).end()
        switch (action) {
            case "loginUser":
                return loginUser(req, res)
            case "loginArtist":
                return loginArtist(req, res)
            default:
                return res.status(404).end()
        }
    },
    sessionOptions

)
async function loginUser(req, res) {
    const { username, password } = req.body;
    console.log('Received username:', username);
    console.log('Provided password during login attempt:', password);
    
    try {
        const user = await loginForUser(username, password);
        req.session.user = user;
 
    
        await req.session.save();
        res.status(200).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function loginArtist(req, res) {
    const { username, password } = req.body;

    try {
        const artist = await loginForArtist(username, password);
        req.session.user = artist;
        await req.session.save();
        res.status(200).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}