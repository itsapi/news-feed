google.load("feeds", "1");

var feeds = [
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

var allFeeds = new Array();

$(document).ready(function() {
	var count = 0;
	$.each(feeds, function () {
		var feed = new google.feeds.Feed(this);
		feed.setResultFormat('JSON_FORMAT');
		feed.setNumEntries(4);
		feed.load(function(result) {
			if (!result.error) {
				$.each(result.feed.entries, function() {
					allFeeds.push(this);
				});
				count++;
				putInHTML(count, allFeeds);
			}
		});
	});
});

function putInHTML(feedsLoaded) {
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

		$.each(allFeeds.reverse(), function(n) {
			var entry = this;
			var tags;
			if (entry.categories.length > 0) {
				tags = $('<ul class="tags" />').html(
					'<li>' + entry.categories.join('</li><li>') + '</li>'
				);
			}
			var dispDate = new Date(entry.publishedDate).format("D, d M Y H:i");
			$('#feed').append(
				$('<li />').html(
					$('<h3 />').html(
						$('<a />').html(
							entry.title
						).attr('href', entry.link).attr('target', '_blank')
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