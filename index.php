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

	<div class="main-menu menu">
		<ul>
			<li class="click-plus"><div class="icon-plus" data-title="Добавить"></div></li>
			<li class="click-shuffle"><div class="icon-shuffle" data-title="Перемешать"></div></li>
			<li class="click-edit"><div class="icon-edit" data-title="Редактировать"></div></li>
		</ul>
	</div>

	<div class="cloud-wrapper" style="left:450px; top:80px; width:300px; height:300px;">
		<div class="cloud">
			<div class="cloud-menu menu">
				<ul>
					<li class="click-shuffle">
						<div class="icon-shuffle" data-title="Перемешать"></div>
					</li>
				</ul>
			</div>
			<div class="cloud-resize resize-e"><span></span></div>
			<div class="cloud-resize resize-se"><span></span></div>
			<div class="cloud-resize resize-s"><span></span></div>
			<div class="cloud-items">
				<div class="item"><p>Свиток мудрости</p></div>
				<div class="item"><p>Свиток портала</p></div>
				<div class="item"><p>Деталь доспеха</p></div>
				<div class="item"><p>Точильный камень</p></div>
			</div>
		</div>
	</div>

	<?php

	echo_cloud();

	?>
	<script src="js/prototype.js"></script>
	<script src="js/script.js"></script>
</body>
</html>