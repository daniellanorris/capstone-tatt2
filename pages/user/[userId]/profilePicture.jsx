import UserImageUploadForm from '../../../components/userImageForm'

export default function initUserProfile() {

    return (
        <>
        <h1> Upload your profile picture </h1>
        <div className="card">
        <UserImageUploadForm/>
        <div style={{width: "30px", margin:"30px"}} className="mx-auto">
        <button> Next </button>
        </div>
        </div>
     
        </>

    )
}