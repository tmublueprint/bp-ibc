import './ContactPage.css';

function ContactInfo() {
    return (
        <section id="contact-info-section">
            <h2>Get in Touch</h2>
            <div className="contact-details">
                <div className="contact-detail-item">
                    <span>Email</span>
                    <a href="mailto:info@ittybittycrittes.org">info@ittybittycrittes.org</a>
                </div>
                <div className="contact-detail-item">
                    <span>Phone</span>
                    <a href="tel:+15551234567">(647) 123-4567</a>
                </div>
                <div className="contact-detail-item">
                    <span>Location</span>
                    <span>Toronto, ON</span>
                </div>
                <div className="contact-detail-item">
                    <span>Response Time</span>
                    <span>Within 2–3 business days</span>
                </div>
            </div>
        </section>
    );
}

export default ContactInfo;
