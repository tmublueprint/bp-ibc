import Navbar from '../components/site/navigation/Navbar'
import Footer from '../components/site/navigation/Footer'
import WildlifeGuide from '../components/site/education_page/WildlifeGuideSection'
import NotEveryAnimal from '../components/site/education_page/NotEveryAnimalSection'
import EducationQuestions from '../components/site/education_page/EducationSection'

function EducationPage() {
    return (
        <div data-id="2">
            <Navbar/> 
            <WildlifeGuide/>
            <NotEveryAnimal />
            <EducationQuestions/>
            <Footer/> 
        </div>
    )
}

export default EducationPage