export default function LoadingScreen({ isLoading }) {
    return (
        <div className={`loading-screen ${isLoading ? '' : 'hidden'}`}>
            <span className="loader"></span>
        </div>
    );
}