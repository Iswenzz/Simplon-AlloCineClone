import "./assets/scss/index.scss";
import "materialize-css";
import axios from "axios";
import autocomplete from "autocompleter";
import { apiKey } from "./config/key.js";
import { renderCards } from "./cards";
import { renderMovie } from "./movie";

M.AutoInit();
export const cardContainer = document.getElementById("card-container");
const searchHeader = document.getElementById("header-title");

/**
 * Search bar autocomplete configuration.
 */
autocomplete({
	input: document.getElementById("search"),
	minLength: 2,
	preventSubmit: true,
	className: "search-dropdown white z-depth-2",
	fetch: async (text, update) => 
	{
		text = text.toLowerCase();

		// change search header
		if (searchHeader)
			searchHeader.innerText = text 
				? `"${text.toUpperCase()}" sur Allociné` : "Recherche sur Allociné";
		
		// render cards if movie container is defined
		const movies = await queryMovies(text);
		if (cardContainer)
			renderCards(movies);

		// update autocompleter data
		const movieNames = movies.map(m => m.title);
		update(movieNames);
	},
	render: (item) => 
	{
		let div = document.createElement("div");
		div.textContent = item;
		return div;
	}
});

/**
 * Query a movie from its id.
 * @param {number} id - The movie ID.
 */
export const queryMovie = async (id) =>
{
	try
	{
		const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-EN`);
		return res.data;
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};

/**
 * Query all movies that contains the specified string.
 * @param {string} name - The movie query string.
 */
export const queryMovies = async (name) =>
{
	try
	{
		const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-EN&query=${name}&page=1&include_adult=false`);
		const data = res.data.results.sort((a, b) => a.title.localeCompare(b.title));

		return data;
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};

renderMovie();