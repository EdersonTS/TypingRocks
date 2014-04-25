
function monta_frase() {
	var wrd = [];
	var frase = $('#frase').get(0);

	for(var _I = 0; _I < __TOTAL__; _I++) {
		var img  = document.createElement('img');
		img.src = __PALAVRAS__[_I];

		var span = document.createElement('span');
		span.id        = __CHAVES__[_I];
		span.className = 'bloco';

		span.appendChild(img);
		frase.appendChild(span);
		// frase.appendChild(document.createTextNode(' '));

		palavras.push(span)
	}
}

var palavra  = '';
var palavras = [];
var total    = __TOTAL__;
var digitar  = $('#digitar');
var counter  = {
	backspace : 0,
	error     : 0,
	word      : 0,
	char      : 0,
};


var keys = {
	CTRL         : 17,  // ctrl
	ALT          : 18,  // alt
	PAUSE        : 19,  // pause
	CAPSLOCK     : 20,  // caps-lock
	ESC          : 27,  // esc
	PAGEUP       : 33,  // page-up
	PAGEDOWN     : 34,  // page-down
	END          : 35,  // end
	HOME         : 36,  // home
	INSERT       : 45,  // insert
	DEL          : 46,  // del
	CONTEXT_MENU : 93,  // context-menu
	ALTGR        : 225, // altgr
	BACKSPACE    : 8,   // backspace
	TAB          : 9    // tab
};

monta_frase();



digitar.keyup(function(event) {

	var _this = this, $_this = $(this);


	// [BACKSPACE] ---------------------
	if( event.which == 8 ) {
		counter.backspace++;

		counter.char--;
		set_background();
	} else


	// [SPACE] empty -------------------
	if ( event.which == 32 && this.value == ' ' ) {

		this.value = '';
	} else 


	// [SPACE] -------------------------
	if ( event.which == 32 ) {

		// save actual word position
		var word_number = counter.word;

		$.ajax({
			type: 'POST',
			url: 'get.php',
			cache: false,
			dataType: 'json',
			data: {'id' : get_word().id, 'word' : _this.value.replace(/\s/g, '')},
			success: function (data){
				mark_as_correct_word( word_number, data.match )
			},
			error : function (data) {
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
	} else 


	{
		counter.char++

		// typing tracking
		set_background();
	}

});







function mark_next_word() {

	if (counter.word != 0) {
		$(get_word(counter.word - 1)).removeClass( 'digitando' );
		$(get_word(counter.word - 1).getElementsByTagName('img')[0]).removeAttr( 'style' );
	}

	$(get_word()).addClass( 'digitando' );
}

mark_next_word();


function mark_as_correct_word( word_number, result ) {
	$(get_word(word_number)).addClass( result ? 'green' : 'red' );
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


function clean() {
	digitar[0].value = '';
}



(function () {
	digitar[0].value = '';
	digitar[0].focus();
})();