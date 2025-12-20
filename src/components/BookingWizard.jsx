import React, { useEffect, useRef } from 'react';
import { useBooking, useAuth } from '../context/useBookingHooks';
import ProgressBar from './ProgressBar';


import { z } from 'zod';


import ServiceStep from './wizard/ServiceStep';
import DetailsStep from './wizard/DetailsStep';
import DateTimeStep from './wizard/DateTimeStep';
import ContactStep from './wizard/ContactStep';


const Step1Schema = z.object({
    serviceCode : z.string().min(1, "Please select a service type.")
});

 const Step2Schema = z.object({
    beds: z.number().min(1,"The number of bedrooms must be at least 1."),
    baths:z.number().min(1,"The number of bathrooms must be at least 1."),
    freq:z.enum(['Once','Weekly', 'Bi-weekly', 'Monthly'], { errorMap:() => ({message:  "Please select a valid cleaning frequency." })
    }),
    extras: z.array(z.string()).optional(),
 });

const Step3Schema = z.object({
    date: z.string().min(1, "A date is required for the reservation."),
    time: z.string().min(1, "A time slot is required."),
    address: z.string().min(5, "Please enter the full address."),
    zip: z.string().regex(/^\d{4,6}$/, "Zip code must be between 4 and 6 digits."),
});

const CustomerSchema = z.object({
    name: z.string().min(3, "The name is too short."),
    email: z.string().email("Invalid email address."),
    phone: z.string().regex(/^\+?(\d{10,15})$/, "Invalid phone number format."),
});



const StepSchemas = {
    1: Step1Schema,
     2: Step2Schema,
      3: Step3Schema,
       4: CustomerSchema ,
}

 export default function BookingWizard ({ initialServiceCode }) {
    const {
        booking,
        currentStep,
        setCurrentStep,
        setBooking, 
        fetchQuote,
        currentQuote,
        quoteLoading,
        uiMessage,
    } = useBooking ();
    const { isLoading: authLoading, error: authError } = useAuth();

    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
    
        if(authLoading || authError || currentStep === 1 || !booking.serviceCode) return;

      
        if(debounceTimeoutRef.current){
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            fetchQuote(booking);
        },250);

    
        return  () => {
            if(debounceTimeoutRef.current){
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    },[ booking, currentStep, fetchQuote,  authLoading, authError]);

    
    const validateStep = (step) => {
        const schema = StepSchemas[step];
        if (!schema) return true; 

        
        let dataToValidate = {};
        switch (step) {
            case 1:
                dataToValidate = { serviceCode: booking.serviceCode };
                break;
            case 2:
               
                dataToValidate = {
                    beds: Number(booking.beds),
                    baths: Number(booking.baths),
                    freq: booking.freq
                };
                break;
            case 3:
                dataToValidate = {
                    date: booking.date,
                    time: booking.time,
                    address: booking.address,
                    zip: booking.zip
                };
                break;
            case 4:
                dataToValidate = booking.customer;
                break;
            default:
                return true;
        }

        try {
            
            schema.parse(dataToValidate);
            return true;
        } catch (error) {
            const errorMessage = error.errors[0].message;
            alert(`Validation Error: ${errorMessage}`);
            return false;
        }
    };

    const handleNext = async () => {
        if (!validateStep(currentStep)) return;

        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            console.log('Step 4 validated. Ready to send quote from ContactStep component.');
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const isInitialized = useRef(false);
 
   useEffect(() => {
    if (initialServiceCode && !isInitialized.current) {
        isInitialized.current = true; 
        
        setBooking(prev => ({
            ...prev,
            serviceCode: initialServiceCode
        }));
        setCurrentStep(2);
    }
}, [initialServiceCode, setBooking, setCurrentStep]);

    const renderStep = () => {
        const stepComponents = {
            1: <ServiceStep />,
            2: <DetailsStep />,
            3: <DateTimeStep />,
            4: <ContactStep />,
        };

        return [1, 2, 3, 4].map((stepNum) => (
        <div 
            key={stepNum} 
            className={`booking-step ${currentStep !== stepNum ? 'd-none' : 'd-block'}`}
            
        >
            {stepComponents[stepNum]}
        </div>
    ));
    };

    if (authLoading) return <div className="text-center p-5">Loading application...</div>;
    console.log("Wizard Status:", { currentStep, service: booking.serviceCode, authLoading });
    return (
        <div className="bg-white rounded-2xl shadow-soft p-3 p-lg-4">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3">
                <h2 className="h4 mb-2 mb-md-0">Book your cleaning</h2>
                <div className="small text-muted">4-step process</div>
            </div>

            {authError && (
                <div className="alert alert-danger p-3 mb-3">{authError}</div>
            )}

            <ProgressBar />

            <form id="bookingForm" onSubmit={(e) => e.preventDefault()}>
                {renderStep()}

                {currentStep > 1 && (
                    <div className="alert alert-info small mt-3">
                        Estimated rate: <strong>{quoteLoading ? 'Calculating...' : (currentQuote ? `${Math.round(currentQuote?.amount || 0)}` : '—')}</strong>
                        {uiMessage && <p className='text-danger small mt-2 mb-0'> {uiMessage}</p>}
                    </div>
                )}

                <div id="wizard-nav-buttons" className="d-flex justify-content-between mt-4">
                    <button
                        type="button"
                        className={`btn btn-outline-secondary ${currentStep === 1 ? 'd-none' : ''}`}
                        data-prev
                        onClick={handlePrev}
                    >
                        Return
                    </button>

                    <button
                        type="button"
                        className="btn btn-brand"
                        data-next
                        onClick={handleNext}
                        disabled={quoteLoading}
                    >
                        {currentStep < 4 ? 'Following' : 'Send Quote Request'}
                    </button>
                </div>
            </form>
        </div>
    );
}