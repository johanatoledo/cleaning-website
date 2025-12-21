export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark text-light py-4">
            <div className="container text-center">
                <p>  Creado por ToledanaDev   {currentYear}</p>
            
            </div>
        </footer>
    )
};