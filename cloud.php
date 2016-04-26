<?php

$default_items = array(
	'Свиток мудрости',
	'Свиток портала',
	'Деталь доспеха',
	'Точильный камень',
	'Стекольная масса',
	'Резец картографа',
	'Призма камнереза',
	'Сфера златокузнеца',
	'Цветная сфера',
	'Сфера соединения',
	'Сфера превращения',
	'Сфера удачи',
	'Сфера алхимии',
	'Сфера царей',
	'Сфера усиления',
	'Сфера возвышения',
	'Сфера перемен',
	'Сфера хаоса',
	'Благодатная сфера',
	'Божественная сфера',
	'Сфера очищения',
	'Зеркало Каландры',
	'Сфера раскаяния',
	array(
		'title' => 'Сфера ваал',
		'color' => 'rgb(210,0,0)'
	),
	array(
		'title' => 'Цепочка',
		'color' => 'rgb(175,96,37)'
	),
	array(
		'title' => 'Искажённый Кобальтовый самоцвет эффективности',
		'color' => 'rgb(136,136,255)'
	),
	array(
		'title' => 'Потусторонний меч высокого качества',
		'color' => 'rgb(255,255,119)',
		'sockets' => array(
			's' => 6,
			'l' => 6
		)
	),
	array(
		'title' => 'Вендору отдай',
		'color' => 'rgb(175,96,37)',
		'sockets' => array(
			's' => 4,
			'l' => 0
		)
	)
	);

function cloud_menu() {
	return <<<EOF
	<div class="menu cloud-menu">
		<ul>
			<li class="click-shuffle">
				<span class="icon-shuffle"></span>
				<p>Перемешать</p>
			</li>
			<li class="click-delete">
				<span class="icon-delete"></span>
				<p>Удалить</p>
			</li>
		</ul>
	</div>
EOF;
}

function cloud_sockets($socket_count, $link_count) {
	/*
	<li class="socket-1 socket-red"></li>
	<li class="socket-2 socket-blue"></li>
	<li class="socket-3 socket-blue"></li>
	<li class="socket-4 socket-blue"></li>
	<li class="socket-5 socket-green"></li>
	<li class="socket-6 socket-blue"></li>
	<li class="link-1"></li>
	<li class="link-2"></li>
	<li class="link-3"></li>
	<li class="link-4"></li>
	<li class="link-5"></li>
	*/
	if ( $socket_count <= 2 ) {
		$className = 'sockets-2';
	} else if ( $socket_count <= 4 ) {
		$className = 'sockets-4';
	}
	if ( $className ) {
		$className = ' class="' . $className . '"';
	}
	$ret = '<ul' . $className . '>';

	if ( $socket_count > 0 ) {
		for ( $i=0; $i <= $socket_count; $i++ ) {
			$ret .= '<li class="socket-' . $i . ' socket-blue"></li>';
		}
	}

	if ( $link_count > 0 ) {
		if ( $link_count >= $socket_count ) {
			$link_count = $socket_count - 1;
		}
		for ( $i=0; $i <= $link_count; $i++ ) {
			$ret .= '<li class="link-' . $i . '"></li>';
		}
	}

	$ret .= '</ul>';
	return $ret;
}

function cloud_items() {
	global $default_items;

	foreach ( $default_items as $item ) {
		$style = '';
		if ( is_array($item) ) {
			$item_title = $item['title'];
			if ( $item['color'] ) {
				$style .= 'style="color: ' . $item['color'] . ';"';
			}
			if ( $item['sockets'] ) {
				$className = ' item-sockets';
			}
			$default .= '
			<div class="item' . $className . '">
				<p class="item-title"' . $style . '>' . $item_title . '</p>';
			if ( $item['sockets'] ) {
				//$default .= cloud_sockets(rand(1,6), rand(1,5));
				$default .= cloud_sockets($item['sockets']['s'], $item['sockets']['l']);
			}
			$default .= '</div>';
		} else {
			$default .= '
			<div class="item">
				<p class="item-title"' . $style . '>' . $item . '</p>
			</div>';
		}
	}

	return <<<EOF
	<div class="cloud-items">
		$default
	</div>
EOF;
}

function echo_cloud() {
	$menu = cloud_menu();
	$items = cloud_items();
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