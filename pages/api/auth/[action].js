import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../../config/session"
import dbConnect from '../../../config/db/utils/dbConnect'
import { useRouter } from 'next/router';
import db from '../../../config/db/auth'


const router = useRouter()

dbConnect()

export default withIronSessionApiRoute(
  function handler(req, res) {
    if (req.method !== 'POST')
      return res.status(404).end()
    switch (req.query.action) {
      case "loginUser":
        return loginUser(req, res)
      case "signupUser":
        return signupUser(req, res)
      case "loginArtist":
        return loginArtist(req, res)
      case "signupArtist":
        return signupArtist(req, res)
      default:
        return res.status(404).end()

    }
  },
  sessionOptions

)



export async function loginUser(req, res) {
  const { username, password } = req.body
  try {
    const user = await db.auth.login(username, password)
    req.session.user = {
      username: user.username,
      id: user.id
    }
    await req.session.save()
    res.writeHead(302, { Location: '/' });
    res.end();
  } catch(err) {
    res.status(400).json({error: err.message})
  }
}

export async function signupUser(req, res) {
  const { username, password, _id } = req.body
  try {
    const user = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        id: _id
      }),
    });
    req.session.user = {
      username: user.username,
      password: user._id
    }
    if (response.status === 201) {
      setMessage('Signup successful');
      res.writeHead(302, { Location: '/' });
      res.end();
      await req.session.save()
    } else if (response.status === 400) {
      const data = await response.json();
      setMessage(data.message);
    } else {
      setMessage('Signup failed');
    }

  }

  catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export async function signupArtist(req, res) {
  try {
  signupArtist()
    req.session.artist = {
      username: artist.username,
    };
    await req.session.save();

    // Redirect the user
    res.writeHead(302, { Location: '/' });
    res.end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }


}

export async function loginArtist(req, res) {
  try {  
    const { username, password } = req.body
    const {
      password: _,
      ...otherFields
    } = await db.auth.login(username, password)
    req.session.user = otherFields
    await req.session.save()
    res.writeHead(302, { Location: '/' });
    res.end();
  } catch(err) {
    res.status(400).json({error: err.message})
  }
}


