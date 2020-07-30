import "./assets/scss/index.scss";
import "materialize-css";
import axios, { AxiosResponse } from "axios";
import autocomplete, { AutocompleteItem } from "autocompleter";
import { apiKey } from "./config/key.js";
import { renderCards } from "./cards";
import { renderMovie, IMovie } from "./movie";

M.AutoInit();
export const cardContainer = document.getElementById("card-container") as HTMLElement;
const searchHeader = document.getElementById("header-title") as HTMLHeadingElement;

export interface MovieDBResponse
{
	page: number,
	results: IMovie[],
	total_pages: number,
	total_results: number
}

/**
 * Search bar autocomplete configuration.
 */
autocomplete({
	input: document.getElementById("search") as HTMLInputElement,
	minLength: 2,
	preventSubmit: true,
	className: "search-dropdown white z-depth-2",
	fetch: async (text: string, update: (items: false | AutocompleteItem[]) => void) => 
	{
		text = text.toLowerCase();

		// change search header
		if (searchHeader)
			searchHeader.innerText = text 
				? `"${text.toUpperCase()}" sur Allociné` : "Recherche sur Allociné";
		
		// render cards if movie container is defined
		const movies: IMovie[] = await queryMovies(text);
		if (cardContainer)
			renderCards(movies);

		// update autocompleter data
		const movieNames = movies.map((m: any) => m.title);
		update(movieNames);
	},
	render: (item: AutocompleteItem) => 
	{
		let div = document.createElement("div");
		div.textContent = item as string;
		return div;
	},
	onSelect: () =>
	{
		// TODO
	}
});

/**
 * Query a movie from its id.
 * @param id - The movie ID.
 */
export const queryMovie = async (id: number): Promise<MovieDBResponse | null> =>
{
	try
	{
		const res: AxiosResponse<MovieDBResponse> = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-EN`);
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
 * @param name - The movie query string.
 */
export const queryMovies = async (name: string): Promise<IMovie[] | null> =>
{
	try
	{
		const res: AxiosResponse<MovieDBResponse> = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-EN&query=${name}&page=1&include_adult=false`);
		console.log(res);
		const data: any = res.data.results.sort((a: IMovie, b: IMovie) => 
			a.title.localeCompare(b.title));

		return data;
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};

renderMovie();