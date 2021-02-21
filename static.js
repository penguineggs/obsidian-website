let openHeaderLink = fish('.static-header-menu');
let headerMobileNav = fish('.static-header-pop-up-nav-container');
let mobileNavCloseButton = fish('.static-header-pop-up-nav-close-button');
openHeaderLink.addEventListener('click', (evt) => {
	evt.preventDefault();
	headerMobileNav.addClass('is-active');
});
mobileNavCloseButton.addEventListener('click', (evt) => {
	evt.preventDefault();
	headerMobileNav.removeClass('is-active');
});
