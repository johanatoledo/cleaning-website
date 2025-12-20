import React from 'react';
import { useBooking } from '../context/useBookingHooks';

const steps = [
  { num: 1, label: 'Service' },
  { num: 2, label: 'Details' },
  { num: 3, label: 'Date & Time' },
  { num: 4, label: 'Contact' },
];

export default function ProgressBar() {
  const { currentStep } = useBooking();

 
  const getStepClassName = (stepNum) => {
    if (stepNum < currentStep) {
      return 'step active'; 
    } else if (stepNum === currentStep) {
      return 'step active';
    } else {
      return 'step';
    }
  };

  const getStepCircleClassName = (stepNum) => {
    let baseClass = "step-circle d-flex align-items-center justify-content-center rounded-circle fw-bold";
    if (stepNum <= currentStep) {
      
      return `${baseClass} bg-brand text-white`;
    } else {
      
      return `${baseClass} bg-secondary-subtle text-secondary`;
    }
  };


  return (
    <div className="d-flex justify-content-between align-items-center mb-5">
      {steps.map((step, index) => (
        <React.Fragment key={step.num}>
          <div
            className={`d-flex flex-column align-items-center flex-fill ${getStepClassName(step.num)}`}
            data-step={step.num}
          >
            <div className={getStepCircleClassName(step.num)}>
              {step.num}
            </div>
            <span className="mt-2 text-sm-start text-center text-muted fw-medium text-black">
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div key={`line-${step.num}`} className="flex-fill border-top border-secondary-subtle mx-2"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}