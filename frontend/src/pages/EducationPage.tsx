import Navbar from '../components/site/navigation/Navbar'
import Footer from '../components/site/navigation/Footer'
import WildlifeGuide from '../components/site/education_page/WildlifeGuideSection'
import NotEveryAnimal from '../components/site/education_page/NotEveryAnimalSection'
import EducationQuestions from '../components/site/education_page/EducationSection'

function EducationPage() {
    return (
        <>
            <Navbar/> 
            <WildlifeGuide/>
            <NotEveryAnimal />
            <EducationQuestions/>
            <Footer/> 
        </>
    )
}

export default EducationPage