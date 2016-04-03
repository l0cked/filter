<?php

function echo_cloud_menu() {
	return <<<EOF
	<div class="cloud-menu menu">
		<ul>
			<li class="click-shuffle">
				<div class="icon-shuffle" data-title="Перемешать"></div>
			</li>
			<li class="click-delete">
				<div class="icon-delete" data-title="Удалить"></div>
			</li>
		</ul>
	</div>
EOF;
}

function echo_cloud_items() {
	return <<<EOF
	<div class="cloud-items">
		<div class="item"><p>Свиток мудрости</p></div>
		<div class="item"><p>Свиток портала</p></div>
		<div class="item"><p>Деталь доспеха</p></div>
		<div class="item"><p>Точильный камень</p></div>
		<div class="item"><p>Стекольная масса</p></div>
		<div class="item"><p>Резец картографа</p></div>
		<div class="item"><p>Призма камнереза</p></div>
		<div class="item"><p>Сфера златокузнеца</p></div>
		<div class="item"><p>Цветная сфера</p></div>
		<div class="item"><p>Сфера соединения</p></div>
		<div class="item"><p>Сфера превращения</p></div>
		<div class="item"><p>Сфера удачи</p></div>
		<div class="item"><p>Сфера алхимии</p></div>
		<div class="item"><p>Сфера царей</p></div>
		<div class="item"><p>Сфера усиления</p></div>
		<div class="item"><p>Сфера возвышения</p></div>
		<div class="item"><p>Сфера перемен</p></div>
		<div class="item"><p>Сфера хаоса</p></div>
		<div class="item"><p>Благодатная сфера</p></div>
		<div class="item"><p>Божественная сфера</p></div>
		<div class="item"><p>Сфера очищения</p></div>
		<div class="item"><p>Зеркало Каландры</p></div>
		<div class="item"><p>Сфера раскаяния</p></div>
		<div class="item item-corrupted"><p>Сфера ваал</p></div>
		<div class="item item-magic"><p>Искажённый Кобальтовый самоцвет эффективности</p></div>
		<div class="item item-unique"><p>Цепочка</p></div>
		<div class="item item-sockets">
			<p style="color:rgb(175,96,37);">Вендору отдай</p>
			<ul class="sockets-4">
				<li class="socket-1 socket-red"></li>
				<li class="socket-2 socket-blue"></li>
				<li class="socket-3 socket-blue"></li>
				<li class="socket-4 socket-blue"></li>
			</ul>
		</div>
		<div class="item item-sockets item-rare">
			<p>Потусторонний меч высокого качества</p>
			<ul>
				<li class="socket-1 socket-red"></li>
				<li class="socket-2 socket-blue"></li>
				<li class="socket-3 socket-blue"></li>
				<li class="socket-4 socket-blue"></li>
				<li class="socket-5 socket-green"></li>
				<li class="socket-6 socket-blue"></li>
				<li class="link-h-1"></li>
				<li class="link-h-2"></li>
				<li class="link-h-3"></li>
				<li class="link-v-1"></li>
				<li class="link-v-2"></li>
			</ul>
		</div>
	</div>
EOF;
}

function echo_cloud() {
	$menu = echo_cloud_menu();
	$items = echo_cloud_items();
	echo <<<EOF
	<div class="cloud-wrapper">
		<div class="cloud">
			$menu
			<div class="cloud-resize resize-e"><span></span></div>
			<div class="cloud-resize resize-se"><span></span></div>
			<div class="cloud-resize resize-s"><span></span></div>
			$items
		</div>
	</div>
EOF;
}

?>