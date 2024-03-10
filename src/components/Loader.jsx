import './LoaderStyle.scss';
function Loader() {

    return (
        <div className="loader-container">
            <div className="loader book">
                <figure className="page"></figure>
                <figure className="page"></figure>
                <figure className="page"></figure>
            </div>
            <span className='position-absolute loading-text'>Loading...</span>
        </div>
    )
}

export default Loader;