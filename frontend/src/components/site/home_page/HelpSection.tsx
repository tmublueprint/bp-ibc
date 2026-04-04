import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import GreenLeaf from '../../../assets/home/greenLeaf.svg';
import Paw from '../../../assets/home/bluePaw.svg';
import LeftHeart from '../../../assets/shared/leftHeart.svg';
import RightHeart from '../../../assets/shared/rightHeart.svg';
import GreenArrow from '../../../assets/shared/greenArrowThin.svg'

function HelpSection(){
    const navigate = useNavigate();
    return (
        <section id="home-page-section">
            <div id="help-section">
                <h3>How Itty Bitty Critter Helps</h3>
                <div className="gallery">
                    <div className="card-content">
                        <div className="icons">
                            <img src={GreenLeaf} alt="green-leaf"/>
                        </div>
                        <h3 className="card-title">Wildlife Education</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh eu</p>
                    </div>
                    <div className="card-content">
                        <div className="icons">
                            <img src={Paw} alt="blue-paw"/>
                        </div>
                        <h3 className="card-title">Guidance & Support</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh eu</p>
                        </div>
                    <div className="card-content">
                        <div className="icons">
                            <img src={LeftHeart} alt="left-hearthands"/>
                            <img src={RightHeart} alt="right-hearthands"/>
                        </div>
                        <h3 className="card-title">Community Awareness</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, nisl, sed diam nonummy nibh eu</p>
                    </div>
                </div>
                <h3>How You Can Help</h3>
                <div id="button-section">
                    <button onClick={() => navigate('/education')} id="page-button">
                        Learn About Wildlife
                    </button>
                    <button onClick={() => navigate('/volunteer')} id="page-button">
                        Volunteer With Us
                    </button>
                    <button onClick={() => navigate('/updates')} id="page-button"> {/*Placeholder used*/}
                        Follow Our Updates
                        <img src={GreenArrow} alt="arrow-right"/>
                    </button>
                </div>
            </div>
        </section>);
}
export default HelpSection;