export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark text-light py-4">
            <div className="container text-center">
                <p>© {currentYear} Pristine Homes. All rights reserved.</p>
            
            </div>
        </footer>
    )
};