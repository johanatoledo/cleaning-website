

export default function FAQItem({ id, question, answer, isInitiallyOpen }) {
  const targetId = `q${id}`;
  const collapseClass = isInitiallyOpen
    ? "accordion-collapse collapse show"
    : "accordion-collapse collapse";
  const buttonClass = `accordion-button${!isInitiallyOpen ? " collapsed" : ""}`;

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          className={buttonClass}
          data-bs-toggle="collapse"
          data-bs-target={`#${targetId}`}
        >
          {question}
        </button>
      </h2>
      <div id={targetId} className={collapseClass} data-bs-parent="#faqAcc">
        <div className="accordion-body">{answer}</div>
      </div>
    </div>
  );
}