

var frase       = $('#frase');
var digitar     = $('#digitar');
var timer       = $('#timer');
var palavras    = [];

var is_loading  = false;
var is_typing   = false;

var time_to_end = 60;
var counter     = {
	backspace : 0,
	error     : 0,
	word      : 0,
	char      : 0,
	typing    : null,
	row       : 1,
};
var result      = {
	time_start  : 0,
	time_end    : 0,
	input_typed : '',
}




digitar.keyup(function(event) {

	var _this = this, $_this = $(this);

	if ( is_loading ) {
		event.preventDefault();

		// disable
		// this.disabled = true;

		// clean typing area
		clean(this);

		return;
	}

	typing_start();

	// [BACKSPACE] ---------------------
	if( event.which == 8 ) {
		counter.backspace++;

		counter.char--;
		set_background();
	} else


	// [SPACE] empty -------------------
	if ( event.which == 32 && _this.value == ' ' ) {

		_this.value = '';
	} else


	// [SPACE] -------------------------
	if ( event.which == 32 ) {

		// add word to "input stream"
		result.input_typed += _this.value.split(' ')[0] + ' ';

		// save actual word position
		var word_number = counter.word;

		$.ajax({
			type: 'POST',
			url: 'check.php',
			cache: false,
			dataType: 'json',
			data: {'id' : get_word().id, 'word' : _this.value.replace(/\s/g, '')},
			success: function (data){
				mark_as_correct_word( word_number, data.match )
			},
			error : function (data) {
				console.log('Error AJAX: check.php');
				console.log(data);
			}
		});

		// next word
		counter.word++;
		counter.char = 0;

		// clean typing area
		clean(this);

		// highlight next word
		mark_next_word();

		// move row to top
		move_row();
	} else


	{
		counter.char++

		// typing tracking
		set_background();
	}
});








function mark_as_correct_word( word_number, result ) {
	$(get_word(word_number)).addClass( result ? 'green' : 'red' );
}
function mark_next_word() {

	if (counter.word != 0) {
		$(get_word(counter.word - 1)).removeClass( 'digitando' );
		$(get_word(counter.word - 1).getElementsByTagName('img')[0]).removeAttr( 'style' );
	}

	$(get_word()).addClass( 'digitando' );
}
mark_next_word();

function move_row() {
	var row_height = counter.row * 31;
	if ( get_word().offsetTop > row_height ) {
		frase.css( {'margin-top' : - row_height + 'px'} )

		counter.row++;
	}
}




function get_word(position) {
	position = Number(position);

	if ( isNaN(position) || position < 0 ) {
		position = counter.word;
	}

	return palavras[position];
}



function set_background() {
	(get_word().getElementsByTagName('img')[0]).style.backgroundPosition =  - 300 + (counter.char * 12) + "px 50%";
}


function get_current_time() {
	return (new Date()).getTime();
}


function clean() {
	digitar[0].value = '';
}




function init( data ) {
	monta_frase( data );
	digitar[0].value = '';
	digitar[0].focus();
}




function typing_start() {
	if ( ! is_typing ) {
		is_typing = true;
		counter.typing = setInterval( typing_decrease_time, 1000 );
		result.time_start = get_current_time();
	}
}
function typing_end() {
	if ( is_typing ) {
		clearInterval( counter.typing );
		result.time_end = get_current_time();

		result_calc();
	}
}

function typing_decrease_time() {
	time_to_end--;
	timer[0].innerHTML = time_to_end + ' s';
	if ( time_to_end == 0 ) {
		typing_end();
	}
}

function result_calc() {
	if ( ! is_loading ) {

		is_loading = true;

		var __result = array_merge(counter, result);

		clear_words();

		$.ajax({
			type: 'POST',
			url: 'result.php',
			cache: false,
			dataType: 'json',
			data: __result,
			success: function ( data ){
				if (data.error) {

				} else {
					var message = '';

					if (typeof data.message == 'string') {
						message = data.message;
					} else 

					if (typeof data.message == 'object') {
						for ( var __i in data.message) {
							message += data.message[__i];
						}
					}
					alert(message);
				}
			},
			error : function ( data ) {
				console.log('Error AJAX: result.php');
				console.log(data);
			}
		});

	}
}

function monta_frase(__SERVER__) {
	var wrd = [];

	for(var _I = 0; _I < __SERVER__.total; _I++) {
		var img  = document.createElement('img');
		img.src = __SERVER__.palavras[_I];

		var span = document.createElement('span');
		span.id        = __SERVER__.chaves[_I];
		span.className = 'bloco';

		span.appendChild(img);
		frase.get(0).appendChild(span);
		// frase.appendChild(document.createTextNode(' '));

		palavras.push(span)
	}
}

function clear_words() {
	// frase.children().fadeOut( 750, function () {
	// 	$(this).remove();
	// });
}

function array_merge() {
	var __array = {};
	for (var _i = 0; _i < arguments.length; _i++) {
		for ( var __i in arguments[_i] ) {
			__array[__i] = arguments[_i][__i];
		}
	}
	return __array;
}