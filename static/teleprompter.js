function stream(endStream=false){
    console.log('starting stream')
    // make a request to /stream and get the data
    // as it comes through (data will stream in)
    // also handle reconnection
    // this is a regular GET request that responses with mimetype "application/x-ndjson"
    // which is a newline delimited json stream
    if (endStream == true) { window.source.close(); console.log('window.source.readyState: ' + window.source?.readyState); return}
    var source = new EventSource('/stream');
    var suggestion_template = $(".suggestion").clone();
    window.source = source // to end stream
    
    source.onmessage = function(event) {
        
        var data = JSON.parse(event.data);
        // update the text in the prompter

        $("#current-transcript").text(data.transcript);
        console.log(data.transcript)
        // copy ".suggestion-container" for each suggestion
        var suggestions = data.suggestions.map(function(suggestion){
            var element = suggestion_template.clone();
            if (suggestion.text.length > 150) {
                suggestion.text = suggestion.text.substring(0, 150) + "...";
            }
            element.find('.card-title').text(suggestion.text);
            
            element.find('.card-subtitle').text(suggestion.subtext);
            return element;
        });
        // remove the old suggestions
        $(".suggestion-list").empty();
        // add the new suggestions
        $(".suggestion-list").append(suggestions);
    };
    source.onerror = function(event) {
        console.log("error", event);
    }
}
// stream()
window.stream = stream