import { parse, ParsedUrlQuery } from "querystring";
import ProgressBar from "progressbar.js";
import { queryMovie } from "./index";

const movieContent = document.getElementById("movie-content") as HTMLElement;

const poster = document.getElementById("movie-poster") as HTMLImageElement;
const title = document.getElementById("movie-title") as HTMLHeadingElement;
const date = document.getElementById("movie-date") as HTMLDataElement;
const genre = document.getElementById("movie-genre") as HTMLDivElement;
const duration = document.getElementById("movie-duration") as HTMLDivElement;
const rating = document.getElementById("movie-rating") as HTMLDivElement;
const description = document.getElementById("movie-description") as HTMLDivElement;

export interface IMovie
{
	adult?: boolean,
	backdrop_path?: string,
	budget?: number,
	genres?: IGenre[]
	id: number,
	homepage?: string,
	original_language?: string,
	original_title?: string,
	title?: string,
	overview?: string,
	popularity: number,
	poster_path?: string,
	tagline?: string,
	video?: boolean,
	vote_average?: number,
	vote_count?: number
}

export interface IGenre
{
	id: number,
	name: string
}

const ratingCircle: any | null = rating ? new ProgressBar.Circle(rating, {
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
		let value = Math.round(circle.value() * 100);
		circle.setText(value + "%");
	}
}) : null;

/**
 * Render a movie from url query.
 */
export const renderMovie = async (): Promise<void> =>
{
	if (!movieContent)
		return;
	
	const query: ParsedUrlQuery = parse(location.search);
	const data: any = await queryMovie(parseInt(query["?id"] as string, 10));
	console.log(data);
	
	const bg: string = data.backdrop_path 
		? `https://image.tmdb.org/t/p/original${data.backdrop_path}` 
		: "./assets/images/empty_portrait.webp";
	const lbg: string = "linear-gradient(rgba(0, 100, 200, 0.8), rgba(7, 0, 93, 0.8))";
	movieContent.setAttribute("style", `background: ${lbg}, url(${bg})`);
	poster.src = data.poster_path 
		? `https://image.tmdb.org/t/p/original${data.poster_path}` 
		: "./assets/images/empty_portrait.webp";

	title.innerText = data.title;
	description.innerText = data.overview;

	date.setAttribute("datetime", data.release_date);
	date.innerText = new Date(data.release_date).toLocaleDateString();
	genre.innerText = data.genres.map(g => g.name).join(", ");
	const hours: number = Math.floor(data.runtime / 60);
	const minutes: number = data.runtime % 60;
	duration.innerText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

	ratingCircle.animate(data.vote_average / 10);
};
