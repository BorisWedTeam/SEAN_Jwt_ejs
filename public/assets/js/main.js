$.noConflict();

jQuery(document).ready(function($) {

	"use strict";

	[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
		new SelectFx(el);
	} );

	jQuery('.selectpicker').selectpicker;


	$('#menuToggle').on('click', function(event) {
		$('body').toggleClass('open');
	});

	$('.search-trigger').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').addClass('open');
	});

	$('.search-close').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').removeClass('open');
	});

	// $('.user-area> a').on('click', function(event) {
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	$('.user-menu').parent().removeClass('open');
	// 	$('.user-menu').parent().toggleClass('open');
	// });

	var pathname = window.location.pathname;
	console.log(pathname);
	var element = $('.sub-menu > li > a[href="'+pathname+'"]');//.parent().addClass('active');
	element.parent().addClass('active');
	var ulMenu = element.parent().parent().parent();
	ulMenu.addClass('show');
	//ulMenu.first().attr('aria-expanded',true);
	element.parent().parent().prev().attr('aria-expanded',true);
	element.parent().parent().addClass('show');
});