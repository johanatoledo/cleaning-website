import React, { useMemo } from 'react';
import { useBooking } from '../../context/useBookingHooks';

export default function DateTimeStep() {
    const { booking, updateBooking } = useBooking();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateBooking(name, value);
    };

    const getMinDate = useMemo(() => {
        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(today.getDate() + 1); // Minimum date is tomorrow
        const year = minDate.getFullYear();
        const month = String(minDate.getMonth() + 1).padStart(2, '0');
        const day = String(minDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, []);

    return (
        <div className="row g-3">
            <div className="col-12 col-md-6">
                <label className="form-label">Date</label>
                <input
                    type="date"
                    className="form-control"
                    name="date"
                    required
                    min={getMinDate}
                    value={booking.date || ''}
                    onChange={handleInputChange}
                />
            </div>
            <div className="col-12 col-md-6">
                <label className="form-label">Hour</label>
                <input
                    type="time"
                    className="form-control"
                    name="time"
                    required
                    value={booking.time || ''}
                    onChange={handleInputChange}
                />
            </div>
            <div className="col-12">
                <label className="form-label">Address</label>
                <input
                    type="text"
                    className="form-control"
                    name="address"
                    placeholder="Calle 123, Ciudad"
                    required
                    value={booking.address || ''}
                    onChange={handleInputChange}
                />
            </div>
            <div className="col-12 col-md-6">
                <label className="form-label">Zip code</label>
                <input
                    type="text"
                    className="form-control"
                    name="zip"
                    pattern="[0-9]{4,6}"
                    required
                    value={booking.zip || ''}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
}

