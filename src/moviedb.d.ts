declare module "moviedb"
{
	export interface MovieResponse
	{
		page: number,
		results: IMovie[],
		total_pages: number,
		total_results: number
	}

	export interface MovieKeywordResponse
	{
		keywords: IKeyword[]
	}

	export interface PeopleImageResponse
	{
		id: number,
		profiles: IImage[]
	}

	export interface MovieCreditsResponse
	{
		cast: ICast[],
		crew: ICrew[],
		id: number
	}

	export interface MovieVideosResponse
	{
		id: number,
		results: IVideo[]
	}

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
		videos?: MovieVideosResponse,
		vote_average?: number,
		vote_count?: number,
		release_date?: string,
		revenue?: number,
		runtime?: number,
		status?: string,
		spoken_languages?: ILanguage[],
		credits?: MovieCreditsResponse,
		keywords?: MovieKeywordResponse
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
