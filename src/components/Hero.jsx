
import bannerImage from '../assets/banner.png';

export default function Hero() {
    return (
        <section 
            className='hero hero-min'
            style={{ backgroundImage: `url(${bannerImage})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
        >
            <div className='container py-5'>
                <div div className='row align-items-center g-4'>
                    
                    <div className='col-12 col-lg-6'>
                        <span className='badge rounded-pill brand-pill mb-4' style={{ background: 'rgba(187, 91, 235, 0.3)', color: 'var(--pristine-black)' }} >
                            Professional Cleaning · Fast · Guaranteed
                        </span>
                        <h1 className='display-5 fw-bold lh-tight mb-4'>
                            Your spotless home in hours, not days!
                        </h1>
                        <p className='lead mb-4'>
                            Experts in washing and disinfection: Quality and Professionalism at your service
                        </p>
                        
                        
                        <div className='d-flex gap-4 mt-4 small text-muted'>
                            <div className='d-flex align-items-center gap-2'>
                                <span className='icon-circle' style={{ background: 'rgba(46,191,165,.12)', color: 'var(--pristine-black)' }}>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                        <polyline points='20 6 9 17 4 12'></polyline>
                                    </svg>
                                </span>
                                Verified staff
                            </div>
                            <div className='d-flex align-items-center gap-2'>
                                <span className='icon-circle'  style={{ background: 'rgba(187, 91, 235, 0.12)', color: 'var(--pristine-black)' }}>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                        <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'></path>
                                    </svg>
                                </span>
                                100% Guarantee
                            </div>
                            <div className='d-flex align-items-center gap-2'>
                                <span className='icon-circle' style={{ background: 'rgba(46,191,165,.12)', color: 'var(--pristine-black)' }}>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                        <path d='M3 3h18v4H3z'></path>
                                        <path d='M16 7v13a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V7'></path>
                                    </svg>
                                </span>
                                Eco-friendly
                            </div>
                        </div>
                    </div>
                 </div>
               </div>    
        </section>
    );
}
