import "./assets/scss/search.scss";
import { queryMedias } from "./index";
import { IMedia, IMovie, ITv } from "moviedb";
import { ParsedUrlQuery, parse } from "querystring";

const cardContainer = document.getElementById("card-container") as HTMLElement;
const searchHeader = document.getElementById("header-title") as HTMLHeadingElement;

/**
 * When clicking on a card image/title callback.
 * @param e - The mouse event.
 */
const selectCard = (e: MouseEvent): void =>
{
	const card: HTMLDivElement = e.target as HTMLDivElement;
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

	const query: ParsedUrlQuery = parse(location.search);
	const search: string = query["?search"] as string;
	
	if (search)
	{
		// update search header
		if (searchHeader)
			searchHeader.innerText = search 
				? `"${search.toUpperCase()}" on Allociné` : "Search on Allociné";
		
		// render cards
		const data: IMedia[] = await queryMedias(search, "all");
		renderCards(data);
	}
	else if (cardContainer)
		cardContainer.innerText = "There are no movies that matched your query.";
};

/**
 * Create all cards elements.
 * @param mediaData - The media data array.
 */
export const renderCards = (mediaData: IMedia[]): void =>
{
	if (!cardContainer)
		return;
	cardContainer.innerHTML = "";

	if (!mediaData.length)
		cardContainer.innerText = "There are no movies that matched your query.";

	for (const m of mediaData)
	{
		const data = m as IMovie & ITv;

		const card: HTMLElement = document.createElement("article");
		const cardHeader: HTMLElement = document.createElement("header");
		const img: HTMLImageElement = document.createElement("img");
		const title: HTMLAnchorElement = document.createElement("a");
		const cardBody: HTMLElement = document.createElement("section");
		const cardBodyAction: HTMLElement = document.createElement("section");
		const desc: HTMLParagraphElement = document.createElement("p");

		// Card poster
		img.src = data.poster_path 
			? `https://image.tmdb.org/t/p/w400${data.poster_path}` 
			: "./src/assets/images/empty_portrait.webp";
		img.setAttribute("data-id", data.id.toString());
		img.setAttribute("data-type", data.media_type.toString());

		// Card header
		cardHeader.setAttribute("data-id", data.id.toString());
		cardHeader.setAttribute("data-type", data.media_type.toString());
		cardHeader.addEventListener("click", selectCard);
		cardHeader.appendChild(img);

		// Card title
		title.setAttribute("data-id", data.id.toString());
		title.setAttribute("data-type", data.media_type.toString());
		title.addEventListener("click", selectCard);
		title.innerText = data.title ?? data.name;
		document.title = `AlloCinéClone Search - ${title.innerText}`;

		cardBodyAction.classList.add("card-action");
		cardBodyAction.appendChild(title);

		// Card description
		let descStr: string = data.overview;
		if (descStr.length > 200)
			descStr = descStr.substr(0, 199) + "...";
		desc.innerText = descStr;
		cardBody.append(cardBodyAction, desc);
		
		// Card content
		card.classList.add("card", "grey", "darken-4");
		cardHeader.classList.add("class-image", "waves-effect", "waves-light");
		cardBody.classList.add("card-content");
		card.append(cardHeader, cardBody);

		cardContainer.appendChild(card);
	}
};
