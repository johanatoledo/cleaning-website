import { useState, useCallback, useRef, useEffect } from 'react';

export default function useQuote(csrfToken, getQuotePayload) {
    const [currentQuote, setCurrentQuote] = useState(null);
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [uiMessage, setUiMessage] = useState('');
    
    const priceAbortCtrlRef = useRef(null);
    const debounceTimerRef = useRef(null);
    const lastPayloadRef = useRef(null);

    
    useEffect(() => {
        return () => {
            if (priceAbortCtrlRef.current) priceAbortCtrlRef.current.abort();
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        };
    }, []);

    const fetchQuote = useCallback(async (data) => {
        const payload = getQuotePayload(data);

        
        if (!data.serviceCode || !payload || !csrfToken) return null;

        
        const stringifiedPayload = JSON.stringify(payload);
        if (lastPayloadRef.current === stringifiedPayload && currentQuote) {
            return currentQuote;
        }

        
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

        return new Promise((resolve) => {
            debounceTimerRef.current = setTimeout(async () => {
                lastPayloadRef.current = stringifiedPayload;
                setQuoteLoading(true);
                setUiMessage('');

                
                if (priceAbortCtrlRef.current) priceAbortCtrlRef.current.abort();
                priceAbortCtrlRef.current = new AbortController();
                
                try {
                    const res = await fetch(`/api/bookings/calculate?t=${Date.now()}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': csrfToken,
                        },
                        credentials: 'include',
                        body: stringifiedPayload,
                        signal: priceAbortCtrlRef.current.signal,
                    });

                    
                    if (res.status === 403) {
                        throw new Error('Su sesión ha expirado. Por favor, actualice la página.');
                    }

                    if (!res.ok) throw new Error('No pudimos calcular su presupuesto. Intente de nuevo.');
                    
                    const quoteData = await res.json();
                    setCurrentQuote(quoteData);
                    setQuoteLoading(false);
                    resolve(quoteData);

                } catch (err) {
                    if (err.name === 'AbortError') return;
                    
                    console.error("Error en fetchQuote:", err.message);
                    lastPayloadRef.current = null; 
                    setCurrentQuote(null);
                    setQuoteLoading(false);
                    setUiMessage(err.message);
                    resolve(null);
                }
            }, 500); 
        });
    }, [csrfToken, getQuotePayload, currentQuote]);

    return { currentQuote, setCurrentQuote, quoteLoading, uiMessage, fetchQuote };
};