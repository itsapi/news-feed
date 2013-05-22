google.load("feeds", "1");

var feeds = [
	'http://feeds.bbci.co.uk/news/rss.xml',
	'http://rss.cnn.com/rss/edition_world.rss',
	'http://feeds.nytimes.com/nyt/rss/World',
	'http://feeds.reuters.com/Reuters/worldNews'
];

$(document).ready(function() {
	
	var allFeeds = new Array(); // Defined here

	var error = 0;
	$.each(feeds, function () {
		var feed = new google.feeds.Feed(this);
		feed.setResultFormat('JSON_FORMAT');
		feed.setNumEntries(1);
		feed.load(function(result) {
			if (!result.error) {
				allFeeds.push(result.feed.entries); // Appended to here
			} else {
				error = 1;
			}
		});
	});
	console.log(allFeeds); // Nothing in it here!
	if (!error) {
		$.each(allFeeds, function() {
			var entry = this;
			$('#feed').append(
				$('<li />').html(
					$('<h3 />').html(
						$('<a />').html(
							entry.title
						).attr('href', entry.link)
					).add(
						$('<p />').html(entry.contentSnippet)
					).add(
						$('<time />').html(entry.publishedDate)
					)
				)
			);
		});
	} else {
		alert('Error accessing feeds!');
	}
});