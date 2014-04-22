
function monta_frase() {
	var wrd = [];
	var frase = $('#frase').get(0);

	for(var _I = 0; _I < __TOTAL__; _I++) {
		var img  = document.createElement('img');
		img.src = __PALAVRAS__[_I];
		img.id  = __CHAVES__[_I];

		var span = document.createElement('span');

		span.appendChild(img);
		frase.appendChild(span);
		// frase.appendChild(document.createTextNode(' '));

		palavras.push(span)
	}
}

var palavras = [];
var total    = __TOTAL__;
var atual    = 0;
var palavra  = '';
var limpeza  = false;
var digitar  = $('#digitar');
var charcode = $('#charcode');

var keycodes = [
	17,  // ctrl
	18,  // alt
	19,  // pause
	20,  // caps-lock
	27,  // esc
	33,  // page-up
	34,  // page-down
	35,  // end
	36,  // home
	45,  // insert
	46,  // del
	93,  // context-menu
	225, // altgr
	8,   // backspace
	9,   // tab
	0,   // 
];

monta_frase();

digitar.keydown(function(e) {
	if (e.which == 32) {
		marca_espaco();
		conta_palavra();
		marca_palavra_fim();
		guarda_palavra(this.value);
		// charcode.html(this.value + '|');
	} else {
		// set_background()
	}
});
digitar.keypress(function(e) {
	if (deve_limpar()) {
		e.preventDefault();
		limpar(this);
	}
});
digitar.keyup(function(e) {
	if (esta_limpo(this.value)) {
		marca_palavra_ini();
		console.log(e.which);
		digitando();
	}
});

function digitando() {
	if (atual != 0)
		$(palavras[atual - 1]).removeAttr( 'class' );
		
	$(palavras[atual]).toggleClass( 'digitando' );
}
digitando();

function set_background() {
	var _wrd = get_palavra_object(get_atual() + 1);
	var _tt  = _wrd.innerHTML.length;
	var _qt  = digitar.value.length + 1;
	var _pc  = _qt/_tt*_wrd.offsetWidth;
	_wrd.style.backgroundPosition =  - 300 + _pc + "px 50%";
}

function conta_palavra() {
	atual++;
}
function marca_espaco() {
	espaco = true;
}
function e_espaco() {
	return espaco;
}
function remove_espaco() {
	espaco = false;
}
function marca_palavra_fim() {
	limpeza = true;
}
function marca_palavra_ini() {
	limpeza = false;
}
function deve_limpar() {
	return limpeza;
}
function esta_limpo(str) {
	return str.length == 0;
}
function limpar(input) {
	input.value = '';
}
function guarda_palavra(str) {
	palavra = str;
}


(function () {
	digitar.value = '';
	digitar.focus();
})();