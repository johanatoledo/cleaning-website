import AdvantageCard from "./AdvantageCard";



const UserIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/>
    </svg>
);

const ChatIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1-2-2H4"/>
    </svg>
);

const EcologyIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 9M1 15l5.36 3.36A9 9 0 0 0 20.49 15"/>
    </svg>
);


const advantages = [
    {
        Icon: UserIcon,
        title:"Verified staff",
        description:"Background checks and ongoing training."
    },
     {
        Icon: ChatIcon,
        title:"Satisfaction Guarantes",
        description:"Not satisfied? We'll do it again free of charge."
    },
     {
        Icon: EcologyIcon,
        title:"Ecological products",
        description:"We take care of your home and the planet."
    }
];

export default function AdvantagesSection() {
    return(
        <section className="py-5 bg-white">
            <div className="container">
                <div className="row text-center mb-4">
                    <h2 className="fw-bold">Why choose us?</h2>
                </div>
                <div className=" row g-3 g-lg-4">
                    
                   {advantages.map((item, index) => (
                     <AdvantageCard
                      key={index}
                      Icon={item.Icon}
                      title={item.title}
                      description={item.description}
                      />
                   ))}
                </div>
            </div>
        </section>
    )
}