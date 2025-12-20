
import React, { useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { BookingContext, AuthContext } from './contexts';

const initialBookingState = {
    
    serviceCode: '',
    beds: 1,
    baths: 1,
    freq: 'Once', 
    extras: [],
    date: '',
    time: '',
    address: '',
    zip: '',
    customer: { name: '', email: '', phone: '' },
    
};

export const AuthProvider = ({ children }) => {
    const [csrfToken, setCsrfToken] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCsrfToken = useCallback(async () => {
        try {
            const res = await fetch('/api/csrf-token');
            
        
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Oops, we didn't get JSON from the server! Check your API route.");
            }

            if (!res.ok) throw new Error('Failed to get CSRF token.');
            
            const data = await res.json();
            setCsrfToken(data.csrfToken);
            console.log('CSRF Token obtenido correctamente');
            setIsLoading(false);
        } catch (err) {
            console.error('Error getting CSRF token:', err);
            setError('Connection error with the server.');
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCsrfToken();
    }, [fetchCsrfToken]);

    const value = { csrfToken, isLoading, error };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const BookingProvider = ({ children }) => {
    const { csrfToken } = useContext(AuthContext);
    const [booking, setBooking] = useState(initialBookingState);
    const [currentStep, setCurrentStep] = useState(1); 
    const [currentQuote, setCurrentQuote] = useState(null); 
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [uiMessage, setUiMessage] = useState('');
    
    const priceAbortCtrlRef = useRef(new AbortController());
    const currentQuoteRef = useRef(currentQuote);

   
     useEffect(() => {
       currentQuoteRef.current = currentQuote;
   }, [currentQuote]);
    
    const getQuotePayload = useCallback((bookingData) => {
        if (!bookingData.serviceCode) {
            console.log('Incomplete quote data: missing serviceCode.');
            return null;
        }

        const freqMap = {
            'Once': 'one-time',
            'Weekly': 'weekly',
            'Bi-weekly': 'biweekly',
            'Biweekly': 'biweekly',
            'Monthly': 'monthly',
        };
        const mappedFreq = freqMap[bookingData.freq] || 'one-time';


        let quoteAmount = bookingData.quoteAmount;
        if (!quoteAmount) {
            quoteAmount = 5000 + (Number(bookingData.beds) * 1000) + (Number(bookingData.baths) * 1000);
        }

        return {
            serviceCode: bookingData.serviceCode,
            beds: Number(bookingData.beds),
            baths: Number(bookingData.baths),
            freq: mappedFreq,
            extras: bookingData.extras || [],
            date: bookingData.date,
            time: bookingData.time,
            address: bookingData.address,
            zip: bookingData.zip,
            customer: bookingData.customer,
            quoteAmount: Number(quoteAmount)
        };
    }, []);

 
    const fetchQuote = useCallback(async (data) => {
        const payload = getQuotePayload(data);
        if (!data.serviceCode || !payload || !csrfToken) return null;

        setQuoteLoading(true);
        setUiMessage('');

        if (priceAbortCtrlRef.current) priceAbortCtrlRef.current.abort();
        priceAbortCtrlRef.current = new AbortController();

       
        
        try {
            const res = await fetch('/api/bookings/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify(payload),
                signal: priceAbortCtrlRef.current.signal,
            });

            if (!res.ok) throw new Error(await res.text() || 'Pricing service not available.');
            
            const quoteData = await res.json();
            setCurrentQuote(quoteData);
            setQuoteLoading(false);
            return quoteData;

        } catch (err) {
            if (err.name === 'AbortError') {
                return currentQuoteRef.current; 
            }
            console.error('Error fetching quote:', err);
            setCurrentQuote(null);
            setQuoteLoading(false);
            setUiMessage(err.message || 'The quote could not be calculated. Please check your input.');
            return null;
        }
    }, [csrfToken, getQuotePayload]);

    
    const updateBooking = useCallback((key, value) => {
        if (key === 'customer') {
             setBooking(prev => ({
                ...prev,
                customer: { ...prev.customer, ...value }
             }));
        } else {
            setBooking(prev => ({ ...prev, [key]: value }));
        }
    }, []);

    const value = useMemo(() => ({
        booking,
        updateBooking,
        setBooking, 
        currentStep,
        setCurrentStep,
        currentQuote,
        quoteLoading,
        uiMessage,
        fetchQuote,
        initialBookingState
    }), [booking,updateBooking, currentStep, currentQuote, quoteLoading, uiMessage, fetchQuote]);

    return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};