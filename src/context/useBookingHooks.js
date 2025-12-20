
import { useContext } from 'react';
import { BookingContext, AuthContext } from './contexts';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBooking must be used within BookingProvider');
    return context;
};
