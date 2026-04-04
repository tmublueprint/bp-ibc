import Navbar from '../components/site/navigation/Navbar'
import Footer from '../components/site/navigation/Footer'
import VolunteerInfo from '../components/site/volunteer_page/VolunteerInfoSection'; 
import VolunteerHelp from '../components/site/volunteer_page/VolunteerHelpSection'
import VolunteerLooksLike from '../components/site/volunteer_page/VolunteerLooksLikeSection'; 
import VolunteerGetInvolved from '../components/site/volunteer_page/VolunteerGetInvolvedSection'; 

function VolunteerPage() {


    return (
        <div data-id="4">            
            <Navbar/> 
            <VolunteerInfo/> 
            <VolunteerLooksLike/> 
            <VolunteerHelp/>
            <VolunteerGetInvolved/> 
            <Footer/>
        </div>
    )
}

export default VolunteerPage