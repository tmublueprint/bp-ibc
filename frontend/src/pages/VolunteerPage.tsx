import Navbar from '../components/site/navigation/Navbar'
import Footer from '../components/site/navigation/Footer'
import VolunteerInfo from '../components/site/volunteer_page/VolunteerInfoSection';
import VolunteerHelp from '../components/site/volunteer_page/VolunteerHelpSection'
import VolunteerLooksLike from '../components/site/volunteer_page/VolunteerLooksLikeSection';
import VolunteerGetInvolved from '../components/site/volunteer_page/VolunteerGetInvolvedSection';
import LoadFromPublished from '../components/site/LoadFromPublished'

function VolunteerPage() {
    return (
        <div data-id="4">
            <Navbar/>
            <VolunteerInfo/>
            <VolunteerLooksLike/>
            <VolunteerHelp/>
            <VolunteerGetInvolved/>
            <Footer/>
            <LoadFromPublished pageNumber={3} />
        </div>
    )
}

export default VolunteerPage