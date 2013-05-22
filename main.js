google.load("feeds", "1");

var feeds = [
	'http://feeds.bbci.co.uk/news/rss.xml',
	'http://rss.cnn.com/rss/edition_world.rss',
	'http://feeds.nytimes.com/nyt/rss/World',
	'http://feeds.reuters.com/Reuters/worldNews'
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
		$.each(allFeeds, function() {
			var entry = this;
			$('#feed').append(
				$('<li />').html(
					$('<h3 />').html(
						$('<a />').html(
							entry.title
						).attr('href', entry.link).attr('target', '_blank')
					).add(
						$('<p />').html(entry.contentSnippet)
					).add(
						$('<time />').html(entry.publishedDate)
					)
				)
			);
			if (entry.categories.length > 0) {
				$('#feed:last-child').append(
					$('<ul class="tags" />').html(
						'<li>' + entry.categories.join('</li><li>') + '</li>'
					)
				)
			}
		});
	}
}