import "materialize-css";
import "./assets/scss/index.scss";
import axios, { AxiosResponse } from "axios";
import autocomplete, { AutocompleteItem } from "autocompleter";
import { apiKey } from "./config/key";
import { IMovie, MovieResponse, PeopleImageResponse } from "moviedb";
import { renderCardContainer } from "./search";
import { renderMovie } from "./movie";

M.AutoInit();
export const searchBox = document.getElementById("search") as HTMLInputElement;

export interface AutocompleteMovieItem extends AutocompleteItem
{
	id: number,
	poster?: string,
}

/**
 * Searchbox keydown event callback.
 */
searchBox.addEventListener("keydown", (e: KeyboardEvent) =>
{
	if (e.keyCode === 13)
		window.location.href = `search.html?search=${(e.target as HTMLInputElement).value}`;
});

/**
 * Search bar autocomplete configuration.
 */
autocomplete<AutocompleteMovieItem>({
	input: searchBox,
	minLength: 2,
	preventSubmit: true,
	className: "search-dropdown white z-depth-2",
	fetch: async (text: string, update: (items: false | AutocompleteMovieItem[]) => void) => 
	{
		text = text.toLowerCase();
		
		// update autocompleter data
		const movies: IMovie[] = await queryMovies(text);
		const movieNames: AutocompleteMovieItem[] = movies?.map((m: IMovie) => ({
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
		div.addEventListener("click", () => window.location.href = `movie.html?id=${item.id}`);
		return div;
	},
	onSelect: () => null
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

renderCardContainer();
renderMovie();
