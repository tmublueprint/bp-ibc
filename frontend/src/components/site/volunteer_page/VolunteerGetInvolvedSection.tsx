import './VolunteerPage.css'
import exclamationMark from '../../../assets/volunteer/exclamationMark.svg'; 
import whiteArrow from '../../../assets/shared/whiteArrow.svg'; 
import greenBg from '../../../assets/shared/greenBackground.svg'; 

function VolunteerGetInvolved() {

    const navPage = () => {
        window.location.href = '/home';
    }

    return (
        <>
            <div id="get-involved" style={{width: "100%", height: "600px"}}>
                <img src={greenBg} alt="green-bg" style={{objectFit: "cover", width: "100%", height: "100%"}}/>
                <div className="overlayText" style={{left: "50%"}}>
                    <h1 className="headerTwo" style={{color: "white", width: "950px", marginBottom: "60px"}}>Get Involved</h1>
                    <div id="volunteer-container">
                        <div id="volunteer-info">
                            <img src={exclamationMark} alt="exclamation-mark" style={{width: "60px", height: "60px", marginTop: "35px"}}/>
                            <p className="bodyText" id="volunteer-text" style={{color: "#DCDACD", width: "350px"}}>Volunteering with Itty Bitty Critters is not hands-on animal rescue. Our focus is education, prevention, and promoting 
                            responsible wildlife interaction within the community.</p>
                        </div>
                        <div id="volunteer-contact">
                            <p className="bodyText" style={{height: "170px", width: "400px", marginBottom: "20px", color: "#324436"}}>If you're interested in volunteering, we would love to hear from you. Please reach out with a brief introduction and let us know how you would like to help.</p>
                            <button className="cardTitleText" id="contact-btn" onClick={navPage}>
                                Contact Us for Volunteer Inquiries
                                <img src={whiteArrow} alt="white-arrow" style={{width: "13px", height: "13px", marginLeft: "15px"}}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    ); 
}

export default VolunteerGetInvolved;