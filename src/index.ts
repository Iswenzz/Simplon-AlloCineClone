import "materialize-css";
import "./assets/scss/index.scss";
import autocomplete, { AutocompleteItem } from "autocompleter";
import { IMedia, MediaResponse, MediaType, ITv, IMovie } from "moviedb";
import { queryMedias, queryLatest, queryTrending } from "./query";

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

export interface QueryMediaOptions 
{
	type?: MediaType,
	page?: number | string
}

/**
 * Searchbox keydown event callback.
 */
searchBox.addEventListener("keydown", (e: KeyboardEvent) =>
{
	if (e.keyCode === 13)
		window.location.href = `search.html?search=${(e.target as HTMLInputElement).value}&page=1`;
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
		const medias: MediaResponse = await queryMedias(text, {
			type: "multi"
		});
		const mediaNames: AutocompleteMediaItem[] = medias.results?.map((m: IMovie & ITv) => ({
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
			: require("./assets/images/empty_portrait.webp").default;
		p.innerText = item.label;

		div.classList.add("autocomplete-item");
		div.append(img, p);
		div.addEventListener("click", () => window.location.href = `media.html?id=${item.id}&type=${item.media_type}`);
		return div;
	},
	onSelect: () => null
});

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
			: require("./assets/images/empty_portrait.webp").default;

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
	renderToCarousel(await queryLatest(), upcomingCarousel);
};

/**
 * Render the trending carousel.
 */
export const renderTrending = async (): Promise<void> =>
{
	const medias: IMedia[] = await queryTrending();
	renderToCarousel(medias, trendingCarousel);

	const rnd: number = Math.floor(Math.random() * 20);
	parallaxBg.src = medias[rnd] 
		? `https://image.tmdb.org/t/p/original${medias[rnd].backdrop_path}` 
		: "";
};

renderLatest();
renderTrending();