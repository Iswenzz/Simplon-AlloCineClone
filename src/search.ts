import "./assets/scss/search.scss";
import { queryMedias } from "./index";
import { IMedia, MediaResponse } from "moviedb";
import { MediaCard } from "./mediaCard";
import * as qs from "querystring";

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
	if (!cardContainer)
		return;

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
	if (!cardContainer)
		return;
	cardContainer.innerHTML = "";

	const mediaData: IMedia[] = mediaResponse.results;
	if (!mediaData || !mediaData.length)
	{
		cardContainer.innerText = "There are no movies that matched your query.";
		return;
	}
	for (const media of mediaData)
		new MediaCard(cardContainer, media, selectCard);
		
	initPagination(mediaResponse.total_pages);
};

/**
 * Pagination mouse event callback.
 * @param e - The pagination mouse event.
 */
const paginationCallback = (e: MouseEvent): void =>
{
	// get the current page query
	const li = e.currentTarget as HTMLLIElement;
	const query: qs.ParsedUrlQuery = qs.parse(location.search.replace("?", ""));
	const maxPages: number = parseInt(li.parentElement.getAttribute("data-maxPages"));
	let currentPage: number = parseInt(query["page"] as string, 10);

	switch (li.getAttribute("data-type"))
	{
		case "prev":
			{
				if (currentPage > 1)
					currentPage--;
				query["page"] = currentPage.toString();
			}
			break;
		case "next":
			{
				if (currentPage < maxPages)
					currentPage++;
				query["page"] = currentPage.toString();
			}
			break;
		case "page":
			{
				const liIndex: number = parseInt(li.getAttribute("data-index"), 10);
				query["page"] = (currentPage + (liIndex + getPaginationOffset(currentPage, maxPages))).toString();
			}
			break;
	}
	// update document if page changed
	if (location.search.replace("?", "") !== qs.stringify(query))
		location.search = qs.stringify(query);
};

/**
 * Initialize the pagination component.
 * @param maxPages - The max amount of pages in the pagination.
 */
export const initPagination = (maxPages: number): void =>
{
	if (!pagination)
		return;
	pagination.setAttribute("data-maxPages", maxPages.toString());

	// get the current page query
	const query: qs.ParsedUrlQuery = qs.parse(location.search.replace("?", ""));
	const currentPage: number = parseInt(query["page"] as string, 10);
	
	const limit: number = maxPages > 5 ? 5 : maxPages;
	for (let i = 0; i < limit; i++)
	{
		// add page data
		const li: HTMLLIElement = document.createElement("li");
		li.classList.add("waves-effect", "waves-light");
		li.setAttribute("data-type", "page");
		li.setAttribute("data-index", i.toString());

		// set page number & styling
		const liAnchor: HTMLAnchorElement = document.createElement("a");
		liAnchor.innerText = (currentPage + (i + getPaginationOffset(currentPage, maxPages))).toString();
		if (liAnchor.innerText === currentPage.toString())
			li.classList.add("active");

		li.appendChild(liAnchor);
		pagination.insertBefore(li, pagination.lastChild);
	}

	// add list item click event
	for (let i = 0; i < pagination.children.length; i++)
		pagination.children[i].addEventListener("click", paginationCallback);
};

export const getPaginationOffset = (currentPage: number, maxPages: number): number =>
{
	const offset = {
		[1]: 0,
		[2]: -1,
		[maxPages]: -4,
		[maxPages - 1]: -3
	};
	return offset[currentPage] ?? -2;
};
