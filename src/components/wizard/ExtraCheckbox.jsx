import React  from "react";
import { useBooking } from "../../context/useBookingHooks";

export default function ExtraCheckbox({ code, name, price, description }) {
    const { booking, updateBooking } = useBooking();
    const isChecked = booking.extras.includes(code);

    const handleToggle = () => {
        let newExtras;
        if(isChecked) {
            // Eliminar extra: Filtra el array, manteniendo todos excepto el actual
            newExtras = booking.extras.filter(extra => extra !== code);

        }else {
            // Añadir extra: Agrega el código al array
            newExtras = [...booking.extras,code];
        }
        // Actualiza el estado 'extras' en el contexto
        updateBooking('extras',newExtras);
    };

    return (
        <div className="col-12 col-sm-6">
            <div
              className={`card p-3 extra-card h-100 ${isChecked ? 'border-brand shadow-sm' : 'border-light'}`}
              onClick={handleToggle}
              style={{ cursor: 'pointer'}}
              >
                <div className="d-flex justify-content-between align-items-center ">
                    <div className="form-check m-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={isChecked}
                          onChange={handleToggle}
                          id={`extra-${code}`}
                          style={{cursor: 'pointer'}}
                          />
                          <label className="form-check-label fw-bold" htmlFor={`extra-${code}`}>
                            {name}
                          </label>
                    </div>
                    <span className="text-secondary small">
                        {price > 0 ? `+$${(price / 100).toFixed(2)}` : 'Free'}
                    </span>
                </div>
                <p className="small text-muted mt-2 mb-0">{description}</p>
              </div>
        </div>
    );

}