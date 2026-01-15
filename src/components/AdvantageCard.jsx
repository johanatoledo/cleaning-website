// eslint-disable-next-line no-unused-vars
export default function AdvantageCard({ Icon, title, description }) {
    return (
        <div className="col-12 col-md-4 ">
            <div className="p-4 bg-white rounded-2xl sw-card-green h-100">
                <div className="icon-circle mb-2">
                    <Icon width="50" height="50" viewBox="0 0 24 24" stroke="currentColor" />
                </div>
                <h3 className="h6 fw-bold mb-1">{title}</h3>
                <p className="text-muted small mb-0">{description}</p>
            </div>
        </div>
    );
}