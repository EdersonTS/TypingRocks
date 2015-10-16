<?php

include 'funcoes.php';
include 'palavras.php';

// guarda as palavras
$palavras = array(
  'chaves' => array(), // chaves para aferir
  'texto'  => array(), // texto para aferir
  'imagem' => array()  // texto modo imagem pará usuário
);

for ($__i = 0; $__i < 200; $__i++) {
  // escolhe uma palavra do dicionário disponível
  $__palavra  = $__PALAVRAS__[rand(0, $__TOTAL__)];

  // gera a chave
  $palavras['chaves'][] = hash('adler32', rand(0, time()));

  // armazena palavra para aferir
  $palavras['texto'][]  = array('palavra' => $__palavra, 'valida' => NULL);

  // armazena imagem da palavra para usuário
  $palavras['imagem'][] = 'data:image/png;base64,' . base64_encode(gerarImagens($__palavra));
}

$result = json_encode(
	array(
		'chaves'   => $palavras['chaves'],
		'palavras' => $palavras['imagem'],
		'total'    => count($palavras['imagem']),
	)
);

$__chaves = $palavras['chaves'];
$__texto  = $palavras['texto'];

session_start();
$_SESSION['palavras'] = array_combine($__chaves, $__texto);
session_commit();

echo $result;