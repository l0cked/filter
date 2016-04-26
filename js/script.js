'use strict';

/* Cloud obj */

var Cloud = function(elem) {

	var

	self = this,

	MIN_CLOUD_WIDTH = 300,
	MIN_CLOUD_HEIGHT = 300,

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
		items = divCloudItems.querySelectorAll('.item');
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
		if ( localStorage['cloud-left'] ) {
			elem.style.left = localStorage['cloud-left'] + 'px';
		}
		if ( localStorage['cloud-top'] ) {
			elem.style.top = localStorage['cloud-top'] + 'px';
		}
		if ( localStorage['cloud-width'] ) {
			elem.style.width = localStorage['cloud-width'] + 'px';
		}
		if ( localStorage['cloud-height'] ) {
			elem.style.height = localStorage['cloud-height'] + 'px';
		}
	},

	itemClick = function() {
		if ( document.body.classList.contains('cloud-edit') ) return;
		this.toggleClass('item-open');
	},

	itemsEvents = function () {
		for ( var i in elements ) {
			var element = elements[i],
				item = items[element.pos];
			item.drag({
				parent: 'cloud-wrapper',
				setClass: 'item-on-drag'
			});
			item.addEventListener('click', itemClick, false);
		}
	},

	draw = function() {

		divCloudItems.shuffle();

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
		}
	};

	this.draw = draw;

	loadLocalStorage();
	defWindowSizes();

	// cloud-menu .shuffle
	elem.querySelector('.click-shuffle').onclick = function() {
		self.draw();
	}

	elem.drag({
		targetClass: 'cloud-items',
		onDragEnd: function(left, top) {
			localStorage['cloud-left'] = left;
			localStorage['cloud-top'] = top;
		}
	});

	elem.resize({
		onResizeEnd: function(width, height) {
			self.draw();
			localStorage['cloud-width'] = width;
			localStorage['cloud-height'] = height;
		}
	});

	draw();

	itemsEvents();
}

/* Cloud obj end */

/* main */

var divCloudWrapperAll = document.querySelectorAll('.cloud-wrapper'),
	clouds = {};

function load() {

	var imgElem = document.querySelector('.bg-img'),
		img = new Image();
	img.src = imgElem.getAttribute('data-src');
	img.onload = function() {

		imgElem.removeAttribute('data-src');
		imgElem.setAttribute('src', this.src);

		for ( var i = 0; i < divCloudWrapperAll.length; i++ ) {
			clouds[i] = new Cloud(divCloudWrapperAll[i]);
		}

		document.body.classList.add('load');

	}
}

document.addEventListener('DOMContentLoaded', load);

/* main-menu */

var mainMenu = document.querySelector('.main-menu');

mainMenu.querySelector('.click-edit').onclick = function() {
	document.body.toggleClass('cloud-edit');
	this.toggleClass('active');
}
