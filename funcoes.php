<?php

ini_set("display_errors", TRUE);

error_reporting(E_ALL);

date_default_timezone_set('America/Sao_Paulo');

ini_set('default_charset', 'UTF-8');

setlocale(LC_ALL, "pt_BR", "ptb");





function gerarImagens($txt = "{ÉqtE") {
  $im    = imagecreate(mb_strlen($txt, 'UTF-8') * 12, 25);
  $black = imagecolorallocate($im, 0, 0, 0);
  $white = imagecolorallocate($im, 255, 255, 255);
  imagecolortransparent($im, $black);

  $image    = $im;
  $size     = 18;
  $angle    = 0;
  $x        = 0;
  $y        = 20;
  $color    = $white;
  $fontfile = __DIR__ . '/libs/fonts/UbuntuMono-R.ttf';
  $text     = $txt;

  imagettftext($image, $size, $angle, $x, $y, $color, $fontfile, $text);

  ob_start();
  imagepng($im);
  imagedestroy($im);
  return ob_get_clean();
}



function print_($value, $dump = FALSE) {
  echo '<pre>';

  if ( $dump === FALSE )
    print_r($value);
  else
    var_dump($value);

  echo '</pre>';
}