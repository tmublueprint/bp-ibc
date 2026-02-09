import './EducationPage.css'
import bandage from '/src/assets/education/bandageIcon.svg'
import babyAnimal from '/src/assets/education/babyAnimalIcon.svg'
import warning from '/src/assets/education/warningIcon.svg'

function EducationQuestions() {
    return (
        <div className="education_questions">
            <h1>Before You Act, Ask These Questions</h1>
            <div className="education_grid">
                <div className="education_item">
                    <img src={bandage} alt="Bandage"/>
                    <h2>Is the animal injured?</h2>
                    <p>consectetuer adipiscing elit, Lorem ipsum dolor sit amet, 
                        sed diam nonummy nibh eu consectetuer adipiscing elit
                    </p>
                </div>
                <div className="education_item">
                    <img src={babyAnimal} alt="Baby animal"/>
                    <h2>Is it a baby animal?</h2>
                    <p>consectetuer adipiscing elit, Lorem ipsum dolor sit amet, 
                        sed diam nonummy nibh eu consectetuer adipiscing elit
                    </p>
                </div>
                <div className="education_item">
                    <img src={warning} alt="Warning"/>
                    <h2>Is it in immediate danger?</h2>
                    <p>consectetuer adipiscing elit, Lorem ipsum dolor sit amet, 
                        sed diam nonummy nibh eu consectetuer adipiscing elit
                    </p>
                </div>
            </div>
            <h1>Please Do Not</h1>
            <div className="education_warnings">
                <ul>
                    <li>Feed wild animals food or water</li>
                    <li>Take animals home</li>
                </ul>
                <ul>
                    <li>Move animals away from where they were found</li>
                    <li>Assume an animal is abandoned without observing</li>
                </ul>
            </div>
    </div>
    )
}

export default EducationQuestions;
