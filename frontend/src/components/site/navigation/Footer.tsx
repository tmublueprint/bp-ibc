import './Footer.css'
import facebook from '/src/assets/navigation/facebook.svg'

function Footer() {
    return (
        <footer style={{fontFamily: 'DM Sans, sans-serif', paddingTop: '50px', paddingBottom: '50px'}}>
            <h1 className="footerDesc1">We are not an emergency drop-off location.</h1>
            <h1 className="footerDesc2">Please consult our guide before contacting us.</h1>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <img src={facebook} alt="Facebook logo"/>
                <a href="https://www.facebook.com/people/Itty-bitty-critters-Wildlife-Rehabilitation/100064814888128/"><p className="facebook">Facebook</p></a>
                <svg width="1" height="35" viewBox="0 0 1 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.5 0V35" stroke="white" strokeMiterlimit="10"/>
                </svg>
                <p className="ibc">Itty Bitty Critters</p>
            </div>
        </footer>
    );
}

export default Footer;