import { IMedia, IMovie, ITv } from "moviedb";

/**
 * Represent a media card that contains data pulled from TMDB.
 */
export class MediaCard
{
	public data: IMedia;
	public container: HTMLElement;

	private _title: string;
	private _description: string;
	private _image: string;

	public cardElem: HTMLElement = document.createElement("article");
	public cardHeaderElem: HTMLElement = document.createElement("header");
	public imgElem: HTMLImageElement = document.createElement("img");
	public titleElem: HTMLAnchorElement = document.createElement("a");
	public cardBodyElem: HTMLElement = document.createElement("section");
	public cardBodyActionElem: HTMLElement = document.createElement("section");
	public descriptionElem: HTMLParagraphElement = document.createElement("p");

	/**
	 * Initialize a new MediaCard object with the specified data.
	 * @param container - The container to add the card.
	 * @param media - The media data.
	 */
	public constructor(container: HTMLElement, media: IMedia, clickCallback?: (e: MouseEvent) => void)
	{
		this.container = container;
		this.initializeData(media as IMovie & ITv);

		// Card events
		this.cardHeaderElem.addEventListener("click", clickCallback);
		this.titleElem.addEventListener("click", clickCallback);
		
		// Card classes
		this.cardElem.classList.add("card", "grey", "darken-4");
		this.cardHeaderElem.classList.add("class-image", "waves-effect", "waves-light");
		this.cardBodyElem.classList.add("card-content");

		// Card childrens
		this.cardHeaderElem.appendChild(this.imgElem);
		this.cardBodyActionElem.classList.add("card-action");
		this.cardBodyActionElem.appendChild(this.titleElem);
		this.cardBodyElem.append(this.cardBodyActionElem, this.descriptionElem);
		this.cardElem.append(this.cardHeaderElem, this.cardBodyElem);
		this.container.appendChild(this.cardElem);
	}

	/**
	 * Initialize the media card properties/elements with the specified media data.
	 * @param media - The media data.
	 */
	public initializeData(media: IMovie & ITv): void
	{
		// Card data
		this.cardHeaderElem.setAttribute("data-id", media.id.toString());
		this.cardHeaderElem.setAttribute("data-type", media.media_type.toString());
		this.titleElem.setAttribute("data-id", media.id.toString());
		this.titleElem.setAttribute("data-type", media.media_type.toString());

		// Card poster
		this.image = media.poster_path 
			? `https://image.tmdb.org/t/p/w400${media.poster_path}` 
			: require("./assets/images/empty_portrait.webp").default;


		// Card title
		this.titleElem.innerText = media.title ?? media.name;
		document.title = `AlloCinéClone Search - ${this.title}`;

		// Card description
		let descStr: string = media.overview ?? "";
		if (descStr.length > 200)
			descStr = descStr.substr(0, 199) + "...";
		this.descriptionElem.innerText = descStr;
	}

	/**
	 * Get the card title.
	 */
	public get title(): string
	{
		return this._title;
	}

	/**
	 * Set the card title.
	 * @param text - The media title.
	 */
	public set title(text: string)
	{
		this._title = text;
		this.titleElem.innerText = text;
	}

	/**
	 * Get the card description.
	 */
	public get description(): string
	{
		return this._description;
	}

	/**
	 * Set the card description.
	 * @param text - The description.
	 */
	public set description(text: string)
	{
		this._description = text;
		this.descriptionElem.innerText = text;
	}

	/**
	 * Get the card source image URL.
	 */
	public get image(): string
	{
		return this._image;
	}

	/**
	 * Set the card source image.
	 * @param url - The source image URL.
	 */
	public set image(url: string)
	{
		this._image = url;
		this.imgElem.src = url;
	}
}
