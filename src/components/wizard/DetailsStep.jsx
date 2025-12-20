import React from 'react';
import { useBooking } from '../../context/useBookingHooks';

const frequencyOptions = [
    { value: 'Once', label: 'Once' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Biweekly', label: 'Biweekly' },
    { value: 'Monthly', label: 'Monthly' },
];

const extrasOptions = [
    { value: 'windows', label: 'Window cleaning', id: 'ex1' },
    { value: 'oven', label: 'Oven', id: 'ex2' },
    { value: 'fridge', label: 'Fridge', id: 'ex3' },
    { value: 'iron', label: 'Ironing', id: 'ex4' },
];

export default function DetailsStep() {
    const { booking, updateBooking } = useBooking();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newValue = (name === 'beds' || name === 'baths') ? parseInt(value) || 0 : value;
        updateBooking(name, newValue);
    };

    const handleExtraChange = (e) => {
        const { value, checked } = e.target;
        const currentExtras = booking.extras || [];
        let newExtras;
        if (checked) {
            newExtras = [...currentExtras, value];
        } else {
            newExtras = currentExtras.filter(extra => extra !== value);
        }
        updateBooking('extras', newExtras);
    };

    return (
        <div className="row g-3">
            <div className="col-6 col-md-3">
                <label className="form-label">Rooms</label>
                <input type="number" min="0" max="10" className="form-control" name="beds" value={booking.beds || '1'} onChange={handleInputChange} required />
            </div>
            <div className="col-6 col-md-3">
                <label className="form-label">Bathrooms</label>
                <input type="number" min="1" max="10" className="form-control" name="baths" value={booking.baths || '1'} onChange={handleInputChange} required />
            </div>
            <div className="col-12 col-md-6">
                <label className="form-label">Frequency</label>
                <select className="form-select" name="freq" value={booking.freq || 'Once'} onChange={handleInputChange} required>
                    {frequencyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
            <div className="col-12">
                <label className="form-label">Extras</label>
                <div className="row g-2">
                    {extrasOptions.map(extra => (
                        <div className="col-6 col-md-3" key={extra.value}>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={extra.value}
                                    id={extra.id}
                                    checked={(booking.extras || []).includes(extra.value)}
                                    onChange={handleExtraChange}
                                />
                                <label className="form-check-label" htmlFor={extra.id}>{extra.label}</label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}