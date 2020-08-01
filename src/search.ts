import "./assets/scss/search.scss";
import { queryMovies } from "./index";
import { IMedia } from "moviedb";
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
	window.location.href = `movie.html?id=${card.getAttribute("data-id")}`;
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
		const data: IMedia[] = await queryMovies(search);
		renderCards(data);
	}
};

/**
 * Create all cards elements.
 * @param data - The movie data array.
 */
export const renderCards = (data: IMedia[]): void =>
{
	if (!cardContainer)
		return;
	cardContainer.innerHTML = "";

	for (const c of data)
	{
		const card: HTMLElement = document.createElement("article");
		const cardHeader: HTMLElement = document.createElement("header");
		const img: HTMLImageElement = document.createElement("img");
		const title: HTMLAnchorElement = document.createElement("a");
		const cardBody: HTMLElement = document.createElement("section");
		const cardBodyAction: HTMLElement = document.createElement("section");
		const desc: HTMLParagraphElement = document.createElement("p");

		// Card poster
		img.src = c.poster_path 
			? `https://image.tmdb.org/t/p/w400${c.poster_path}` 
			: "./src/assets/images/empty_portrait.webp";
		img.setAttribute("data-id", c.id.toString());

		// Card header
		cardHeader.setAttribute("data-id", c.id.toString());
		cardHeader.addEventListener("click", selectCard);
		cardHeader.appendChild(img);

		// Card title
		title.setAttribute("data-id", c.id.toString());
		title.addEventListener("click", selectCard);
		title.innerText = c.title;

		cardBodyAction.classList.add("card-action");
		cardBodyAction.appendChild(title);

		// Card description
		let descStr: string = c.overview;
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
