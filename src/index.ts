import "materialize-css";
import "./assets/scss/index.scss";
import axios, { AxiosResponse } from "axios";
import autocomplete, { AutocompleteItem } from "autocompleter";
import { apiKey } from "./config/key";
import { IMedia, MediaResponse, PeopleImageResponse, MediaType, ITv, IMovie } from "moviedb";
import { renderCardContainer } from "./search";
import { renderMedia } from "./media";

M.Tabs.init(document.getElementById("nav-tabs"));
M.Parallax.init(document.getElementById("plx"));
export const searchBox = document.getElementById("search") as HTMLInputElement;
export const upcomingCarousel = document.getElementById("upcoming-carousel") as HTMLDivElement;
export const trendingCarousel = document.getElementById("trending-carousel") as HTMLDivElement;
export const parallaxBg = document.getElementById("plx-bg") as HTMLImageElement;

export interface AutocompleteMediaItem extends AutocompleteItem
{
	id: number,
	media_type: string,
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
autocomplete<AutocompleteMediaItem>({
	input: searchBox,
	minLength: 2,
	preventSubmit: true,
	className: "search-dropdown white z-depth-2",
	fetch: async (text: string, update: (items: false | AutocompleteMediaItem[]) => void) => 
	{
		text = text.toLowerCase();
		
		// update autocompleter data
		const medias: IMedia[] = await queryMedias(text, "all");
		const mediaNames: AutocompleteMediaItem[] = medias?.map((m: IMovie & ITv) => ({
			id: m.id,
			label: m.title ?? m.name,
			poster: m.poster_path,
			media_type: m.media_type,
			group: null,
		})).slice(0, 10);
		update(mediaNames);
	},
	render: (item: AutocompleteMediaItem) => 
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
		div.addEventListener("click", () => window.location.href = `media.html?id=${item.id}&type=${item.media_type}`);
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
 * Query a media from its id.
 * @param id - The media ID.
 */
export const queryMedia = async (id: number, mediaType: MediaType): Promise<IMedia | null> =>
{
	try
	{
		const res: AxiosResponse<IMedia> = await axios.get(
			`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${apiKey}&language=en-EN&append_to_response=credits,videos,keywords`);
		return res.data;
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};

/**
 * Query all medias that contains the specified string.
 * @param name - The media query string.
 */
export const queryMedias = async (name: string, mediaType: MediaType): Promise<IMedia[] | null> =>
{
	try
	{
		const res: AxiosResponse<MediaResponse> = await axios.get(
			`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-EN&query=${name}&page=1&include_adult=false`);
		const data: IMedia[] = res.data.results
			.filter(m => mediaType === "all" ? true : m.media_type === mediaType);

		return data;
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};

/**
 * Query the latest movies in theatres.
 */
export const queryLatest = async (): Promise<IMovie[] | null> =>
{
	try
	{
		const res: AxiosResponse<MediaResponse> = await axios.get(
			`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-EN&page=1`);
		return res.data.results as IMovie[];
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};

/**
 * Query the trending medias.
 */
export const queryTrending = async (): Promise<IMedia[] | null> =>
{
	try
	{
		const res: AxiosResponse<MediaResponse> = await axios.get(
			`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`);
		return res.data.results;
	}
	catch (e) 
	{
		console.log(e);
	}
	return null;
};

/**
 * Render medias to a materialize carousel.
 * @param mediaData - The data to render.
 * @param carousel - The carousel element.
 */
export const renderToCarousel = async (mediaData: IMedia[], carousel: HTMLElement): Promise<void> =>
{
	for (const data of mediaData)
	{
		const item: HTMLAnchorElement = document.createElement("a");
		const img: HTMLImageElement = document.createElement("img");

		img.src = data.poster_path 
			? `https://image.tmdb.org/t/p/w400${data.poster_path}` 
			: "./src/assets/images/empty_portrait.webp";

		item.classList.add("carousel-item");
		item.href = `media.html?id=${data.id}&type=${data.media_type ?? "movie"}`;
		item.appendChild(img);

		carousel.appendChild(item);
	}
	M.Carousel.init(carousel, {
		duration: 200,
		numVisible: 10,
		dist: -80,
		shift: 50,
		padding: 140,
	});
};

/**
 * Render the latest movie carousel.
 */
export const renderLatest = async (): Promise<void> =>
{
	if(!upcomingCarousel)
		return;

	renderToCarousel(await queryLatest(), upcomingCarousel);
};

/**
 * Render the trending carousel.
 */
export const renderTrending = async (): Promise<void> =>
{
	if(!trendingCarousel)
		return;

	const medias: IMedia[] = await queryTrending();
	renderToCarousel(medias, trendingCarousel);

	const rnd: number = Math.floor(Math.random() * 20);
	parallaxBg.src = medias[rnd] 
		? `https://image.tmdb.org/t/p/original${medias[rnd].backdrop_path}` 
		: "";
};

renderLatest();
renderTrending();
renderCardContainer();
renderMedia();