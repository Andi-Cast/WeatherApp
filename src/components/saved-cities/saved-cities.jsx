import './saved-cities.css'

const SavedCities = ({cities, onCitySelected}) => {
    
    return(
        <div className="saved-cities">
            <h2>Saved Cities</h2>
            <ul>
                {cities.map((city, index) => (
                    <li className="city" key={index} onDoubleClick={() => onCitySelected(city)}>
                        <span>{city.label}</span>
                        <button> Delete City </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SavedCities;
