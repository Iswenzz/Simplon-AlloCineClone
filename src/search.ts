import "materialize-css";
import "./assets/scss/search.scss";
import { IMedia, MediaResponse } from "moviedb";
import { MediaCard } from "./mediaCard";
import * as qs from "querystring";
import { Pagination } from "./pagination";
import { queryMedias } from "./query";

const cardContainer = document.getElementById("card-container") as HTMLElement;
const searchHeader = document.getElementById("header-title") as HTMLHeadingElement;
const pagination = document.getElementById("media-pagination") as HTMLUListElement;

/**
 * When clicking on a card image/title callback.
 * @param e - The mouse event.
 */
const selectCard = (e: MouseEvent): void =>
{
	const card: HTMLDivElement = e.currentTarget as HTMLDivElement;
	window.location.href = 
		`media.html?id=${card.getAttribute("data-id")}&type=${card.getAttribute("data-type")}`;
};

/**
 * Render the card container from URL query.
 */
export const renderCardContainer = async (): Promise<void> =>
{
	const query: qs.ParsedUrlQuery = qs.parse(location.search.replace("?", ""));
	const search: string = query["search"] as string;
	const page: string = query["page"] as string ?? "1";
	
	if (search)
	{
		// update search header
		if (searchHeader)
			searchHeader.innerText = search 
				? `"${search.toUpperCase()}" on Allociné` : "Search on Allociné";
		
		// render cards
		const data: MediaResponse = await queryMedias(search, {
			type: "multi",
			page: page
		});
		renderCards(data);
	}
	else if (cardContainer)
		cardContainer.innerText = "There are no movies that matched your query.";
};

/**
 * Create all cards elements.
 * @param mediaResponse - The medias query response.
 */
export const renderCards = (mediaResponse: MediaResponse): void =>
{
	cardContainer.innerHTML = "";

	const mediaData: IMedia[] = mediaResponse.results;
	if (!mediaData || !mediaData.length)
	{
		cardContainer.innerText = "There are no movies that matched your query.";
		return;
	}
	for (const media of mediaData)
		new MediaCard(cardContainer, media, selectCard);
	
	// get the current page query
	const query: qs.ParsedUrlQuery = qs.parse(location.search.replace("?", ""));
	const currentPage: number = parseInt(query["page"] as string, 10);
	new Pagination(currentPage, mediaResponse.total_pages, 5, pagination);
};

renderCardContainer();