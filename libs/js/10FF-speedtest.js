var word_string, words;         //String = enthält die Wörter; Array(words) = enthält die Wörter aufgesplittet in einem Array
var row1_string = '';           //enthält die einzugebenen Wörter der 1. Reihe
var i;
var word_pointer = 0;           //markiert das aktuelle Wort welches getippt werden soll
var user_input_stream = '';     //sammelt alle Tastatureingaben des Users
var countdown;                  //zeigt die Zeit an und wird runtergezählt
var row_counter = 0;            //zählt die Anzahl der Zeilensprünge
var eingabe;                    //prüfvariable => alles was im Inputfeld drinsteht wird hier zwischengespeichert und weiterverarbeitet (manchmal reagiert der Keylistener für das Leerzeichen nicht schnell genug, z.b. "hallo w" wird dann übertragen, daher erfolgt zu erst eine weiterverarbeitung) 
var start_time = 0;             //die Startzeit in Millisekunden
var end_time = 0;               //die Endzeit in Millisekunden
var setval = "";                //die Variable für den Timer/setInterval
var start_time_set = 0;         //wurde die Startzeit auf dem Server mittels Ajax schon gesetzt oder nicht
var line_height = 0;            //Höhe des Zeilensprungs
var loading = 0;

var error_wpm = 0;              //fallback if ajax call fails => user can still see his result
var error_keystrokes = 0;
var error_correct = 0;
var error_wrong = 0;
var backspace_counter = 0;

var _gaq = _gaq || [];
var test_ausgefuehrt = 0;

var keys = {};                  //liest die gedrückten Tasten ein, wird genutzt für Mac/Safari "Smart" Reload

var input_key_value = $("#config_input_key").attr("value");
var $inputfield = $("input#inputfield");
var $row1 = $("#row1");
var $reloadBtn = $("#reload-btn");
var $row1_span_wordnr;

$(document).ready(function(){
	restart();
	activate_keylistener();
	
	var win_width = $(window).width();
	
	//mostly for Facebook
	/*
	if(win_width < 800)
	{
		$("#words").css('width', win_width-50);
		$("#words").css('margin-left', '10px');
		$("#input-box-space").css('width', '80px');
	}
	*/
	
	//reload-button
	//oder "F5"-Taste abfangen
	$(document).keydown(function(event) {
		if ( event.which == 116 ) {
			loading = 1;
			restart();
			return false;
		}
		
		keys[event.which] = true;
	});
	
	$(document).keyup(function (event) {
		delete keys[event.which];
	});
	
	$("#reload-btn").on('click', function(){
		restart();
		return false;
	});
});

function restart() {
	//wird beim start und beim klick auf "restart" aufgerufen
	//ruft initialisierungsfunktionen auf und setzt werte zurück auf den startwert
	word_string = '';
	words = '';
	row1_string = '';
	word_pointer = 0;
	user_input_stream = '';
	countdown = 60;
	cd_started = 0;
	previous_position_top = 0;
	row_counter = 0;
	eingabe = '';
	start_time = 0;
	end_time = 0;
	start_time_set = 0;
	
	//just to count everything if the ajax-call fails
	error_wpm = 0;
	error_keystrokes = 0;
	error_correct = 0;
	error_wrong = 0;
	backspace_counter = 0;
		
	$("#timer").text("1:00");
	$("#ajax-load").css('display', 'block');
	$("#reload-box").css('display', 'none');
	$("#row1").css('top', "1px");
	$("#timer").removeClass("off");
	
	window.clearInterval(setval);
	setval = "";
	
	$.ajax({
		type: 'POST',
		url: myBaseUrl + '/speedtests/get_words',
		data: "speedtest_mode="+$("#speedtest_mode").attr("value"),
		cache: false,
		success: function(data){
			setTimeout(function() { 
				$("#ajax-load").css('display', 'none');
				$("#reload-box").css('display', 'block');
				$("#wordlist").text(data);
				
				word_string = $('#wordlist').text();
				//console.log(data);
				words = word_string.split("|");
				
				fill_line_switcher();

				//initialisiere wichtige Startwerte die abhängig von der Textgröße ist              
				p = $('#row1 span[wordnr="'+word_pointer+'"]').position();
				
				previous_position_top = 0;
				
				line_height = parseInt($('#row1 span[wordnr="'+word_pointer+'"]').css('line-height'));          
								
				//springe ins InputField
				$inputfield.val('');
				$inputfield.focus();
				
				$("#row1").show();
				$("#words").fadeTo('fast', 1.0);
				
				if(test_ausgefuehrt > 0)
					_gaq.push(['_trackPageview', window.location.pathname]);
				
				test_ausgefuehrt++;
				
				loading = 0;
				
			}, 200);
		},
		error:function(httpRequest, textStatus, errorThrown) { 
			//restart();
		}
	});
}

//wartet auf Eingaben die im #inputfield erfolgen
function activate_keylistener() {
	var android_spacebar = 0;
	
	// Android/mobile specific function to check if inputfield contains a space-char, as the keyup function doesn't work on Android+Chrome 
	$(window).on("touchstart", function(event) {
		$("input#inputfield").on("input", function( event ) {
			var value = $("input#inputfield").val();    
			
			if (value.indexOf(" ") != -1) {
				android_spacebar = 1;
			} else {
				android_spacebar = 0;
			}
		});
	});
	
	$inputfield.keyup(function(event) {
		if ( loading == 0 ) {
			start_countdown();
			
			//setze die Startzeit auf dem Server
			if(start_time_set == 0)
			{
				$.ajax({
					//url: "http://10fastfingers.com/speedtests/set_start_time"
					url: myBaseUrl + '/speedtests/set_start_time',
				})
				
				start_time_set = 1;
			}
		}
		
		$reloadBtn.show();

		$row1_span_wordnr = $('#row1 span[wordnr="'+word_pointer+'"]');
		
		if(event.which == 8)
		{
			backspace_counter++;
		}
		
		if(event.which == input_key_value && $inputfield.val() == ' ')
		{
			$inputfield.val('');
		}
		else if (event.which == input_key_value && loading == 0 || android_spacebar == 1) { //event.which == 32 => SPACE-Taste
			
			//evaluate
			var eingabe = $inputfield.val().split(" ");
			user_input_stream += eingabe[0]+" ";
			
			$row1_span_wordnr.removeClass('highlight-wrong');
			
			if(eingabe[0] == words[word_pointer])
			{
				$row1_span_wordnr.removeClass('highlight').addClass('correct');
				error_correct++;
				error_keystrokes += words[word_pointer].length;
				error_keystrokes++; //für jedes SPACE
			}   
			else
			{
				$row1_span_wordnr.removeClass('highlight').addClass('wrong');
				error_wrong++;
				error_keystrokes -= Math.round(words[word_pointer].length / 2);
			}   
			
			//process
			word_pointer++;
			$row1_span_wordnr = $('#row1 span[wordnr="'+word_pointer+'"]');
			
			$row1_span_wordnr.addClass('highlight');
			
			p = $row1_span_wordnr.position();
		
			//console.log(p.top+"\n");
			
			if(p.top > previous_position_top + 10) //"+ 5 ist die Toleranz, damit der Zeilensprung auch funktioniert, wenn User die Schriftart größer gestellt hat, etc."
			{
				row_counter++;
				previous_position_top = p.top;
				
				var zeilensprung_hoehe = (-1 * line_height) * row_counter;
				$row1.css('top', zeilensprung_hoehe+"px"); //bei einem zeilensprung wird der text um "line_height" verschoben 
				$row1_span_wordnr.addClass('highlight');
			}
			
			//erase
			$("#inputstream").text(user_input_stream);
			$inputfield.val(eingabe[1]);
		} else {
			//prüfe ob user das wort gerade falsch schreibt (dann zeige es rot an, damit user direkt korrigieren kann)
			if($inputfield.val().replace(/\s/g, '') == words[word_pointer].substr(0, $inputfield.val().length))
				$row1_span_wordnr.removeClass('highlight-wrong').addClass('highlight');
			else
				$row1_span_wordnr.removeClass('highlight').addClass('highlight-wrong'); 
		}
		
	});
}

//zählt die Zeit runter und stoppt den Speedtest
function start_countdown() {
	if(cd_started == 0)
	{
		cd_started = 1;
		setval = window.setInterval(count_down, 1000);
		start_time = get_current_time().toString(16);
	}
}

//zählt die Zeit runter
function count_down() {
	countdown--;
	
	var first_part;
	var second_part;
	
	first_part = Math.floor(countdown / 60);
	second_part = countdown % 60;
	
	if(second_part < 10)
		second_part = '0'+second_part;
	
	$("#timer").text(first_part+":"+second_part);
	
	if(countdown > 9)
	{
		$("#timer").text("0:"+countdown);
	} else if(countdown > 0){
		$("#timer").text("0:0"+countdown);
	} else {
		//ENDE => countdown erreicht 0 Sekunden, stoppe den Countdown und Auswertung mittels Ajax
		$("#timer").text("0:00");
		$("#timer").addClass("off");
		$("#row1").hide();
		//$("#words").fadeTo('fast', 0.3);
		$("#words").fadeOut();
		
		window.clearInterval(setval);
		setval = "";
		
		end_time = get_current_time().toString(16);
		
		var send_data = "sz="+start_time+"&ez="+end_time+"&user_input="+user_input_stream+"&backspace_counter="+backspace_counter+"&speedtest_id="+$("#logo").attr("speedtest_id");
	
		$("#result-load-indicator").show();
		
		$.ajax({
			type: 'POST',
			url: myBaseUrl + '/speedtests/auswertung',
			cache: false,
			dataType: 'json',
			data: send_data,
			success: function(data){
				$("#result-load-indicator").hide();
				$("#auswertung-result").html(data['result']);
				$("#auswertung-result").show();
				
				
				$("#badge-box").html(data['badge']);
				$("#badge-box").show();
				
				$("#advertisement").css("width", "1400px");
				$("#ads-speedtest-view-container").css("width", "");
				
				//check & load new notifications, 5 seconds after test to check for  
				//and 70 seconds after test => achievements are processed every minute, so it has to be one minute later
				
				/*
				setTimeout(function() { load_notifications() }, 5000);
				setTimeout(function() { load_notifications() }, 70000);
				*/
				
				//hides the secondary main-ad and resizes the "main-ad-box" to fit on the right side next to "result" & "share"
				//$("#ad-main-secondary").hide();
				$("#ad-main").css('margin', 'none');
				$("#ad-main").css('float', 'left');
				$("#ad-main-secondary").css('float', 'left');
			},
			error: function(xhr, textStatus, errorThrown) {
				console.log(xhr);
				console.log(textStatus);
				console.log(errorThrown);
				
				error_wpm = Math.round(error_keystrokes / 5);
				$("#error-box #wpm").text(error_wpm);
				$("#error-box #keystrokes").text(error_keystrokes);
				$("#error-box #correct-words").text(error_correct);
				$("#error-box #wrong-words").text(error_wrong);
				
				$("#error-box").show();
			}
		});
	}   
}

function get_current_time() {
	var d = new Date();
	return d.getTime();
}

//String "Trim" Function
function trim11 (str) {
	str = str.replace(/^\s+/, '');
	for (var i = str.length - 1; i >= 0; i--) {
		if (/\S/.test(str.charAt(i))) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;
}

//befüllt #row1 und #row2 mit neuen Wörtern
function fill_line_switcher() {
	for(i=0; i < words.length; i++)
		row1_string += '<span wordnr="'+i+'" class="">'+words[i]+'</span> '; //classes = NONE, green, red, highlight
		
	$("#row1").html(row1_string);
	
	$("#row1 span:first").addClass('highlight');
}