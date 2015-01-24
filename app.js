/**
 * This was an assignment for Thinkful Frontend Developer Bootcamp.
 * The initial project was forked and we were only supposed to a new feature to it.
 * So some parts of the code are re-used and not completely re-written.
 */
$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		// the parameters we need to pass in our request to StackOverflow's API
		var request = {
						tagged: tags,
						site: 'stackoverflow',
						order: 'desc',
						sort: 'creation'
		};

		getData(tags, request, "http://api.stackexchange.com/2.2/questions/unanswered", showQuestion);
	});

	$('.inspiration-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tag = $(this).find("input[name='answerers']").val();
		
		var request = {
						site: 'stackoverflow'
		};
		var endPoint = "http://api.stackexchange.com/" + "2.2/tags/" + tag + "/top-answerers/all_time";
		getData(tag, request, endPoint, showUser);
	});

	var showUser = function(item) {
		// clone our user template code
		var result = $('.templates .user').clone();
		
		// Set the user details properties in result
		var userElem = result.find('.user-name-and-pic a');
		userElem.attr('href', item.user.link);
		userElem.find(".username").text(item.user.display_name);
		var img = "<img src='" + item.user.profile_image + "' alt='" + item.user.display_name + "'/>";
		userElem.find(".img").append(img);

		result.find(".user-reputation").text(item.user.reputation);
		result.find(".total-posts").text(item.post_count);
		result.find(".total-score").text(item.score);

		return result;
	}

	// this function takes the question object returned by StackOverflow 
	// and creates new result to be appended to DOM
	var showQuestion = function(question) {
		
		// clone our result template code
		var result = $('.templates .question').clone();
		
		// Set the question properties in result
		var questionElem = result.find('.question-text a');
		questionElem.attr('href', question.link);
		questionElem.text(question.title);

		// set the date asked property in result
		var asked = result.find('.asked-date');
		var date = new Date(1000*question.creation_date);
		asked.text(date.toString());

		// set the #views for question property in result
		var viewed = result.find('.viewed');
		viewed.text(question.view_count);

		// set some properties related to asker
		var asker = result.find('.asker');
		asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
														question.owner.display_name +
													'</a>' +
								'</p>' +
	 							'<p>Reputation: ' + question.owner.reputation + '</p>'
		);

		return result;
	};


	// this function takes the results object from StackOverflow
	// and creates info about search results to be appended to DOM
	var showSearchResults = function(query, resultNum) {
		var results = resultNum + ' results for <strong>' + query;
		return results;
	};

	// takes error string and turns it into displayable DOM element
	var showError = function(error){
		var errorElem = $('.templates .error').clone();
		var errorText = '<p>' + error + '</p>';
		errorElem.append(errorText);
	};

	// takes a string of semi-colon separated tags to be searched
	// for on StackOverflow
	var getData = function(tags, request, url, showItem) {
		var result = $.ajax({
			"url": url,
			data: request,
			dataType: "jsonp",
			type: "GET",
			})
		.done(function(result){
			var searchResults = showSearchResults(tags, result.items.length);

			$('.search-results').html(searchResults);

			$.each(result.items, function(i, item) {
				$('.results').append(showItem(item));
			});
		})
		.fail(function(jqXHR, error, errorThrown){
			var errorElem = showError(error);
			$('.search-results').append(errorElem);
		});
	};
});