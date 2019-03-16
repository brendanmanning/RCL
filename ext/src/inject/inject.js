chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	
		if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("FairNews is now active and checking for media biases...");
		console.log("(c) 2019 Brendan Manning");

		// ----------------------------------------------------------

		downloadData(function(d) {
			data = d;
			tooltip();
		})

	}
	}, 10);
});

var RIGHT_IMAGE = 'https://i.ibb.co/6NfMn0Z/Right.png';
var CENTER_IMAGE = 'https://i.ibb.co/9c3JY4W/Center.png';
var LEFT_IMAGE = 'https://i.ibb.co/dth9X3w/Left.png';

var data = {};

function tooltip() {

	var links = document.getElementsByTagName('a');

	for(var link of links) {

		// Exluce the "View All" suggestion which implicitly links back to news.google.com
		if(link.innerHTML.toLowerCase() == "View all".toLowerCase()) {
			continue;
		}

		// Exclude links without a href prop
		if(!link.hasAttribute('href')) {
			continue;
		}

		// Exclude links with a nested image
		var imgs = link.getElementsByTagName('img');
		if(imgs.length != 0 || link.style.backgroundImage != "") {
			continue;
		}

		if(link.href == "" || link.href == null || link.href == undefined) {
			continue;
		}

		// Get everything we know about this website
		var info = insights(siteName(link.href));

		// Skip it if we know nothing
		if(info == null) {
			continue;
		}

		console.log("We've rated the url " + link.href + " with " + JSON.stringify(info));

		// Figure out which icon ot use
		var icon = '';
		if(info.rating == Bias.leanleft || info.rating == Bias.solidleft) {
			icon = LEFT_IMAGE;
		} else if (info.rating == Bias.center) {
			icon = CENTER_IMAGE;
		} else if (info.rating == Bias.solidright || info.rating == Bias.leanright) {
			icon = RIGHT_IMAGE;
		}

		// Put a little R/C/L flag/tooltip
		var flag = '';
		flag += '<a class="tooltip" href="' + info.readmore + '">'
		flag += '<img src="' + icon + '" height="14" width="14" style="display: inline; position: relative; top: 2px;">'
		flag+= '<div class="tooltiptext"><strong>' + info.name + "</strong>  " + info.rating + '<hr>' +  ((info.description != undefined) ? info.description : "Click the bubble to find out why we rated it this way")+ '</div>';
		flag += "</a>";
		link.innerHTML = flag + link.innerHTML;

	}
}

var Bias = {
	solidleft: "Solid Left",
	leanleft: "Lean Left",
	center: "Center",
	leanright: "Lean Right",
	solidright: "Solid Right"
}

function downloadData(callback) {
	fetch('https://raw.githubusercontent.com/brendanmanning/RCL/master/ext/ratings.json')
  	.then(function(response) {
		return response.json();
  	})
	.then(function(myJson) {
    	callback(myJson)
  	});
}

function insights(site) {

	if(site == null) {
		return null;
	}

	if(site.startsWith("www.")) {
		site = site.substring(4);
	}

	return data[site.toLowerCase()];

}

/*
function isCenter(newssite) {
	var moderate = [
		'reuters.com',
		'uk.reuters.com',
		'ap.org',
		'apnews.com',
		'axios.com',
		'forbes.com'
	];

	for(str of moderate) {
		if(str === newssite.toLowerCase() || "www." + str === newssite.toLowerCase()) {
			return true;
		}
	}

	return false;
}

function isLiberal(newssite) {
	var liberal = [
		'cnn.com',
		'msnbc.com',
		'nbcnews.com',
		'huffpost.com',
		'washingtonpost.com',
		'slate.com',
		'newyorker.com',
		'nytimes.com',
		'aljazeera.com',
		'news.google.com',
		'bloomberg.com',
		'abcnews.go.com',
		'usatoday.com',
		'cbsnews.com',
		'vox.com',
		'bbc.com',
		'buzzfeed.com',
		'buzzfeednews.com',
		'global.brother',
		'theguardian.com',
		'npr.org',
		'politico.com',
		'economist.com',
		'theatlantic.com',
		'politico.com',
		'mercurynews.com',
		'splinternews.com'
	]

	for(str of liberal) {
		if(str === newssite.toLowerCase() || "www." + str === newssite.toLowerCase()) {
			console.log(str);
			return true;
		}
	}

	return false;

}*/

function isConservative(newssite) {
	var conservative = [
		'news.yahoo.com',
		'wsj.com',
		'foxnews.com',
		'drudgereport.com',
		'breitbart.com',
		'hannity.com',
		'theblaze.com',
		'glennbeck.com',
		'rushlimbaugh.com',
		'redstate.com',
		'newsmax.com',
		'townhall.com',
		'donaldjtrump.com',
		'reason.com',
		'washingtonexaminer.com',
		'washingtontimes.com',
		'thefederalist.com',
		'dailymail.co.uk',
		'cbn.com',
		'dailywire.com',
		'spectator.org',
		'dailycaller.com',
		'nationalreview.com'
	];

	for(str of conservative) {
		if(str === newssite.toLowerCase() || "www." + str === newssite.toLowerCase()) {
			return true;
		}
	}

	return false;
}

function siteName(url) {
	var regex = /:\/\/(.[^/]+)/;
	var res = url.match(regex);

	if(res == null || res.length != 2) {
		return null;
	}

	return res[1];
}

function go(url) {
	window.location.href = url;
}