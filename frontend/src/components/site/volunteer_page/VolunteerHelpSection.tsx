import './VolunteerPage.css'

function VolunteerHelp() {
    return (
        <div className="ways_you_can_help">
            <h1 className="volunteer-help-main-heading">Ways You Can Help</h1>
            <div className="help_info_containers">
                <div className="help_info_container">
                    <h2>Education & Outreach Support</h2>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh eu</p>
                </div>
                <div className="help_info_container">
                    <h2>Administrative Assistance</h2>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh eu</p>
                </div>
                <div className="help_info_container">
                    <h2>Event or Fundraising Help</h2>
                    <p>Lorem ipsum dolor sit amet consectetuer adipiscing elit, sed diam nonummy nibh eu consectetuer adipiscing elit</p>
                </div>
            </div>
            <h1 className="volunteer-help-main-heading" style={{ marginTop: '100px' }}>
                What We Look For in Volunteers
            </h1>
            <div className="volunteer_attributes">
                <ul>
                    <li>Compassionate and calm</li>
                    <li>Reliable and respectful of guidelines</li>
                    <li>Comfortable working as part of a team</li>
                    <li>Open to learning — and unlearning — common wildlife misconceptions</li>
                </ul>
            </div>
        </div>
    )
}

export default VolunteerHelp;
