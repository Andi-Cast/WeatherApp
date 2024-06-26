import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import {GEO_API_URL, geoApiOptions} from "../../api"
import './Search.css'


const Search = ({onSearchChange}) => {

    const [search, setSearch] = useState(null);

    const loadOptions = async (inputValue) => {
        try {
            const response = await fetch(`${GEO_API_URL}/cities?minPopulation=500000&namePrefix=${inputValue}`, geoApiOptions);
            const result = await response.json();
            console.log(result);
    
            return {
                options: result.data.map((city) => {
                    return {
                        value: `${city.latitude} ${city.longitude}`,
                        label: `${city.name} ${city.countryCode}`,
                    };
                })
            };
        } catch (error) {
            console.error('Error fetching cities:', error);
            return {
                options: []
            };
        }
    };
    

    const handleOnChange = (searchData) => {
        setSearch(searchData);
        onSearchChange(searchData);
        setSearch(null);
    }

    return(
        <AsyncPaginate
            id="city-search"
            placeholder="Search for city"
            debounceTimeout={600}
            value={search}
            onChange={handleOnChange}
            loadOptions={loadOptions}
            classNamePrefix="react-select">
        </AsyncPaginate>
    )
}

export default Search;