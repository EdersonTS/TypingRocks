<?php

include 'funcoes.php';
include 'palavras.php';
 
// guarda as palavras
$palavras = array(
  'chaves' => array(), // chaves para aferir
  'texto'  => array(), // texto para aferir
  'imagem' => array()  // texto modo imagem pará usuário
);

for ($__i = 0; $__i < 30; $__i++) { 
  // escolhe uma palavra do dicionário disponível
  $__palavra  = $__PALAVRAS__[rand(0, $__TOTAL__)];

  // gera a chave
  $palavras['chaves'][] = hash('adler32', rand(0, time()));

  // armazena palavra para aferir
  $palavras['texto'][]  = $__palavra;

  // armazena imagem da palavra para usuário
  $palavras['imagem'][] = 'data:image/png;base64,' . base64_encode(gerarImagens($__palavra));
}

session_start();
$_SESSION['palavras'] = array(
  'chaves' => $palavras['chaves'],
  'texto'  => $palavras['texto'],
);
session_commit();


include 'html.php';