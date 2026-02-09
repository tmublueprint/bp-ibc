import Navbar from '../components/site/navigation/Navbar'
import Footer from '../components/site/navigation/Footer'
import AboutIBCSection from '../components/site/about_page/AboutIBCSection'
import MissionSection from '../components/site/about_page/MissionSection'
import EducationSection from '../components/site/about_page/EducationSection'

function AboutPage() {
    return (
        <>
            <Navbar/>
            <AboutIBCSection/>
            <MissionSection/>
            <EducationSection/>
            <Footer/>
        </>
    )
}

export default AboutPage