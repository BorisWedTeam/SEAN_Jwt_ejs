var countries = [];
var htmlCountry = '';


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


	$.ajax({
        url:'/getCountries',
        type:'GET',
        success:function(response){
            countries = response;
            for(var i = 0 ; i < countries.length; i ++){
                htmlCountry +="<option value='"+countries[i].id+"'>"+countries[i].name+"</option>";
            }
        }
    })

});

function selectCustomer(customerId){
	$(".btnCustomer").removeClass("active");
	$("#btnCustomer"+customerId).addClass("active");
	var selectName = $("#btnCustomer"+customerId).html();
	
	$("#selectCustomerName").html(selectName);

	localStorage['selectCustomerId'] = customerId;
	localStorage['selectCustomerName'] = selectName;
}
function init(){
	localStorage['selectCustomerId'] = 0;
}

function initCollapse(){
    var coll = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < coll.length; i++) {
        coll[i].removeEventListener("click", collapseCallback);
    }

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", collapseCallback);
    }
}
function collapseCallback() {
    this.classList.toggle("active");
    var content = this.parentElement.nextElementSibling;
    if (content.style.display=='block'){
        content.style.display = 'none';
        this.firstChild.classList.remove('fa-chevron-down');
        this.firstChild.classList.add('fa-chevron-up');
    } else {
        content.style.display = 'block';
        this.firstChild.classList.remove('fa-chevron-up');
        this.firstChild.classList.add('fa-chevron-down');

    } 
}
