import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import WhiteArrow from '/src/assets/shared/whiteArrow.svg';
import BabyAnimal from '/src/assets/home/babyAnimal.jpg';

function FoundAnimalSection(){
    const navigate = useNavigate();

    return (
        <section id="home-page-section">
            <div className="homepage-green">
                <div id="text-section">
                    <h1>Found a wild animal?</h1>
                    <h4>Before helping, learn what to do- and what NOT <br></br>
                        to do - to keep wildlife safe.
                    </h4>
                    <button onClick={() => navigate('/education')} id="main-button">
                        Learn What To Do First
                    </button>
                    <div id="link-white">
                        <a href="/volunteer">I want to help in other ways</a>
                        <img src={WhiteArrow} alt="arrow-right"/>
                    </div>
                </div>
                <div id="main-image">
                    <img src={BabyAnimal} alt="image of baby animal"/>
                </div>
            </div>
        </section>
    );
}

export default FoundAnimalSection;
