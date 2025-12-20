import BookingWizard from "../components/BookingWizard";
import { useLocation } from "react-router-dom";

export default function Booking() {
    const location = useLocation();
    const serviceCode = location.state?.serviceCode;

    return (
        <section data-view id="booking" className="py-5"  style={{ minHeight: '100vh', display: 'block' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10">
                        <BookingWizard initialServiceCode={serviceCode} />
                    </div>
                </div>
            </div>
        </section>
    );
}