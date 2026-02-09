import './AboutPage.css';
import shieldIcon from '/src/assets/about/shieldIcon.svg'
import heartIcon from '/src/assets/about/heartIcon.svg'
import lockIcon from '/src/assets/about/lockIcon.svg'

function EducationSection(){
    return (
        <section id="education">
            <h2 id="header-1">Why Education Comes First</h2>
            <div id="grid-1">
                <div>
                    <img src={shieldIcon} alt="Shield icon"/>
                    <h3>Prevent Unnecessary Intervention</h3>
                    <p>
                        Lorem ipsum dolor sit amet,
                        consectetuer adipiscing elit,
                        sed diam nonummy nibh eu
                    </p>
                </div>
                <div>
                    <img src={heartIcon} alt="Heart icon"/>
                    <h3>Protect Wildlife Families</h3>
                    <p>
                        Lorem ipsum dolor sit amet,
                        consectetuer adipiscing elit,
                        sed diam nonummy nibh eu
                        consectetuer adipiscing elit
                    </p>
                </div>
                <div>
                    <img src={lockIcon} alt="Lock icon"/>
                    <h3>Keep People Safe</h3>
                    <p>
                        Lorem ipsum dolor sit amet,
                        consectetuer adipiscing elit,
                        sed diam nonummy nibh eu
                        consectetuer adipiscing elit
                    </p>
                </div>
            </div>

            <h2 id="header-2">What We Do</h2>
            <div id="grid-2">
                <p>
                    • Provide clear guidance for people who
                    find wildlife
                </p>
                <p>
                    • Share resources to help people assess 
                    situations before acting
                </p>
                <p>
                    • Educate communities on safe and 
                    responsible wildlife interaction
                </p>
                <p>
                    • Promote coexistence between people 
                    and wildlife
                </p>
            </div>
        </section>
    );
}

export default EducationSection;