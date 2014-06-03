<?php

include 'funcoes.php';

$return = Array();
$return['error']   = TRUE;
$return['message'] = Array();
session_start();

$sessao = $_SESSION['palavras'];

session_commit();

$input = array(
	'backspace'   => $_POST['backspace'],
	'error'       => $_POST['error'],
	'word'        => (int) $_POST['word'],
	'word_check'  => (int) count(explode(' ', trim($_POST['input_typed']))),
	'word_typed'  => explode(' ', trim($_POST['input_typed'])),
	'char'        => $_POST['char'],
	'typing'      => $_POST['typing'],
	'row'         => $_POST['row'],
	'time_start'  => $_POST['time_start'],
	'time_end'    => $_POST['time_end'],
	'input_typed' => trim($_POST['input_typed']),
);

if ($input['word'] !== $input['word_check']) {
	$return['message'][] = 'Número de palavras não confere.';

	set_json($return);
	exit;
}


$frase_sessao = '';
$contador     = 0;

foreach ( $sessao as $word ) {

	if ( $contador >= $input['word_check'] ) {
		break;
	}

	$frase_sessao .= $word['palavra'] . ' ';

	$contador++;
}

$input['input_typed'] = trim($input['input_typed']);
$frase_sessao = trim($frase_sessao);

$deveria_ser = mb_strlen($frase_sessao) + 1;
$digitado    = mb_strlen($input['input_typed']) + 1;
$backspace   = $input['backspace'];

$return['error'] = FALSE;
$return['message'][] = $digitado / 5;

set_json($return);