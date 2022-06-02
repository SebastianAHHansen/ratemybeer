import React, { useState, useEffect, useRef } from 'react';
import Data from "./data.json"
import { v1 as uuidv1 } from 'uuid'
import axios from 'axios';
import './App.css';

// React Icons 
import { FiEdit3 } from 'react-icons/fi';
import { AiFillDelete } from 'react-icons/ai';
import { FaBeer } from 'react-icons/fa';

/**
 * Rate My Beer App - Full CRUD functionality - Local JSON Database
 * @includes useEffect(), saveBeer(), deleteBeer(), populateBeer(), updateBeer(), saveJson() & downloadJsonFile()
 * 
 */
function Beers() {

    //References
    const beerRef = useRef();
    const categoryRef = useRef();
    const ratingRef = useRef();

    //States
    const [data, setData] = useState(Data);

    //Temp States
    const [beer, setBeer] = useState();
    const [category, setCategory] = useState();
    const [rating, setRating] = useState();
    const [searching, setSearching] = useState("");

    const [updatedID, setUpdatedID] = useState();
    const [updatedBeer, setUpdatedBeer] = useState();
    const [updatedCategory, setUpdatedCategory] = useState();
    const [updatedRating, setUpdatedRating] = useState();

    //useEffect - Clear Input Forms
    useEffect(() => {
        //Clear Input Forms
        beerRef.current.value='';
        categoryRef.current.value='';
        ratingRef.current.value='';
    }, [data]);

    //Save Beer
    const saveBeer = () => {
        // Checks if input forms are containing values
        if (beer && category && rating <=10 && rating >0) {
            //Create New Object
            let newBeer = {
                // uuidv1 extension creates unique ID
                "id": uuidv1(),
                "beer": beer,
                "category": category,
                "rating": rating
            }
            //Merge new post with copy of old state
            let addsNewBeer = [...data, newBeer];

            //Push new object to state
            setData(addsNewBeer)

            //Clear Beer, Category & Rating from state
            setBeer()
            setCategory()
            setRating()

            //Writes values to JSON
            saveJson(addsNewBeer);

            // Successfull alert
            return alert("Great Success!")
        } else {
            // Incorrect alert
            return alert("Please fill in all forms to save a Beer. Note that the rating must be between 1-10.")
        }
    };

    //Delete Beer
    const deleteBeer = (key) => {
        //Filter out beers containing that specific ID
        let filterOutBeers = [...data].filter(obj => obj.id!==key);
        //Save the rest in state
        setData(filterOutBeers);

        //Writes to JSON File 
        saveJson(filterOutBeers);
    };

    //Populate Beer
    const populateBeer = (key, beer, category, rating) => {
        setUpdatedID(key);
        setUpdatedBeer(beer);
        setUpdatedCategory(category);
        setUpdatedRating(rating);
    };

    //Update Beer
    const updateBeers = (key) => {
        //Populate post info from temp state and prepare new object for changed post
        let editBeer = {
            "id": updatedID,
            "beer": updatedBeer,
            "category": updatedCategory,
            "rating": updatedRating
        }
        //Remove the old object with same ID and get the remaining data
        let filterBeers = [...data].filter(obj => obj.id!==updatedID);

        //Prepare object with edited post + remaining data from object new object
        let editedBeers = [...filterBeers, editBeer];
        setData(editedBeers)

        setUpdatedID();
        setUpdatedBeer();
        setUpdatedCategory();
        setUpdatedRating();

        //Writes values to JSON
        saveJson(editedBeers);
    };

    //Write to JSON File 
    const saveJson = (beers) => {
        //API URL // End Point from Node Server / Express Server
        const url = 'http://localhost:8080/beers'
        axios.post(url, beers)
        .then(response => {
        });
    }

    //Download JSON File
    const downloadJsonFile = jsonData => {
        const fileData = JSON.stringify(jsonData);
        const blob = new Blob([fileData], {beer: "text/plain"});
        const url = URL.createObjectURL(blob);
        //Creates Link
        const link = document.createElement('a');

        //Point link to file to be Downloaded
        link.download = 'rateMyBeerData.json';
        link.href = url;

        //Trigger Download
        link.click();
    }

    //Content
        return (
            <div className="App">
                <h1>Rate My Beer <FaBeer/></h1>
                <hr/>
                {/* Rate Beer */}
                <div className="rateBeer">
                <h3>Add A New Beer</h3>
                <h4>These forms are required fields to save a Beer</h4>
                    {/* Input Form - Beer */}
                    <input placeholder="Beer *"
                    onChange= { e => setBeer( e.target.value ) } 
                    value={ beer || '' }
                    ref={ beerRef } 
                    required
                    />
                    <br/>

                    {/* Input Form - Category */}
                    <input placeholder="Category *"
                    onChange= { e => setCategory( e.target.value ) } 
                    value={ category || '' }
                    ref={ categoryRef }
                    required
                    />
                    <br/>

                    {/* Input Form - Rating */}
                    <input type="number" min="1" max="10" placeholder="Rating 1-10 *" 
                    onChange= { e => setRating( e.target.value ) } 
                    value={ rating || '' }
                    ref={ ratingRef } 
                    required
                    />
                    <br/>
                    {/* Button - onClick - Save Beer */}
                    <button onClick= { saveBeer }>Cheers!</button>
                </div>

                {/* Search Beer */}
                <div className="searchBeer">
                <h3>Search For Your Saved Beers</h3>
                    {/* Input Search Beer - onChange event */}
                    <input className="search" 
                    type="search" 
                    placeholder="Search Beer"
                    onChange={event => setSearching(event.target.value)}
                    />
                </div>

                {/* Update Beer */}
                {/* Only appears when user clicks on Edit Button */}
                {updatedBeer || updatedCategory || updatedRating ? 
                (
                <div className="updateBeer">
                        <h3>Edit Your Beer</h3>
                            {/* Input Form - Beer (Update) */}
                            <input placeholder="Beer"
                            onChange= { e => setUpdatedBeer( e.target.value ) } 
                            value={ updatedBeer || '' }
                            required
                            />
                            <br/>
                            {/* Input Form - Category (Update) */}
                            <input placeholder="Category"
                            onChange= { e => setUpdatedCategory( e.target.value ) } 
                            value={ updatedCategory || '' }
                            required
                            />
                            <br/>
                            {/* Input Form - Number (Update) */}
                            <input type="number" min="1" max="10" placeholder="Rating"
                            onChange= { e => setUpdatedRating( e.target.value ) } 
                            value={ updatedRating || '' }
                            required
                            />
                            <br/>
                            {/* Button - Update Beer - onClick */}
                            <button onClick= { updateBeers }>Update Beer</button>
                            </div>
                ): null }

                {/* List All Beers */}
                <div className="allBeersListed">
                    <h3>All Saved Beers</h3>
                    <br/><br/>
                    {/* Table */}
                    <table className="table">
                        {/* Table Head */}
                        <thead>
                            {/* Table Row */}
                            <tr>
                            <th className="th-beer">Beer</th>
                            <th className="th-category" >Category</th>
                            <th className="th-rating" >Rating</th>
                            <th className="th-edit" >Edit</th>
                            <th className="th-delete" >Delete</th>
                        </tr>
                        </thead>
                    </table>
                </div>  

        {/* Filter() - Search  */}
        { data ? data.filter((beer)=>{
            return beer.beer.toLowerCase().includes(searching) || beer.category.toLowerCase().includes(searching);
        
        // Map() Database
        }).map(beers => {
            return (
                <div key={ beers.id } className="allBeers">
                {/* Table */}
                    <table className="table">
                                {/* Table Rows */}
                                <thead>
                                    <tr>
                                    {/* Table Data */}
                                    <td className="td-beer" >{beers.beer}</td>
                                    <td className="td-category" >{beers.category}</td>
                                    <td className="td-rating" >{beers.rating}/10</td>
                                    {/* Buttons */}
                                    <td className="td-edit" >
                                        {/* Edit Button */}
                                        <button onClick = { () => populateBeer(beers.id, beers.beer, beers.category, beers.rating)}><FiEdit3/></button>
                                    </td>
                                    <td className="td-delete" >
                                        {/* Delete Button */}
                                        <button onClick = { () => deleteBeer(beers.id)}><AiFillDelete/></button>
                                    </td>
                                </tr>
                                </thead>
                        </table>
                </div>
            )       
            }): null} 

             {/* Download JSON File */}
            <div className="downloadJson">
                <h3>Remember All of your Saved Beers</h3>
                <button onClick={ e => downloadJsonFile(data) }>Download Database File</button>
                <h5>Remember: When you drive never drink</h5>
                <hr/>
            </div>
        </div>
        );
}

export default Beers;