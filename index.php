<!doctype html>
<html lang="ru">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
	<!-- For IE 9 and below. ICO should be 32x32 pixels in size -->
	<!--[if IE]><link rel="shortcut icon" href="favicon.ico"><![endif]-->
	<!-- Touch Icons - iOS and Android 2.1+ 180x180 pixels in size. -->
	<link rel="apple-touch-icon-precomposed" href="apple-touch-icon-precomposed.png">
	<!-- Firefox, Chrome, Safari, IE 11+ and Opera. 196x196 pixels in size. -->
	<link rel="icon" href="favicon196x196.png">
	<title>POE Filter *beta</title>
	<link rel="stylesheet" href="css/fontello.css">
	<link rel="stylesheet" href="css/style.css">
</head>
<!-- <body> -->
<body class="cloud-edit">
	<?include 'cloud.php';?>

	<div class="loader">
		<img src="img/loader.gif" alt="loader">
	</div>

	<div class="bg">
		<img class="bg-img" data-src="img/bg.png" alt="background">
	</div>

	<div class="menu main-menu">
		<ul>
			<li>
				<span class="icon-plus"></span>
				<p>Добавить</p>
			</li>
			<li class="click-shuffle">
				<span class="icon-shuffle"></span>
				<p>Перемешать</p>
			</li>
			<li class="click-edit">
				<span class="icon-edit"></span>
				<p>Редактировать</p>
			</li>
		</ul>
	</div>

	<?php

	echo_cloud();

	?>
	<script src="js/prototype.js"></script>
	<script src="js/script.js"></script>
</body>
</html>