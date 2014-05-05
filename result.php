<?php

include 'funcoes.php';

session_start();

$sessao = $_SESSION['palavras'];

session_commit();

print_($_POST);
print_($sessao);