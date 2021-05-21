// const BASE_URL = 'http://127.0.0.1:3000';
const BASE_URL = 'https://api.obsidian.md';
const USER_INFO_URL = BASE_URL + '/user/info';
const LOGIN_URL = BASE_URL + '/user/signin';
const SIGNUP_URL = BASE_URL + '/user/signup';
const LOGOUT_URL = BASE_URL + '/user/signout';
const FORGOT_PASS_URL = BASE_URL + '/user/forgetpass';
const RESET_PASS_URL = BASE_URL + '/user/resetpass';
const LIST_SUBSCRIPTION_URL = BASE_URL + '/subscription/list';
const GET_STRIPE_SECRET_URL = BASE_URL + '/subscription/stripe/start';
const FINISH_STRIPE_URL = BASE_URL + '/subscription/stripe/end';
const CHECK_PRICE_URL = BASE_URL + '/subscription/price';
const BIZ_RENAME_URL = BASE_URL + '/subscription/business/rename';
const UPDATE_PLAN_URL = BASE_URL + '/subscription/renew';
const REDUCE_SITES_URL = BASE_URL + '/subscription/publish/reduce';
const GET_PAYMENT_INFO_URL = BASE_URL + '/subscription/paymentmethod';
const UPDATE_PAYMENT_INFO_URL = BASE_URL + '/subscription/stripe/paymentmethod';
const CLAIM_DISCORD_ROLE_URL = BASE_URL + '/subscription/role/discord';
const CLAIM_FORUM_ROLE_URL = BASE_URL + '/subscription/role/forum';
const STRIPE_PUBLIC_KEY = 'pk_live_vqeOYADfYPpqKDT5FtAqCNBP00a9WEhYa6';
// const STRIPE_PUBLIC_KEY = 'pk_test_y7CBP7qLG6kSU9sdcHV5S2db0052OC4wR8';


function request(url, data, callback) {
	ajax({
		method: 'post',
		url: url,
		data: data,
		success: (data) => {
			if (data.error) {
				callback(data.error);
				return;
			}
			callback(null, data);
		},
		error: (err) => {
			if (err.error) {
				callback(err.error);
				return;
			}
			callback(err);
		}
	});
}

function decodeUrlQuery(query) {
	let object = {};
	if (!query || query.trim() === '') {
		return object;
	}
	let queries = query.split('&');

	for (let i = 0; i < queries.length; i++) {
		let parts = queries[i].split('=');
		if (parts.length >= 1 && parts[0]) {
			let key = decodeURIComponent(parts[0]);
			if (parts.length === 2) {
				object[key] = decodeURIComponent(parts[1]);
			} else {
				object[key] = true;
			}
		}
	}

	return object;
}

function removeHash() {
	if (history.pushState) {
		history.pushState('', document.title, window.location.pathname + window.location.search);
	} else {
		location.hash = '';
	}
}

function formatPrice(price) {
	let parts = (price / 100).toFixed(2).toString().toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}

function copyTextToClipboard(text) {
	let text_area_el = document.createElement('textarea');
	text_area_el.value = text;
	document.body.appendChild(text_area_el);
	text_area_el.focus();
	text_area_el.select();

	let success = false;

	try {
		success = document.execCommand('copy');
	} catch (err) {
	}

	document.body.removeChild(text_area_el);

	return success;
}

let hash = location.hash;

if (hash && hash.length > 1) {
	hash = hash.substr(1);
}

let query = location.search;

if (query && query.length > 1) {
	query = query.substr(1);
}

window.setTimeout(() => {
	ready(() => {
		let loginFormEl = fish('.login-form');
		let loginErrorEl = fish('.login-form .message.mod-error');
		let signupFormEl = fish('.signup-form');
		let signupErrorEl = fish('.signup-form .message.mod-error');
		let welcomeEl = fish('.welcome');
		let emailEl = fish('#labeled-input-email');
		let passwordEl = fish('#labeled-input-password');
		let signupNameEl = fish('.signup-name');
		let signupEmailEl = fish('.obsidian-signup-email');
		let signupPasswordEl = fish('.signup-password');
		let userNameEl = fish('.welcome-name');
		let userEmailEl = fish('.welcome-email');
		let logoutButtonEl = fish('.js-logout');
		let getPublishCardEl = fish('.card.mod-publish');
		let getSyncCardEl = fish('.card.mod-sync');
		let publishBoughtSiteNumEl = fish('.publish-site-num');
		let publishRenewSiteNumEl = fish('.publish-renew-site-num');
		let publishRenewTimeEl = fish('.publish-renewal-time');
		let publishRenewInfoRenewingEl = fish('.publish-renew-info-renewing');
		let publishRenewInfoNotRenewingEl = fish('.publish-renew-info-not-renewing');
		let publishViewPaymentLinkEl = fishAll('.js-view-payment-info');
		let publishOpenChangePaymentButtonEl = fishAll('.js-open-change-payment');
		let currentCardInfoTextEl = fish('.current-card-info');
		let updatePaymentMethodModalEl = fish('.modal-container.mod-change-payment-method');
		let updatePaymentMethodFormEl = fish('.modal-container.mod-change-payment-method .payment-form');
		let publishChangeNumOfSitesEl = fish('.js-change-number-of-publish-sites');
		let publishReduceNumOfSitesEl = fish('.js-reduce-number-of-publish-sites');
		let publishChangeToMonthlyEl = fish('.js-change-publish-to-monthly');
		let publishChangeToYearlyEl = fish('.js-change-publish-to-yearly');
		let publishRenewalFrequencyEl = fish('.setting-item-description.mod-publish-frequency');
		let reduceSiteNumInputEl = fish('.publish-reduce-sites-num');
		let reduceSiteConfirmButtonEl = fish('.js-update-reduce-sites');
		let publishStopRenewalEl = fish('.js-stop-publish-auto-renewal');
		let commercialLicensePitchEl = fish('.commercial-license-pitch');
		let existingCommercialLicenseEl = fish('.existing-commercial-license');
		let businessNameInputEl = fish('.business-name-input');
		let commercialLicenseKeyEl = fish('.commercial-license-key');
		let commercialLicenseCompanyEl = fish('.commercial-license-company-name');
		let commercialLicenseSeatNumberEl = fish('.commercial-license-seat-number');
		let commercialLicenseExpiryEl = fish('.commercial-license-expiry-date');
		let commercialLicenseCardEl = fish('.card.mod-commercial-license');
		let commercialLicenseModal = fish('.modal-container.mod-commercial-license');
		let personalLicenseModal = fish('.modal-container.mod-personal-license');
		let personalLicenseTierEl = fish('.catalyst-tier');
		let personalLicenseUpgradeButtonEl = fish('.catalyst-upgrade-button');
		let closeModalButtonEls = fishAll('.js-close-modal, .modal-close-button, .modal-bg');
		let buyCatalystLicenseCardEl = fish('.card.mod-catalyst');
		let insiderOptionEl = fish('.card[data-tier="insider"]');
		let supporterOptionEl = fish('.card[data-tier="supporter"]');
		let catalystTierCardsEl = fishAll('.modal-container.mod-personal-license .card');
		let stripeCatalystFormEl = fish('.modal-container.mod-personal-license .payment-form');
		let stripeBizFormEl = fish('.modal-container.mod-commercial-license .payment-form');
		let commercialLicenseRenewalToggleEl = fish('.commercial-license-auto-renewal');
		let spinnerEl = fish('.loader-cube');
		let gotoSignupEl = fish('.js-go-to-signup');
		let gotoLoginEl = fish('.js-go-to-login');
		let gotoForgotPassEl = fish('.js-go-to-forgot-pass');
		let forgotPassFormEl = fish('.forgot-pass-form');
		let forgotPassSuccessMsgEl = fish('.forgot-pass-form .message.mod-success');
		let forgotPassErrorMsgEl = fish('.forgot-pass-form .message.mod-error');
		let forgotPasswordInputEl = fish('.forgot-pass-email');
		let resetPassFormEl = fish('.reset-pass-form');
		let resetPassFieldContainerEl = fish('.forgot-pass-email-container');
		let resetPassNewPasswordEl = fish('.reset-pass-password');
		let resetPassSuccessMsgEl = fish('.reset-pass-form .message.mod-success');
		let resetPassErrorMsgEl = fish('.reset-pass-form .message.mod-error');
		let resetPassButtonEl = fish('.js-request-forgot');
		let personalLicensePaymentContainerEl = fish('.modal-container.mod-personal-license .payment-container');
		let commercialLicenseSeatEl = fish('.commercial-license-seat');
		let subTotalPaymentLineEl = fish('.modal-container.mod-personal-license .payment-line.mod-subtotal');
		let subTotalPaymentDescEl = fish('.modal-container.mod-personal-license .payment-line.mod-subtotal .payment-desc');
		let subTotalPaymentAmountEl = fish('.modal-container.mod-personal-license .payment-line.mod-subtotal .payment-amount');
		let discountPaymentLineEl = fish('.modal-container.mod-personal-license .payment-line.mod-discount');
		let discountPaymentDescEl = fish('.modal-container.mod-personal-license .payment-line.mod-discount .payment-desc');
		let discountPaymentAmountEl = fish('.modal-container.mod-personal-license .payment-line.mod-discount .payment-amount');
		let taxPaymentLineEl = fish('.modal-container.mod-personal-license .payment-line.mod-tax');
		let taxPaymentDescEl = fish('.modal-container.mod-personal-license .payment-line.mod-tax .payment-desc');
		let taxPaymentAmountEl = fish('.modal-container.mod-personal-license .payment-line.mod-tax .payment-amount');
		let totalPaymentDescEl = fish('.modal-container.mod-personal-license .payment-line.mod-total .payment-desc');
		let totalPaymentAmountEl = fish('.modal-container.mod-personal-license .payment-line.mod-total .payment-amount');
		let bizSubTotalPaymentLineEl = fish('.modal-container.mod-commercial-license .payment-line.mod-subtotal');
		let bizSubTotalPaymentDescEl = fish('.modal-container.mod-commercial-license .payment-line.mod-subtotal .payment-desc');
		let bizSubTotalPaymentAmountEl = fish('.modal-container.mod-commercial-license .payment-line.mod-subtotal .payment-amount');
		let bizDiscountPaymentLineEl = fish('.modal-container.mod-commercial-license .payment-line.mod-discount');
		let bizDiscountPaymentDescEl = fish('.modal-container.mod-commercial-license .payment-line.mod-discount .payment-desc');
		let bizDiscountPaymentAmountEl = fish('.modal-container.mod-commercial-license .payment-line.mod-discount .payment-amount');
		let bizTaxPaymentLineEl = fish('.modal-container.mod-commercial-license .payment-line.mod-tax');
		let bizTaxPaymentDescEl = fish('.modal-container.mod-commercial-license .payment-line.mod-tax .payment-desc');
		let bizTaxPaymentAmountEl = fish('.modal-container.mod-commercial-license .payment-line.mod-tax .payment-amount');
		let bizTotalPaymentDescEl = fish('.modal-container.mod-commercial-license .payment-line.mod-total .payment-desc');
		let bizTotalPaymentAmountEl = fish('.modal-container.mod-commercial-license .payment-line.mod-total .payment-amount');
		let publishSubTotalPaymentLineEl = fish('.modal-container.mod-choose-publish-plan .payment-line.mod-subtotal');
		let publishSubTotalPaymentDescEl = fish('.modal-container.mod-choose-publish-plan .payment-line.mod-subtotal .payment-desc');
		let publishSubTotalPaymentAmountEl = fish('.modal-container.mod-choose-publish-plan .payment-line.mod-subtotal .payment-amount');
		let publishDiscountPaymentLineEl = fish('.modal-container.mod-choose-publish-plan .payment-line.mod-discount');
		let publishDiscountPaymentDescEl = fish('.modal-container.mod-choose-publish-plan .payment-line.mod-discount .payment-desc');
		let publishDiscountPaymentAmountEl = fish('.modal-container.mod-choose-publish-plan .payment-line.mod-discount .payment-amount');
		let publishTaxPaymentLineEl = fish('.modal-container.mod-choose-publish-plan .payment-line.mod-tax');
		let publishTaxPaymentDescEl = fish('.modal-container.mod-choose-publish-plan .payment-line.mod-tax .payment-desc');
		let publishTaxPaymentAmountEl = fish('.modal-container.mod-choose-publish-plan .payment-line.mod-tax .payment-amount');
		let publishTotalPaymentDescEl = fish('.modal-container.mod-choose-publish-plan .payment-line.mod-total .payment-desc');
		let publishTotalPaymentAmountEl = fish('.modal-container.mod-choose-publish-plan .payment-line.mod-total .payment-amount');
		let paymentErrorEl = null;
		let publishUpgradeButtonEl = fish('.js-upgrade-publish');
		let publishUpgradeModal = fish('.modal-container.mod-choose-publish-plan');
		let publishReduceSitesModal = fish('.modal-container.mod-publish-reduce-sites');
		let publishViewPaymentMethodModal = fish('.modal-container.mod-view-payment-method');
		let publishPlansCardsEl = publishUpgradeModal.findAll('.card');
		let publishSiteNumEl = publishUpgradeModal.find('.publish-sites-num');
		let stripePublishFormEl = fish('.modal-container.mod-choose-publish-plan .payment-form');
		let wechatPayImageEl = fishAll('.wechat-pay-image');
		let wechatPayModalEl = fish('.modal-container.mod-wechat-pay');
		let paypalPayImageEl = fishAll('.paypal-pay-image');
		let paypalPayModalEl = fish('.modal-container.mod-paypal-pay');
		let openUnlimitedEl = fish('.js-open-unlimited');
		let donationModalEl = fish('.modal-container.mod-donation');
		let donationFormEl = fish('.modal-container.mod-donation .payment-form');
		let unlimitedDonationAmountEl = fish('.donation-amount-input');
		let unlimitedDonatedAmountEl = fish('.donation-amount');
		let modalsEl = fishAll('.modal-container');
		let syncUpgradeButtonEl = fish('.js-upgrade-sync');
		let syncUpgradeModal = fish('.modal-container.mod-choose-sync-plan');
		let syncPlansCardsEl = syncUpgradeModal.findAll('.card');
		let stripeSyncFormEl = syncUpgradeModal.find('.payment-form');
		let syncSubTotalPaymentLineEl = syncUpgradeModal.find('.payment-line.mod-subtotal');
		let syncSubTotalPaymentDescEl = syncUpgradeModal.find('.payment-line.mod-subtotal .payment-desc');
		let syncSubTotalPaymentAmountEl = syncUpgradeModal.find('.payment-line.mod-subtotal .payment-amount');
		let syncDiscountPaymentLineEl = syncUpgradeModal.find('.payment-line.mod-discount');
		let syncDiscountPaymentDescEl = syncUpgradeModal.find('.payment-line.mod-discount .payment-desc');
		let syncDiscountPaymentAmountEl = syncUpgradeModal.find('.payment-line.mod-discount .payment-amount');
		let syncTaxPaymentLineEl = syncUpgradeModal.find('.payment-line.mod-tax');
		let syncTaxPaymentDescEl = syncUpgradeModal.find('.payment-line.mod-tax .payment-desc');
		let syncTaxPaymentAmountEl = syncUpgradeModal.find('.payment-line.mod-tax .payment-amount');
		let syncTotalPaymentDescEl = syncUpgradeModal.find('.payment-line.mod-total .payment-desc');
		let syncTotalPaymentAmountEl = syncUpgradeModal.find('.payment-line.mod-total .payment-amount');
		let syncChangeToMonthlyEl = fish('.js-change-sync-to-monthly');
		let syncChangeToYearlyEl = fish('.js-change-sync-to-yearly');
		let syncStopRenewalEl = fish('.js-stop-sync-auto-renewal');
		let syncRenewTimeEl = fish('.sync-renewal-time');
		let syncRenewInfoRenewingEl = fish('.sync-renew-info-renewing');
		let syncRenewInfoNotRenewingEl = fish('.sync-renew-info-not-renewing');
		let syncRenewalFrequencyEl = fish('.setting-item-description.mod-sync-frequency');
		let commercialRenewTimeEl = fish('.commercial-renewal-time');
		let commercialResumeRenewalEl = fish('.js-resume-commercial-auto-renewal');
		let commercialStopRenewalEl = fish('.js-stop-commercial-auto-renewal');
		let commercialRenewInfoRenewingEl = fish('.commercial-renew-info-renewing');
		let commercialRenewInfoNotRenewingEl = fish('.commercial-renew-info-not-renewing');
		let toggleEls = fishAll('.checkbox-container');
		let claimDiscordBadgeButtons = fishAll('.claim-discord-badge-button');
		let claimForumBadgeButtons = fishAll('.claim-forum-badge-button');
		let discordSuccessModal = fish('.modal-container.mod-discord-success');
		let discordFailureModal = fish('.modal-container.mod-discord-failure');
		let forumSuccessModal = fish('.modal-container.mod-forum-success');
		let forumFailureModal = fish('.modal-container.mod-forum-failure');
		let discordErrorMessageEl = fish('.modal-container.mod-discord-failure .message.mod-error');
		let forumErrorMessageEl = fish('.modal-container.mod-forum-failure .message.mod-error');
		let catalystPaymentSuccessModal = fish('.modal-container.mod-catalyst-payment-success');
		let publishPaymentSuccessModal = fish('.modal-container.mod-publish-payment-success');
		let syncPaymentSuccessModal = fish('.modal-container.mod-sync-payment-success');

		let stripeStyles = {
			base: {
				color: '#dcddde',
				iconColor: '#dcddde',
				fontFamily: 'Inter, sans-serif',
				fontSmoothing: 'antialiased',
				fontSize: '16px',
				'::placeholder': {
					color: '#888888'
				}
			},
			invalid: {
				fontFamily: 'Inter, sans-serif',
				color: '#fa755a',
				iconColor: '#fa755a'
			}
		};

		let hasSyncSubscription = false;
		let catalystLicenseTier = '';
		let hasCommercialLicense = false;
		let buyingLicense = null;
		let buyingVariation = null;
		let buyingRenew = null;
		let signupMode = false;
		let resetPasswordId = null;
		let resetPasswordKey = null;
		let refreshAfterClosing = false;

		let stripe = window.Stripe(STRIPE_PUBLIC_KEY);
		let elements = stripe.elements();
		let card = elements.create('card', {style: stripeStyles});

		let closeModal = () => {
			if (refreshAfterClosing) {
				window.location.reload();
				return;
			}
			card.unmount();
			personalLicensePaymentContainerEl.hide();
			modalsEl.forEach(el => el.hide());
			catalystTierCardsEl.forEach(el => el.removeClass('is-selected'));
			refreshAfterClosing = false;
		};

		let decodedUrl = decodeUrlQuery(hash);
		if (decodedUrl.mode && decodedUrl.mode === 'signup') {
			removeHash();
			spinnerEl.hide();
			signupFormEl.show();
			signupMode = true;
		} else if (decodedUrl.mode && decodedUrl.mode === 'forgotpass') {
			removeHash();
			spinnerEl.hide();
			forgotPassFormEl.show();
			signupMode = true;
		} else if (decodedUrl.forgetpw && decodedUrl.id && decodedUrl.key) {
			removeHash();
			resetPasswordId = decodedUrl.id;
			resetPasswordKey = decodedUrl.key;
			spinnerEl.hide();
			resetPassFormEl.show();
			signupMode = true;
		} else if (decodedUrl.stripe && decodedUrl.stripe === 'complete') {
			let paymentSessionId = decodedUrl.session;
			if (paymentSessionId) {
				// continue to charge for commercial/personal license
			}
		}

		let decodedQuery = decodeUrlQuery(query);

		// User just authorized Discord to know their identity, now grant the badges
		if (decodedQuery.code) {
			request(CLAIM_DISCORD_ROLE_URL, {
				code: decodedQuery.code
			}, (err, data) => {
				if (err) {
					discordErrorMessageEl.setText(err);
					discordFailureModal.show();
				} else {
					discordSuccessModal.show();
				}
				window.history.replaceState(null, null, window.location.pathname);
			})
		}

		stripeCatalystFormEl.addEventListener('submit', function (event) {
			event.preventDefault();

			fishAll('.payment-error').forEach(e => e.hide());
			// Complete payment when the submit button is clicked
			// payWithCard(stripe, card, data.clientSecret);
			setLoading(true);
			networkGetStripeSecret((secret) => {
				payWithCard(stripe, card, secret);
			});
		});

		stripeBizFormEl.addEventListener('submit', function (event) {
			event.preventDefault();

			fishAll('.payment-error').forEach(e => e.hide());

			let companyName = businessNameInputEl.value;

			if (!companyName) {
				paymentErrorEl.setText(`Please enter a business name.`);
				paymentErrorEl.show();
				return;
			}

			let autoRenewal = commercialLicenseRenewalToggleEl.hasClass('is-enabled');

			if (autoRenewal) {
				buyingRenew = 'yearly';
			} else {
				buyingRenew = '';
			}

			// Complete payment when the submit button is clicked
			// payWithCard(stripe, card, data.clientSecret);
			setLoading(true);
			networkGetStripeSecret((secret) => {
				payWithCard(stripe, card, secret);
			});
		});

		let payWithCard = function (stripe, card, clientSecret) {
			paymentErrorEl.hide();
			stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: card
				}
			}).then(function (result) {
				if (result.error) {
					// Show error to your customer
					setLoading(false);
					paymentErrorEl.setText(result.error.message);
					paymentErrorEl.show();
				} else {
					// The payment succeeded!
					orderComplete(result.paymentIntent.id);
				}
			});
		};

		/* ------- UI helpers ------- */
		// Shows a success message when the payment is complete
		let orderComplete = function (paymentIntentId) {
			request(FINISH_STRIPE_URL, {intent_id: paymentIntentId}, (err, data) => {
				setLoading(false);

				if (err) {
					paymentErrorEl.setText(err);
					paymentErrorEl.show();
				} else {
					let companyName = businessNameInputEl.value;
					if (buyingLicense === 'business') {
						request(BIZ_RENAME_URL, {company: companyName}, (err, data) => {
							if (err) {
								paymentErrorEl.setText(err);
								paymentErrorEl.show();
							} else {
								window.location.reload();
							}
						});
					} else if (buyingLicense === 'catalyst') {
						closeModal();
						refreshAfterClosing = true;
						catalystPaymentSuccessModal.show();
					} else if (buyingLicense === 'publish') {
						closeModal();
						refreshAfterClosing = true;
						publishPaymentSuccessModal.show();
					} else if (buyingLicense === 'sync') {
						closeModal();
						refreshAfterClosing = true;
						syncPaymentSuccessModal.show();
					} else {
						window.location.reload();
					}
				}
			});
		};
		// Show a spinner on payment submission
		let setLoading = function (isLoading) {
			if (isLoading) {
				// Disable the button and show a spinner
				fishAll('button.submit').forEach(s => s.addClass('mod-disabled'));
				fishAll('.spinner').forEach(s => s.removeClass('hidden'));
				fishAll('.button-text').forEach(s => s.addClass('hidden'));
			} else {
				fishAll('button.submit').forEach(s => s.removeClass('mod-disabled'));
				fishAll('.spinner').forEach(s => s.addClass('hidden'));
				fishAll('.button-text').forEach(s => s.removeClass('hidden'));
			}
		};

		let testLoggedIn = () => {
			request(USER_INFO_URL, {}, (err, data) => {
				if (err) {
					if (!signupMode) {
						spinnerEl.hide();
						loginFormEl.show();
					}
				} else {
					userNameEl.setText(data.name);
					userEmailEl.setText(data.email);
					if (data.donation) {
						unlimitedDonatedAmountEl.setText(formatPrice(data.donation));
					}
					signupFormEl.hide();
					spinnerEl.hide();
					welcomeEl.show();

					if (data.license) {
						catalystLicenseTier = data.license;
					}

					if (catalystLicenseTier) {
						buyCatalystLicenseCardEl.addClass('is-active');
						personalLicenseTierEl.setText(data.license);

						// VIP can't upgrade any more
						if (catalystLicenseTier !== 'vip') {
							personalLicenseUpgradeButtonEl.addEventListener('click', () => {
								paymentErrorEl = fish('.modal-container.mod-personal-license .payment-error');
								personalLicenseModal.show();
							});
							personalLicenseUpgradeButtonEl.show();

							if (catalystLicenseTier === 'supporter') {
								insiderOptionEl.hide();
								supporterOptionEl.hide();
							} else if (catalystLicenseTier === 'insider') {
								insiderOptionEl.hide();
							}
						}

					} else {
						buyCatalystLicenseCardEl.addEventListener('click', () => {
							paymentErrorEl = fish('.modal-container.mod-personal-license .payment-error');
							personalLicenseModal.show();
						});
					}
				}
			});
		};

		let getCurrentSubscription = () => {
			request(LIST_SUBSCRIPTION_URL, {}, (err, data) => {
				if (err) {
					// console.log(err);
					return;
				}
				if (data.business && data.business !== null) {
					let bizLicense = data.business;

					commercialLicenseKeyEl.setText(bizLicense.key);
					commercialLicenseCompanyEl.setText(bizLicense.company);
					commercialLicenseSeatNumberEl.setText(bizLicense.seats);
					commercialLicenseExpiryEl.setText((new Date(bizLicense.expiry).toLocaleDateString()));
					commercialLicensePitchEl.hide();
					existingCommercialLicenseEl.show();
				} else {
					commercialLicenseCardEl.addEventListener('click', () => {
						buyingLicense = 'business';
						buyingVariation = parseInt(commercialLicenseSeatEl.value).toString();
						paymentErrorEl = fish('.modal-container.mod-commercial-license .payment-error');
						commercialLicenseModal.show();

						card.mount('.modal-container.mod-commercial-license .card-element');

						updateBizPrice();
					});
				}

				if (data.publish) {
					let {sites, renew, renew_sites, expiry_ts} = data.publish;

					if (expiry_ts >= Date.now()) {
						getPublishCardEl.addClass('is-active');

						if (sites === 1) {
							publishBoughtSiteNumEl.setText('1 site');
						} else {
							publishBoughtSiteNumEl.setText(`${sites} sites`);
						}

						if (renew_sites === 1) {
							publishRenewSiteNumEl.setText('1 site');
							publishReduceNumOfSitesEl.hide();
						} else {
							publishRenewSiteNumEl.setText(`${renew_sites} sites`);
							publishReduceNumOfSitesEl.show();
						}

						if (expiry_ts) {
							let date = new Date(expiry_ts);
							publishRenewTimeEl.setText(`on ${date.toLocaleDateString()}`);
						}

						publishRenewInfoNotRenewingEl.hide();

						let renewalFrequencyEl = document.createDocumentFragment();
						if (renew === 'yearly') {
							publishChangeToYearlyEl.hide();
							renewalFrequencyEl.createSpan({text: `You\'re currently on a `});
							renewalFrequencyEl.createSpan({cls: 'u-pop', text: 'yearly'});
							renewalFrequencyEl.createSpan({text: ' plan.'});
						} else if (renew === 'monthly') {
							publishChangeToMonthlyEl.hide();
							renewalFrequencyEl.createSpan({text: `You\'re currently on a `});
							renewalFrequencyEl.createSpan({cls: 'u-pop', text: 'monthly'});
							renewalFrequencyEl.createSpan({text: ' plan.'});
						} else if (renew === '') {
							publishStopRenewalEl.hide();
							publishRenewInfoNotRenewingEl.show();
							publishRenewInfoRenewingEl.hide();
							renewalFrequencyEl.createSpan({text: `You\'re not currently being renewed.`});
						}

						publishRenewalFrequencyEl.empty();
						publishRenewalFrequencyEl.appendChild(renewalFrequencyEl);

						reduceSiteNumInputEl.value = sites;
					}
				}

				if (data.sync) {
					let {renew, expiry_ts} = data.sync;

					if (expiry_ts >= Date.now()) {
						getSyncCardEl.addClass('is-active');

						if (expiry_ts) {
							let date = new Date(expiry_ts);
							syncRenewTimeEl.setText(`on ${date.toLocaleDateString()}`);
						}

						syncRenewInfoNotRenewingEl.hide();
						if (renew === 'yearly') {
						} else if (renew === 'monthly') {
							syncChangeToMonthlyEl.hide();
						} else if (renew === '') {
							syncStopRenewalEl.hide();
							syncRenewInfoNotRenewingEl.show();
							syncRenewInfoRenewingEl.hide();
						}

						let renewalFrequencyEl = document.createDocumentFragment();
						if (renew === 'yearly') {
							syncChangeToYearlyEl.hide();
							renewalFrequencyEl.createSpan({text: `You\'re currently on a `});
							renewalFrequencyEl.createSpan({cls: 'u-pop', text: 'yearly'});
							renewalFrequencyEl.createSpan({text: ' plan.'});
						} else if (renew === 'monthly') {
							syncChangeToMonthlyEl.hide();
							renewalFrequencyEl.createSpan({text: `You\'re currently on a `});
							renewalFrequencyEl.createSpan({cls: 'u-pop', text: 'monthly'});
							renewalFrequencyEl.createSpan({text: ' plan.'});
						} else if (renew === '') {
							syncStopRenewalEl.hide();
							syncRenewInfoNotRenewingEl.show();
							syncRenewInfoRenewingEl.hide();
							renewalFrequencyEl.createSpan({text: `You\'re not currently being renewed.`});
						}

						syncRenewalFrequencyEl.empty();
						syncRenewalFrequencyEl.appendChild(renewalFrequencyEl);
					}
				}

				if (data.business) {
					let {renew, expiry} = data.business;

					if (expiry >= Date.now()) {
						commercialLicenseCardEl.addClass('is-active');

						if (expiry) {
							let date = new Date(expiry);
							commercialRenewTimeEl.setText(`on ${date.toLocaleDateString()}`);
						}

						commercialRenewInfoNotRenewingEl.hide();
						if (renew === 'yearly') {
							commercialResumeRenewalEl.hide();
							commercialStopRenewalEl.show();
							commercialRenewInfoNotRenewingEl.hide();
							commercialRenewInfoRenewingEl.show();
						} else if (renew === '') {
							commercialResumeRenewalEl.show();
							commercialStopRenewalEl.hide();
							commercialRenewInfoNotRenewingEl.show();
							commercialRenewInfoRenewingEl.hide();
						}

						if (renew === 'yearly') {
							syncChangeToYearlyEl.hide();

						} else if (renew === '') {
							commercialStopRenewalEl.hide();
							commercialRenewInfoNotRenewingEl.show();
							commercialRenewInfoRenewingEl.hide();
						}
					}
				}
			});
		};

		let attemptLogin = () => {
			loginErrorEl.hide();
			loginFormEl.hide();
			spinnerEl.show();

			let email = emailEl.value;
			let password = passwordEl.value;
			let showError = false;

			if (email === '') {
				loginErrorEl.setText('Email cannot be empty.');
				showError = true;
			} else if (email.indexOf('@') === -1) {
				loginErrorEl.setText('Email is not valid.');
				showError = true;
			} else if (password === '') {
				loginErrorEl.setText('Password cannot be empty.');
				showError = true;
			}

			if (showError) {
				loginFormEl.show();
				spinnerEl.hide();
				loginErrorEl.show();
				return;
			}

			request(LOGIN_URL, {
				email: emailEl.value,
				password: passwordEl.value
			}, (err, data) => {
				if (!err) {
					window.location.reload();
				} else {
					loginFormEl.show();
					spinnerEl.hide();

					if (err === 'Login failed') {
						loginErrorEl.setText('Login failed, please double check your email and password.');
						loginErrorEl.show();
					}
				}
			});
		};

		let attemptSignup = () => {
			signupErrorEl.hide();
			signupFormEl.hide();
			spinnerEl.show();

			let name = signupNameEl.value;
			let email = signupEmailEl.value;
			let password = signupPasswordEl.value;

			let showError = false;

			if (name === '') {
				signupErrorEl.setText('Name cannot be empty.');
				showError = true;
			} else if (email === '') {
				signupErrorEl.setText('Email cannot be empty.');
				showError = true;
			} else if (email.indexOf('@') === -1) {
				signupErrorEl.setText('Email is not valid.');
				showError = true;
			} else if (password === '') {
				signupErrorEl.setText('Password cannot be empty.');
				showError = true;
			}

			if (showError) {
				signupErrorEl.show();
				signupFormEl.show();
				spinnerEl.hide();
				return;
			}

			request(SIGNUP_URL, {
				name, email, password
			}, (err, data) => {
				signupFormEl.show();
				spinnerEl.hide();

				if (err) {
					if (err === 'Invalid email address') {
						signupErrorEl.setText('The email address you entered was invalid.');
					} else if (err === 'Already signed up') {
						signupErrorEl.setText('Seems like you already have an account! Please log in.')
					}

					signupErrorEl.show();
				} else {
					window.location.reload();
				}
			});
		};

		let attemptForgotPassword = () => {
			forgotPassErrorMsgEl.hide();
			forgotPassSuccessMsgEl.hide();

			let email = forgotPasswordInputEl.value;

			if (!email) {
				forgotPassErrorMsgEl.setText('Please fill out your email.');
				forgotPassErrorMsgEl.show();
				return;
			} else if (email.indexOf('@') === -1) {
				forgotPassErrorMsgEl.setText('Email address is not valid and must contain "@".');
				forgotPassErrorMsgEl.show();
				return;
			}
			request(FORGOT_PASS_URL, {email, captcha: 'captcha'}, (err, data) => {
				spinnerEl.show();
				if (err) {
					forgotPassErrorMsgEl.setText('Something went wrong, please try again.');
					forgotPassErrorMsgEl.show();
					spinnerEl.hide();
					return;
				}

				forgotPassSuccessMsgEl.setText(`We have sent an email to ${email} to reset your password.`);
				forgotPassSuccessMsgEl.show();
				resetPassFieldContainerEl.hide();
				resetPassButtonEl.hide();
				spinnerEl.hide();
			});
		};

		let attemptResetPassword = () => {
			resetPassSuccessMsgEl.hide();
			resetPassErrorMsgEl.hide();

			let password = resetPassNewPasswordEl.value;

			if (!password) {
				resetPassErrorMsgEl.setText('Please set a new password.');
				resetPassErrorMsgEl.show();
				return;
			}

			request(RESET_PASS_URL, {
				password,
				id: resetPasswordId,
				key: resetPasswordKey
			}, (err, data) => {
				if (err) {
					resetPassErrorMsgEl.setText('Something went wrong, please try again.');
					resetPassErrorMsgEl.show();
					return;
				}

				resetPassSuccessMsgEl.innerHTML = `Your password has been successfully set. <a href="/account">Log in</a>`;
				resetPassSuccessMsgEl.show();
			});
		};

		let attemptLogout = () => {
			request(LOGOUT_URL, {}, (err, data) => {
				if (!err) {
					window.location.reload();
				} else {
					// console.log(data);
				}
			});
		};

		let networkGetStripeSecret = (callback) => {
			request(GET_STRIPE_SECRET_URL, {
				type: buyingLicense,
				variation: buyingVariation,
				renew: buyingRenew
			}, (err, data) => {
				if (err) {
					paymentErrorEl.setText(err);
					paymentErrorEl.show();
				} else {
					callback && callback(data.secret);
				}
			});
		};

		let updateBizPrice = () => {
			paymentErrorEl.hide();
			request(CHECK_PRICE_URL, {
				type: buyingLicense,
				variation: buyingVariation
			}, (err, data) => {
				if (err) {
					paymentErrorEl.setText(err);
					paymentErrorEl.show();
				} else {
					let {subtotal, desc, tax, taxDesc, discount, discountDesc, total} = data;

					if (discount === 0) {
						bizDiscountPaymentLineEl.hide();
					} else {
						bizDiscountPaymentAmountEl.setText(formatPrice(discount));

						if (discountDesc) {
							bizDiscountPaymentDescEl.setText(discountDesc);
						}
					}

					if (tax === 0) {
						bizTaxPaymentLineEl.hide();
					} else {
						bizTaxPaymentAmountEl.setText(formatPrice(tax));

						if (taxDesc) {
							bizTaxPaymentDescEl.setText(taxDesc);
						}
					}

					if (subtotal === total && discount === 0 && tax === 0) {
						bizSubTotalPaymentLineEl.hide();
						bizTotalPaymentDescEl.setText(desc);
						bizTotalPaymentAmountEl.setText(formatPrice(total));
					} else {
						bizSubTotalPaymentAmountEl.setText(formatPrice(subtotal));

						if (desc) {
							bizSubTotalPaymentDescEl.setText(desc);
						}

						bizTotalPaymentAmountEl.setText(formatPrice(total));
					}
				}
			});
		};

		testLoggedIn();
		getCurrentSubscription();

		logoutButtonEl.addEventListener('click', () => {
			attemptLogout();
		});

		let copyCommercialLicenseKey = () => {
			let licenseKey = commercialLicenseKeyEl.getText();
			let copySuccess = copyTextToClipboard(licenseKey);

			if (copySuccess) {
				commercialLicenseKeyEl.setText('Copied!');
				commercialLicenseKeyEl.addClass('is-copied');
				commercialLicenseKeyEl.removeEventListener('click', copyCommercialLicenseKey);
				setTimeout(() => {
					commercialLicenseKeyEl.removeClass('is-copied');
					commercialLicenseKeyEl.setText(licenseKey);
					commercialLicenseKeyEl.addEventListener('click', copyCommercialLicenseKey);
				}, 500)
			}
		};

		commercialLicenseKeyEl.addEventListener('click', copyCommercialLicenseKey);

		commercialLicenseSeatEl.addEventListener('input', () => {
			buyingLicense = 'business';

			if (commercialLicenseSeatEl.value === '') {
				return;
			}

			buyingVariation = parseInt(commercialLicenseSeatEl.value).toString();

			updateBizPrice();
		});

		catalystTierCardsEl.forEach(el => {
			el.addEventListener('click', () => {
				catalystTierCardsEl.forEach(el => el.removeClass('is-selected'));
				el.addClass('is-selected');

				buyingLicense = 'catalyst';
				buyingVariation = el.getAttribute('data-tier');

				if (!['insider', 'supporter', 'vip'].contains(buyingVariation)) {
					return;
				}

				request(CHECK_PRICE_URL, {
					type: buyingLicense,
					variation: buyingVariation
				}, (err, data) => {
					if (err) {
						paymentErrorEl.setText(err);
						paymentErrorEl.show();
					} else {
						let {subtotal, desc, tax, taxDesc, discount, discountDesc, total} = data;

						if (discount === 0) {
							discountPaymentLineEl.hide();
						} else {
							discountPaymentAmountEl.setText(formatPrice(discount));

							if (discountDesc) {
								discountPaymentDescEl.setText(discountDesc);
							}
						}

						if (tax === 0) {
							taxPaymentLineEl.hide();
						} else {
							taxPaymentAmountEl.setText(formatPrice(tax));

							if (taxDesc) {
								taxPaymentDescEl.setText(taxDesc);
							}
						}

						if (subtotal === total && discount === 0 && tax === 0) {
							subTotalPaymentLineEl.hide();
							totalPaymentDescEl.setText(desc);
							totalPaymentAmountEl.setText(formatPrice(total));
						} else {
							subTotalPaymentAmountEl.setText(formatPrice(subtotal));
							subTotalPaymentDescEl.setText(desc);
							totalPaymentAmountEl.setText(formatPrice(total));
						}

						personalLicensePaymentContainerEl.show();
						card.mount('.modal-container.mod-personal-license .card-element');
					}
				});
			});
		});

		closeModalButtonEls.forEach(el => {
			el.addEventListener('click', closeModal);
		});

		gotoSignupEl.addEventListener('click', () => {
			location.hash = '#mode=signup';
			location.reload();
		});

		gotoLoginEl.addEventListener('click', () => {
			location.hash = '';
			location.reload();
		});

		gotoForgotPassEl.addEventListener('click', () => {
			location.hash = '#mode=forgotpass';
			location.reload();
		});

		loginFormEl.find('form').addEventListener('submit', (evt) => {
			evt.preventDefault();
			attemptLogin();
		});

		signupFormEl.find('form').addEventListener('submit', (evt) => {
			evt.preventDefault();
			attemptSignup();
		});

		forgotPassFormEl.find('form').addEventListener('submit', (evt) => {
			evt.preventDefault();
			attemptForgotPassword();
		});

		resetPassFormEl.find('form').addEventListener('submit', (evt) => {
			evt.preventDefault();
			attemptResetPassword();
		});

		let updatePublishPrice = () => {
			let selectedCardEls = publishPlansCardsEl.filter(el => el.hasClass('is-selected'));
			if (selectedCardEls.length === 0) {
				return;
			}
			let renewal = selectedCardEls[0].getAttribute('data-renew');
			let numSites = publishSiteNumEl.value.toString();

			buyingLicense = 'publish';
			buyingVariation = numSites;
			buyingRenew = renewal;

			paymentErrorEl.hide();
			request(CHECK_PRICE_URL, {
				type: 'publish',
				renew: renewal,
				variation: numSites
			}, (err, data) => {
				if (err) {
					paymentErrorEl.setText(err);
					paymentErrorEl.show();
				} else {
					let {subtotal, desc, tax, taxDesc, discount, discountDesc, total} = data;

					if (discount === 0) {
						publishDiscountPaymentLineEl.hide();
					} else {
						publishDiscountPaymentLineEl.show();
						publishDiscountPaymentAmountEl.setText(formatPrice(discount));

						if (discountDesc) {
							publishDiscountPaymentDescEl.setText(discountDesc);
						}
					}

					if (tax === 0) {
						publishTaxPaymentLineEl.hide();
					} else {
						publishTaxPaymentLineEl.show();
						publishTaxPaymentAmountEl.setText(formatPrice(tax));

						if (taxDesc) {
							publishTaxPaymentDescEl.setText(taxDesc);
						}
					}

					if (subtotal === total && discount === 0 && tax === 0) {
						publishSubTotalPaymentLineEl.hide();
						publishTotalPaymentDescEl.setText(desc);
						publishTotalPaymentAmountEl.setText(formatPrice(total));
					} else {
						publishSubTotalPaymentLineEl.show();
						publishSubTotalPaymentAmountEl.setText(formatPrice(subtotal));

						if (desc) {
							publishSubTotalPaymentDescEl.setText(desc);
						}

						publishTotalPaymentAmountEl.setText(formatPrice(total));
					}
				}
			});
		};

		let updateSyncPrice = () => {
			let selectedCardEls = syncPlansCardsEl.filter(el => el.hasClass('is-selected'));
			if (selectedCardEls.length === 0) {
				return;
			}
			let renewal = selectedCardEls[0].getAttribute('data-renew');

			buyingLicense = 'sync';
			buyingRenew = renewal;

			paymentErrorEl.hide();
			request(CHECK_PRICE_URL, {
				type: 'sync',
				renew: renewal
			}, (err, data) => {
				if (err) {
					paymentErrorEl.setText(err);
					paymentErrorEl.show();
				} else {
					let {subtotal, desc, tax, taxDesc, discount, discountDesc, total} = data;

					if (discount === 0) {
						syncDiscountPaymentLineEl.hide();
					} else {
						syncDiscountPaymentLineEl.show();
						syncDiscountPaymentAmountEl.setText(formatPrice(discount));

						if (discountDesc) {
							syncDiscountPaymentDescEl.setText(discountDesc);
						}
					}

					if (tax === 0) {
						syncTaxPaymentLineEl.hide();
					} else {
						syncTaxPaymentLineEl.show();
						syncTaxPaymentAmountEl.setText(formatPrice(tax));

						if (taxDesc) {
							syncTaxPaymentDescEl.setText(taxDesc);
						}
					}

					if (subtotal === total && discount === 0 && tax === 0) {
						syncSubTotalPaymentLineEl.hide();
						syncTotalPaymentDescEl.setText(desc);
						syncTotalPaymentAmountEl.setText(formatPrice(total));
					} else {
						syncSubTotalPaymentLineEl.show();
						syncSubTotalPaymentAmountEl.setText(formatPrice(subtotal));

						if (desc) {
							syncSubTotalPaymentDescEl.setText(desc);
						}

						syncTotalPaymentAmountEl.setText(formatPrice(total));
					}
				}
			});
		};

		publishUpgradeButtonEl.addEventListener('click', () => {
			publishUpgradeModal.show();
			card.mount('.modal-container.mod-choose-publish-plan .card-element');

			paymentErrorEl = fish('.modal-container.mod-choose-publish-plan .payment-error');
			updatePublishPrice();
		});

		publishPlansCardsEl.forEach((cardEl) => {
			cardEl.addEventListener('click', () => {
				publishPlansCardsEl.forEach(el => el.removeClass('is-selected'));
				cardEl.addClass('is-selected');

				updatePublishPrice();
			});
		});

		publishSiteNumEl.addEventListener('change', () => {
			updatePublishPrice();
		});

		stripePublishFormEl.addEventListener('submit', function (event) {
			event.preventDefault();

			fishAll('.payment-error').forEach(e => e.hide());

			// Complete payment when the submit button is clicked
			// payWithCard(stripe, card, data.clientSecret);
			setLoading(true);
			networkGetStripeSecret((secret) => {
				payWithCard(stripe, card, secret);
			});
		});

		wechatPayImageEl.forEach(el => el.addEventListener('click', () => {
			wechatPayModalEl.show();
		}));

		paypalPayImageEl.forEach(el => el.addEventListener('click', () => {
			paypalPayModalEl.show();
		}));

		publishChangeToMonthlyEl.addEventListener('click', () => {
			request(UPDATE_PLAN_URL, {type: 'publish', renew: 'monthly'}, () => {
				window.location.reload()
			});
		});

		publishChangeToYearlyEl.addEventListener('click', () => {
			request(UPDATE_PLAN_URL, {type: 'publish', renew: 'yearly'}, () => {
				window.location.reload()
			});
		});

		publishStopRenewalEl.addEventListener('click', () => {
			request(UPDATE_PLAN_URL, {type: 'publish', renew: ''}, () => {
				window.location.reload()
			});
		});

		publishChangeNumOfSitesEl.addEventListener('click', () => {
			publishUpgradeModal.show();
			card.mount('.modal-container.mod-choose-publish-plan .card-element');

			paymentErrorEl = fish('.modal-container.mod-choose-publish-plan .payment-error');
			updatePublishPrice();
		});

		publishReduceNumOfSitesEl.addEventListener('click', () => {
			publishReduceSitesModal.show();
		});

		reduceSiteConfirmButtonEl.addEventListener('click', () => {
			let newNumberOfSites = parseInt(reduceSiteNumInputEl.value);
			request(REDUCE_SITES_URL, {sites: newNumberOfSites}, () => {
				window.location.reload();
			});
		});

		publishViewPaymentLinkEl.forEach(el => el.addEventListener('click', () => {
			request(GET_PAYMENT_INFO_URL, {}, (error, data) => {
				if (data.info) {
					currentCardInfoTextEl.setText(`You're currently using a ${data.info}.`);
				} else {
					currentCardInfoTextEl.setText(`You currently do not have any payment methods on file.`);
				}

				publishViewPaymentMethodModal.show();
			});
		}));

		publishOpenChangePaymentButtonEl.forEach(el => el.addEventListener('click', () => {
			updatePaymentMethodModalEl.show();
			paymentErrorEl = updatePaymentMethodModalEl.find('.payment-error');
			card.mount('.modal-container.mod-change-payment-method .card-element');
		}));

		updatePaymentMethodFormEl.addEventListener('submit', (event) => {
			event.preventDefault();

			stripe.createPaymentMethod({
				type: 'card',
				card: card,
			}).then((data) => {
				if (data.paymentMethod && data.paymentMethod.id) {
					request(UPDATE_PAYMENT_INFO_URL, {
						payment_method_id: data.paymentMethod.id
					}, () => {
						window.location.reload();
					});
				} else {
					paymentErrorEl.setText('Could not update your payment method.');
					paymentErrorEl.show();
				}
			});
		});

		openUnlimitedEl.addEventListener('click', () => {
			donationModalEl.show();
			paymentErrorEl = donationModalEl.find('.payment-error');
			card.mount('.modal-container.mod-donation .card-element');
		});

		donationFormEl.addEventListener('submit', (event) => {
			event.preventDefault();

			fishAll('.payment-error').forEach(e => e.hide());

			// Complete payment when the submit button is clicked
			// payWithCard(stripe, card, data.clientSecret);
			setLoading(true);
			networkGetStripeSecret((secret) => {
				payWithCard(stripe, card, secret);
			});
		});

		unlimitedDonationAmountEl.addEventListener('change', () => {
			buyingLicense = 'donation';
			buyingVariation = (unlimitedDonationAmountEl.value * 100).toString();
		});

		syncUpgradeButtonEl.addEventListener('click', () => {
			syncUpgradeModal.show();
			card.mount('.modal-container.mod-choose-sync-plan .card-element');

			paymentErrorEl = fish('.modal-container.mod-choose-sync-plan .payment-error');
			updateSyncPrice();
		});

		syncPlansCardsEl.forEach((cardEl) => {
			cardEl.addEventListener('click', () => {
				syncPlansCardsEl.forEach(el => el.removeClass('is-selected'));
				cardEl.addClass('is-selected');

				updateSyncPrice();
			});
		});

		stripeSyncFormEl.addEventListener('submit', function (event) {
			event.preventDefault();

			fishAll('.payment-error').forEach(e => e.hide());

			// Complete payment when the submit button is clicked
			// payWithCard(stripe, card, data.clientSecret);
			setLoading(true);
			networkGetStripeSecret((secret) => {
				payWithCard(stripe, card, secret);
			});
		});

		syncChangeToMonthlyEl.addEventListener('click', () => {
			request(UPDATE_PLAN_URL, {type: 'sync', renew: 'monthly'}, () => {
				window.location.reload()
			});
		});

		syncChangeToYearlyEl.addEventListener('click', () => {
			request(UPDATE_PLAN_URL, {type: 'sync', renew: 'yearly'}, () => {
				window.location.reload()
			});
		});

		syncStopRenewalEl.addEventListener('click', () => {
			request(UPDATE_PLAN_URL, {type: 'sync', renew: ''}, () => {
				window.location.reload()
			});
		});

		commercialStopRenewalEl.addEventListener('click', () => {
			request(UPDATE_PLAN_URL, {type: 'business', renew: ''}, () => {
				window.location.reload()
			});
		});

		commercialResumeRenewalEl.addEventListener('click', () => {
			request(UPDATE_PLAN_URL, {type: 'business', renew: 'yearly'}, () => {
				window.location.reload()
			});
		});

		toggleEls.forEach(el => {
			el.addEventListener('click', () => {
				let currentChecked = el.hasClass('is-enabled');
				if (currentChecked) {
					el.removeClass('is-enabled');
				} else {
					el.addClass('is-enabled');
				}
			});
		});

		claimDiscordBadgeButtons.forEach(el => el.addEventListener('click', () => {
			let discordClientId = '823279137640415263';
			let redirectUrl = location.protocol + '//' + location.host + location.pathname;
			el.addClass('mod-disabled');
			location.href = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=identify`;
		}));

		claimForumBadgeButtons.forEach(el => el.addEventListener('click', () => {
			el.addClass('mod-disabled');
			request(CLAIM_FORUM_ROLE_URL, {}, (err, data) => {
				if (err) {
					forumErrorMessageEl.setText(err);
					forumFailureModal.show();
				} else {
					forumSuccessModal.show();
				}
				el.removeClass('mod-disabled');
			});
		}));
	});
}, 500);
