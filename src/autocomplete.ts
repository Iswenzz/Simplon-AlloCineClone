import autocomplete, { AutocompleteItem } from "autocompleter";
import { MediaResponse, IMovie, ITv } from "moviedb";
import { queryMedias } from "./query";

export const searchBox = document.getElementById("search") as HTMLInputElement;

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
