import Navbar from '../components/site/navigation/Navbar'
import Footer from '../components/site/navigation/Footer'
import FoundAnimal from '../components/site/home_page/FoundAnimalSection'
import DoNot from '../components/site/home_page/DoNotSection'
import Help from '../components/site/home_page/HelpSection'
import LoadFromPublished from '../components/site/LoadFromPublished'

function HomePage() {
    return (
        <div data-id="3">
            <Navbar/>
            <FoundAnimal/>
            <DoNot/>
            <Help/>
            <Footer/>
            <LoadFromPublished pageNumber={0} />
        </div>
    )
}

export default HomePage