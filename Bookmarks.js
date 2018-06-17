function loadJSON(callback, fileJSON)
{
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open("GET", fileJSON, true);
	xobj.onreadystatechange = function()
	{
		if (xobj.readyState==4 && xobj.status=="200")
		{
			callback(xobj.responseText)
		}
	};
	xobj.send(null);
}

function Bookmark2HTML (response)
{
	var json = JSON.parse(response);
	var bookmarkList = getBookmarksHTML(json.roots.bookmark_bar)
	document.body.appendChild(bookmarkList)
}

function getBookmarksHTML(parentNode)
{
	var list = document.createElement("ul");
	for (var i=0; i<parentNode.children.length; ++i)
	{
		var children;
		var childrenNode = parentNode.children[i];
		if  (childrenNode.type == "url")
		{
			children = getUrl(childrenNode);
		}
		else if (childrenNode.type == "folder")
		{
			children = createCollapsible(childrenNode.name);
			children.appendChild(getBookmarksHTML(childrenNode));
		}
		list.appendChild(listWrap(children));
	}
	return list;
}

function getUrl(urlObj)
{
	var urlElement = document.createElement("a");
	var textNode = document.createTextNode(urlObj.name);
	urlElement.appendChild(textNode);
	urlElement.setAttribute("href", urlObj.url);
	return urlElement;
}

function listWrap(element)
{
	var listElement = document.createElement("li");
	listElement.appendChild(element);
	return listElement;
}

function createCollapsible(summary)
{
	var collapsibleElement = document.createElement("details");
	var collapsibleSummary = document.createElement("summary");
	var textNode = document.createTextNode(summary);
	collapsibleSummary.appendChild(textNode);
	collapsibleElement.appendChild(collapsibleSummary);
	return collapsibleElement;
}

function main()
{
	loadJSON(Bookmark2HTML, "Bookmarks.json");
}

main();

