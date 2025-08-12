import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Discover.css';
import { FaMapMarkerAlt, FaRegClock, FaSearch, FaBookmark, FaBinoculars, FaFilter } from 'react-icons/fa';

const apiURL = import.meta.env.VITE_API_URL; //process.env.REACT_APP_API_URL;
console.log('API URL:', apiURL);

// base tender
const baseTender = {
    title: "SUPPLY AND DELIVERY OF (162) BULK LAPTOPS FOR EXTENSION AND ADVISORY SERVICES",
    location: "Eastern Cape",
    closing: "Friday, 06 June 2025 - 11:00",
    tags: ["New", "Computer programming", "Consultancy"]
};

// mock data
const mockTenders = [
    { id: 1, ...baseTender },
    { id: 2, ...baseTender },
    { id: 3, ...baseTender }
];

//^^ LEGACY ^^

const Discover = () => {

    //triggered on initialisation.
    //Checks localstorage for previous stores and toggles the attribute on the body class then saves the setting to localStorage.
    useEffect(() => {
        const storedMode = localStorage.getItem("darkMode");
        if (storedMode === "true") {
            document.body.classList.toggle("dark-mode", true);
        }
        else {
            document.body.classList.toggle("dark-mode", false);
        }
    }, []);

    const [filters, setFilters] = useState(["New", "Programming", "Construction", "Emergency", "Green Energy", "x", "x", "x", "x", "x"]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('Popularity');
    const [tenders, setTenders] = useState([]);

    //Tender Logic (maybe nest in seperate classes?)
    useEffect(() => {
        const fetchTenders = async () => {
            try {
                //get tenders from lambda-test api
                const response = await axios.get(`${apiURL}/tender/fetch`); //await axios.get('https://ktomenjalj.execute-api.us-east-1.amazonaws.com/Prod/api/mocktender/getalltenders');
                const data = Array.isArray(response.data) ? response.data : [response.data]; //data can either be an array or initalises array for single object for flexibility.
                console.log("response:", response.headers, response, response.data); //log for testing :/
                const tenderData = data.map((item, index) => ({
                    index: index + 1,
                    id: item.tenderID,
                    title: item.title,
                    location: item.officeLocation,
                    closing: item.closingDate,
                    tags: item.tags ? item.tags.map(tag => tag.tagName) : [],
                }));
                //cache the data here -- it would likely be best to hold the full list of tags and tender info in the cache
                //we can query and filter based on all the tenders in the cache! we set a timer to refresh db query every 5-10min

                ///set tender to list/array? of tenders stored in [data]
                setTenders(tenderData);
            } catch (err) {
                console.error("Failed to fetch tenders:", err);
            }
        };
        //invoke
        fetchTenders();
    }, [/*implement refresh variable to reinitialise this function*/]);

    const removeFilter = (index) => {
        const updated = [...filters];
        updated.splice(index, 1);
        setFilters(updated);
    };

    const filteredTenders = tenders.filter(tender => {
        const titleMatch = tender.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filters.length === 0 || tender.tags.some(tag => filters.includes(tag));
        return titleMatch && matchesFilter
    });

    return (
        <div className="discovery-container">
            <h1 className="discovery-title">Discover</h1>
            <p className="discovery-subtitle">Search for public sector tenders in South Africa</p>

            <div className="filter-tags">
                {filters.map((filter, index) => (
                    <button key={index} className="filter-tag" onClick={() => removeFilter(index)}>
                        × {filter}
                    </button>
                ))}
            </div>

            <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="filter-button">
                    <FaFilter />
                </button>
            </div>

            <div className="sort-container">
                <label className="sort-label">Sort by</label>
                <select
                    className="sort-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option>Popularity</option>
                    <option>Date</option>
                    <option>Region</option>
                </select>
            </div>

            <div className="tender-list">
                {filteredTenders.map((tender) => (
                    <div className="tender-card" key={tender.id}>
                        <h2 className="tender-title">{tender.title}</h2>
                        <p className="tender-location"> <FaMapMarkerAlt />{tender.location}</p>
                        <p className="tender-closing"> <FaRegClock /> Closing Info: {tender.closing}</p>
                        <div className="tender-tags">
                            {tender.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className={`tag ${tag === "New" ? "tag-new" : "tag-blue"}`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="tender-icons">
                            <FaBookmark className="icon" />
                            <FaBinoculars className="icon" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Discover;
