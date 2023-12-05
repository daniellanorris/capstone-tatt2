export default function LandingPage() {
    return (
        <div className="index-bg">
            <div
                className="row row-column-fix container d-flex mt-4"
                style={{ zIndex: "2" }}
            >
                <h1>
                    Welcome to Tatt(2), </h1> <h3>the Web Application that brings together tattoo
                        seekers, and tattoo artists!
                </h3>
                <div
                    className="col column-fix mt-4"
                    style={{
                        backgroundColor: 'rgba(255, 165, 0, 0.5)',
                        boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                        height: "300px",
                    }}
                >
                    <div style={{ textAlign: "left" }} className="pt-5">
                        <h3>
                            To use this application...     </h3> <p>Create an account as either a
                                'User' or an 'Artist'.</p>

                        <ul>
                            <li style={{ textAlign: "left" }}><em> Artists </em> have the ability to upload
                                pictures, upload bios, booking URLs, tattoo styles, and more! </li>
                            <li style={{ textAlign: "left" }}>
                                <em> Users </em>can peruse the list of artists, save artists, and view
                                artists' profiles.

                            </li>

                        </ul>

                    </div>
                </div>

                <div
                    className="container col column-fix mt-4 "
                    style={{
                        backgroundColor: "rgba(255, 115, 0, 0.25)",
                        height: "300px", flex: "1"
                    }}
                >
                    <h3 className="pt-5">To get started....</h3>
                    <div>
                        <p> Have an account? </p>
                        <button>
                            {" "}
                            <a style={{ color: "white" }} href="/login">Login </a>
                        </button>
                    </div>
                    <div>
                        <p> Need to create an account? </p>
                        <button >
                            <a style={{ color: "white" }} href="/signup"> Signup </a>{" "}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
