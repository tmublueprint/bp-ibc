import Navbar from '../components/site/navigation/Navbar'
import Footer from '../components/site/navigation/Footer'
import AboutIBCSection from '../components/site/about_page/AboutIBCSection'
import MissionSection from '../components/site/about_page/MissionSection'
import EducationSection from '../components/site/about_page/EducationSection'
import LoadFromPublished from '../components/site/LoadFromPublished'

function AboutPage() {
    return (
        <div data-id="1">
            <Navbar/>
            <AboutIBCSection/>
            <MissionSection/>
            <EducationSection/>
            <Footer/>
            <LoadFromPublished pageNumber={1} />
        </div>
    )
}

export default AboutPage