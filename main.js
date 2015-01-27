google.load("feeds", "1");

if ($.cookie('savedFeeds')) {
	var defaultFeeds = $.parseJSON($.cookie('savedFeeds'));
} else {
	var defaultFeeds = [
		'http://bbc.co.uk/news',
		'http://cnn.com',
		'http://nytimes.com',
		'http://reuters.com',
		'http://news.sky.com',
		'http://telegraph.co.uk',
		'http://washingtonpost.com',
		'http://wsj.com',
		'http://channel4.com/news',
		'http://guardian.co.uk'
	];
}

var total = 100;

$(document).ready(function() {

	$.each(defaultFeeds, function() {
		$('nav ul').append(
			$('<li />').html(
				$('<label />').html(
					$('<input />')
					.attr('checked', '')
					.attr('type', 'checkbox')
					.attr('value', this)
					.add(
						$('<span />').html(
							getDomainName(this)
						)
					)
				)
			)
		);
	});

	var feeds = []; // The feed URLs
	
	$('nav form').submit(function() {
		var search = $('nav form input#search').val();
		var userURL = $('nav form input#url').val();
		if (userURL != '') {
			if(userURL.substr(0,7) != 'http://'){
				userURL = 'http://' + userURL;
			}
			console.log(userURL);
			$('nav ul').append(
				$('<li />').html(
					$('<label />').html(
						$('<input />')
						.attr('checked', '')
						.attr('type', 'checkbox')
						.attr('value', userURL)
						.add(
							$('<span />').html(
								getDomainName(userURL)
							)
						)
					)
				)
			)
		}

		feeds = [];
		$('nav ul input:checked').each(function() {
			feeds.push($(this).attr('value'));
		});

		$.removeCookie('savedFeeds');
		$.cookie('savedFeeds', JSON.stringify(feeds), { expires: 30 });

		displayFeeds(feeds, search);
		$('nav input[type=text]').val('');
		return false;
	});
	$('nav form').submit();
});

function displayFeeds(feeds, search) {
	var allFeeds = []; // The feed contents
	var count = 0;
	function next() {
		count++;
		putInHTML(count, feeds, allFeeds);
	}
	$.each(feeds, function () {

		// Get the feed URL
		var query = 'site:' + this + ' ' + search;
		google.feeds.findFeeds(query, function(result) {
			if (result.error) {
			  console.log('Error finding feed');
			  next();
			}
			if (result.entries.length <= 0) {
			  console.log('No results for feed');
			  next();
			}
			var feedURL = result.entries[0].url;
			if (feedURL === '') {
			  console.log('Feed not found');
			  next();
			}
			console.log('Fetching:', feedURL);
			var feed = new google.feeds.Feed(feedURL);
			feed.setResultFormat('JSON_FORMAT');
			feed.setNumEntries(parseInt(total/feeds.length));
			feed.load(function(result) {
			  console.log(result)
				if (result.error) {
				  console.log('Error fetching feed');
				  next();
				}
				$.each(result.feed.entries, function() {
					allFeeds.push(this);
				});
				next();
			});
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
		$('#feed li').each(function() {
			$(this).find('h3').css('margin-right', $(this).find('h4').css('width'));
		});
		console.log('Loaded Stories');
	}
}

function getDomainName(data) {
	var a = document.createElement('a');
	a.href = data;
	return a.hostname;
}
