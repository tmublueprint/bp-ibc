import Navbar from '../components/site/navigation/Navbar';
import Footer from '../components/site/navigation/Footer';
import ContactHero from '../components/site/contact_page/ContactHeroSection';
import ContactInfo from '../components/site/contact_page/ContactInfoSection';

function ContactPage() {
    return (
        <div data-id="5">
            <Navbar />
            <ContactHero />
            <ContactInfo />
            <Footer />
        </div>
    );
}

export default ContactPage;
