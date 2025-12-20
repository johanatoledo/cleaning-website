import Hero from '../components/Hero';
import StepsSection from '../components/StepsSection';
import ServicesSection from '../components/ServicesSection';
import AdvantagesSection from '../components/AdvantagesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';


export default function Home() {
    return (
        <>
            <Hero />
            <StepsSection />
            <ServicesSection />
            <AdvantagesSection />
            <TestimonialsSection />
            <FAQSection />
        </>
    );
}