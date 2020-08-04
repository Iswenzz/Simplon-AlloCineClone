import "./assets/scss/media.scss";
import * as qs from "querystring";
import ProgressBar from "progressbar.js";
import { queryMedia, queryPersonImage } from "./index";
import YouTubePlayer from "youtube-player";
import { ICast, IMedia, IVideo, MediaType, IMovie, ITv, IKeyword } from "moviedb";

M.Tabs.init(document.getElementById("media-tabs"));

const mediaContainer = document.getElementById("media-container") as HTMLElement;
const mediaContent = document.getElementById("media-content") as HTMLElement;
const mediaCasting = document.getElementById("casting-content") as HTMLElement;

const poster = document.getElementById("media-poster") as HTMLImageElement;
const title = document.getElementById("media-title") as HTMLHeadingElement;
const date = document.getElementById("media-date") as HTMLDataElement;
const genre = document.getElementById("media-genre") as HTMLDivElement;
const duration = document.getElementById("media-duration") as HTMLDivElement;
const rating = document.getElementById("media-rating") as HTMLDivElement;
const description = document.getElementById("media-description") as HTMLDivElement;

const status = document.getElementById("media-status") as HTMLParagraphElement;
const language = document.getElementById("media-language") as HTMLParagraphElement;
const budget = document.getElementById("media-budget") as HTMLParagraphElement;
const revenue = document.getElementById("media-revenue") as HTMLParagraphElement;
const keywords = document.getElementById("media-keywords") as HTMLDivElement;

const ratingCircle: any = rating ? new ProgressBar.Circle(rating, {
	strokeWidth: 10,
	easing: "easeInOut",
	duration: 1400,
	color: "#9b00c4",
	trailColor: "#eee",
	trailWidth: 3,
	svgStyle: null,
	text: {
		autoStyleContainer: false
	},
	step: (state: any, circle: any) => 
	{
		const value = Math.round(circle.value() * 100);
		circle.setText(value + "%");
	}
}) : null;

/**
 * Render all actors/cast that played in the media.
 * @param mediaData - The media result data.
 */
export const renderCast = async (mediaData: IMedia): Promise<void> =>
{
	if (!mediaData.credits.cast.length)
	{
		mediaCasting.textContent = "We don't have any cast added to this movie.";
		mediaCasting.className = "";
		return;
	}

	const limit: boolean = mediaData.credits.cast.length > 10;
	for (let i = 0; i < (limit ? 10 : mediaData.credits.cast.length); i++)
	{
		const c: ICast = mediaData.credits.cast[i];

		const card: HTMLElement = document.createElement("article");
		const cardHeader: HTMLDivElement = document.createElement("div");
		const cardBody: HTMLDivElement = document.createElement("div");
		const cardImage: HTMLImageElement = document.createElement("img");
		const cardTitle: HTMLHeadingElement = document.createElement("h4");
		const cardDesc: HTMLParagraphElement = document.createElement("p");

		card.setAttribute("itemtype", "http://schema.org/Person");
		card.setAttribute("itemprop", "actor");
		card.setAttribute("itemscope", "");

		card.classList.add("card", "grey", "darken-4");
		cardHeader.classList.add("card-image", "waves-effect", "waves-light");
		cardBody.classList.add("card-content");

		const imgUrl: string = await queryPersonImage(c.id);
		cardImage.src = imgUrl ? imgUrl : "";
		cardImage.setAttribute("itemprop", "image");
		cardTitle.innerText = c.name;
		cardTitle.setAttribute("itemprop", "name");
		cardDesc.innerText = c.character;
		
		cardHeader.appendChild(cardImage);
		cardBody.append(cardTitle, cardDesc);
		card.append(cardHeader, cardBody);
		mediaCasting.appendChild(card);
	}
};

/**
 * Render extra infos aside.
 * @param mediaData - The media result data.
 */
export const renderAside = async (mediaData: IMedia): Promise<void> =>
{
	const dollarFormater: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});
	const data = mediaData as IMovie & ITv;

	status.innerText = data.status ?? "-";
	language.innerText = data.spoken_languages && data.spoken_languages[0] 
		? data.spoken_languages[0].name : "-";
	budget.innerText = data.budget ? dollarFormater.format(data.budget) : "-";
	revenue.innerText = data.revenue ? dollarFormater.format(data.revenue) : "-";
	
	const words: IKeyword[] = mediaData.keywords.keywords 
		? mediaData.keywords.keywords : mediaData.keywords.results;
	if (!words)
		return;

	// empty keywords
	if (!words.length)
		keywords.innerText = "No keywords has been added.";

	for (const word of words)
	{
		const k: HTMLLIElement = document.createElement("li");
		k.classList.add("z-depth-2", "waves-effect", "waves-light");
		k.innerText = word.name;
		keywords.appendChild(k);
	}
};

/**
 * Render the media trailer using YT Player.
 * @param mediaData - The media result data.
 */
export const renderTrailer = async (mediaData: IMedia): Promise<void> =>
{
	const trailer: IVideo = mediaData.videos.results[0];
	if (!trailer)
	{
		document.getElementById("media-video").innerText = "No videos has been added.";
		return;
	}

	const player: any = YouTubePlayer("media-video");
	player.loadVideoById(trailer.key);
};

/**
 * Render a media from URL query.
 */
export const renderMedia = async (): Promise<void> =>
{
	if (!mediaContent)
		return;
	
	// query media content data
	const query: qs.ParsedUrlQuery = qs.parse(location.search.replace("?", ""));
	const mediaId: number = parseInt(query["id"] as string, 10);
	const m: IMedia = await queryMedia(mediaId, query["type"] as MediaType);
	const data = m as IMovie & ITv;

	// query failed
	if (!data)
	{
		mediaContainer.classList.add("center");
		mediaContainer.innerHTML = "";
		mediaContainer.innerText = "There are no movies that matched your query.";
		mediaContainer.style.marginTop = "3em";
		return;
	}

	// media poster & background
	const bg: string = data.backdrop_path 
		? `https://image.tmdb.org/t/p/original${data.backdrop_path}` 
		: require("./assets/images/empty_portrait.webp").default;
	const lbg = "linear-gradient(rgba(0, 100, 200, 0.8), rgba(7, 0, 93, 0.8))";
	mediaContent.setAttribute("style", `background: ${lbg}, url(${bg})`);
	poster.src = data.poster_path 
		? `https://image.tmdb.org/t/p/w400${data.poster_path}` 
		: require("./assets/images/empty_portrait.webp").default;
	M.Materialbox.init(poster);

	// media title & description
	title.innerText = data.title ?? data.name;
	document.title = `${title.innerText} - AlloCinéClone`;
	description.innerText = data.overview;

	// media date & genre
	date.setAttribute("datetime", data.release_date);
	date.innerText = new Date(data.release_date ?? data.first_air_date).toLocaleDateString();
	const genres: string = data.genres.map(g => g.name).join(", ");
	genre.innerText = genres.length ? genres : "Unknown";
	
	// duration/episodes
	if (data.number_of_episodes)
		duration.innerText = `${data.number_of_episodes} episodes`;
	else
	{
		const hours: number = Math.floor(data.runtime / 60);
		const minutes: number = data.runtime % 60;
		duration.innerText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
	}

	// SEO
	document.head.innerHTML += `
		<meta name="theme-color" content="#2A2A2A">
		<meta name="title" content="${data.title ?? data.name}">
		<meta name="description" content="${data.overview}">
		<meta property="og:type" content="video.movie">
		<meta property="og:url" content="${data.homepage}">
		<meta property="og:title" content="${data.title ?? data.name}">
		<meta property="og:description" content="${data.overview}">
		<meta property="og:image" content="${bg}">
		<meta property="twitter:card" content="${bg}">
		<meta property="twitter:url" content="${data.homepage}">
		<meta property="twitter:title" content="${data.title ?? data.name}">
		<meta property="twitter:description" content="${data.overview}">
		<meta property="twitter:image" content="${bg}">
	`;

	// media rating
	ratingCircle.animate(data.vote_average / 10);
	
	renderTrailer(data);
	renderCast(data);
	renderAside(data);
};
