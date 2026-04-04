import Navbar from '../components/site/navigation/Navbar'
import Footer from '../components/site/navigation/Footer'
import FoundAnimal from '../components/site/home_page/FoundAnimalSection'
import DoNot from '../components/site/home_page/DoNotSection'
import Help from '../components/site/home_page/HelpSection'

function HomePage() {
    return (
        <div data-id="3">
            <Navbar/>
            <FoundAnimal/>
            <DoNot/>
            <Help/>
            <Footer/> 
        </div>
    )
}

export default HomePage