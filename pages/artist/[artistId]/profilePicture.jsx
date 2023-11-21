import UserImageUploadForm from '../../../components/userImageForm'
import Link from 'next/link';

export default function initUserProfile() {

    return (
        <>
        <h1> Upload your profile picture </h1>
        <div className="card">
        <UserImageUploadForm/>
        <div style={{width: "30px", margin:"30px"}} className="mx-auto">
        <Link href="/">

          <button type="button">Next</button>

      </Link>
        </div>
        </div>
     
        </>

    )
}