import './VolunteerPage.css'
import greenBg from '/src/assets/shared/greenBackground.svg'; 

function VolunteerLooksLike() {
    return (
        <>
            <div id="volun-looks-like" style={{height: "350px", width:"100%"}}>
                <img src={greenBg} alt="green-bg" style={{objectFit: "cover", width: "100%", height: "100%"}}/>
                <div className="overlayText">
                    <h1 className="headerTwo" style={{color: "white", width: "950px", marginBottom: "20px"}}>What Volunteering Looks Like</h1>
                    <p className="bodyText" style={{color: "#DCDACD", width: "1000px"}}>Volunteers do not handle wildlife directly. Instead, they support our work through educa-
                    tion, organization, and community outreach.</p>  
                </div>
            </div>
        </>
    ); 
}

export default VolunteerLooksLike;