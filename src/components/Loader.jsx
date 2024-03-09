import './LoaderStyle.scss';
function Loader() {

    return (
        <div className="loader-container">
            <div class="loader book">
                <figure class="page"></figure>
                <figure class="page"></figure>
                <figure class="page"></figure>
            </div>
            <span className='position-absolute loading-text'>Loading...</span>
        </div>
    )
}

export default Loader;