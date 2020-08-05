import * as qs from "querystring";

/**
 * Represent a pagination component.
 * < 1 2 3 >
 */
export class Pagination
{
	public page: number;
	public maxPages: number;
	public container: HTMLElement;
	public pageShown: number;

	/**
	 * Initialize a new Pagination object with the specified component properties.
	 * @param page - The start page index.
	 * @param maxPages - The max amount of pages.
	 * @param pageShown - The amount of page button to show in the pagination.
	 * @param container - The HTML container to render the pagination.
	 */
	public constructor(page: number, maxPages: number, pageShown: number, container: HTMLElement)
	{
		this.page = page ?? 1;
		this.maxPages = maxPages ?? 10;
		this.pageShown = pageShown ?? 5;
		this.container = container;

		this.initPagination();
	}

	/**
	 * Initialize the pagination component.
	 */
	public initPagination(): void
	{
		this.container.innerHTML = "";
		this.container.setAttribute("data-maxPages", this.maxPages.toString());
		
		// prev arrow
		const prev: HTMLLIElement = document.createElement("li");
		prev.setAttribute("data-type", "prev");
		prev.innerHTML = "<a><i class=\"material-icons\">chevron_left</i></a>";
		prev.classList.add("waves-effect", "waves-light");
		this.container.appendChild(prev);

		const limit: number = this.maxPages > this.pageShown ? this.pageShown : this.maxPages;
		for (let i = 0; i < limit; i++)
		{
			// add page data
			const li: HTMLLIElement = document.createElement("li");
			li.classList.add("waves-effect", "waves-light");
			li.setAttribute("data-type", "page");
			li.setAttribute("data-index", i.toString());

			// set page number & styling
			const liAnchor: HTMLAnchorElement = document.createElement("a");
			liAnchor.innerText = (this.page + (i + this.offset)).toString();
			if (liAnchor.innerText === this.page.toString())
				li.classList.add("active");

			li.appendChild(liAnchor);
			this.container.appendChild(li);
		}

		// next arrow
		const next: HTMLLIElement = document.createElement("li");
		next.setAttribute("data-type", "next");
		next.innerHTML = "<a><i class=\"material-icons\">chevron_right</i></a>";
		next.classList.add("waves-effect", "waves-light");
		this.container.appendChild(next);

		// add list item click event
		for (let i = 0; i < this.container.children.length; i++)
			this.container.children[i].addEventListener("click", this.paginationCallback.bind(this));
	}

	/**
	 * Pagination mouse event callback.
	 * @param e - The pagination mouse event.
	 */
	public paginationCallback(e: MouseEvent): void
	{
		// get the current page query
		const li = e.currentTarget as HTMLLIElement;
		const query: qs.ParsedUrlQuery = qs.parse(location.search.replace("?", ""));

		switch (li.getAttribute("data-type"))
		{
			case "prev":
				{
					if (this.page > 1)
						this.page--;
					query["page"] = this.page.toString();
				}
				break;
			case "next":
				{
					if (this.page < this.maxPages)
						this.page++;
					query["page"] = this.page.toString();
				}
				break;
			case "page":
				{
					const liIndex: number = parseInt(li.getAttribute("data-index"), 10);
					query["page"] = (this.page + (liIndex + this.offset)).toString();
				}
				break;
		}
		// update document if page changed
		if (location.search.replace("?", "") !== qs.stringify(query))
			location.search = qs.stringify(query);
	}

	/**
	 * Get the offset to center the current page in the pagination.
	 */
	public get offset(): number
	{
		const bottom: number[] = [];
		const top: number[] = [];

		for (let i = 1; i <= this.pageShown / 2; i++)
		{
			top.push(-i + 1);
			bottom.push(-this.pageShown + i);
		}

		const offset: number[] = new Array<number>(this.maxPages);
		offset.splice(1, top.length, ...top);
		offset.splice(offset.length - bottom.length + 1, bottom.length, ...bottom.reverse());

		return offset[this.page] ?? top.pop() - 1;
	}
}
