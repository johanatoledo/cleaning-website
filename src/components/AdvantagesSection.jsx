import AdvantageCard from "./AdvantageCard";
import  ProductsIcon  from "../assets/productosdelimpieza.png";
import  HouseIcon from '../assets/casalimpia.png';
import  EsterIcon from '../assets/esterilizacion.png';

const FirstIcon = (props) => (
    <img 
        src={HouseIcon} 
        alt="Verified Staff"
        {...props}
        style={{ 
            width: props.width || '60px', 
            height: props.height || '60px',
            objectFit: 'contain',
            ...props.style 
        }} 
    />
);

const  SecondIcon = (props) => (
    <img 
        src={ProductsIcon} 
        alt="Verified Staff"
        {...props}
        style={{ 
            width: props.width || '60px', 
            height: props.height || '60px',
            objectFit: 'contain',
            ...props.style 
        }} 
    />
);

const  ThirdIcon = (props) => (
    <img 
        src={EsterIcon} 
        alt="Verified Staff"
        {...props}
        style={{ 
            width: props.width || '60px', 
            height: props.height || '60px',
            objectFit: 'contain',
            ...props.style 
        }} 
    />
);

const advantages = [
    {
        Icon: FirstIcon,
        title:"Satisfaction Guarantes",
        description:"Not satisfied? We'll do it again free of charge."
    },
     {
        Icon: SecondIcon,
        title:"Ecological products",
        description:"We take care of your home and the planet."
    },
     {
        Icon: ThirdIcon,
        title: "Deep Sterilization of Bathrooms",
        description: "Hospital-grade disinfection to ensure a germ-free environment for your family."
    }
];

export default function AdvantagesSection() {
    return(
        <section className="py-5 bg-white">
            <div className="container">
                <div className="row text-center mb-4">
                    <h2 className="fw-bold">Why choose us?</h2>
                </div>
                <div className=" row g-3 g-lg-4" >
                    
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