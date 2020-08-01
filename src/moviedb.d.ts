declare module "moviedb"
{
	export type MediaType = "movie" | "tv" | "all";

	export interface MediaResponse
	{
		page: number,
		results: IMedia[],
		total_pages: number,
		total_results: number
	}

	export interface KeywordsResponse
	{
		keywords?: IKeyword[],
		results?: IKeyword[]
	}

	export interface PeopleImageResponse
	{
		id: number,
		profiles: IImage[]
	}

	export interface CreditsResponse
	{
		cast: ICast[],
		crew: ICrew[],
		id: number
	}

	export interface VideosResponse
	{
		id: number,
		results: IVideo[]
	}

	export interface IMovie extends IMedia
	{
		title: string,
		budget?: number,
		revenue?: number,
		spoken_languages?: ILanguage[],
		video: boolean,
		tagline?: string,
	}

	export interface ITv extends IMedia
	{
		name: string,
		first_air_date?: string,
		last_air_date?: string,
		number_of_episodes: number,
		number_of_seasons: number,
		seasons?: ISeason[],
		type?: string
	}

	export interface IMedia
	{
		adult?: boolean,
		backdrop_path?: string,
		genres?: IGenre[]
		id: number,
		homepage?: string,
		original_language?: string,
		original_title?: string,
		overview?: string,
		popularity: number,
		poster_path?: string,
		videos?: VideosResponse,
		vote_average?: number,
		vote_count?: number,
		release_date?: string,
		runtime?: number,
		status?: string,
		credits?: CreditsResponse,
		keywords?: KeywordsResponse,
		media_type?: string
	}

	export interface ISeason
	{
		id: number,
		air_date?: string,
		episode_count?: number,
		name?: string,
		overview?: string,
		poster_path?: string,
		season_number: number
	}

	export interface ILanguage
	{
		iso_639_1: string,
		name: string
	}

	export interface IVideo
	{
		id: number,
		iso_639_1?: any,
		iso_3166_1?: any,
		key: string,
		name: string,
		site: string,
		size: number,
		type: string
	}

	export interface IImage
	{
		aspect_ratio: number,
		file_path: string,
		height: number,
		iso_639_1?: any,
		vote_average: number,
		vote_count: number,
		width: number
	}

	export interface IGenre
	{
		id: number,
		name: string
	}

	export interface ICast
	{
		cast_id: number,
		character: string,
		gender?: number,
		id: number,
		name: string,
		order: number,
		profile_path?: string
	}

	export interface ICrew
	{
		credit_id?: string,
		department?: string,
		genre?: number,
		id: number,
		job?: string,
		name: string,
		profile_path?: string
	}

	export interface IKeyword
	{
		id: number,
		name: string
	}
}
