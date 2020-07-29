import { cardContainer } from "./index";

/**
 * When clicking on a card image/title callback.
 * @param {MouseEvent} e - The mouse event.
 */
const selectCard = (e) =>
	window.location.href = `movie.html?id=${e.target.getAttribute("data-id")}`;

/**
 * Create all DOM cards elements.
 * @param {any[]} data - The movie data array.
 */
export const renderCards = (data) =>
{
	if (!cardContainer)
		return;
	cardContainer.innerHTML = "";

	for (const c of data)
	{
		const card = document.createElement("article");
		const cardHeader = document.createElement("header");
		const img = document.createElement("img");
		const title = document.createElement("a");
		const cardBody = document.createElement("section");
		const cardBodyAction = document.createElement("section");
		const desc = document.createElement("p");

		// Card poster
		img.src = c.poster_path 
			? `https://image.tmdb.org/t/p/original${c.poster_path}` 
			: "./assets/images/empty_portrait.webp";
		img.setAttribute("data-id", c.id);
		img.style.width = "100%";
		img.style.height = "100%";

		// Card header
		cardHeader.setAttribute("data-id", c.id);
		cardHeader.addEventListener("click", selectCard);
		cardHeader.classList.add("waves-effect", "waves-light");
		cardHeader.appendChild(img);

		// Card title
		title.setAttribute("data-id", c.id);
		title.addEventListener("click", selectCard);
		title.innerText = c.title;

		cardBodyAction.classList.add("card-action");
		cardBodyAction.appendChild(title);

		// Card description
		let descStr = c.overview;
		if (descStr.length > 200)
			descStr = descStr.substr(0, 199) + "...";
		desc.innerText = descStr;
		cardBody.appendChild(cardBodyAction);
		cardBody.appendChild(desc);
		
		// Card content
		card.classList.add("card", "grey", "darken-4");
		cardHeader.classList.add("class-image");
		card.appendChild(cardHeader);
		cardBody.classList.add("card-content");
		card.appendChild(cardBody);

		cardContainer.appendChild(card);
	}
};
