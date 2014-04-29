<?php

include 'funcoes.php';
include 'palavras.php';

$return = array('match' => FALSE);

$id   = isset($_POST['id']) && strlen($_POST['id']) == 8 ? $_POST['id'] : FALSE;
$word = isset($_POST['word']) ? $_POST['word'] : FALSE;


if ( ! $id OR ! $word ) {
  exit ('Nothing to do here!!');
}


session_start();

if ( array_key_exists($id, $_SESSION['palavras']) ) {

  $return['match'] = $_SESSION['palavras'][$id]['palavra'] == $_POST['word'];
  $_SESSION['palavras'][$id]['valida'] = $return['match'];

  echo json_encode($return);

}

session_commit();
