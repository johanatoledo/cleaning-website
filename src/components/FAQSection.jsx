import FAQItem from "./FAQItem";

const faqData =[
    {
        id:1,
        question:"Do you bring materials and equipament?",
        answer:"Yes, all included. If you prefer your own products, please indicate this in the reservation notes.",
        isOpen:false,
    },
    {
        id:2,
        question:"How does the warranty work?",
        answer:"If you are not satisfied, we will reschedule within 48 hours at no additional cost.",
        isOpen:false,
    },
    {
        id:3,
        question:"What payment methods do you accept?",
        answer:"Payment is made directly to our staff after the service. No online payments are required.",
        isOpen:false
    },

];

export default function FAQSection(){
    return(
        <section id="faq" className="py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-9">
                        <h2 className="fw-bold text-center mb-4">Frequently asked questions</h2>
                         <div className="accordion" id="faqAcc">
                            {faqData.map((item) => (
                                <FAQItem
                                  key={item.id}
                                  id={item.id}
                                  question={item.question}
                                  answer={item.answer}
                                  isInitiallyOpen={item.isOpen}
                                  />

                            ))}
                         </div>
                </div>
                </div>
            </div>
        </section>
    )
}