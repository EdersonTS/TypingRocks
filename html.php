<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>TypingRocks</title>

	<link rel="stylesheet" media="all" href="./libs/css/reset.css" />
	<link rel="stylesheet" media="all" href="./libs/css/style.css" />

</head>
<body>

	<div class="frase">
		<div id="frase"></div>
	</div>

	<div><input type="text" class="digitar" id="digitar" /></div>
	<div id="timer"></div>


	<script type="text/javascript">
	// <![CDATA[
	var __CHAVES__   = <?php echo json_encode($palavras['chaves']); ?>;
	var __PALAVRAS__ = <?php echo json_encode($palavras['imagem']); ?>;
	var __TOTAL__    = <?php echo count($palavras['imagem']); ?>;
	// ]]>
	</script>
	<script type="text/javascript" src="./libs/js/jquery-2.1.0.min.js"></script>
	<script type="text/javascript" src="./libs/js/script.js"></script>

</body>
</html>
