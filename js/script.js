'use strict';

function draggable(elem, options={}) {

	if ( options.remove ) {
		elem.onmousedown = null;
		return;
	}

	var moveObject = {},

	onMouseMove = function(e) {
		if ( !moveObject.move ) {
			var moveX = e.pageX - moveObject.downX,
				moveY = e.pageY - moveObject.downY,
				coords = elem.getCoords();
			if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
				return;
			}
			moveObject.move = true;
			moveObject.shiftX = moveObject.downX - coords.left;
			moveObject.shiftY = moveObject.downY - coords.top;
		}
		elem.style.left = e.pageX - moveObject.shiftX + 'px';
		elem.style.top = e.pageY - moveObject.shiftY + 'px';
	},

	onMouseUp = function(e) {
		document.onmousemove = null;
		document.onmouseup = null;

		if ( options.onDragEnd ) {
			options.onDragEnd(parseInt(elem.style.left), parseInt(elem.style.top));
		}

		moveObject = {};
	};

	elem.onmousedown = function(e) {
		if ( e.which != 1 ) return;

		if ( options.targetClass ) {
			if ( !e.target.classList.contains(options.targetClass) ) return;
		}

		moveObject.downX = e.pageX;
		moveObject.downY = e.pageY;

		console.dir(moveObject);

		document.onmousemove = onMouseMove;
		document.onmouseup = onMouseUp;
	}
}


function resizeable(elem, options={}) {

	var resizeElems = elem.querySelectorAll('.cloud-resize');

	if ( options.remove ) {
		for ( var i = 0; i < resizeElems.length; i++ ) {
			resizeElems[i].onmousedown = null;
		}
		return;
	}

	var MIN_CLOUD_WIDTH = 300,
		MIN_CLOUD_HEIGHT = 300,
		RESIZE_SE_OFFSET =5,
		resizeObject = {},

	onMouseMove = function(e) {
		var w = e.pageX - resizeObject.coords.left + resizeObject.paddingRight,
			h = e.pageY - resizeObject.coords.top + resizeObject.paddingBottom;
		if ( resizeObject.this.classList.contains('resize-e') ) {
			if ( w > MIN_CLOUD_WIDTH ) {
				elem.style.width = w + 'px';
			}
		}
		if ( resizeObject.this.classList.contains('resize-s') ) {
			if ( h > MIN_CLOUD_HEIGHT ) {
				elem.style.height = h + 'px';
			}
		}
		if ( resizeObject.this.classList.contains('resize-se') ) {
			if ( w > MIN_CLOUD_WIDTH ) {
				elem.style.width = w + RESIZE_SE_OFFSET + 'px';
			}
			if ( h > MIN_CLOUD_HEIGHT ) {
				elem.style.height = h + RESIZE_SE_OFFSET + 'px';
			}
		}
	},

	onMouseUp = function(e) {
		document.onmousemove = null;
		document.onmouseup = null;

		if ( options.onResizeEnd ) {
			options.onResizeEnd(parseInt(elem.style.width), parseInt(elem.style.height));
		}
	},

	onMouseDown = function(e) {
		if ( e.which != 1 ) return;

		resizeObject.coords = elem.getCoords();
		resizeObject.this = this;

		document.onmousemove = onMouseMove;
		document.onmouseup = onMouseUp;
	};

	resizeObject.paddingRight = parseInt(window.getComputedStyle(elem, null).getPropertyValue('padding-right'));
	resizeObject.paddingBottom = parseInt(window.getComputedStyle(elem, null).getPropertyValue('padding-bottom'));

	for ( var i = 0; i < resizeElems.length; i++ ) {
		resizeElems[i].onmousedown = onMouseDown;
	}

}

/* Cloud obj */

var Cloud = function(elem) {

	var

	MIN_CLOUD_WIDTH = 300,
	MIN_CLOUD_HEIGHT = 300,

	lsname = 'cloud' + [].indexOf.call(elem.parentNode.children, elem) + '-',

	divCloudItems = elem.querySelector('.cloud-items'),
	items = divCloudItems.querySelectorAll('.item'),
	width = divCloudItems.offsetWidth,
	height = divCloudItems.offsetHeight,
	center = {
		x: width / 2,
		y: height / 2
	},
	aspect_ratio = width / height,
	busy = false,
	radius = 0,
	angle = 6.28 * Math.random(),
	step = 0.15,
	elements = [],

	init = function() {
		width = divCloudItems.offsetWidth;
		height = divCloudItems.offsetHeight;
		center = {
			x: width / 2,
			y: height / 2
		};
		aspect_ratio = width / height;
		radius = 0;
		angle = 6.28 * Math.random();
		step = 0.15;
		elements = [];
	},

	isOverride = function(a, b) {
		var ar = {
				left: a.left,
				top: a.top,
				right: a.left + a.width,
				bottom: a.top + a.height,
			},
			br = {
				left: b.left,
				top: b.top,
				right: b.left + b.width,
				bottom: b.top + b.height,
			}
		return !(
			br.left > ar.right ||
			br.right < ar.left ||
			br.top > ar.bottom ||
			br.bottom < ar.top
		);
	},

	hitTest = function(index) {
		for ( var i in elements ) {
			if ( index == i ) continue; // if delete this str = infinity loop
			if ( isOverride(elements[index], elements[i]) ) {
				return true;
			}
		}
		return false;
	},

	beforeDraw = function() {
		for ( var i = 0; i < items.length; i++ ) {
			var item = items[i],
				w = item.offsetWidth,
				h = item.offsetHeight,
				left = center.x - w / 2,
				top = center.y - h / 2;
			elements[i] = {
				pos: i,
				left: left,
				top: top,
				width: w,
				height: h
			}
			while ( hitTest(i) ) {
				radius += step;
				angle += (i % 2 === 0 ? 1 : -1) * step;
				left = center.x - (w / 2) + (radius * Math.cos(angle)) * aspect_ratio;
				top = center.y + radius * Math.sin(angle) - (h / 2);
				left = Math.round(left * 100) / 100;
				top = Math.round(top * 100) / 100;
				elements[i] = {
					pos: i,
					left: left,
					top: top,
					width: w,
					height: h
				}
			}
		}
	},

	draw = function() {
		//divCloudItems.shuffle();
		init();
		beforeDraw();
		for ( var i in elements ) {
			var element = elements[i],
				item = items[element.pos],
				x = element.left,
				y = element.top;
			item.style.left = x + 'px';
			item.style.top = y + 'px';
			item.classList.add('item-show');
			draggable(item);
		}
	},

	// set default .cloud-wrapper position and sizes if not set
	defWindowSizes = function() {

		var def = {
			width: 500,
			height: 500
		}

		def.left = (document.body.offsetWidth / 2) - (def.width / 2);
		def.top = (document.body.offsetHeight / 2) - (def.height / 2);

		if ( !elem.style.left ) elem.style.left = def.left + 'px';
		if ( !elem.style.top ) elem.style.top = def.top + 'px';
		if ( !elem.style.width ) elem.style.width = def.width + 'px';
		if ( !elem.style.height ) elem.style.height = def.height + 'px';
	},

	loadLocalStorage = function() {
		if ( localStorage[lsname + 'left'] ) {
			elem.style.left = localStorage[lsname + 'left'] + 'px';
		}
		if ( localStorage[lsname + 'top'] ) {
			elem.style.top = localStorage[lsname + 'top'] + 'px';
		}
		if ( localStorage[lsname + 'width'] ) {
			elem.style.width = localStorage[lsname + 'width'] + 'px';
		}
		if ( localStorage[lsname + 'height'] ) {
			elem.style.height = localStorage[lsname + 'height'] + 'px';
		}
	};

	loadLocalStorage();
	defWindowSizes();

	// cloud-menu
	elem.querySelector('.click-shuffle').onclick = function() {
		draw();
	}

	draggable(elem, {
		targetClass: 'cloud-items',
		onDragEnd: function(left, top) {
			localStorage[lsname + 'left'] = left;
			localStorage[lsname + 'top'] = top;
		}
	});

	resizeable(elem, {
		onResizeEnd: function(width, height) {
			draw();
			localStorage[lsname + 'width'] = width;
			localStorage[lsname + 'height'] = height;
		}
	});

	draw();

}

/* Cloud obj end */

/* main */

function load() {

	var imgElem = document.querySelector('.bg-img'),
		img = new Image();
	img.src = imgElem.getAttribute('data-src');
	img.onload = function() {

		imgElem.removeAttribute('data-src');
		imgElem.setAttribute('src', this.src);

		var divCloudWrapperAll = document.querySelectorAll('.cloud-wrapper');

		for ( var i = 0; i < divCloudWrapperAll.length; i++ ) {

			Cloud(divCloudWrapperAll[i]);

		}

		document.body.classList.add('load');

	}
}

document.addEventListener('DOMContentLoaded', load);

/* main-menu */

var mainMenu = document.querySelector('.main-menu');

mainMenu.querySelector('.click-shuffle').onclick = function() {
	for( var i in clouds ) {
		clouds[i].redraw();
	}
}

mainMenu.querySelector('.click-edit').onclick = function() {
	document.body.toggleClass('cloud-edit');
	this.toggleClass('active');
}
