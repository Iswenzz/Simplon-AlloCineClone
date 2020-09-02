import "materialize-css";
import "./assets/scss/index.scss";
import { IMedia } from "moviedb";
import { queryLatest, queryTrending } from "./query";
import "./autocomplete";

M.Tabs.init(document.getElementById("nav-tabs"));
M.Parallax.init(document.getElementById("plx"));
export const upcomingCarousel = document.getElementById("upcoming-carousel") as HTMLDivElement;
export const trendingCarousel = document.getElementById("trending-carousel") as HTMLDivElement;
export const parallaxBg = document.getElementById("plx-bg") as HTMLImageElement;

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