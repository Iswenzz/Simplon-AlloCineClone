import "materialize-css";
import "./assets/scss/index.scss";
import axios, { AxiosResponse } from "axios";
import autocomplete, { AutocompleteItem } from "autocompleter";
import { apiKey } from "./config/key";
import { renderCards } from "./cards";
import { renderMovie } from "./movie";
import { IMovie, MovieResponse, PeopleImageResponse } from "moviedb";

M.AutoInit();
export const cardContainer = document.getElementById("card-container") as HTMLElement;
const searchHeader = document.getElementById("header-title") as HTMLHeadingElement;

export interface AutocompleteMovieItem extends AutocompleteItem
{
	id: number,
	poster?: string,
}

/**
 * Search bar autocomplete configuration.
 */
autocomplete<AutocompleteMovieItem>({
	input: document.getElementById("search") as HTMLInputElement,
	minLength: 2,
	preventSubmit: true,
	className: "search-dropdown white z-depth-2",
	fetch: async (text: string, update: (items: false | AutocompleteMovieItem[]) => void) => 
	{
		text = text.toLowerCase();

		// change search header
		if (searchHeader)
			searchHeader.innerText = text 
				? `"${text.toUpperCase()}" on Allociné` : "Search on Allociné";
		
		// render cards if movie container is defined
		const movies: IMovie[] = await queryMovies(text);
		if (cardContainer)
			renderCards(movies);

		// update autocompleter data
		const movieNames: AutocompleteMovieItem[] = movies.map((m: IMovie) => ({
			id: m.id,
			label: m.title,
			poster: m.poster_path,
			group: null,
		})).slice(0, 10);
		update(movieNames);
	},
	render: (item: AutocompleteMovieItem) => 
	{
		const div: HTMLDivElement = document.createElement("div");
		const img: HTMLImageElement = document.createElement("img");
		const p: HTMLParagraphElement = document.createElement("p");

		img.src = item.poster 
			? `https://image.tmdb.org/t/p/w400${item.poster}` 
			: "./src/assets/images/empty_portrait.webp";
		p.innerText = item.label;

		div.classList.add("autocomplete-item");
		div.append(img, p);
		return div;
	},
	onSelect: (item: AutocompleteMovieItem) =>
	{
		// TODO
	}
});

/**
 * Query a person portrait image URL.
 * @param id - The person ID.
 */
export const queryPersonImage = async (id: number): Promise<string> =>
{
	try
	{
		const res: AxiosResponse<PeopleImageResponse> = await axios.get(
			`https://api.themoviedb.org/3/person/${id}/images?api_key=${apiKey}`);
		return res.data.profiles[0] 
			? `https://image.tmdb.org/t/p/w400${res.data.profiles[0].file_path}` 
			: "./src/assets/images/empty_portrait.webp";
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};

/**
 * Query a movie from its id.
 * @param id - The movie ID.
 */
export const queryMovie = async (id: number): Promise<IMovie | null> =>
{
	try
	{
		const res: AxiosResponse<IMovie> = await axios.get(
			`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-EN&append_to_response=credits,videos,keywords`);
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
		const res: AxiosResponse<MovieResponse> = await axios.get(
			`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-EN&query=${name}&page=1&include_adult=false`);
		const data: IMovie[] = res.data.results.sort((a: IMovie, b: IMovie) => 
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