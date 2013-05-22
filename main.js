google.load("feeds", "1");

function initialize() {
	var feed = new google.feeds.Feed("http://fastpshb.appspot.com/feed/1/fastpshb");
	feed.load(function(result) {
		if (!result.error) {
			for (var i = 0; i < result.feed.entries.length; i++) {
				var entry = result.feed.entries[i];
				$('#feed').append($('<li />').html(entry.title));
				console.log(entry.title);
			}
		} else {
			alert('Error accessing feed!');
		}
	});
}
google.setOnLoadCallback(initialize);
