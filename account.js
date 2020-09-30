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
const PERSONAL_ROLES_URL = BASE_URL + '/subscription/personal/roles';
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
		let signupEmailEl = fish('.signup-email');
		let signupPasswordEl = fish('.signup-password');
		let userNameEl = fish('.welcome-name');
		let userEmailEl = fish('.welcome-email');
		let logoutButtonEl = fish('.js-logout');
		let syncInstructionEl = fish('.setup-sync');
		let getSyncCardEl = fish('.card.mod-sync');
		let getPublishCardEl = fish('.card.mod-publish');
		let publishBoughtSiteNumEl = fish('.publish-site-num');
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
		let spinnerEl = fish('.loader-cube');
		let gotoSignupEl = fish('.js-go-to-signup');
		let gotoLoginEl = fish('.js-go-to-login');
		let gotoForgotPassEl = fish('.js-go-to-forgot-pass');
		let forgotPassFormEl = fish('.forgot-pass-form');
		let forgotPassSuccessMsgEl = fish('.forgot-pass-form .message.mod-success');
		let forgotPassErrorMsgEl = fish('.forgot-pass-form .message.mod-error');
		let forgotPasswordInputEl = fish('.forgot-pass-email');
		let resetPassFormEl = fish('.reset-pass-form');
		let resetPassNewPasswordEl = fish('.reset-pass-password');
		let resetPassSuccessMsgEl = fish('.reset-pass-form .message.mod-success');
		let resetPassErrorMsgEl = fish('.reset-pass-form .message.mod-error');
		let personalLicensePaymentContainerEl = fish('.modal-container.mod-personal-license .payment-container');
		let personalLicenseUserInfoEl = fish('.modal-container.mod-personal-license .personal-license-user-info');
		let discordUsernameInputEl = fish('.discord-username-input');
		let forumUsernameInputEl = fish('.forum-username-input');
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
		let publishPlansCardsEl = publishUpgradeModal.findAll('.card');
		let publishSiteNumEl = publishUpgradeModal.find('.publish-sites-num');
		let stripePublishFormEl = fish('.modal-container.mod-choose-publish-plan .payment-form');

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

		let stripe = window.Stripe(STRIPE_PUBLIC_KEY);
		let elements = stripe.elements();
		let card = elements.create('card', {style: stripeStyles});

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

		// syncInstructionEl.hide();

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
					} else {
						let discordName = discordUsernameInputEl.value;
						let forumName = forumUsernameInputEl.value;

						request(PERSONAL_ROLES_URL, {
							discord: discordName,
							forum: forumName
						}, () => {
							// best effort, do not need to show error for this
							window.location.reload();
						});
					}
				}
			});
		};
		// Show a spinner on payment submission
		let setLoading = function (isLoading) {
			if (isLoading) {
				// Disable the button and show a spinner
				fishAll('.spinner').forEach(s => s.removeClass('hidden'));
				fishAll('.button-text').forEach(s => s.addClass('hidden'));
			} else {
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
					signupFormEl.hide();
					spinnerEl.hide();
					welcomeEl.show();

					if (data.license) {
						catalystLicenseTier = data.license;
					}

					if (catalystLicenseTier) {
						buyCatalystLicenseCardEl.addClass('is-active');
						getPublishCardEl.addClass('is-insider');
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
							}
							else if (catalystLicenseTier === 'insider') {
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
					commercialLicenseCardEl.addClass('is-active');
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
					getPublishCardEl.addClass('is-active');

					if (data.publish.sites === 1) {
						publishBoughtSiteNumEl.setText('1 site');
					}
					else {
						publishBoughtSiteNumEl.setText(`${data.publish.sites} sites`);
					}
				}
			});
		};

		let attemptLogin = () => {
			loginErrorEl.hide();

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
					if (err === 'Login failed') {
						loginErrorEl.setText('Login failed, please double check your email and password.');
						loginErrorEl.show();
					}
				}
			});
		};

		let attemptSignup = () => {
			signupErrorEl.hide();

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
				return;
			}

			request(SIGNUP_URL, {
				name, email, password
			}, (err, data) => {
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
				if (err) {
					forgotPassErrorMsgEl.setText('Something went wrong, please try again.');
					forgotPassErrorMsgEl.show();
					return;
				}

				forgotPassSuccessMsgEl.setText(`We have sent an email to ${email} to reset your password.`);
				forgotPassSuccessMsgEl.show();
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

		// getSyncCardEl.addEventListener('click', () => {
		// 	window.location.href = './pricing.html';
		// });

		commercialLicenseKeyEl.addEventListener('click', () => {
			let licenseKey = commercialLicenseKeyEl.getText();
			let copySuccess = copyTextToClipboard(licenseKey);

			if (copySuccess) {
				commercialLicenseKeyEl.setText('Copied!');
				commercialLicenseKeyEl.addClass('is-copied');
				setTimeout(() => {
					commercialLicenseKeyEl.removeClass('is-copied');
					commercialLicenseKeyEl.setText(licenseKey);
				}, 500)
			}
		});

		commercialLicenseSeatEl.addEventListener('input', () => {
			buyingLicense = 'business';
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
						personalLicenseUserInfoEl.show();
						card.mount('.modal-container.mod-personal-license .card-element');
					}
				});
			});
		});

		closeModalButtonEls.forEach(el => {
			el.addEventListener('click', () => {
				commercialLicenseModal.hide();
				personalLicenseModal.hide();
				card.unmount();
				personalLicensePaymentContainerEl.hide();
				personalLicenseUserInfoEl.hide();
				publishUpgradeModal.hide();
				catalystTierCardsEl.forEach(el => el.removeClass('is-selected'));
			});
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
					console.log(data);
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
	});
}, 500);
