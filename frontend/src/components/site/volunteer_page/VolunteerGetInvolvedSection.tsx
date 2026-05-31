import './VolunteerPage.css'
import exclamationMark from '../../../assets/volunteer/exclamationMark.svg'; 
import whiteArrow from '../../../assets/shared/whiteArrow.svg'; 

function VolunteerGetInvolved() {

    const navPage = () => {
        window.location.href = '/contact';
    }

    return (
        <>
            <div id="get-involved">
                <h1 className="headerTwo">Get Involved</h1>
                <div id="volunteer-container">
                    <div id="volunteer-info">
                        <img src={exclamationMark} alt="exclamation-mark" />
                        <p className="bodyText" id="volunteer-text">Volunteering with Itty Bitty Critters is not hands-on animal rescue. Our focus is education, prevention, and promoting 
                        responsible wildlife interaction within the community.</p>
                    </div>
                    <div id="volunteer-contact">
                        <p className="bodyText">If you're interested in volunteering, we would love to hear from you. Please reach out with a brief introduction and let us know how you would like to help.</p>
                        <button className="cardTitleText" id="contact-btn" onClick={navPage}>
                            Contact Us for Volunteer Inquiries
                            <img src={whiteArrow} alt="white-arrow"/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    ); 
}

export default VolunteerGetInvolved;