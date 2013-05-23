google.load("feeds", "1");

var defaultFeeds = [
	'http://feeds.bbci.co.uk/news/rss.xml',
	'http://rss.cnn.com/rss/edition_world.rss',
	'http://feeds.nytimes.com/nyt/rss/World',
	'http://feeds.reuters.com/Reuters/worldNews',
	'http://news.sky.com/feeds/rss/home.xml',
	'http://www.telegraph.co.uk/news/worldnews/rss',
	'http://feeds.washingtonpost.com/rss/world',
	'http://online.wsj.com/xml/rss/3_7085.xml',
	'http://www.channel4.com/news/world-news/rss',
	'http://feeds.guardian.co.uk/theguardian/world/rss'
];

var total = 20;

$(document).ready(function() {

	$.each(defaultFeeds, function(i) {
		$('nav ul').append(
			$('<li />').html(
				$('<input />')
				.attr('checked', '')
				.attr('type', 'checkbox')
				.attr('title', this)
				.add(
					$('<label />')
					.html(getDomainName(this))
				)
			)
		);
	});

	var feeds = []; // The feed URLs
	
	$('nav form').submit(function() {
		feeds = [];
		$('nav input:checked').each(function() {
			feeds.push($(this).attr('title'));
		});
		
		displayFeeds(feeds);
		return false;
	});
	$('nav form').submit();
	$('nav').show();
});

function displayFeeds(feeds) {
	var allFeeds = []; // The feed contents
	var count = 0;
	$.each(feeds, function () {
		var feed = new google.feeds.Feed(this);
		feed.setResultFormat('JSON_FORMAT');
		feed.setNumEntries(parseInt(total/feeds.length));
		feed.load(function(result) {
			if (!result.error) {
				$.each(result.feed.entries, function() {
					allFeeds.push(this);
				});
				count++;
				putInHTML(count, feeds, allFeeds);
			}
		});
	});
}

function putInHTML(feedsLoaded, feeds, allFeeds) {
	if (feedsLoaded == feeds.length) {
		allFeeds.sort(function (a, b) {
			var aDate = new Date(a.publishedDate);
			var bDate = new Date(b.publishedDate);
			if (aDate < bDate) {
				return -1;
			} else if (aDate > bDate) {
				return 1;
			} else {
				return 0;
			}
		});

		$('#feed').empty();
		$.each(allFeeds.reverse(), function(n) {
			var entry = this;
			var tags;
			if (entry.categories.length > 0) {
				tags = $('<ul class="tags" />').html(
					'<li>' + entry.categories.join('</li><li>') + '</li>'
				);
			}
			var source = getDomainName(entry.link);
			var dispDate = new Date(entry.publishedDate).format("D, d M Y H:i");
			$('#feed').append(
				$('<li />').html(
					$('<h3 />').html(
						$('<a />')
						.html(entry.title)
						.attr('href', entry.link)
						.attr('target', '_blank')
					).add(
						$('<h4 />').html(
							$('<a />')
							.attr('href', 'http://' + source)
							.attr('target', '_blank')
							.html(source)
						)
					).add(
						$('<p />').html(entry.contentSnippet)
					).add(
						$('<time />').html(dispDate)
					).add(tags)
				)
			);
		});
	}
}

function getDomainName(url) {
	domain_name_parts = url.match(/:\/\/(.[^/]+)/)[1].split('.');
	if(domain_name_parts.length >= 3){
		domain_name_parts[0] = '';
	}
	var domain = domain_name_parts.join('.');
	if(domain.indexOf('.') == 0) {
		return domain.substr(1);
	} else {
		return domain;
	}
}