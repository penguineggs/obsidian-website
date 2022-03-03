(() => {
  // src/shared/util/browser.ts
  function copyTextToClipboard(text) {
    if (!navigator.clipboard || !navigator.permissions) {
      let textAreaEl = document.createElement("textarea");
      textAreaEl.value = text;
      textAreaEl.style.top = "0";
      textAreaEl.style.left = "0";
      textAreaEl.style.position = "fixed";
      document.body.appendChild(textAreaEl);
      try {
        textAreaEl.focus();
        textAreaEl.select();
        document.execCommand("copy");
      } catch (err) {
      }
      document.body.removeChild(textAreaEl);
      return;
    }
    navigator.clipboard.writeText(text);
  }
  var requestIdleCallback = window.requestIdleCallback;
  var isProbablyCrawler = /bot|crawl|spider/i.test(navigator.userAgent);

  // src/shared/util/github.ts
  function getRawGithubUrl(repo, file, branch) {
    return "https://raw.githubusercontent.com/" + repo + "/" + (branch || "HEAD") + "/" + file;
  }

  // src/static/util.ts
  function request(url, data, callback) {
    ajax({
      method: "POST",
      url,
      data,
      success: (data2) => {
        data2 = JSON.parse(data2);
        if (data2.error) {
          callback(data2.error);
          return;
        }
        callback(null, data2);
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
  var COMMUNITY_PLUGIN_URL = getRawGithubUrl("obsidianmd/obsidian-releases", "community-plugins.json");
  var PLUGIN_STATS_URL = getRawGithubUrl("obsidianmd/obsidian-releases", "community-plugin-stats.json");
  var THEMES_URL = getRawGithubUrl("obsidianmd/obsidian-releases", "community-css-themes.json");

  // src/shared/util/url.ts
  var UrlUtil = class {
    static encodeUrlQuery(object) {
      if (!object) {
        return "";
      }
      let queries = [];
      for (let key in object) {
        if (object.hasOwnProperty(key) && object[key]) {
          if (object[key] === true) {
            queries.push(encodeURIComponent(key));
          } else {
            queries.push(encodeURIComponent(key) + "=" + encodeURIComponent(object[key]));
          }
        }
      }
      return queries.join("&");
    }
    static decodeUrlQuery(query2) {
      let object = {};
      if (!query2 || query2.trim() === "") {
        return object;
      }
      let queries = query2.split("&");
      for (let i = 0; i < queries.length; i++) {
        let parts = queries[i].split("=");
        if (parts.length >= 1 && parts[0]) {
          let key = decodeURIComponent(parts[0]);
          if (parts.length === 2) {
            object[key] = decodeURIComponent(parts[1]);
          } else {
            object[key] = "";
          }
        }
      }
      return object;
    }
    static decodeUrl(url) {
      if (!url) {
        url = "";
      }
      let hash_split = url.split("#");
      let hash2 = hash_split.length > 1 ? hash_split[1] : "";
      let query_split = hash_split[0].split("?");
      let query2 = query_split.length > 1 ? query_split[1] : "";
      let path = query_split[0];
      return { path, query: UrlUtil.decodeUrlQuery(query2), hash: UrlUtil.decodeUrlQuery(hash2) };
    }
  };

  // src/static/account.ts
  var isDev = location.host.startsWith("127.0.0.1") || location.host.startsWith("localhost");
  var BASE_URL = "https://api.obsidian.md";
  if (isDev) {
    BASE_URL = "http://127.0.0.1:3000";
  }
  var USER_INFO_URL = BASE_URL + "/user/info";
  var LOGIN_URL = BASE_URL + "/user/signin";
  var SIGNUP_URL = BASE_URL + "/user/signup";
  var LOGOUT_URL = BASE_URL + "/user/signout";
  var FORGOT_PASS_URL = BASE_URL + "/user/forgetpass";
  var RESET_PASS_URL = BASE_URL + "/user/resetpass";
  var CHANGE_NAME_URL = BASE_URL + "/user/changename";
  var CHANGE_EMAIL_URL = BASE_URL + "/user/changeemail";
  var CHANGE_PASSWORD_URL = BASE_URL + "/user/changepass";
  var DELETE_ACCOUNT_URL = BASE_URL + "/user/deleteaccount";
  var LIST_SUBSCRIPTION_URL = BASE_URL + "/subscription/list";
  var PAY_URL = BASE_URL + "/subscription/pay";
  var FINISH_STRIPE_URL = BASE_URL + "/subscription/stripe/end";
  var CHECK_PRICE_URL = BASE_URL + "/subscription/price";
  var BIZ_RENAME_URL = BASE_URL + "/subscription/business/rename";
  var REDUCE_COMMERCIAL_LICENSE_URL = BASE_URL + "/subscription/business/reduce";
  var UPDATE_PLAN_URL = BASE_URL + "/subscription/renew";
  var REDUCE_SITES_URL = BASE_URL + "/subscription/publish/reduce";
  var GET_PAYMENT_INFO_URL = BASE_URL + "/subscription/paymentmethod";
  var UPDATE_PAYMENT_INFO_URL = BASE_URL + "/subscription/stripe/paymentmethod";
  var CLAIM_DISCORD_ROLE_URL = BASE_URL + "/subscription/role/discord";
  var CLAIM_FORUM_ROLE_URL = BASE_URL + "/subscription/role/forum";
  var LIST_INVOICES_URL = BASE_URL + "/subscription/invoice/list";
  var REQUEST_REFUND_URL = BASE_URL + "/subscription/invoice/refund";
  var STRIPE_PUBLIC_KEY = "pk_live_vqeOYADfYPpqKDT5FtAqCNBP00a9WEhYa6";
  if (isDev) {
    STRIPE_PUBLIC_KEY = "pk_test_y7CBP7qLG6kSU9sdcHV5S2db0052OC4wR8";
  }
  function removeHash() {
    if (history.pushState) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    } else {
      location.hash = "";
    }
  }
  function formatPrice(price) {
    let parts = (price / 100).toFixed(2).toString().toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  var hash = location.hash;
  if (hash && hash.length > 1) {
    hash = hash.substr(1);
  }
  var query = location.search;
  if (query && query.length > 1) {
    query = query.substr(1);
  }
  window.setTimeout(() => {
    ready(() => {
      let loginFormEl = fish(".login-form");
      let loginErrorEl = fish(".login-form .message.mod-error");
      let signupFormEl = fish(".signup-form");
      let signupErrorEl = fish(".signup-form .message.mod-error");
      let welcomeEl = fish(".welcome");
      let emailEl = fish("#labeled-input-email");
      let passwordEl = fish("#labeled-input-password");
      let signupNameEl = fish(".signup-name");
      let signupEmailEl = fish(".obsidian-signup-email");
      let signupPasswordEl = fish(".signup-password");
      let userNameEl = fish(".welcome-name");
      let userEmailEl = fish(".welcome-email");
      let changeEmailButtonEl = fish(".js-change-email");
      let changeEmailModalEl = fish(".modal-container.mod-change-email");
      let changeEmailNewEmailInputEl = fish(".change-email-new-email");
      let changeEmailPasswordInputEl = fish(".change-email-password");
      let confirmChangeEmailButtonEl = fish(".js-confirm-change-email");
      let changeEmailErrorEl = fish(".modal-container.mod-change-email .message.mod-error");
      let changeNameButtonEl = fish(".js-change-name");
      let changeNameModalEl = fish(".modal-container.mod-change-name");
      let changeNameNewNameInputEl = fish(".change-name-new-name");
      let confirmChangeNameButtonEl = fish(".js-confirm-change-name");
      let changeNameErrorEl = fish(".modal-container.mod-change-name .message.mod-error");
      let changePasswordButtonEl = fish(".js-change-password");
      let changePasswordModalEl = fish(".modal-container.mod-change-password");
      let changePasswordOldPasswordInputEl = fish(".change-password-old-password");
      let changePasswordNewPasswordInputEl = fish(".change-password-new-password");
      let confirmChangePasswordButtonEl = fish(".js-confirm-change-password");
      let changePasswordErrorEl = fish(".modal-container.mod-change-password .message.mod-error");
      let deleteAccountButtonEl = fish(".js-delete-account");
      let deleteAccountModalEl = fish(".modal-container.mod-delete-account");
      let deleteAccountPasswordInputEl = fish(".delete-account-password");
      let deleteAccountEmailInputEl = fish(".delete-account-email");
      let confirmDeleteAccountButtonEl = fish(".js-confirm-delete-account");
      let deleteAccountErrorEl = fish(".modal-container.mod-delete-account .message.mod-error");
      let changeInfoSuccessModalEl = fish(".modal-container.mod-change-info-success");
      let logoutButtonEl = fish(".js-logout");
      let getPublishCardEl = fish(".card.mod-publish");
      let getSyncCardEl = fish(".card.mod-sync");
      let publishBoughtSiteNumEl = fish(".publish-site-num");
      let publishRenewSiteNumEl = fish(".publish-renew-site-num");
      let publishRenewTimeEl = fishAll(".publish-renewal-time");
      let publishRenewInfoRenewingEl = fish(".publish-renew-info-renewing");
      let publishRenewInfoNotRenewingEl = fish(".publish-renew-info-not-renewing");
      let publishViewPaymentLinkEl = fishAll(".js-view-payment-info");
      let publishOpenChangePaymentButtonEl = fishAll(".js-open-change-payment");
      let currentCardInfoTextEl = fish(".current-card-info");
      let updatePaymentMethodModalEl = fish(".modal-container.mod-change-payment-method");
      let updatePaymentMethodFormEl = fish(".modal-container.mod-change-payment-method .payment-form");
      let publishChangeNumOfSitesEl = fish(".js-change-number-of-publish-sites");
      let publishReduceNumOfSitesEl = fish(".js-reduce-number-of-publish-sites");
      let publishChangeToMonthlyEl = fish(".js-change-publish-to-monthly");
      let publishChangeToYearlyEl = fish(".js-change-publish-to-yearly");
      let publishRenewalFrequencyEl = fish(".setting-item-description.mod-publish-frequency");
      let reduceSiteNumInputEl = fish(".publish-reduce-sites-num");
      let reduceSiteConfirmButtonEl = fish(".js-update-reduce-sites");
      let publishStopRenewalEl = fish(".js-stop-publish-auto-renewal");
      let commercialLicensePitchEl = fish(".commercial-license-pitch");
      let existingCommercialLicenseEl = fish(".existing-commercial-license");
      let businessNameInputEl = fish(".business-name-input");
      let commercialLicenseKeyEl = fish(".commercial-license-key");
      let commercialLicenseCompanyEl = fish(".commercial-license-company-name");
      let commercialLicenseSeatNumberEl = fishAll(".commercial-license-seat-number");
      let commercialLicenseCardEl = fish(".card.mod-commercial-license");
      let commercialLicenseModal = fish(".modal-container.mod-commercial-license");
      let commercialLicenseTitle = fish(".modal-container.mod-commercial-license .modal-title");
      let personalLicenseModal = fish(".modal-container.mod-personal-license");
      let personalLicenseTierEl = fish(".catalyst-tier");
      let personalLicenseUpgradeButtonEl = fish(".catalyst-upgrade-button");
      let closeModalButtonEls = fishAll(".js-close-modal, .modal-close-button, .modal-bg");
      let buyCatalystLicenseCardEl = fish(".card.mod-catalyst");
      let insiderOptionEl = fish('.card[data-tier="insider"]');
      let supporterOptionEl = fish('.card[data-tier="supporter"]');
      let catalystTierCardsEl = fishAll(".modal-container.mod-personal-license .card");
      let stripeCatalystFormEl = fish(".modal-container.mod-personal-license .payment-form");
      let stripeBizFormEl = fish(".modal-container.mod-commercial-license .payment-form");
      let commercialLicenseRenewalToggleEl = fish(".commercial-license-auto-renewal");
      let spinnerEl = fish(".loader-cube");
      let gotoSignupEl = fish(".js-go-to-signup");
      let gotoLoginEl = fish(".js-go-to-login");
      let gotoForgotPassEl = fish(".js-go-to-forgot-pass");
      let forgotPassFormEl = fish(".forgot-pass-form");
      let forgotPassSuccessMsgEl = fish(".forgot-pass-form .message.mod-success");
      let forgotPassErrorMsgEl = fish(".forgot-pass-form .message.mod-error");
      let forgotPasswordInputEl = fish(".forgot-pass-email");
      let resetPassFormEl = fish(".reset-pass-form");
      let resetPassFieldContainerEl = fish(".forgot-pass-email-container");
      let resetPassNewPasswordEl = fish(".reset-pass-password");
      let resetPassSuccessMsgEl = fish(".reset-pass-form .message.mod-success");
      let resetPassErrorMsgEl = fish(".reset-pass-form .message.mod-error");
      let resetPassButtonEl = fish(".js-request-forgot");
      let personalLicensePaymentContainerEl = fish(".modal-container.mod-personal-license .payment-container");
      let commercialLicenseSeatEl = fish(".commercial-license-seat");
      let paymentErrorEl = null;
      let publishUpgradeButtonEl = fish(".js-upgrade-publish");
      let publishUpgradeModal = fish(".modal-container.mod-choose-publish-plan");
      let publishReduceSitesModal = fish(".modal-container.mod-publish-reduce-sites");
      let publishViewPaymentMethodModal = fish(".modal-container.mod-view-payment-method");
      let publishPlansCardsEl = publishUpgradeModal.findAll(".card");
      let publishSiteNumEl = publishUpgradeModal.find(".publish-sites-num");
      let stripePublishFormEl = fish(".modal-container.mod-choose-publish-plan .payment-form");
      let paypalPayImageEl = fishAll(".paypal-button");
      let paypalPayModalEl = fish(".modal-container.mod-paypal-pay");
      let openUnlimitedEl = fish(".js-open-unlimited");
      let donationModalEl = fish(".modal-container.mod-donation");
      let donationFormEl = fish(".modal-container.mod-donation .payment-form");
      let unlimitedDonationAmountEl = fish(".donation-amount-input");
      let unlimitedDonatedAmountEl = fish(".donation-amount");
      let modalsEl = fishAll(".modal-container");
      let syncUpgradeButtonEl = fish(".js-upgrade-sync");
      let syncUpgradeModal = fish(".modal-container.mod-choose-sync-plan");
      let syncPlansCardsEl = syncUpgradeModal.findAll(".card");
      let stripeSyncFormEl = syncUpgradeModal.find(".payment-form");
      let syncChangeToMonthlyEl = fish(".js-change-sync-to-monthly");
      let syncChangeToYearlyEl = fish(".js-change-sync-to-yearly");
      let syncStopRenewalEl = fish(".js-stop-sync-auto-renewal");
      let syncRenewTimeEl = fishAll(".sync-renewal-time");
      let syncRenewInfoRenewingEl = fish(".sync-renew-info-renewing");
      let syncRenewInfoNotRenewingEl = fish(".sync-renew-info-not-renewing");
      let syncRenewalFrequencyEl = fish(".setting-item-description.mod-sync-frequency");
      let commercialRenewTimeEl = fishAll(".commercial-renewal-time");
      let commercialResumeRenewalEl = fish(".js-resume-commercial-auto-renewal");
      let commercialStopRenewalEl = fish(".js-stop-commercial-auto-renewal");
      let commercialRenewInfoRenewingEl = fish(".commercial-renew-info-renewing");
      let commercialRenewInfoNotRenewingEl = fish(".commercial-renew-info-not-renewing");
      let commercialLicenseExpiryEl = fishAll(".commercial-license-expiry-time");
      let toggleEls = fishAll(".checkbox-container");
      let claimDiscordBadgeButtons = fishAll(".claim-discord-badge-button");
      let claimForumBadgeButtons = fishAll(".claim-forum-badge-button");
      let discordSuccessModal = fish(".modal-container.mod-discord-success");
      let discordFailureModal = fish(".modal-container.mod-discord-failure");
      let forumSuccessModal = fish(".modal-container.mod-forum-success");
      let forumFailureModal = fish(".modal-container.mod-forum-failure");
      let discordErrorMessageEl = fish(".modal-container.mod-discord-failure .message.mod-error");
      let forumErrorMessageEl = fish(".modal-container.mod-forum-failure .message.mod-error");
      let catalystPaymentSuccessModal = fish(".modal-container.mod-catalyst-payment-success");
      let publishPaymentSuccessModal = fish(".modal-container.mod-publish-payment-success");
      let syncPaymentSuccessModal = fish(".modal-container.mod-sync-payment-success");
      let commercialLicenseChangeSeatEl = fish(".js-commercial-license-change-seat");
      let commercialLicenseReduceSeatEl = fish(".js-commercial-license-reduce-seat");
      let commercialLicenseReduceSeatModal = fish(".modal-container.mod-commercial-license-reduce-seats");
      let commercialLicenseReduceSeatInputEl = fish(".commercial-license-reduce-seat-input");
      let commercialLicenseReduceSeatConfirmEl = fish(".js-update-reduce-seats");
      let commercialLicenseReduceSeatErrorEl = fish(".modal-container.mod-commercial-license-reduce-seats .payment-error");
      let stripeStyles = {
        base: {
          color: "#dcddde",
          iconColor: "#dcddde",
          fontFamily: "Inter, sans-serif",
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#888888"
          }
        },
        invalid: {
          fontFamily: "Inter, sans-serif",
          color: "#fa755a",
          iconColor: "#fa755a"
        }
      };
      let catalystLicenseTier = "";
      let buyingLicense = null;
      let buyingVariation = null;
      let buyingRenew = null;
      let signupMode = false;
      let resetPasswordId = null;
      let resetPasswordKey = null;
      let refreshAfterClosing = false;
      let commercialLicense = null;
      let isUpdatingCommercialLicense = false;
      let stripe = window.Stripe(STRIPE_PUBLIC_KEY);
      let elements = stripe.elements();
      let card = elements.create("card", { style: stripeStyles });
      let decodedQuery = null;
      let orderComplete = function(paymentIntentId) {
        request(FINISH_STRIPE_URL, { intent_id: paymentIntentId }, (err, data) => {
          setLoading(false);
          if (err) {
            paymentErrorEl.setText(err);
            paymentErrorEl.show();
          } else {
            let companyName = businessNameInputEl.value;
            if (buyingLicense === "business" && !isUpdatingCommercialLicense) {
              request(BIZ_RENAME_URL, { company: companyName }, (err2, data2) => {
                if (err2) {
                  paymentErrorEl.setText(err2);
                  paymentErrorEl.show();
                } else {
                  window.location.reload();
                }
              });
            } else if (buyingLicense === "catalyst") {
              closeModal();
              refreshAfterClosing = true;
              catalystPaymentSuccessModal.show();
            } else if (buyingLicense === "publish") {
              closeModal();
              refreshAfterClosing = true;
              publishPaymentSuccessModal.show();
            } else if (buyingLicense === "sync") {
              closeModal();
              refreshAfterClosing = true;
              syncPaymentSuccessModal.show();
            } else if (decodedQuery.payment_intent) {
              window.location.search = "";
            } else {
              window.location.reload();
            }
          }
        });
      };
      let closeModal = () => {
        if (refreshAfterClosing) {
          window.location.reload();
          return;
        }
        card.unmount();
        personalLicensePaymentContainerEl.hide();
        modalsEl.forEach((el) => el.hide());
        catalystTierCardsEl.forEach((el) => el.removeClass("is-selected"));
        refreshAfterClosing = false;
      };
      let decodedUrl = UrlUtil.decodeUrlQuery(hash);
      if (decodedUrl.mode && decodedUrl.mode === "signup") {
        removeHash();
        spinnerEl.hide();
        signupFormEl.show();
        signupMode = true;
      } else if (decodedUrl.mode && decodedUrl.mode === "forgotpass") {
        removeHash();
        spinnerEl.hide();
        forgotPassFormEl.show();
        signupMode = true;
      } else if (decodedUrl.hasOwnProperty("forgetpw") && decodedUrl.id && decodedUrl.key) {
        removeHash();
        resetPasswordId = decodedUrl.id;
        resetPasswordKey = decodedUrl.key;
        spinnerEl.hide();
        resetPassFormEl.show();
        signupMode = true;
      } else if (decodedUrl.stripe && decodedUrl.stripe === "complete") {
        let paymentSessionId = decodedUrl.session;
        if (paymentSessionId) {
        }
      }
      decodedQuery = UrlUtil.decodeUrlQuery(query);
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
        });
      } else if (decodedQuery.redirect_status === "succeeded" && decodedQuery.payment_intent) {
        orderComplete(decodedQuery.payment_intent);
      }
      stripeCatalystFormEl.addEventListener("submit", function(event) {
        event.preventDefault();
        fishAll(".payment-error").forEach((e) => e.hide());
        setLoading(true);
        networkGetStripeSecret("card", (secret) => payWithCard(card, secret));
      });
      fishAll(".wechat-pay-button").forEach((el) => {
        el.addEventListener("click", () => {
          fishAll(".payment-error").forEach((e) => e.hide());
          setLoading(true);
          networkGetStripeSecret("wechat", (secret) => payWithWechat(secret));
        });
      });
      fishAll(".alipay-button").forEach((el) => {
        el.addEventListener("click", () => {
          fishAll(".payment-error").forEach((e) => e.hide());
          setLoading(true);
          networkGetStripeSecret("alipay", (secret) => payWithAlipay(secret));
        });
      });
      stripeBizFormEl.addEventListener("submit", function(event) {
        event.preventDefault();
        fishAll(".payment-error").forEach((e) => e.hide());
        let companyName = businessNameInputEl.value;
        if (!companyName && !isUpdatingCommercialLicense) {
          paymentErrorEl.setText(`Please enter a business name.`);
          paymentErrorEl.show();
          return;
        }
        if (isUpdatingCommercialLicense) {
          buyingRenew = commercialLicense.renew;
        } else {
          let autoRenewal = commercialLicenseRenewalToggleEl.hasClass("is-enabled");
          if (autoRenewal) {
            buyingRenew = "yearly";
          } else {
            buyingRenew = "";
          }
        }
        setLoading(true);
        networkGetStripeSecret("card", (secret) => payWithCard(card, secret));
      });
      let payWithCard = function(card2, clientSecret) {
        paymentErrorEl.hide();
        stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card2
          }
        }).then(function(result) {
          if (result.error) {
            setLoading(false);
            paymentErrorEl.setText(result.error.message);
            paymentErrorEl.show();
          } else {
            orderComplete(result.paymentIntent.id);
          }
        });
      };
      let payWithWechat = function(clientSecret) {
        paymentErrorEl.hide();
        stripe.confirmWechatPayPayment(clientSecret, {
          payment_method_options: {
            wechat_pay: {
              client: "web"
            }
          }
        }).then(function(result) {
          if (result.error) {
            setLoading(false);
            paymentErrorEl.setText(result.error.message);
            paymentErrorEl.show();
          } else {
            orderComplete(result.paymentIntent.id);
          }
        });
      };
      let payWithAlipay = function(clientSecret) {
        paymentErrorEl.hide();
        stripe.confirmAlipayPayment(clientSecret, {
          return_url: window.location.href
        }).then(function(result) {
          if (result.error) {
            setLoading(false);
            paymentErrorEl.setText(result.error.message);
            paymentErrorEl.show();
          } else {
            orderComplete(result.paymentIntent.id);
          }
        });
      };
      let updatePrice = function(data, containerEl) {
        let subTotalEl = containerEl.find(".payment-line.mod-subtotal");
        let subTotalDescEl = containerEl.find(".payment-line.mod-subtotal .payment-desc");
        let subTotalAmountEl = containerEl.find(".payment-line.mod-subtotal .payment-amount");
        let discountEl = containerEl.find(".payment-line.mod-discount");
        let discountDescEl = containerEl.find(".payment-line.mod-discount .payment-desc");
        let discountAmountEl = containerEl.find(".payment-line.mod-discount .payment-amount");
        let taxEl = containerEl.find(".payment-line.mod-tax");
        let taxDescEl = containerEl.find(".payment-line.mod-tax .payment-desc");
        let taxAmountEl = containerEl.find(".payment-line.mod-tax .payment-amount");
        let creditEl = containerEl.find(".payment-line.mod-credit");
        let creditAmountEl = containerEl.find(".payment-line.mod-credit .payment-amount");
        let totalDescEl = containerEl.find(".payment-line.mod-total .payment-desc");
        let totalAmountEl = containerEl.find(".payment-line.mod-total .payment-amount");
        let { subtotal, desc, tax, taxDesc, discount, discountDesc, creditUsed, total } = data;
        if (discount === 0) {
          discountEl.hide();
        } else {
          discountEl.show();
          discountAmountEl.setText(formatPrice(discount));
          discountDescEl.setText(discountDesc || "");
        }
        if (tax === 0) {
          taxEl.hide();
        } else {
          taxEl.show();
          taxAmountEl.setText(formatPrice(tax));
          taxDescEl.setText(taxDesc || "");
        }
        if (subtotal === total && discount === 0 && tax === 0) {
          subTotalEl.hide();
          totalDescEl.setText(desc);
        } else {
          subTotalEl.show();
          subTotalAmountEl.setText(formatPrice(subtotal));
          subTotalDescEl.setText(desc || "");
          totalDescEl.setText("Total");
        }
        creditAmountEl.setText(formatPrice(creditUsed));
        creditEl.toggle(creditUsed !== 0);
        totalAmountEl.setText(formatPrice(total));
      };
      let setLoading = function(isLoading) {
        if (isLoading) {
          fishAll("button.submit").forEach((s) => s.addClass("mod-disabled"));
          fishAll(".spinner").forEach((s) => s.removeClass("hidden"));
          fishAll(".button-text").forEach((s) => s.addClass("hidden"));
        } else {
          fishAll("button.submit").forEach((s) => s.removeClass("mod-disabled"));
          fishAll(".spinner").forEach((s) => s.addClass("hidden"));
          fishAll(".button-text").forEach((s) => s.removeClass("hidden"));
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
              buyCatalystLicenseCardEl.addClass("is-active");
              personalLicenseTierEl.setText(data.license);
              if (catalystLicenseTier !== "vip") {
                personalLicenseUpgradeButtonEl.addEventListener("click", () => {
                  paymentErrorEl = fish(".modal-container.mod-personal-license .payment-error");
                  personalLicenseModal.show();
                });
                personalLicenseUpgradeButtonEl.show();
                if (catalystLicenseTier === "supporter") {
                  insiderOptionEl.hide();
                  supporterOptionEl.hide();
                } else if (catalystLicenseTier === "insider") {
                  insiderOptionEl.hide();
                }
              }
            } else {
              buyCatalystLicenseCardEl.addEventListener("click", () => {
                paymentErrorEl = fish(".modal-container.mod-personal-license .payment-error");
                personalLicenseModal.show();
              });
            }
          }
        });
      };
      let getCurrentSubscription = () => {
        request(LIST_SUBSCRIPTION_URL, {}, (err, data) => {
          if (err) {
            return;
          }
          if (data.business && data.business !== null && data.business.expiry >= Date.now()) {
            commercialLicense = data.business;
            commercialLicenseKeyEl.setText(commercialLicense.key);
            commercialLicenseCompanyEl.setText(commercialLicense.company);
            let seat = commercialLicense.seats;
            let seatText = seat === 1 ? "1 seat" : seat + " seats";
            commercialLicenseSeatNumberEl.forEach((el) => el.setText(seatText));
            commercialLicenseExpiryEl.forEach((el) => el.setText(new Date(commercialLicense.expiry).toLocaleDateString()));
            commercialLicensePitchEl.hide();
            existingCommercialLicenseEl.show();
          } else {
            commercialLicenseCardEl.addEventListener("click", () => {
              buyingLicense = "business";
              buyingVariation = parseInt(commercialLicenseSeatEl.value).toString();
              paymentErrorEl = fish(".modal-container.mod-commercial-license .payment-error");
              commercialLicenseModal.show();
              card.mount(".modal-container.mod-commercial-license .card-element");
              updateBizPrice();
            });
          }
          if (data.publish) {
            let { sites, renew, renew_sites, expiry_ts, earlybird } = data.publish;
            if (expiry_ts >= Date.now()) {
              getPublishCardEl.addClass("is-active");
              if (sites === 1) {
                publishBoughtSiteNumEl.setText("1 site");
              } else {
                publishBoughtSiteNumEl.setText(`${sites} sites`);
              }
              if (renew_sites === 1) {
                publishRenewSiteNumEl.setText("1 site");
                publishReduceNumOfSitesEl.hide();
              } else {
                publishRenewSiteNumEl.setText(`${renew_sites} sites`);
                publishReduceNumOfSitesEl.show();
              }
              if (expiry_ts) {
                let date = new Date(expiry_ts);
                publishRenewTimeEl.forEach((el) => el.setText(`on ${date.toLocaleDateString()}`));
              }
              publishRenewInfoNotRenewingEl.hide();
              let renewalFrequencyEl = document.createDocumentFragment();
              if (renew === "yearly") {
                publishChangeToYearlyEl.hide();
                renewalFrequencyEl.createSpan({ text: `You're currently on a ` });
                renewalFrequencyEl.createSpan({ cls: "u-pop", text: "yearly" });
                renewalFrequencyEl.createSpan({ text: " plan." });
              } else if (renew === "monthly") {
                publishChangeToMonthlyEl.hide();
                renewalFrequencyEl.createSpan({ text: `You're currently on a ` });
                renewalFrequencyEl.createSpan({ cls: "u-pop", text: "monthly" });
                renewalFrequencyEl.createSpan({ text: " plan." });
              } else if (renew === "") {
                publishStopRenewalEl.hide();
                publishRenewInfoNotRenewingEl.show();
                publishRenewInfoRenewingEl.hide();
                renewalFrequencyEl.createSpan({ text: `You're not currently being renewed.` });
              }
              publishRenewalFrequencyEl.empty();
              publishRenewalFrequencyEl.appendChild(renewalFrequencyEl);
              reduceSiteNumInputEl.value = sites;
            }
            if (earlybird === true) {
              fish(".publish-yearly-price-per-month").setText("8");
              fish(".publish-yearly-price-per-year").setText("96");
              fish(".publish-monthly-price-per-month").setText("10");
              fish(".publish-monthly-price-per-year").setText("120");
              getPublishCardEl.addClass("is-early-bird");
            }
          }
          if (data.sync) {
            let { renew, expiry_ts, earlybird } = data.sync;
            if (expiry_ts >= Date.now()) {
              getSyncCardEl.addClass("is-active");
              if (expiry_ts) {
                let date = new Date(expiry_ts);
                syncRenewTimeEl.forEach((el) => el.setText(`on ${date.toLocaleDateString()}`));
              }
              syncRenewInfoNotRenewingEl.hide();
              if (renew === "yearly") {
              } else if (renew === "monthly") {
                syncChangeToMonthlyEl.hide();
              } else if (renew === "") {
                syncStopRenewalEl.hide();
                syncRenewInfoNotRenewingEl.show();
                syncRenewInfoRenewingEl.hide();
              }
              let renewalFrequencyEl = document.createDocumentFragment();
              if (renew === "yearly") {
                syncChangeToYearlyEl.hide();
                renewalFrequencyEl.createSpan({ text: `You're currently on a ` });
                renewalFrequencyEl.createSpan({ cls: "u-pop", text: "yearly" });
                renewalFrequencyEl.createSpan({ text: " plan." });
              } else if (renew === "monthly") {
                syncChangeToMonthlyEl.hide();
                renewalFrequencyEl.createSpan({ text: `You're currently on a ` });
                renewalFrequencyEl.createSpan({ cls: "u-pop", text: "monthly" });
                renewalFrequencyEl.createSpan({ text: " plan." });
              } else if (renew === "") {
                syncStopRenewalEl.hide();
                syncRenewInfoNotRenewingEl.show();
                syncRenewInfoRenewingEl.hide();
                renewalFrequencyEl.createSpan({ text: `You're not currently being renewed.` });
              }
              syncRenewalFrequencyEl.empty();
              syncRenewalFrequencyEl.appendChild(renewalFrequencyEl);
            }
            if (earlybird === true) {
              fish(".sync-yearly-price-per-month").setText("4");
              fish(".sync-yearly-price-per-year").setText("48");
              fish(".sync-monthly-price-per-month").setText("5");
              fish(".sync-monthly-price-per-year").setText("60");
              getSyncCardEl.addClass("is-early-bird");
            }
          }
          if (data.business) {
            let { renew, expiry } = data.business;
            if (expiry >= Date.now()) {
              commercialLicenseCardEl.addClass("is-active");
              if (expiry) {
                let date = new Date(expiry);
                commercialRenewTimeEl.forEach((el) => el.setText(`on ${date.toLocaleDateString()}`));
              }
              commercialRenewInfoNotRenewingEl.hide();
              if (renew === "yearly") {
                commercialResumeRenewalEl.hide();
                commercialStopRenewalEl.show();
                commercialRenewInfoNotRenewingEl.hide();
                commercialRenewInfoRenewingEl.show();
              } else if (renew === "") {
                commercialResumeRenewalEl.show();
                commercialStopRenewalEl.hide();
                commercialRenewInfoNotRenewingEl.show();
                commercialRenewInfoRenewingEl.hide();
              }
              if (renew === "yearly") {
                syncChangeToYearlyEl.hide();
              } else if (renew === "") {
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
        if (email === "") {
          loginErrorEl.setText("Email cannot be empty.");
          showError = true;
        } else if (email.indexOf("@") === -1) {
          loginErrorEl.setText("Email is not valid.");
          showError = true;
        } else if (password === "") {
          loginErrorEl.setText("Password cannot be empty.");
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
            if (err === "Login failed") {
              loginErrorEl.setText("Login failed, please double check your email and password.");
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
        if (name === "") {
          signupErrorEl.setText("Name cannot be empty.");
          showError = true;
        } else if (email === "") {
          signupErrorEl.setText("Email cannot be empty.");
          showError = true;
        } else if (email.indexOf("@") === -1) {
          signupErrorEl.setText("Email is not valid.");
          showError = true;
        } else if (password === "") {
          signupErrorEl.setText("Password cannot be empty.");
          showError = true;
        }
        if (showError) {
          signupErrorEl.show();
          signupFormEl.show();
          spinnerEl.hide();
          return;
        }
        request(SIGNUP_URL, {
          name,
          email,
          password
        }, (err, data) => {
          signupFormEl.show();
          spinnerEl.hide();
          if (err) {
            if (err === "Invalid email address") {
              signupErrorEl.setText("The email address you entered was invalid.");
            } else if (err === "Already signed up") {
              signupErrorEl.setText("Seems like you already have an account! Please log in.");
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
          forgotPassErrorMsgEl.setText("Please fill out your email.");
          forgotPassErrorMsgEl.show();
          return;
        } else if (email.indexOf("@") === -1) {
          forgotPassErrorMsgEl.setText('Email address is not valid and must contain "@".');
          forgotPassErrorMsgEl.show();
          return;
        }
        request(FORGOT_PASS_URL, { email, captcha: "captcha" }, (err, data) => {
          spinnerEl.show();
          if (err) {
            forgotPassErrorMsgEl.setText("Something went wrong, please try again.");
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
          resetPassErrorMsgEl.setText("Please set a new password.");
          resetPassErrorMsgEl.show();
          return;
        }
        request(RESET_PASS_URL, {
          password,
          id: resetPasswordId,
          key: resetPasswordKey
        }, (err, data) => {
          if (err) {
            resetPassErrorMsgEl.setText("Something went wrong, please try again.");
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
          }
        });
      };
      let networkGetStripeSecret = (method, callback) => {
        request(PAY_URL, {
          type: buyingLicense,
          variation: buyingVariation,
          renew: buyingRenew,
          method
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
        if (isUpdatingCommercialLicense) {
          buyingVariation = (parseInt(buyingVariation) + commercialLicense.seats).toString();
        }
        paymentErrorEl.hide();
        request(CHECK_PRICE_URL, {
          type: buyingLicense,
          variation: buyingVariation
        }, (err, data) => {
          if (err) {
            paymentErrorEl.setText(err);
            paymentErrorEl.show();
          } else {
            updatePrice(data, fish(".modal-container.mod-commercial-license"));
          }
        });
      };
      testLoggedIn();
      getCurrentSubscription();
      logoutButtonEl.addEventListener("click", () => {
        attemptLogout();
      });
      let copyCommercialLicenseKey = () => {
        let licenseKey = commercialLicenseKeyEl.getText();
        copyTextToClipboard(licenseKey);
        commercialLicenseKeyEl.setText("Copied!");
        commercialLicenseKeyEl.addClass("is-copied");
        commercialLicenseKeyEl.removeEventListener("click", copyCommercialLicenseKey);
        setTimeout(() => {
          commercialLicenseKeyEl.removeClass("is-copied");
          commercialLicenseKeyEl.setText(licenseKey);
          commercialLicenseKeyEl.addEventListener("click", copyCommercialLicenseKey);
        }, 500);
      };
      commercialLicenseKeyEl.addEventListener("click", copyCommercialLicenseKey);
      commercialLicenseSeatEl.addEventListener("input", () => {
        buyingLicense = "business";
        if (commercialLicenseSeatEl.value === "") {
          return;
        }
        if (isUpdatingCommercialLicense && parseInt(commercialLicenseSeatEl.value) === 0) {
          return;
        }
        let newSeatNum = parseInt(commercialLicenseSeatEl.value);
        buyingVariation = newSeatNum.toString();
        updateBizPrice();
      });
      catalystTierCardsEl.forEach((el) => {
        el.addEventListener("click", () => {
          catalystTierCardsEl.forEach((el2) => el2.removeClass("is-selected"));
          el.addClass("is-selected");
          buyingLicense = "catalyst";
          buyingVariation = el.getAttribute("data-tier");
          if (!["insider", "supporter", "vip"].contains(buyingVariation)) {
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
              updatePrice(data, fish(".modal-container.mod-personal-license"));
              personalLicensePaymentContainerEl.show();
              card.mount(".modal-container.mod-personal-license .card-element");
            }
          });
        });
      });
      closeModalButtonEls.forEach((el) => {
        el.addEventListener("click", closeModal);
      });
      gotoSignupEl.addEventListener("click", () => {
        location.hash = "#mode=signup";
        location.reload();
      });
      gotoLoginEl.addEventListener("click", () => {
        location.hash = "";
        location.reload();
      });
      gotoForgotPassEl.addEventListener("click", () => {
        location.hash = "#mode=forgotpass";
        location.reload();
      });
      loginFormEl.find("form").addEventListener("submit", (evt) => {
        evt.preventDefault();
        attemptLogin();
      });
      signupFormEl.find("form").addEventListener("submit", (evt) => {
        evt.preventDefault();
        attemptSignup();
      });
      forgotPassFormEl.find("form").addEventListener("submit", (evt) => {
        evt.preventDefault();
        attemptForgotPassword();
      });
      resetPassFormEl.find("form").addEventListener("submit", (evt) => {
        evt.preventDefault();
        attemptResetPassword();
      });
      let updatePublishPrice = () => {
        let selectedCardEls = publishPlansCardsEl.filter((el) => el.hasClass("is-selected"));
        if (selectedCardEls.length === 0) {
          return;
        }
        let renewal = selectedCardEls[0].getAttribute("data-renew");
        let numSites = publishSiteNumEl.value.toString();
        buyingLicense = "publish";
        buyingVariation = numSites;
        buyingRenew = renewal;
        paymentErrorEl.hide();
        request(CHECK_PRICE_URL, {
          type: "publish",
          renew: renewal,
          variation: numSites
        }, (err, data) => {
          if (err) {
            paymentErrorEl.setText(err);
            paymentErrorEl.show();
          } else {
            updatePrice(data, fish(".modal-container.mod-choose-publish-plan"));
          }
        });
      };
      let updateSyncPrice = () => {
        let selectedCardEls = syncPlansCardsEl.filter((el) => el.hasClass("is-selected"));
        if (selectedCardEls.length === 0) {
          return;
        }
        let renewal = selectedCardEls[0].getAttribute("data-renew");
        buyingLicense = "sync";
        buyingRenew = renewal;
        paymentErrorEl.hide();
        request(CHECK_PRICE_URL, {
          type: "sync",
          renew: renewal
        }, (err, data) => {
          if (err) {
            paymentErrorEl.setText(err);
            paymentErrorEl.show();
          } else {
            updatePrice(data, syncUpgradeModal);
          }
        });
      };
      publishUpgradeButtonEl.addEventListener("click", () => {
        publishUpgradeModal.show();
        card.mount(".modal-container.mod-choose-publish-plan .card-element");
        paymentErrorEl = fish(".modal-container.mod-choose-publish-plan .payment-error");
        updatePublishPrice();
      });
      publishPlansCardsEl.forEach((cardEl) => {
        cardEl.addEventListener("click", () => {
          publishPlansCardsEl.forEach((el) => el.removeClass("is-selected"));
          cardEl.addClass("is-selected");
          publishUpgradeModal.find(".paypal-button").toggle(cardEl.getAttribute("data-renew") === "monthly");
          updatePublishPrice();
        });
      });
      publishSiteNumEl.addEventListener("change", () => {
        updatePublishPrice();
      });
      stripePublishFormEl.addEventListener("submit", function(event) {
        event.preventDefault();
        fishAll(".payment-error").forEach((e) => e.hide());
        setLoading(true);
        networkGetStripeSecret("card", (secret) => payWithCard(card, secret));
      });
      paypalPayImageEl.forEach((el) => el.addEventListener("click", () => {
        paypalPayModalEl.show();
      }));
      publishChangeToMonthlyEl.addEventListener("click", () => {
        request(UPDATE_PLAN_URL, { type: "publish", renew: "monthly" }, () => {
          window.location.reload();
        });
      });
      publishChangeToYearlyEl.addEventListener("click", () => {
        request(UPDATE_PLAN_URL, { type: "publish", renew: "yearly" }, () => {
          window.location.reload();
        });
      });
      publishStopRenewalEl.addEventListener("click", () => {
        request(UPDATE_PLAN_URL, { type: "publish", renew: "" }, () => {
          window.location.reload();
        });
      });
      publishChangeNumOfSitesEl.addEventListener("click", () => {
        publishUpgradeModal.show();
        card.mount(".modal-container.mod-choose-publish-plan .card-element");
        paymentErrorEl = fish(".modal-container.mod-choose-publish-plan .payment-error");
        updatePublishPrice();
      });
      publishReduceNumOfSitesEl.addEventListener("click", () => {
        publishReduceSitesModal.show();
      });
      reduceSiteConfirmButtonEl.addEventListener("click", () => {
        let newNumberOfSites = parseInt(reduceSiteNumInputEl.value);
        request(REDUCE_SITES_URL, { sites: newNumberOfSites }, () => {
          window.location.reload();
        });
      });
      publishViewPaymentLinkEl.forEach((el) => el.addEventListener("click", () => {
        request(GET_PAYMENT_INFO_URL, {}, (error, data) => {
          if (data.info) {
            currentCardInfoTextEl.setText(`You're currently using a ${data.info}.`);
          } else {
            currentCardInfoTextEl.setText(`You currently do not have any payment methods on file.`);
          }
          publishViewPaymentMethodModal.show();
        });
      }));
      publishOpenChangePaymentButtonEl.forEach((el) => el.addEventListener("click", () => {
        updatePaymentMethodModalEl.show();
        paymentErrorEl = updatePaymentMethodModalEl.find(".payment-error");
        card.mount(".modal-container.mod-change-payment-method .card-element");
      }));
      updatePaymentMethodFormEl.addEventListener("submit", (event) => {
        event.preventDefault();
        stripe.createPaymentMethod({
          type: "card",
          card
        }).then((data) => {
          if (data.paymentMethod && data.paymentMethod.id) {
            request(UPDATE_PAYMENT_INFO_URL, {
              payment_method_id: data.paymentMethod.id
            }, () => {
              window.location.reload();
            });
          } else {
            paymentErrorEl.setText("Could not update your payment method.");
            paymentErrorEl.show();
          }
        });
      });
      openUnlimitedEl.addEventListener("click", () => {
        donationModalEl.show();
        paymentErrorEl = donationModalEl.find(".payment-error");
        card.mount(".modal-container.mod-donation .card-element");
      });
      donationFormEl.addEventListener("submit", (event) => {
        event.preventDefault();
        fishAll(".payment-error").forEach((e) => e.hide());
        setLoading(true);
        networkGetStripeSecret("card", (secret) => payWithCard(card, secret));
      });
      unlimitedDonationAmountEl.addEventListener("change", () => {
        buyingLicense = "donation";
        buyingVariation = (unlimitedDonationAmountEl.valueAsNumber * 100).toString();
      });
      syncUpgradeButtonEl.addEventListener("click", () => {
        syncUpgradeModal.show();
        card.mount(".modal-container.mod-choose-sync-plan .card-element");
        paymentErrorEl = fish(".modal-container.mod-choose-sync-plan .payment-error");
        updateSyncPrice();
      });
      syncPlansCardsEl.forEach((cardEl) => {
        cardEl.addEventListener("click", () => {
          syncPlansCardsEl.forEach((el) => el.removeClass("is-selected"));
          cardEl.addClass("is-selected");
          syncUpgradeModal.find(".paypal-button").toggle(cardEl.getAttribute("data-renew") === "monthly");
          updateSyncPrice();
        });
      });
      stripeSyncFormEl.addEventListener("submit", function(event) {
        event.preventDefault();
        fishAll(".payment-error").forEach((e) => e.hide());
        setLoading(true);
        networkGetStripeSecret("card", (secret) => payWithCard(card, secret));
      });
      syncChangeToMonthlyEl.addEventListener("click", () => {
        request(UPDATE_PLAN_URL, { type: "sync", renew: "monthly" }, () => {
          window.location.reload();
        });
      });
      syncChangeToYearlyEl.addEventListener("click", () => {
        request(UPDATE_PLAN_URL, { type: "sync", renew: "yearly" }, () => {
          window.location.reload();
        });
      });
      syncStopRenewalEl.addEventListener("click", () => {
        request(UPDATE_PLAN_URL, { type: "sync", renew: "" }, () => {
          window.location.reload();
        });
      });
      commercialStopRenewalEl.addEventListener("click", () => {
        request(UPDATE_PLAN_URL, { type: "business", renew: "" }, () => {
          window.location.reload();
        });
      });
      commercialResumeRenewalEl.addEventListener("click", () => {
        request(UPDATE_PLAN_URL, { type: "business", renew: "yearly" }, () => {
          window.location.reload();
        });
      });
      toggleEls.forEach((el) => {
        el.addEventListener("click", () => {
          let currentChecked = el.hasClass("is-enabled");
          if (currentChecked) {
            el.removeClass("is-enabled");
          } else {
            el.addClass("is-enabled");
          }
        });
      });
      claimDiscordBadgeButtons.forEach((el) => el.addEventListener("click", () => {
        let discordClientId = "823279137640415263";
        let redirectUrl = location.protocol + "//" + location.host + location.pathname;
        el.addClass("mod-disabled");
        location.href = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=identify`;
      }));
      claimForumBadgeButtons.forEach((el) => el.addEventListener("click", () => {
        el.addClass("mod-disabled");
        request(CLAIM_FORUM_ROLE_URL, {}, (err, data) => {
          if (err) {
            forumErrorMessageEl.setText(err);
            forumFailureModal.show();
          } else {
            forumSuccessModal.show();
          }
          el.removeClass("mod-disabled");
        });
      }));
      changeEmailButtonEl.addEventListener("click", () => {
        changeEmailModalEl.show();
      });
      confirmChangeEmailButtonEl.addEventListener("click", () => {
        changeEmailErrorEl.hide();
        let newEmail = changeEmailNewEmailInputEl.value;
        let password = changeEmailPasswordInputEl.value;
        if (newEmail === "") {
          changeEmailErrorEl.setText("New email cannot be empty.");
          changeEmailErrorEl.show();
          return;
        }
        if (password === "") {
          changeEmailErrorEl.setText("Password cannot be empty.");
          changeEmailErrorEl.show();
          return;
        }
        request(CHANGE_EMAIL_URL, {
          password,
          email: newEmail
        }, (err, data) => {
          if (err) {
            changeEmailErrorEl.setText(err);
            changeEmailErrorEl.show();
            return;
          } else {
            closeModal();
            refreshAfterClosing = true;
            changeInfoSuccessModalEl.show();
          }
        });
      });
      changeNameButtonEl.addEventListener("click", () => {
        changeNameModalEl.show();
      });
      confirmChangeNameButtonEl.addEventListener("click", () => {
        changeNameErrorEl.hide();
        let name = changeNameNewNameInputEl.value;
        if (name === "") {
          changeNameErrorEl.setText("New name cannot be empty.");
          changeNameErrorEl.show();
          return;
        }
        request(CHANGE_NAME_URL, {
          name
        }, (err, data) => {
          if (err) {
            changeNameErrorEl.setText(err);
            changeNameErrorEl.show();
            return;
          } else {
            closeModal();
            refreshAfterClosing = true;
            changeInfoSuccessModalEl.show();
          }
        });
      });
      changePasswordButtonEl.addEventListener("click", () => {
        changePasswordModalEl.show();
      });
      confirmChangePasswordButtonEl.addEventListener("click", () => {
        changePasswordErrorEl.hide();
        let oldPassword = changePasswordOldPasswordInputEl.value;
        let newPassword = changePasswordNewPasswordInputEl.value;
        if (oldPassword === "") {
          changePasswordErrorEl.setText("Current password cannot be empty.");
          changePasswordErrorEl.show();
          return;
        }
        if (oldPassword === "") {
          changePasswordErrorEl.setText("New password cannot be empty.");
          changePasswordErrorEl.show();
          return;
        }
        request(CHANGE_PASSWORD_URL, {
          old_password: oldPassword,
          new_password: newPassword
        }, (err, data) => {
          if (err) {
            changePasswordErrorEl.setText(err);
            changePasswordErrorEl.show();
            return;
          } else {
            closeModal();
            refreshAfterClosing = true;
            changeInfoSuccessModalEl.show();
          }
        });
      });
      deleteAccountButtonEl.addEventListener("click", () => {
        deleteAccountModalEl.show();
      });
      confirmDeleteAccountButtonEl.addEventListener("click", () => {
        deleteAccountErrorEl.hide();
        let email = deleteAccountEmailInputEl.value;
        let password = deleteAccountPasswordInputEl.value;
        if (email === "") {
          deleteAccountErrorEl.setText("Please enter your email to confirm account deletion.");
          deleteAccountErrorEl.show();
          return;
        }
        if (password === "") {
          deleteAccountErrorEl.setText("Please enter your password to confirm account deletion.");
          deleteAccountErrorEl.show();
          return;
        }
        request(DELETE_ACCOUNT_URL, {
          email,
          password
        }, (err, data) => {
          if (err) {
            deleteAccountErrorEl.setText(err);
            deleteAccountErrorEl.show();
            return;
          } else {
            closeModal();
            refreshAfterClosing = true;
            changeInfoSuccessModalEl.show();
          }
        });
      });
      commercialLicenseChangeSeatEl.addEventListener("click", () => {
        commercialLicenseModal.addClass("is-updating");
        paymentErrorEl = fish(".modal-container.mod-commercial-license .payment-error");
        commercialLicenseModal.show();
        card.mount(".modal-container.mod-commercial-license .card-element");
        buyingLicense = "business";
        buyingVariation = parseInt(commercialLicenseSeatEl.value).toString();
        isUpdatingCommercialLicense = true;
        commercialLicenseTitle.setText("Add seats");
        updateBizPrice();
      });
      commercialLicenseReduceSeatEl.addEventListener("click", () => {
        commercialLicenseReduceSeatModal.show();
      });
      commercialLicenseReduceSeatConfirmEl.addEventListener("click", () => {
        commercialLicenseReduceSeatErrorEl.hide();
        let reduceBy = commercialLicenseReduceSeatInputEl.valueAsNumber;
        let currentSeats = commercialLicense.seats;
        if (reduceBy === 0) {
          commercialLicenseReduceSeatErrorEl.setText("The number of seats to remove cannot be 0.");
          commercialLicenseReduceSeatErrorEl.show();
          return;
        }
        let newSeats = currentSeats - reduceBy;
        if (newSeats < 0) {
          let currentSeatText = currentSeats === 1 ? "1 seat" : currentSeats + " seats";
          commercialLicenseReduceSeatErrorEl.setText("You currently have " + currentSeatText + " and cannot remove more seats than that.");
          commercialLicenseReduceSeatErrorEl.show();
          return;
        }
        request(REDUCE_COMMERCIAL_LICENSE_URL, { seats: newSeats }, (err, data) => {
          if (err) {
            commercialLicenseReduceSeatErrorEl.setText(err);
            commercialLicenseReduceSeatErrorEl.show();
            return;
          } else {
            closeModal();
            refreshAfterClosing = true;
            changeInfoSuccessModalEl.show();
          }
        });
      });
      let currentRefundChargeId = "";
      let invoiceListEl = fish(".modal-container.mod-invoice-list");
      fish(".js-view-invoices").addEventListener("click", () => {
        spinnerEl.show();
        welcomeEl.hide();
        request(LIST_INVOICES_URL, {}, (err, data) => {
          spinnerEl.hide();
          welcomeEl.show();
          invoiceListEl.show();
          let modalContentEl = invoiceListEl.find(".invoice-list");
          modalContentEl.empty();
          for (let charge of data) {
            modalContentEl.createDiv({ cls: "invoice-item setting-item" }, (el) => {
              el.createDiv({ cls: "setting-item-info" }, (el2) => {
                el2.createDiv({ text: charge.description, cls: "setting-item-name" });
                el2.createDiv({
                  text: new Date(charge.created * 1e3).toLocaleString(),
                  cls: "setting-item-description"
                });
              });
              el.createDiv({ cls: "setting-item-control mod-vertical" }, (el2) => {
                el2.createEl("button", { cls: "mod-cta", text: "View" }, (el3) => {
                  el3.addEventListener("click", () => {
                    let amount = (charge.amount / 100).toFixed(2);
                    let refunded = (charge.refunded / 100).toFixed(2);
                    let total = ((charge.amount - charge.refunded) / 100).toFixed(2);
                    let hasRefund = charge.refunded !== 0;
                    let savedBillingInfo = localStorage.getItem("billing-info");
                    fish(".invoice-date").setText(new Date(parseInt(charge.created) * 1e3).toLocaleString());
                    fish(".invoice-number-title").setText(charge.receipt_number || charge.id);
                    fish(".invoice-number").setText(charge.receipt_number || charge.id);
                    fish(".invoice-description").setText(charge.description);
                    fish(".invoice-amount").setText(amount);
                    if (hasRefund) {
                      fish(".invoice-box .item.mod-refund").show();
                      fish(".invoice-refund-amount").setText(refunded);
                    } else {
                      fish(".invoice-box .item.mod-refund").hide();
                    }
                    fish(".invoice-total").setText(total);
                    if (savedBillingInfo) {
                      fish(".billing-info").setText(savedBillingInfo);
                    }
                    fish(".billing-info").addEventListener("input", () => {
                      let newInfo = fish(".billing-info").getText();
                      localStorage.setItem("billing-info", newInfo);
                    });
                    fish(".modal-container.mod-invoice-detail").show();
                  });
                });
                if (charge.refundable) {
                  el2.createEl("a", { text: "Get refund" }, (el3) => {
                    el3.addEventListener("click", () => {
                      currentRefundChargeId = charge.id;
                      fish(".modal-container.mod-confirm-refund").show();
                    });
                  });
                }
              });
            });
          }
        });
      });
      fish(".js-confirm-refund").addEventListener("click", () => {
        fish(".modal-container.mod-invoice-list").hide();
        fish(".modal-container.mod-confirm-refund").hide();
        spinnerEl.show();
        welcomeEl.hide();
        request(REQUEST_REFUND_URL, { charge: currentRefundChargeId }, (err, data) => {
          spinnerEl.hide();
          welcomeEl.show();
          if (err) {
            fish(".refund-failed-reason").setText(err);
            fish(".modal-container.mod-refund-failed").show();
          } else {
            refreshAfterClosing = true;
            fish(".modal-container.mod-refund-success").show();
          }
        });
      });
    });
  }, 500);
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3NoYXJlZC91dGlsL2Jyb3dzZXIudHMiLCAiLi4vc3JjL3NoYXJlZC91dGlsL2dpdGh1Yi50cyIsICIuLi9zcmMvc3RhdGljL3V0aWwudHMiLCAiLi4vc3JjL3NoYXJlZC91dGlsL3VybC50cyIsICIuLi9zcmMvc3RhdGljL2FjY291bnQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKiBAcHVibGljICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgRGVib3VuY2VyPFQgZXh0ZW5kcyB1bmtub3duW10+IHtcblx0LyoqIEBwdWJsaWMgKi9cblx0KC4uLmFyZ3M6IFsuLi5UXSk6IHZvaWQ7XG5cblx0LyoqIEBwdWJsaWMgKi9cblx0Y2FuY2VsKCk6IHRoaXM7XG59XG5cbi8qKlxuICogQSBzdGFuZGFyZCBkZWJvdW5jZSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0gY2IgLSBUaGUgZnVuY3Rpb24gdG8gY2FsbC5cbiAqIEBwYXJhbSB0aW1lb3V0IC0gVGhlIHRpbWVvdXQgdG8gd2FpdC5cbiAqIEBwYXJhbSByZXNldFRpbWVyIC0gV2hldGhlciB0byByZXNldCB0aGUgdGltZW91dCB3aGVuIHRoZSBkZWJvdW5jZXIgaXMgY2FsbGVkIGFnYWluLlxuICogQHJldHVybnMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCB0YWtlcyB0aGUgc2FtZSBwYXJhbWV0ZXIgYXMgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2U8VCBleHRlbmRzIHVua25vd25bXT4oY2I6ICguLi5hcmdzOiBbLi4uVF0pID0+IGFueSwgdGltZW91dDogbnVtYmVyID0gMCwgcmVzZXRUaW1lcjogYm9vbGVhbiA9IGZhbHNlKTogRGVib3VuY2VyPFQ+IHtcblx0bGV0IHRpbWVyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblx0bGV0IGNvbnRleHQ6IGFueSA9IG51bGw7XG5cdGxldCBhcmdzOiBhbnlbXSB8IG51bGwgPSBudWxsO1xuXHRsZXQgbmV4dFRzOiBudW1iZXIgPSAwO1xuXHRsZXQgZGVib3VuY2VkID0gZnVuY3Rpb24gKCkge1xuXHRcdGlmIChuZXh0VHMpIHtcblx0XHRcdGxldCBub3cgPSBEYXRlLm5vdygpO1xuXHRcdFx0aWYgKG5vdyA8IG5leHRUcykge1xuXHRcdFx0XHR0aW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KGRlYm91bmNlZCwgbmV4dFRzIC0gbm93KTtcblx0XHRcdFx0bmV4dFRzID0gMDtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRpbWVyID0gbnVsbDtcblx0XHRsZXQgYyA9IGNvbnRleHQ7XG5cdFx0bGV0IGEgPSBhcmdzO1xuXHRcdGNvbnRleHQgPSBudWxsO1xuXHRcdGFyZ3MgPSBudWxsO1xuXHRcdGNiLmFwcGx5KGMsIGEpO1xuXHR9O1xuXG5cdGxldCBmbiA9IDxEZWJvdW5jZXI8VD4+ZnVuY3Rpb24gKC4uLm5ld0FyZ3M6IFRbXSkge1xuXHRcdGNvbnRleHQgPSB0aGlzO1xuXHRcdGFyZ3MgPSBuZXdBcmdzO1xuXG5cdFx0aWYgKCF0aW1lcikge1xuXHRcdFx0dGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChkZWJvdW5jZWQsIHRpbWVvdXQpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChyZXNldFRpbWVyKSB7XG5cdFx0XHRuZXh0VHMgPSBEYXRlLm5vdygpICsgdGltZW91dDtcblx0XHR9XG5cdH07XG5cblx0Zm4uY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aW1lcikge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcblx0XHRcdHRpbWVyID0gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIGZuO1xuXHR9O1xuXG5cdHJldHVybiBmbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHF1ZXVlKGZ1bmM6IEZ1bmN0aW9uKSB7XG5cdHJldHVybiBzZXRUaW1lb3V0KGZ1bmMsIDApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29weVRleHRUb0NsaXBib2FyZCh0ZXh0OiBzdHJpbmcpIHtcblx0aWYgKCFuYXZpZ2F0b3IuY2xpcGJvYXJkIHx8ICFuYXZpZ2F0b3IucGVybWlzc2lvbnMpIHtcblx0XHQvLyBGYWxsYmFjayB0byBleGVjQ29tbWFuZFxuXHRcdGxldCB0ZXh0QXJlYUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcblx0XHR0ZXh0QXJlYUVsLnZhbHVlID0gdGV4dDtcblxuXHRcdC8vIEF2b2lkIHNjcm9sbGluZyB0byBib3R0b21cblx0XHR0ZXh0QXJlYUVsLnN0eWxlLnRvcCA9ICcwJztcblx0XHR0ZXh0QXJlYUVsLnN0eWxlLmxlZnQgPSAnMCc7XG5cdFx0dGV4dEFyZWFFbC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG5cblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRleHRBcmVhRWwpO1xuXG5cdFx0dHJ5IHtcblx0XHRcdHRleHRBcmVhRWwuZm9jdXMoKTtcblx0XHRcdHRleHRBcmVhRWwuc2VsZWN0KCk7XG5cdFx0XHRkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdH1cblxuXHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGV4dEFyZWFFbCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRCbG9iQXJyYXlCdWZmZXIoYmxvYjogQmxvYik6IFByb21pc2U8QXJyYXlCdWZmZXI+IHtcblx0aWYgKGJsb2IuYXJyYXlCdWZmZXIpIHtcblx0XHRyZXR1cm4gYmxvYi5hcnJheUJ1ZmZlcigpO1xuXHR9XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0XHRyZWFkZXIub25sb2FkID0gKGV2ZW50KSA9PiB7XG5cdFx0XHRyZXNvbHZlKGV2ZW50LnRhcmdldC5yZXN1bHQgYXMgQXJyYXlCdWZmZXIpO1xuXHRcdH07XG5cdFx0cmVhZGVyLm9uYWJvcnQgPSByZWFkZXIub25lcnJvciA9IChlOiBhbnkpID0+IHtcblx0XHRcdHJlamVjdChlKTtcblx0XHR9O1xuXHRcdHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKTtcblx0fSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkaXNwbGF5SW1hZ2UoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50LCB1cmw6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXHRsZXQgYWx0ID0gY29udGFpbmVyRWwuZ2V0QXR0cignYWx0JykgfHwgbnVsbDtcblx0bGV0IGVsID0gY29udGFpbmVyRWwuY3JlYXRlRWwoJ2ltZycsIHthdHRyOiB7YWx0OiBhbHR9fSk7XG5cdGxldCB3ID0gY29udGFpbmVyRWwuZ2V0QXR0cignd2lkdGgnKTtcblx0bGV0IGggPSBjb250YWluZXJFbC5nZXRBdHRyKCdoZWlnaHQnKTtcblx0aWYgKHcpIHtcblx0XHRlbC5zZXRBdHRyKCd3aWR0aCcsIHcpO1xuXHR9XG5cdGlmIChoKSB7XG5cdFx0ZWwuc2V0QXR0cignaGVpZ2h0JywgaCk7XG5cdH1cblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0bGV0IGRvbmUgPSAoKSA9PiByZXNvbHZlKCk7XG5cdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGRvbmUpO1xuXHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZG9uZSk7XG5cdFx0Ly8gRmFsbGJhY2tcblx0XHRzZXRUaW1lb3V0KGRvbmUsIDUwMDApO1xuXHRcdC8vIFNldCBVUkwgbGFzdFxuXHRcdGVsLnNyYyA9IHVybDtcblx0fSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkaXNwbGF5QXVkaW8oY29udGFpbmVyRWw6IEhUTUxFbGVtZW50LCB1cmw6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXHRsZXQgZWwgPSBjb250YWluZXJFbC5jcmVhdGVFbCgnYXVkaW8nLCB7YXR0cjoge2NvbnRyb2xzOiAnJ319KTtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cdFx0bGV0IGRvbmUgPSAoKSA9PiByZXNvbHZlKCk7XG5cdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCBkb25lKTtcblx0XHRlbC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGRvbmUpO1xuXHRcdC8vIEZhbGxiYWNrXG5cdFx0c2V0VGltZW91dChkb25lLCA1MDAwKTtcblx0XHQvLyBTZXQgVVJMIGxhc3Rcblx0XHRlbC5zcmMgPSB1cmw7XG5cdH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGlzcGxheVZpZGVvT3JBdWRpbyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQsIHVybDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cdGxldCBlbCA9IGNvbnRhaW5lckVsLmNyZWF0ZUVsKCd2aWRlbycsIHthdHRyOiB7Y29udHJvbHM6ICcnfX0pO1xuXG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdGxldCBkb25lID0gKCkgPT4gcmVzb2x2ZSgpO1xuXHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZG1ldGFkYXRhJywgKCkgPT4ge1xuXHRcdFx0Ly8gRGV0ZWN0IGF1ZGlvLW9ubHkgY2xpcHMgYW5kIHJlcGxhY2UgdGhpcyBlbGVtZW50IHdpdGggPGF1ZGlvPiBpbnN0ZWFkXG5cdFx0XHRpZiAoZWwudmlkZW9XaWR0aCA9PT0gMCAmJiBlbC52aWRlb0hlaWdodCA9PT0gMCkge1xuXHRcdFx0XHRjb250YWluZXJFbC5yZW1vdmVDaGlsZChlbCk7XG5cdFx0XHRcdGRpc3BsYXlBdWRpbyhjb250YWluZXJFbCwgdXJsKS50aGVuKGRvbmUsIGRvbmUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGRvbmUoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRlbC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGRvbmUpO1xuXHRcdC8vIEZhbGxiYWNrXG5cdFx0c2V0VGltZW91dChkb25lLCA1MDAwKTtcblx0XHQvLyBTZXQgVVJMIGxhc3Rcblx0XHRlbC5zcmMgPSB1cmw7XG5cdH0pO1xufVxuXG5kZWNsYXJlIGdsb2JhbCB7XG5cdGludGVyZmFjZSBXaW5kb3cge1xuXHRcdHJlcXVlc3RJZGxlQ2FsbGJhY2s6IChmbjogRnVuY3Rpb24sIG9wdGlvbnM/OiB7IHRpbWVvdXQ/OiBudW1iZXIgfSkgPT4gbnVtYmVyO1xuXHRcdGNhbmNlbElkbGVDYWxsYmFjazogKGlkOiBudW1iZXIpID0+IHVuZGVmaW5lZDtcblx0fVxufVxubGV0IHJlcXVlc3RJZGxlQ2FsbGJhY2sgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjaztcblxuZXhwb3J0IGludGVyZmFjZSBQcmlvcml0eUZyYW1lIHtcblx0aGlnaDogYm9vbGVhbjtcblx0Y2FuY2VsOiAoKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdFByaW9yaXR5RnJhbWUoY2I6ICgpID0+IGFueSwgZGVsYXk6IG51bWJlcik6IFByaW9yaXR5RnJhbWUge1xuXHRpZiAoZGVsYXkgPiAwICYmIHJlcXVlc3RJZGxlQ2FsbGJhY2spIHtcblx0XHRsZXQgaWQgPSByZXF1ZXN0SWRsZUNhbGxiYWNrKGNiLCB7dGltZW91dDogZGVsYXl9KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aGlnaDogZmFsc2UsXG5cdFx0XHRjYW5jZWw6ICgpID0+IHdpbmRvdy5jYW5jZWxJZGxlQ2FsbGJhY2soaWQpLFxuXHRcdH07XG5cdH1cblx0ZWxzZSB7XG5cdFx0bGV0IGlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aGlnaDogdHJ1ZSxcblx0XHRcdGNhbmNlbDogKCkgPT4gY2FuY2VsQW5pbWF0aW9uRnJhbWUoaWQpLFxuXHRcdH07XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGVsZWdhdGVkTW91c2VvdmVyKGV2dDogTW91c2VFdmVudCB8IERyYWdFdmVudCwgdGFyZ2V0OiBIVE1MRWxlbWVudCkge1xuXHRsZXQgcmVsYXRlZFRhcmdldCA9IGV2dC5yZWxhdGVkVGFyZ2V0O1xuXHRpZiAocmVsYXRlZFRhcmdldCBpbnN0YW5jZW9mIE5vZGUpIHtcblx0XHRpZiAodGFyZ2V0LmNvbnRhaW5zKHJlbGF0ZWRUYXJnZXQpKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc01pZGRsZUNsaWNrKGV2dDogTW91c2VFdmVudCB8IFBvaW50ZXJFdmVudCB8IFRvdWNoRXZlbnQpIHtcblx0cmV0dXJuIChldnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50IHx8IGV2dCBpbnN0YW5jZW9mIFBvaW50ZXJFdmVudCkgJiYgZXZ0LmJ1dHRvbiA9PT0gMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpeE1pZGRsZUNsaWNrKGVsOiBIVE1MRWxlbWVudCkge1xuXHRlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBlID0+IHtcblx0XHRpZiAoZS5idXR0b24gPT09IDEpIGUucHJldmVudERlZmF1bHQoKTtcblx0fSk7XG59XG5cbmV4cG9ydCBsZXQgaXNQcm9iYWJseUNyYXdsZXIgPSAvYm90fGNyYXdsfHNwaWRlci9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBlbXVsYXRlQ29udGV4dE1lbnUoKSB7XG5cdC8vIEB0cy1pZ25vcmVcblx0ZG9jdW1lbnQuYm9keS5zdHlsZVsnLXdlYmtpdC10b3VjaC1jYWxsb3V0J10gPSAnbm9uZSc7XG5cblx0bGV0IGVsZW1lbnQgPSB3aW5kb3c7XG5cdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChldnQpID0+IHtcblx0XHRpZiAoZXZ0LnRvdWNoZXMubGVuZ3RoID4gMSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgdG91Y2ggPSBldnQudG91Y2hlc1swXTtcblx0XHRsZXQgdGFyZ2V0ID0gZXZ0LnRhcmdldCBhcyBOb2RlO1xuXG5cdFx0bGV0IHRvdWNoU3RhcnRYID0gdG91Y2guY2xpZW50WDtcblx0XHRsZXQgdG91Y2hTdGFydFkgPSB0b3VjaC5jbGllbnRZO1xuXG5cdFx0bGV0IHRvdWNoSWRlbnRpZmllciA9IHRvdWNoLmlkZW50aWZpZXI7XG5cdFx0bGV0IHRzID0gRGF0ZS5ub3coKTtcblxuXHRcdGxldCBjbGVhbnVwID0gKCkgPT4ge1xuXHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIG9uVG91Y2hFbmQsIHRydWUpO1xuXHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uVG91Y2hFbmQsIHRydWUpO1xuXHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSwgdHJ1ZSk7XG5cdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIG9uRHJhZ1N0YXJ0LCB0cnVlKTtcblx0XHR9O1xuXG5cdFx0bGV0IHRvdWNoRW5kID0gKGV2dDogVG91Y2hFdmVudCwgdG91Y2g6IFRvdWNoKSA9PiB7XG5cdFx0XHQvLyBDbGVhbnVwIGZpcnN0XG5cdFx0XHRjbGVhbnVwKCk7XG5cblx0XHRcdGlmIChldnQudHlwZSA9PT0gJ3RvdWNoZW5kJyAmJiBEYXRlLm5vdygpIC0gdHMgPiA0MDApIHtcblx0XHRcdFx0dGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoJ2NvbnRleHRtZW51Jywge1xuXHRcdFx0XHRcdGJ1dHRvbjogMCxcblx0XHRcdFx0XHRidXR0b25zOiAwLFxuXHRcdFx0XHRcdGN0cmxLZXk6IGV2dC5jdHJsS2V5LFxuXHRcdFx0XHRcdGFsdEtleTogZXZ0LmFsdEtleSxcblx0XHRcdFx0XHRtZXRhS2V5OiBldnQubWV0YUtleSxcblx0XHRcdFx0XHRzaGlmdEtleTogZXZ0LnNoaWZ0S2V5LFxuXHRcdFx0XHRcdHNjcmVlblg6IHRvdWNoLnNjcmVlblgsXG5cdFx0XHRcdFx0c2NyZWVuWTogdG91Y2guc2NyZWVuWSxcblx0XHRcdFx0XHRidWJibGVzOiB0cnVlLFxuXHRcdFx0XHRcdGNhbmNlbGFibGU6IHRydWUsXG5cdFx0XHRcdFx0Y2xpZW50WDogdG91Y2hTdGFydFgsXG5cdFx0XHRcdFx0Y2xpZW50WTogdG91Y2hTdGFydFksXG5cdFx0XHRcdH0pKTtcblx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGxldCB0b3VjaE1vdmUgPSAoZXZ0OiBUb3VjaEV2ZW50LCB0b3VjaDogVG91Y2gpID0+IHtcblx0XHRcdC8vIElmIHdlIGV2ZXIgbW92ZSBieSBtb3JlIHRoYW4gNXB4LCBiYWlsXG5cdFx0XHRsZXQgZHggPSB0b3VjaC5jbGllbnRYIC0gdG91Y2hTdGFydFg7XG5cdFx0XHRsZXQgZHkgPSB0b3VjaC5jbGllbnRZIC0gdG91Y2hTdGFydFk7XG5cdFx0XHRsZXQgZGlzdCA9IGR4ICogZHggKyBkeSAqIGR5O1xuXHRcdFx0aWYgKGRpc3QgPiAyNSkge1xuXHRcdFx0XHRjbGVhbnVwKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGxldCBvblRvdWNoRW5kID0gKGV2dDogVG91Y2hFdmVudCkgPT4ge1xuXHRcdFx0bGV0IHRvdWNoZXMgPSBldnQuY2hhbmdlZFRvdWNoZXM7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0bGV0IHRvdWNoID0gdG91Y2hlc1tpXTtcblx0XHRcdFx0aWYgKHRvdWNoLmlkZW50aWZpZXIgPT09IHRvdWNoSWRlbnRpZmllcikge1xuXHRcdFx0XHRcdHRvdWNoRW5kKGV2dCwgdG91Y2gpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0bGV0IG9uVG91Y2hNb3ZlID0gKGV2dDogVG91Y2hFdmVudCkgPT4ge1xuXHRcdFx0bGV0IHRvdWNoZXMgPSBldnQuY2hhbmdlZFRvdWNoZXM7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0bGV0IHRvdWNoID0gdG91Y2hlc1tpXTtcblx0XHRcdFx0aWYgKHRvdWNoLmlkZW50aWZpZXIgPT09IHRvdWNoSWRlbnRpZmllcikge1xuXHRcdFx0XHRcdHRvdWNoTW92ZShldnQsIHRvdWNoKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Ly8gSWYgZHJhZyBzdGFydHMgb24gdGhpcyBlbGVtZW50IG9yIGEgY29udGFpbmVyIGVsZW1lbnQsIHRoZW4gd2Ugc2hvdWxkIGJhaWxcblx0XHQvLyBhbmQgbGV0IHRoZSBkcmFnIG1hbmFnZXIgaGFuZGxlIGl0LCB0byBiZSBjb25zaXN0ZW50IHdpdGggQW5kcm9pZFxuXHRcdGxldCBvbkRyYWdTdGFydCA9IChldnQ6IERyYWdFdmVudCkgPT4ge1xuXHRcdFx0bGV0IHQgPSBldnQudGFyZ2V0O1xuXHRcdFx0aWYgKHQgaW5zdGFuY2VvZiBOb2RlICYmICh0ID09PSB0YXJnZXQgfHwgdC5jb250YWlucyh0YXJnZXQpKSkge1xuXHRcdFx0XHRjbGVhbnVwKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCBvblRvdWNoRW5kLCB0cnVlKTtcblx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCwgdHJ1ZSk7XG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSwgdHJ1ZSk7XG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBvbkRyYWdTdGFydCwgdHJ1ZSk7XG5cdH0pO1xufVxuXG5sZXQgdG91Y2hNb3VzZURldGVjdG9yID0ge1xuXHRzeDogMCxcblx0c3k6IDAsXG5cdGV4OiAwLFxuXHRleTogMCxcblx0dDogMCxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckZha2VNb3VzZURldGVjdGlvbigpIHtcblx0bGV0IG9uVG91Y2hTdGFydCA9IChldnQ6IFRvdWNoRXZlbnQpID0+IHtcblx0XHRpZiAoZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHR0b3VjaE1vdXNlRGV0ZWN0b3Iuc3ggPSBldnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcblx0XHRcdHRvdWNoTW91c2VEZXRlY3Rvci5zeSA9IGV2dC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xuXHRcdFx0dG91Y2hNb3VzZURldGVjdG9yLnQgPSBEYXRlLm5vdygpO1xuXHRcdH1cblx0fTtcblx0bGV0IG9uVG91Y2hFbmQgPSAoZXZ0OiBUb3VjaEV2ZW50KSA9PiB7XG5cdFx0aWYgKGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0dG91Y2hNb3VzZURldGVjdG9yLmV4ID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XG5cdFx0XHR0b3VjaE1vdXNlRGV0ZWN0b3IuZXkgPSBldnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcblx0XHRcdHRvdWNoTW91c2VEZXRlY3Rvci50ID0gRGF0ZS5ub3coKTtcblx0XHR9XG5cdH07XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvblRvdWNoU3RhcnQsIHRydWUpO1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kLCB0cnVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmFrZU1vdXNlRXZlbnQoZXZ0OiBNb3VzZUV2ZW50KTogYm9vbGVhbiB7XG5cdHJldHVybiB0b3VjaE1vdXNlRGV0ZWN0b3IgJiZcblx0XHREYXRlLm5vdygpIC0gdG91Y2hNb3VzZURldGVjdG9yLnQgPCAxMDAwICYmXG5cdFx0KE1hdGguYWJzKGV2dC5jbGllbnRYIC0gdG91Y2hNb3VzZURldGVjdG9yLnN4KSA8IDUgJiYgTWF0aC5hYnMoZXZ0LmNsaWVudFkgLSB0b3VjaE1vdXNlRGV0ZWN0b3Iuc3kpIDwgNSkgfHxcblx0XHQoTWF0aC5hYnMoZXZ0LmNsaWVudFggLSB0b3VjaE1vdXNlRGV0ZWN0b3IuZXgpIDwgNSAmJiBNYXRoLmFicyhldnQuY2xpZW50WSAtIHRvdWNoTW91c2VEZXRlY3Rvci5leSkgPCA1KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVN5bnRoZXRpY0RyYWcoZWw6IEhUTUxFbGVtZW50LCBjYjogKGV2dDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsIHRhcmdldDogTW91c2VFdmVudCB8IFRvdWNoKSA9PiBudWxsIHwgeyBtb3ZlOiAoZXZ0OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCwgdGFyZ2V0OiBNb3VzZUV2ZW50IHwgVG91Y2gpID0+IGJvb2xlYW4sIGVuZDogKGV2dDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsIHRhcmdldDogTW91c2VFdmVudCB8IFRvdWNoKSA9PiB2b2lkIH0pIHtcblx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGV2dDogTW91c2VFdmVudCkgPT4ge1xuXHRcdGlmIChldnQuYnV0dG9uICE9PSAwKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGlmIChpc0Zha2VNb3VzZUV2ZW50KGV2dCkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgcmVzdWx0ID0gY2IoZXZ0LCBldnQpO1xuXHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0IG9uTW91c2VNb3ZlID0gKGV2dDogTW91c2VFdmVudCkgPT4ge1xuXHRcdFx0bGV0IHJlcyA9IHJlc3VsdC5tb3ZlKGV2dCwgZXZ0KTtcblx0XHRcdGlmICghcmVzKSB7XG5cdFx0XHRcdGNsZWFudXAoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0bGV0IG9uTW91c2VVcCA9IChldnQ6IE1vdXNlRXZlbnQpID0+IHtcblx0XHRcdGNsZWFudXAoKTtcblx0XHRcdHJlc3VsdC5lbmQoZXZ0LCBldnQpO1xuXHRcdH07XG5cblx0XHRsZXQgY2xlYW51cCA9ICgpID0+IHtcblx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcblx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXApO1xuXHRcdH07XG5cblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uTW91c2VVcCk7XG5cdH0pO1xuXG5cdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZXZ0KSA9PiB7XG5cdFx0aWYgKGV2dC50b3VjaGVzLmxlbmd0aCA+IDEpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0bGV0IHRvdWNoID0gZXZ0LnRvdWNoZXNbMF07XG5cblx0XHRsZXQgcmVzdWx0ID0gY2IoZXZ0LCB0b3VjaCk7XG5cdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRsZXQgdG91Y2hJZGVudGlmaWVyID0gdG91Y2guaWRlbnRpZmllcjtcblx0XHRsZXQgZ2V0T3duVG91Y2ggPSAoZXZ0OiBUb3VjaEV2ZW50KTogVG91Y2ggfCBudWxsID0+IHtcblx0XHRcdGxldCB0b3VjaGVzID0gZXZ0LmNoYW5nZWRUb3VjaGVzO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGxldCB0b3VjaCA9IHRvdWNoZXNbaV07XG5cdFx0XHRcdGlmICh0b3VjaC5pZGVudGlmaWVyID09PSB0b3VjaElkZW50aWZpZXIpIHtcblx0XHRcdFx0XHRyZXR1cm4gdG91Y2g7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH07XG5cblx0XHRsZXQgb25Ub3VjaEVuZCA9IChldnQ6IFRvdWNoRXZlbnQpID0+IHtcblx0XHRcdGxldCB0b3VjaCA9IGdldE93blRvdWNoKGV2dCk7XG5cdFx0XHRpZiAoIXRvdWNoKSByZXR1cm47XG5cdFx0XHRjbGVhbnVwKCk7XG5cdFx0XHRyZXN1bHQuZW5kKGV2dCwgdG91Y2gpO1xuXHRcdH07XG5cblx0XHRsZXQgb25Ub3VjaENhbmNlbCA9IChldnQ6IFRvdWNoRXZlbnQpID0+IHtcblx0XHRcdGxldCB0b3VjaCA9IGdldE93blRvdWNoKGV2dCk7XG5cdFx0XHRpZiAoIXRvdWNoKSByZXR1cm47XG5cdFx0XHRjbGVhbnVwKCk7XG5cdFx0XHRyZXN1bHQuZW5kKGV2dCwgdG91Y2gpO1xuXHRcdH07XG5cblx0XHRsZXQgb25Ub3VjaE1vdmUgPSAoZXZ0OiBUb3VjaEV2ZW50KSA9PiB7XG5cdFx0XHRsZXQgdG91Y2ggPSBnZXRPd25Ub3VjaChldnQpO1xuXHRcdFx0aWYgKCF0b3VjaCkgcmV0dXJuO1xuXG5cdFx0XHRsZXQgcmVzID0gcmVzdWx0Lm1vdmUoZXZ0LCB0b3VjaCk7XG5cdFx0XHRpZiAoIXJlcykge1xuXHRcdFx0XHRjbGVhbnVwKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGxldCBjbGVhbnVwID0gKCkgPT4ge1xuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCBvblRvdWNoQ2FuY2VsKTtcblx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCk7XG5cdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSk7XG5cdFx0fTtcblxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgb25Ub3VjaENhbmNlbCk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSwge3Bhc3NpdmU6IGZhbHNlfSk7XG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXR0YWNoUmVvcmRlckhhbmRsZXIodGFyZ2V0RWw6IEhUTUxFbGVtZW50LCBwYXJlbnRFbDogSFRNTEVsZW1lbnQsIGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCwgdG9sZXJhbmNlOiBudW1iZXIsIHN0YXJ0OiAoKSA9PiBhbnksIGVuZDogKGluZGV4OiBudW1iZXIpID0+IGFueSkge1xuXHR0b2xlcmFuY2UgPSB0b2xlcmFuY2UgKiB0b2xlcmFuY2U7XG5cblx0Ly8gdGhlIGluZGV4IG9mIHRoZSBvcHRpb24gdG8gdHJhZGUgcGxhY2VzIHdpdGhcblx0ZnVuY3Rpb24gZ2V0RHJvcEluZGV4KGV2dDogTW91c2VFdmVudCB8IFRvdWNoKTogbnVtYmVyIHtcblx0XHRsZXQgeSA9IGV2dC5jbGllbnRZO1xuXHRcdGxldCBpbmRleDtcblxuXHRcdGxldCBjaGlsZHJlbiA9IEFycmF5LmZyb20oY29udGFpbmVyRWwuY2hpbGROb2RlcykgYXMgSFRNTEVsZW1lbnRbXTtcblx0XHRmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBjaGlsZHJlbi5sZW5ndGg7IGluZGV4KyspIHtcblx0XHRcdGxldCBlbCA9IGNoaWxkcmVuW2luZGV4XTtcblx0XHRcdGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRpZiAoeSA8IHJlY3QuYm90dG9tKSB7XG5cdFx0XHRcdHJldHVybiBpbmRleDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gaW5kZXg7XG5cdH1cblxuXHRoYW5kbGVTeW50aGV0aWNEcmFnKHRhcmdldEVsLCAoZXZ0LCB0YXJnZXQpID0+IHtcblx0XHRsZXQgc3RhcnRYID0gdGFyZ2V0LmNsaWVudFg7XG5cdFx0bGV0IHN0YXJ0WSA9IHRhcmdldC5jbGllbnRZO1xuXG5cdFx0bGV0IHJlY3QgPSBwYXJlbnRFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRsZXQgb2Zmc2V0WCA9IHN0YXJ0WCAtIHJlY3QueDtcblx0XHRsZXQgb2Zmc2V0WSA9IHN0YXJ0WSAtIHJlY3QueTtcblx0XHRsZXQgZHJhZ0dob3N0RWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cdFx0bGV0IHBsYWNlaG9sZGVySGVpZ2h0OiBudW1iZXIgPSAwO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdG1vdmU6IChldnQsIHRhcmdldCkgPT4ge1xuXHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0bGV0IHggPSB0YXJnZXQuY2xpZW50WDtcblx0XHRcdFx0bGV0IHkgPSB0YXJnZXQuY2xpZW50WTtcblxuXHRcdFx0XHRpZiAoZHJhZ0dob3N0RWwgPT09IG51bGwpIHtcblx0XHRcdFx0XHRsZXQgZHggPSB4IC0gc3RhcnRYO1xuXHRcdFx0XHRcdGxldCBkeSA9IHkgLSBzdGFydFk7XG5cdFx0XHRcdFx0bGV0IGRpZmYgPSBkeCAqIGR4ICsgZHkgKiBkeTtcblx0XHRcdFx0XHRpZiAoZGlmZiA8IHRvbGVyYW5jZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bGV0IHdpZHRoID0gcGFyZW50RWwub2Zmc2V0V2lkdGg7XG5cdFx0XHRcdFx0bGV0IGhlaWdodCA9IHBsYWNlaG9sZGVySGVpZ2h0ID0gcGFyZW50RWwub2Zmc2V0SGVpZ2h0O1xuXG5cdFx0XHRcdFx0ZHJhZ0dob3N0RWwgPSBjcmVhdGVEaXYoJ2RyYWctZ2hvc3QnKTtcblx0XHRcdFx0XHRsZXQgY2xvbmVFbCA9IHBhcmVudEVsLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcblx0XHRcdFx0XHRkcmFnR2hvc3RFbC5hcHBlbmRDaGlsZChjbG9uZUVsKTtcblx0XHRcdFx0XHRkcmFnR2hvc3RFbC5zdHlsZS5wYWRkaW5nID0gJzAgNXB4Jztcblx0XHRcdFx0XHRkcmFnR2hvc3RFbC5zdHlsZS5tYXhXaWR0aCA9ICd1bnNldCc7XG5cdFx0XHRcdFx0Y2xvbmVFbC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4Jztcblx0XHRcdFx0XHRjbG9uZUVsLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkcmFnR2hvc3RFbCk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hZGRDbGFzcygnaXMtZ3JhYmJpbmcnKTtcblx0XHRcdFx0XHRwYXJlbnRFbC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG5cdFx0XHRcdFx0c3RhcnQoKTtcblxuXHRcdFx0XHRcdGxldCBvdXRlclBvcyA9IGRyYWdHaG9zdEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0XHRcdGxldCBpbm5lclBvcyA9IGNsb25lRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRcdFx0b2Zmc2V0WCArPSBpbm5lclBvcy54IC0gb3V0ZXJQb3MueDtcblx0XHRcdFx0XHRvZmZzZXRZICs9IGlubmVyUG9zLnkgLSBvdXRlclBvcy55O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdC8vIE1lYXN1cmUgdGhlIGRyb3AgbG9jYXRpb24gZmlyc3QgdG8gYXZvaWQgcmVmbG93XG5cdFx0XHRcdGxldCBkcm9wSW5kZXggPSBnZXREcm9wSW5kZXgodGFyZ2V0KTtcblxuXHRcdFx0XHQvLyBVcGRhdGUgZ2hvc3QgbG9jYXRpb25cblx0XHRcdFx0aWYgKGRyYWdHaG9zdEVsKSB7XG5cdFx0XHRcdFx0ZHJhZ0dob3N0RWwuc3R5bGUubGVmdCA9ICh4IC0gb2Zmc2V0WCkgKyAncHgnO1xuXHRcdFx0XHRcdGRyYWdHaG9zdEVsLnN0eWxlLnRvcCA9ICh5IC0gb2Zmc2V0WSkgKyAncHgnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cGFyZW50RWwuZGV0YWNoKCk7XG5cdFx0XHRcdGxldCBjdXJyZW50SXRlbSA9IGNvbnRhaW5lckVsLmNoaWxkTm9kZXNbZHJvcEluZGV4XTtcblx0XHRcdFx0Y29udGFpbmVyRWwuaW5zZXJ0QmVmb3JlKHBhcmVudEVsLCBjdXJyZW50SXRlbSk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSxcblx0XHRcdGVuZDogKGV2dCwgdGFyZ2V0KSA9PiB7XG5cdFx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRpZiAoIWRyYWdHaG9zdEVsKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IGRyb3BJbmRleCA9IGdldERyb3BJbmRleCh0YXJnZXQpO1xuXG5cdFx0XHRcdGRyYWdHaG9zdEVsLmRldGFjaCgpO1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUNsYXNzKCdpcy1ncmFiYmluZycpO1xuXHRcdFx0XHRwYXJlbnRFbC5zdHlsZS52aXNpYmlsaXR5ID0gJyc7XG5cblx0XHRcdFx0cGFyZW50RWwuZGV0YWNoKCk7XG5cdFx0XHRcdGxldCBjdXJyZW50SXRlbSA9IGNvbnRhaW5lckVsLmNoaWxkTm9kZXNbZHJvcEluZGV4XTtcblx0XHRcdFx0Y29udGFpbmVyRWwuaW5zZXJ0QmVmb3JlKHBhcmVudEVsLCBjdXJyZW50SXRlbSk7XG5cblx0XHRcdFx0ZW5kKGRyb3BJbmRleCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb2JpbGVJbWFnZUxpZ2h0Ym94KHRhcmdldEVsOiBIVE1MSW1hZ2VFbGVtZW50KSB7XG5cdGxldCBpbWFnZUVsID0gdGFyZ2V0RWwuY2xvbmVOb2RlKCkgYXMgSFRNTEltYWdlRWxlbWVudDtcblx0bGV0IGltYWdlVmlld2VyRWwgPSBkb2N1bWVudC5ib2R5LmNyZWF0ZURpdignbW9iaWxlLWltYWdlLXZpZXdlcicpO1xuXHRpbWFnZVZpZXdlckVsLmFwcGVuZENoaWxkKGltYWdlRWwpO1xuXG5cdGxldCB3aWR0aCA9IGltYWdlRWwud2lkdGg7XG5cdGxldCBoZWlnaHQgPSBpbWFnZUVsLmhlaWdodDtcblx0bGV0IG5hdHVyYWxXaWR0aCA9IGltYWdlRWwubmF0dXJhbFdpZHRoO1xuXHRsZXQgbmF0dXJhbEhlaWdodCA9IGltYWdlRWwubmF0dXJhbEhlaWdodDtcblx0bGV0IG1heFNjYWxlID0gNTtcblxuXHRsZXQgeCA9IDA7XG5cdGxldCB5ID0gMDtcblx0bGV0IHNjYWxlID0gMTtcblx0bGV0IGFwcGx5ID0gKCkgPT4ge1xuXHRcdGxldCBmYWN0b3IgPSAoc2NhbGUgLSAxKSAvIHNjYWxlIC8gMjtcblx0XHRsZXQgZXggPSBNYXRoLm1heCgwLCB3aWR0aCAqIGZhY3Rvcik7XG5cdFx0bGV0IGV5ID0gTWF0aC5tYXgoMCwgaGVpZ2h0ICogZmFjdG9yKTtcblx0XHR4ID0gTWF0aC5jbGFtcCh4LCAtZXgsIGV4KTtcblx0XHR5ID0gTWF0aC5jbGFtcCh5LCAtZXksIGV5KTtcblx0XHRzY2FsZSA9IE1hdGguY2xhbXAoc2NhbGUsIDEsIG1heFNjYWxlKTtcblx0XHRpbWFnZUVsLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3NjYWxlfSkgdHJhbnNsYXRlKCR7eH1weCwgJHt5fXB4KWA7XG5cdH07XG5cblx0bGV0IHZlbG9jaXR5ID0gMDtcblx0bGV0IGFuZ2xlID0gMDtcblx0bGV0IGZyYW1lVGltZSA9IDA7XG5cdGxldCBpbmVydGlhbFRpbWVyID0gMDtcblxuXHRsZXQgaW5lcnRpYSA9ICgpID0+IHtcblx0XHRjYW5jZWxBbmltYXRpb25GcmFtZShpbmVydGlhbFRpbWVyKTtcblx0XHRsZXQgbmV3RnJhbWVUaW1lID0gRGF0ZS5ub3coKTtcblx0XHRsZXQgZHQgPSBuZXdGcmFtZVRpbWUgLSBmcmFtZVRpbWU7XG5cdFx0eCArPSBNYXRoLmNvcyhhbmdsZSkgKiB2ZWxvY2l0eSAqIGR0O1xuXHRcdHkgKz0gTWF0aC5zaW4oYW5nbGUpICogdmVsb2NpdHkgKiBkdDtcblx0XHQxO1xuXHRcdGFwcGx5KCk7XG5cdFx0dmVsb2NpdHkgLT0gTWF0aC5taW4oMC4wMDMgKiBkdCwgdmVsb2NpdHkpO1xuXHRcdGlmICh2ZWxvY2l0eSA+IDAuMDEpIHtcblx0XHRcdGZyYW1lVGltZSA9IG5ld0ZyYW1lVGltZTtcblx0XHRcdGluZXJ0aWFsVGltZXIgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoaW5lcnRpYSk7XG5cdFx0fVxuXHR9O1xuXG5cdGltYWdlRWwuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcblx0XHQoe3dpZHRoLCBoZWlnaHQsIG5hdHVyYWxXaWR0aCwgbmF0dXJhbEhlaWdodH0gPSBpbWFnZUVsKTtcblx0XHRtYXhTY2FsZSA9IDIgKiBNYXRoLm1heChuYXR1cmFsV2lkdGggLyB3aWR0aCwgbmF0dXJhbEhlaWdodCAvIGhlaWdodCk7XG5cdFx0aWYgKG1heFNjYWxlIDwgMSkge1xuXHRcdFx0bWF4U2NhbGUgPSAxO1xuXHRcdH1cblx0XHRhcHBseSgpO1xuXHR9KTtcblxuXG5cdGxldCBwcmltYXJ5OiBUb3VjaCB8IG51bGwgPSBudWxsO1xuXHRsZXQgc2Vjb25kYXJ5OiBUb3VjaCB8IG51bGwgPSBudWxsO1xuXHRsZXQgaGFuZGxlciA9IChldnQ6IFRvdWNoRXZlbnQpID0+IHtcblx0XHRjYW5jZWxBbmltYXRpb25GcmFtZShpbmVydGlhbFRpbWVyKTtcblx0XHRsZXQgbmV3RnJhbWVUaW1lID0gRGF0ZS5ub3coKTtcblx0XHRsZXQgZHQgPSBuZXdGcmFtZVRpbWUgLSBmcmFtZVRpbWU7XG5cdFx0bGV0IHRvdWNoZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChldnQudG91Y2hlcykgYXMgVG91Y2hbXTtcblxuXHRcdGxldCBuZXdQcmltYXJ5ID0gbnVsbDtcblx0XHRsZXQgbmV3U2Vjb25kYXJ5ID0gbnVsbDtcblxuXHRcdGZvciAobGV0IHQgb2YgdG91Y2hlcykge1xuXHRcdFx0aWYgKHByaW1hcnkgJiYgdC5pZGVudGlmaWVyID09PSBwcmltYXJ5LmlkZW50aWZpZXIpIHtcblx0XHRcdFx0bmV3UHJpbWFyeSA9IHQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAoc2Vjb25kYXJ5ICYmIHQuaWRlbnRpZmllciA9PT0gc2Vjb25kYXJ5LmlkZW50aWZpZXIpIHtcblx0XHRcdFx0bmV3U2Vjb25kYXJ5ID0gdDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAobmV3U2Vjb25kYXJ5ICYmICFuZXdQcmltYXJ5KSB7XG5cdFx0XHRwcmltYXJ5ID0gc2Vjb25kYXJ5O1xuXHRcdFx0bmV3UHJpbWFyeSA9IG5ld1NlY29uZGFyeTtcblx0XHRcdHNlY29uZGFyeSA9IG51bGw7XG5cdFx0XHRuZXdTZWNvbmRhcnkgPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmIChuZXdQcmltYXJ5KSB7XG5cdFx0XHR0b3VjaGVzLnJlbW92ZShuZXdQcmltYXJ5KTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodG91Y2hlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRuZXdQcmltYXJ5ID0gdG91Y2hlcy5maXJzdCgpO1xuXHRcdFx0dG91Y2hlcy5zcGxpY2UoMCwgMSk7XG5cdFx0fVxuXG5cdFx0aWYgKG5ld1NlY29uZGFyeSkge1xuXHRcdFx0dG91Y2hlcy5yZW1vdmUobmV3U2Vjb25kYXJ5KTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodG91Y2hlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRuZXdTZWNvbmRhcnkgPSB0b3VjaGVzLmZpcnN0KCk7XG5cdFx0XHR0b3VjaGVzLnNwbGljZSgwLCAxKTtcblx0XHR9XG5cblx0XHRpZiAocHJpbWFyeSAmJiBuZXdQcmltYXJ5ICYmIHByaW1hcnkuaWRlbnRpZmllciA9PT0gbmV3UHJpbWFyeS5pZGVudGlmaWVyKSB7XG5cdFx0XHRsZXQgdncgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5cdFx0XHRsZXQgdmggPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xuXG5cdFx0XHRpZiAoc2Vjb25kYXJ5ICYmIG5ld1NlY29uZGFyeSAmJiBzZWNvbmRhcnkuaWRlbnRpZmllciA9PT0gbmV3U2Vjb25kYXJ5LmlkZW50aWZpZXIpIHtcblx0XHRcdFx0bGV0IGN4MSA9IC14ICsgKChwcmltYXJ5LmNsaWVudFggKyBzZWNvbmRhcnkuY2xpZW50WCkgLyAyIC0gdncpIC8gc2NhbGU7XG5cdFx0XHRcdGxldCBjeTEgPSAteSArICgocHJpbWFyeS5jbGllbnRZICsgc2Vjb25kYXJ5LmNsaWVudFkpIC8gMiAtIHZoKSAvIHNjYWxlO1xuXHRcdFx0XHRsZXQgY3gyID0gKG5ld1ByaW1hcnkuY2xpZW50WCArIG5ld1NlY29uZGFyeS5jbGllbnRYKSAvIDI7XG5cdFx0XHRcdGxldCBjeTIgPSAobmV3UHJpbWFyeS5jbGllbnRZICsgbmV3U2Vjb25kYXJ5LmNsaWVudFkpIC8gMjtcblx0XHRcdFx0bGV0IGR4MSA9IHByaW1hcnkuY2xpZW50WCAtIHNlY29uZGFyeS5jbGllbnRYO1xuXHRcdFx0XHRsZXQgZHkxID0gcHJpbWFyeS5jbGllbnRZIC0gc2Vjb25kYXJ5LmNsaWVudFk7XG5cdFx0XHRcdGxldCBkeDIgPSBuZXdQcmltYXJ5LmNsaWVudFggLSBuZXdTZWNvbmRhcnkuY2xpZW50WDtcblx0XHRcdFx0bGV0IGR5MiA9IG5ld1ByaW1hcnkuY2xpZW50WSAtIG5ld1NlY29uZGFyeS5jbGllbnRZO1xuXHRcdFx0XHRsZXQgZDEgPSBkeDEgKiBkeDEgKyBkeTEgKiBkeTE7XG5cdFx0XHRcdGxldCBkMiA9IGR4MiAqIGR4MiArIGR5MiAqIGR5Mjtcblx0XHRcdFx0aWYgKGQxICE9PSAwICYmIGQyICE9PSAwKSB7XG5cdFx0XHRcdFx0bGV0IGRzID0gTWF0aC5zcXJ0KGQyIC8gZDEpO1xuXHRcdFx0XHRcdGxldCBuZXdTY2FsZSA9IHNjYWxlICogZHM7XG5cblx0XHRcdFx0XHR4ID0gKGN4MiAtIHZ3KSAvIG5ld1NjYWxlIC0gY3gxO1xuXHRcdFx0XHRcdHkgPSAoY3kyIC0gdmgpIC8gbmV3U2NhbGUgLSBjeTE7XG5cdFx0XHRcdFx0c2NhbGUgPSBuZXdTY2FsZTtcblx0XHRcdFx0XHRhcHBseSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bGV0IGR4ID0gKG5ld1ByaW1hcnkuY2xpZW50WCAtIHByaW1hcnkuY2xpZW50WCkgLyBzY2FsZTtcblx0XHRcdFx0bGV0IGR5ID0gKG5ld1ByaW1hcnkuY2xpZW50WSAtIHByaW1hcnkuY2xpZW50WSkgLyBzY2FsZTtcblx0XHRcdFx0eCArPSBkeDtcblx0XHRcdFx0eSArPSBkeTtcblx0XHRcdFx0dmVsb2NpdHkgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpIC8gZHQ7XG5cdFx0XHRcdGFuZ2xlID0gTWF0aC5hdGFuMihkeSwgZHgpO1xuXHRcdFx0XHRhcHBseSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByaW1hcnkgPSBuZXdQcmltYXJ5O1xuXHRcdHNlY29uZGFyeSA9IG5ld1NlY29uZGFyeTtcblxuXHRcdGlmICghcHJpbWFyeSAmJiAhc2Vjb25kYXJ5KSB7XG5cdFx0XHRpbmVydGlhbFRpbWVyID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGluZXJ0aWEpO1xuXHRcdH1cblxuXHRcdGZyYW1lVGltZSA9IG5ld0ZyYW1lVGltZTtcblx0fTtcblxuXHRpbWFnZVZpZXdlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBoYW5kbGVyKTtcblx0aW1hZ2VWaWV3ZXJFbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGhhbmRsZXIpO1xuXHRpbWFnZVZpZXdlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGhhbmRsZXIpO1xuXHRpbWFnZVZpZXdlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgaGFuZGxlcik7XG5cdGltYWdlVmlld2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZ0KSA9PiB7XG5cdFx0aW1hZ2VWaWV3ZXJFbC5yZW1vdmUoKTtcblx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRjYW5jZWxBbmltYXRpb25GcmFtZShpbmVydGlhbFRpbWVyKTtcblx0fSk7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGdldFJhd0dpdGh1YlVybChyZXBvOiBzdHJpbmcsIGZpbGU6IHN0cmluZywgYnJhbmNoPzogc3RyaW5nKSB7XG5cdHJldHVybiAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tLycgKyByZXBvICsgJy8nICsgKGJyYW5jaCB8fCAnSEVBRCcpICsgJy8nICsgZmlsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEdpdGh1YlVybChyZXBvOiBzdHJpbmcpIHtcblx0cmV0dXJuICdodHRwczovL2dpdGh1Yi5jb20vJyArIHJlcG87XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHaXRodWJSZWxlYXNlRG93bmxvYWQocmVwbzogc3RyaW5nLCB2ZXJzaW9uOiBzdHJpbmcsIGZpbGU6IHN0cmluZykge1xuXHRyZXR1cm4gJ2h0dHBzOi8vZ2l0aHViLmNvbS8nICsgcmVwbyArICcvcmVsZWFzZXMvZG93bmxvYWQvJyArIHZlcnNpb24gKyAnLycgKyBmaWxlO1xufVxuIiwgImltcG9ydCB7IGdldFJhd0dpdGh1YlVybCB9IGZyb20gJ3NoYXJlZC91dGlsL2dpdGh1Yic7XG5cbmV4cG9ydCBmdW5jdGlvbiByZXF1ZXN0KHVybDogc3RyaW5nLCBkYXRhOiBhbnksIGNhbGxiYWNrOiAoZXJyOiBhbnksIGRhdGE/OiBhbnkpID0+IGFueSkge1xuXHRhamF4KHtcblx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHR1cmw6IHVybCxcblx0XHRkYXRhOiBkYXRhLFxuXHRcdHN1Y2Nlc3M6IChkYXRhKSA9PiB7XG5cdFx0XHRkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblx0XHRcdGlmIChkYXRhLmVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGRhdGEuZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRjYWxsYmFjayhudWxsLCBkYXRhKTtcblx0XHR9LFxuXHRcdGVycm9yOiAoZXJyKSA9PiB7XG5cdFx0XHRpZiAoZXJyLmVycm9yKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGVyci5lcnJvcik7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGNhbGxiYWNrKGVycik7XG5cdFx0fVxuXHR9KTtcbn1cblxuY29uc3QgQ09NTVVOSVRZX1BMVUdJTl9VUkwgPSBnZXRSYXdHaXRodWJVcmwoJ29ic2lkaWFubWQvb2JzaWRpYW4tcmVsZWFzZXMnLCAnY29tbXVuaXR5LXBsdWdpbnMuanNvbicpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q29tbXVuaXR5UGx1Z2lucygpOiBQcm9taXNlPGFueVtdPiB7XG5cdGxldCByZXN1bHQgPSBhd2FpdCBhamF4UHJvbWlzZSh7dXJsOiBDT01NVU5JVFlfUExVR0lOX1VSTH0pO1xuXHRsZXQgYXJyYXkgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG5cdGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBwYXJzZSBjb21tdW5pdHkgcGx1Z2lucy4nKTtcblx0fVxuXHRyZXR1cm4gYXJyYXk7XG59XG5cbmNvbnN0IFBMVUdJTl9TVEFUU19VUkwgPSBnZXRSYXdHaXRodWJVcmwoJ29ic2lkaWFubWQvb2JzaWRpYW4tcmVsZWFzZXMnLCAnY29tbXVuaXR5LXBsdWdpbi1zdGF0cy5qc29uJyk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDb21tdW5pdHlQbHVnaW5TdGF0cygpOiBQcm9taXNlPGFueVtdPiB7XG5cdGxldCByZXN1bHQgPSBhd2FpdCBhamF4UHJvbWlzZSh7dXJsOiBQTFVHSU5fU1RBVFNfVVJMfSk7XG5cblx0dHJ5IHtcblx0XHRsZXQgcmVzdWx0T2JqID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuXHRcdHJldHVybiByZXN1bHRPYmo7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0dGhyb3cgZXJyb3I7XG5cdH1cbn1cblxuY29uc3QgVEhFTUVTX1VSTCA9IGdldFJhd0dpdGh1YlVybCgnb2JzaWRpYW5tZC9vYnNpZGlhbi1yZWxlYXNlcycsICdjb21tdW5pdHktY3NzLXRoZW1lcy5qc29uJyk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDb21tdW5pdHlUaGVtZXMoKTogUHJvbWlzZTxhbnlbXT4ge1xuXHRsZXQgcmVzdWx0ID0gYXdhaXQgYWpheFByb21pc2Uoe3VybDogVEhFTUVTX1VSTH0pO1xuXHRsZXQgYXJyYXkgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG5cdGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBwYXJzZSBjb21tdW5pdHkgdGhlbWVzLicpO1xuXHR9XG5cdHJldHVybiBhcnJheTtcbn1cbiIsICJleHBvcnQgY2xhc3MgVXJsVXRpbCB7XG5cdC8qKlxuXHQgKiBFbmNvZGUgYW4gb2JqZWN0IGludG8gYSBxdWVyeSBzdHJpbmdcblx0ICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHQgKi9cblx0c3RhdGljIGVuY29kZVVybFF1ZXJ5KG9iamVjdDogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgYm9vbGVhbj4pIHtcblx0XHRpZiAoIW9iamVjdCkge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblxuXHRcdGxldCBxdWVyaWVzID0gW107XG5cblx0XHRmb3IgKGxldCBrZXkgaW4gb2JqZWN0KSB7XG5cdFx0XHRpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgJiYgb2JqZWN0W2tleV0pIHtcblx0XHRcdFx0aWYgKG9iamVjdFtrZXldID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0cXVlcmllcy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRxdWVyaWVzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQob2JqZWN0W2tleV0pKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBxdWVyaWVzLmpvaW4oJyYnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWNvZGUgYSBxdWVyeSBzdHJpbmcgaW50byBhbiBvYmplY3Rcblx0ICogQHBhcmFtIHtzdHJpbmd9IHF1ZXJ5XG5cdCAqIEByZXR1cm5zIHtPYmplY3R9XG5cdCAqL1xuXHRzdGF0aWMgZGVjb2RlVXJsUXVlcnkocXVlcnk6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xuXHRcdGxldCBvYmplY3Q6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcblx0XHRpZiAoIXF1ZXJ5IHx8IHF1ZXJ5LnRyaW0oKSA9PT0gJycpIHtcblx0XHRcdHJldHVybiBvYmplY3Q7XG5cdFx0fVxuXHRcdGxldCBxdWVyaWVzID0gcXVlcnkuc3BsaXQoJyYnKTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcXVlcmllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IHBhcnRzID0gcXVlcmllc1tpXS5zcGxpdCgnPScpO1xuXHRcdFx0aWYgKHBhcnRzLmxlbmd0aCA+PSAxICYmIHBhcnRzWzBdKSB7XG5cdFx0XHRcdGxldCBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pO1xuXHRcdFx0XHRpZiAocGFydHMubGVuZ3RoID09PSAyKSB7XG5cdFx0XHRcdFx0b2JqZWN0W2tleV0gPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdG9iamVjdFtrZXldID0gJyc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9XG5cblx0LyoqXG5cdCAqIERlY29kZSBhIFVSTCBpbnRvIHRoZSBwYXRoLCBxdWVyeSBhbmQgaGFzaCBjb21wb25lbnRzXG5cdCAqIEBwYXJhbSB1cmxcblx0ICogQHJldHVybnMge3twYXRoOiBzdHJpbmcsIHF1ZXJ5OiBPYmplY3QsIGhhc2g6IE9iamVjdH19XG5cdCAqL1xuXHRzdGF0aWMgZGVjb2RlVXJsKHVybDogc3RyaW5nKTogeyBwYXRoOiBzdHJpbmcsIHF1ZXJ5OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBib29sZWFuPiwgaGFzaDogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgYm9vbGVhbj4gfSB7XG5cdFx0aWYgKCF1cmwpIHtcblx0XHRcdHVybCA9ICcnO1xuXHRcdH1cblx0XHQvLyBwcm90b2NvbDovL2hvc3QvcGF0aD9xdWVyeSNoYXNoXG5cdFx0bGV0IGhhc2hfc3BsaXQgPSB1cmwuc3BsaXQoJyMnKTtcblx0XHRsZXQgaGFzaCA9IGhhc2hfc3BsaXQubGVuZ3RoID4gMSA/IGhhc2hfc3BsaXRbMV0gOiAnJztcblx0XHRsZXQgcXVlcnlfc3BsaXQgPSBoYXNoX3NwbGl0WzBdLnNwbGl0KCc/Jyk7XG5cdFx0bGV0IHF1ZXJ5ID0gcXVlcnlfc3BsaXQubGVuZ3RoID4gMSA/IHF1ZXJ5X3NwbGl0WzFdIDogJyc7XG5cdFx0bGV0IHBhdGggPSBxdWVyeV9zcGxpdFswXTtcblxuXHRcdHJldHVybiB7cGF0aCwgcXVlcnk6IFVybFV0aWwuZGVjb2RlVXJsUXVlcnkocXVlcnkpLCBoYXNoOiBVcmxVdGlsLmRlY29kZVVybFF1ZXJ5KGhhc2gpfTtcblx0fVxufVxuIiwgImltcG9ydCB7IGNvcHlUZXh0VG9DbGlwYm9hcmQgfSBmcm9tICdzaGFyZWQvdXRpbC9icm93c2VyJztcbmltcG9ydCB7IHJlcXVlc3QgfSBmcm9tICdzdGF0aWMvdXRpbCc7XG5pbXBvcnQgeyBVcmxVdGlsIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWwvdXJsJztcblxuZXhwb3J0IHt9O1xuXG5sZXQgaXNEZXYgPSBsb2NhdGlvbi5ob3N0LnN0YXJ0c1dpdGgoJzEyNy4wLjAuMScpIHx8IGxvY2F0aW9uLmhvc3Quc3RhcnRzV2l0aCgnbG9jYWxob3N0Jyk7XG5sZXQgQkFTRV9VUkwgPSAnaHR0cHM6Ly9hcGkub2JzaWRpYW4ubWQnO1xuaWYgKGlzRGV2KSB7XG5cdEJBU0VfVVJMID0gJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMCc7XG59XG5jb25zdCBVU0VSX0lORk9fVVJMID0gQkFTRV9VUkwgKyAnL3VzZXIvaW5mbyc7XG5jb25zdCBMT0dJTl9VUkwgPSBCQVNFX1VSTCArICcvdXNlci9zaWduaW4nO1xuY29uc3QgU0lHTlVQX1VSTCA9IEJBU0VfVVJMICsgJy91c2VyL3NpZ251cCc7XG5jb25zdCBMT0dPVVRfVVJMID0gQkFTRV9VUkwgKyAnL3VzZXIvc2lnbm91dCc7XG5jb25zdCBGT1JHT1RfUEFTU19VUkwgPSBCQVNFX1VSTCArICcvdXNlci9mb3JnZXRwYXNzJztcbmNvbnN0IFJFU0VUX1BBU1NfVVJMID0gQkFTRV9VUkwgKyAnL3VzZXIvcmVzZXRwYXNzJztcbmNvbnN0IENIQU5HRV9OQU1FX1VSTCA9IEJBU0VfVVJMICsgJy91c2VyL2NoYW5nZW5hbWUnO1xuY29uc3QgQ0hBTkdFX0VNQUlMX1VSTCA9IEJBU0VfVVJMICsgJy91c2VyL2NoYW5nZWVtYWlsJztcbmNvbnN0IENIQU5HRV9QQVNTV09SRF9VUkwgPSBCQVNFX1VSTCArICcvdXNlci9jaGFuZ2VwYXNzJztcbmNvbnN0IERFTEVURV9BQ0NPVU5UX1VSTCA9IEJBU0VfVVJMICsgJy91c2VyL2RlbGV0ZWFjY291bnQnO1xuY29uc3QgTElTVF9TVUJTQ1JJUFRJT05fVVJMID0gQkFTRV9VUkwgKyAnL3N1YnNjcmlwdGlvbi9saXN0JztcbmNvbnN0IFBBWV9VUkwgPSBCQVNFX1VSTCArICcvc3Vic2NyaXB0aW9uL3BheSc7XG5jb25zdCBGSU5JU0hfU1RSSVBFX1VSTCA9IEJBU0VfVVJMICsgJy9zdWJzY3JpcHRpb24vc3RyaXBlL2VuZCc7XG5jb25zdCBDSEVDS19QUklDRV9VUkwgPSBCQVNFX1VSTCArICcvc3Vic2NyaXB0aW9uL3ByaWNlJztcbmNvbnN0IEJJWl9SRU5BTUVfVVJMID0gQkFTRV9VUkwgKyAnL3N1YnNjcmlwdGlvbi9idXNpbmVzcy9yZW5hbWUnO1xuY29uc3QgUkVEVUNFX0NPTU1FUkNJQUxfTElDRU5TRV9VUkwgPSBCQVNFX1VSTCArICcvc3Vic2NyaXB0aW9uL2J1c2luZXNzL3JlZHVjZSc7XG5jb25zdCBVUERBVEVfUExBTl9VUkwgPSBCQVNFX1VSTCArICcvc3Vic2NyaXB0aW9uL3JlbmV3JztcbmNvbnN0IFJFRFVDRV9TSVRFU19VUkwgPSBCQVNFX1VSTCArICcvc3Vic2NyaXB0aW9uL3B1Ymxpc2gvcmVkdWNlJztcbmNvbnN0IEdFVF9QQVlNRU5UX0lORk9fVVJMID0gQkFTRV9VUkwgKyAnL3N1YnNjcmlwdGlvbi9wYXltZW50bWV0aG9kJztcbmNvbnN0IFVQREFURV9QQVlNRU5UX0lORk9fVVJMID0gQkFTRV9VUkwgKyAnL3N1YnNjcmlwdGlvbi9zdHJpcGUvcGF5bWVudG1ldGhvZCc7XG5jb25zdCBDTEFJTV9ESVNDT1JEX1JPTEVfVVJMID0gQkFTRV9VUkwgKyAnL3N1YnNjcmlwdGlvbi9yb2xlL2Rpc2NvcmQnO1xuY29uc3QgQ0xBSU1fRk9SVU1fUk9MRV9VUkwgPSBCQVNFX1VSTCArICcvc3Vic2NyaXB0aW9uL3JvbGUvZm9ydW0nO1xuY29uc3QgTElTVF9JTlZPSUNFU19VUkwgPSBCQVNFX1VSTCArICcvc3Vic2NyaXB0aW9uL2ludm9pY2UvbGlzdCc7XG5jb25zdCBSRVFVRVNUX1JFRlVORF9VUkwgPSBCQVNFX1VSTCArICcvc3Vic2NyaXB0aW9uL2ludm9pY2UvcmVmdW5kJztcbmxldCBTVFJJUEVfUFVCTElDX0tFWSA9ICdwa19saXZlX3ZxZU9ZQURmWVBwcUtEVDVGdEFxQ05CUDAwYTlXRWhZYTYnO1xuaWYgKGlzRGV2KSB7XG5cdFNUUklQRV9QVUJMSUNfS0VZID0gJ3BrX3Rlc3RfeTdDQlA3cUxHNmtTVTlzZGNIVjVTMmRiMDA1Mk9DNHdSOCc7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUhhc2goKSB7XG5cdGlmIChoaXN0b3J5LnB1c2hTdGF0ZSkge1xuXHRcdGhpc3RvcnkucHVzaFN0YXRlKCcnLCBkb2N1bWVudC50aXRsZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0bG9jYXRpb24uaGFzaCA9ICcnO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFByaWNlKHByaWNlOiBudW1iZXIpIHtcblx0bGV0IHBhcnRzID0gKHByaWNlIC8gMTAwKS50b0ZpeGVkKDIpLnRvU3RyaW5nKCkudG9TdHJpbmcoKS5zcGxpdCgnLicpO1xuXHRwYXJ0c1swXSA9IHBhcnRzWzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJyk7XG5cdHJldHVybiBwYXJ0cy5qb2luKCcuJyk7XG59XG5cbmxldCBoYXNoID0gbG9jYXRpb24uaGFzaDtcblxuaWYgKGhhc2ggJiYgaGFzaC5sZW5ndGggPiAxKSB7XG5cdGhhc2ggPSBoYXNoLnN1YnN0cigxKTtcbn1cblxubGV0IHF1ZXJ5ID0gbG9jYXRpb24uc2VhcmNoO1xuXG5pZiAocXVlcnkgJiYgcXVlcnkubGVuZ3RoID4gMSkge1xuXHRxdWVyeSA9IHF1ZXJ5LnN1YnN0cigxKTtcbn1cblxud2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuXHRyZWFkeSgoKSA9PiB7XG5cdFx0bGV0IGxvZ2luRm9ybUVsID0gZmlzaCgnLmxvZ2luLWZvcm0nKTtcblx0XHRsZXQgbG9naW5FcnJvckVsID0gZmlzaCgnLmxvZ2luLWZvcm0gLm1lc3NhZ2UubW9kLWVycm9yJyk7XG5cdFx0bGV0IHNpZ251cEZvcm1FbCA9IGZpc2goJy5zaWdudXAtZm9ybScpO1xuXHRcdGxldCBzaWdudXBFcnJvckVsID0gZmlzaCgnLnNpZ251cC1mb3JtIC5tZXNzYWdlLm1vZC1lcnJvcicpO1xuXHRcdGxldCB3ZWxjb21lRWwgPSBmaXNoKCcud2VsY29tZScpO1xuXHRcdGxldCBlbWFpbEVsID0gZmlzaCgnI2xhYmVsZWQtaW5wdXQtZW1haWwnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdGxldCBwYXNzd29yZEVsID0gZmlzaCgnI2xhYmVsZWQtaW5wdXQtcGFzc3dvcmQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdGxldCBzaWdudXBOYW1lRWwgPSBmaXNoKCcuc2lnbnVwLW5hbWUnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdGxldCBzaWdudXBFbWFpbEVsID0gZmlzaCgnLm9ic2lkaWFuLXNpZ251cC1lbWFpbCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cdFx0bGV0IHNpZ251cFBhc3N3b3JkRWwgPSBmaXNoKCcuc2lnbnVwLXBhc3N3b3JkJykgYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRsZXQgdXNlck5hbWVFbCA9IGZpc2goJy53ZWxjb21lLW5hbWUnKTtcblx0XHRsZXQgdXNlckVtYWlsRWwgPSBmaXNoKCcud2VsY29tZS1lbWFpbCcpO1xuXHRcdGxldCBjaGFuZ2VFbWFpbEJ1dHRvbkVsID0gZmlzaCgnLmpzLWNoYW5nZS1lbWFpbCcpO1xuXHRcdGxldCBjaGFuZ2VFbWFpbE1vZGFsRWwgPSBmaXNoKCcubW9kYWwtY29udGFpbmVyLm1vZC1jaGFuZ2UtZW1haWwnKTtcblx0XHRsZXQgY2hhbmdlRW1haWxOZXdFbWFpbElucHV0RWwgPSBmaXNoKCcuY2hhbmdlLWVtYWlsLW5ldy1lbWFpbCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cdFx0bGV0IGNoYW5nZUVtYWlsUGFzc3dvcmRJbnB1dEVsID0gZmlzaCgnLmNoYW5nZS1lbWFpbC1wYXNzd29yZCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cdFx0bGV0IGNvbmZpcm1DaGFuZ2VFbWFpbEJ1dHRvbkVsID0gZmlzaCgnLmpzLWNvbmZpcm0tY2hhbmdlLWVtYWlsJyk7XG5cdFx0bGV0IGNoYW5nZUVtYWlsRXJyb3JFbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWNoYW5nZS1lbWFpbCAubWVzc2FnZS5tb2QtZXJyb3InKTtcblx0XHRsZXQgY2hhbmdlTmFtZUJ1dHRvbkVsID0gZmlzaCgnLmpzLWNoYW5nZS1uYW1lJyk7XG5cdFx0bGV0IGNoYW5nZU5hbWVNb2RhbEVsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtY2hhbmdlLW5hbWUnKTtcblx0XHRsZXQgY2hhbmdlTmFtZU5ld05hbWVJbnB1dEVsID0gZmlzaCgnLmNoYW5nZS1uYW1lLW5ldy1uYW1lJykgYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRsZXQgY29uZmlybUNoYW5nZU5hbWVCdXR0b25FbCA9IGZpc2goJy5qcy1jb25maXJtLWNoYW5nZS1uYW1lJyk7XG5cdFx0bGV0IGNoYW5nZU5hbWVFcnJvckVsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtY2hhbmdlLW5hbWUgLm1lc3NhZ2UubW9kLWVycm9yJyk7XG5cdFx0bGV0IGNoYW5nZVBhc3N3b3JkQnV0dG9uRWwgPSBmaXNoKCcuanMtY2hhbmdlLXBhc3N3b3JkJyk7XG5cdFx0bGV0IGNoYW5nZVBhc3N3b3JkTW9kYWxFbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWNoYW5nZS1wYXNzd29yZCcpO1xuXHRcdGxldCBjaGFuZ2VQYXNzd29yZE9sZFBhc3N3b3JkSW5wdXRFbCA9IGZpc2goJy5jaGFuZ2UtcGFzc3dvcmQtb2xkLXBhc3N3b3JkJykgYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRsZXQgY2hhbmdlUGFzc3dvcmROZXdQYXNzd29yZElucHV0RWwgPSBmaXNoKCcuY2hhbmdlLXBhc3N3b3JkLW5ldy1wYXNzd29yZCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cdFx0bGV0IGNvbmZpcm1DaGFuZ2VQYXNzd29yZEJ1dHRvbkVsID0gZmlzaCgnLmpzLWNvbmZpcm0tY2hhbmdlLXBhc3N3b3JkJyk7XG5cdFx0bGV0IGNoYW5nZVBhc3N3b3JkRXJyb3JFbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWNoYW5nZS1wYXNzd29yZCAubWVzc2FnZS5tb2QtZXJyb3InKTtcblx0XHRsZXQgZGVsZXRlQWNjb3VudEJ1dHRvbkVsID0gZmlzaCgnLmpzLWRlbGV0ZS1hY2NvdW50Jyk7XG5cdFx0bGV0IGRlbGV0ZUFjY291bnRNb2RhbEVsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtZGVsZXRlLWFjY291bnQnKTtcblx0XHRsZXQgZGVsZXRlQWNjb3VudFBhc3N3b3JkSW5wdXRFbCA9IGZpc2goJy5kZWxldGUtYWNjb3VudC1wYXNzd29yZCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cdFx0bGV0IGRlbGV0ZUFjY291bnRFbWFpbElucHV0RWwgPSBmaXNoKCcuZGVsZXRlLWFjY291bnQtZW1haWwnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdGxldCBjb25maXJtRGVsZXRlQWNjb3VudEJ1dHRvbkVsID0gZmlzaCgnLmpzLWNvbmZpcm0tZGVsZXRlLWFjY291bnQnKTtcblx0XHRsZXQgZGVsZXRlQWNjb3VudEVycm9yRWwgPSBmaXNoKCcubW9kYWwtY29udGFpbmVyLm1vZC1kZWxldGUtYWNjb3VudCAubWVzc2FnZS5tb2QtZXJyb3InKTtcblx0XHRsZXQgY2hhbmdlSW5mb1N1Y2Nlc3NNb2RhbEVsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtY2hhbmdlLWluZm8tc3VjY2VzcycpO1xuXHRcdGxldCBsb2dvdXRCdXR0b25FbCA9IGZpc2goJy5qcy1sb2dvdXQnKTtcblx0XHRsZXQgZ2V0UHVibGlzaENhcmRFbCA9IGZpc2goJy5jYXJkLm1vZC1wdWJsaXNoJyk7XG5cdFx0bGV0IGdldFN5bmNDYXJkRWwgPSBmaXNoKCcuY2FyZC5tb2Qtc3luYycpO1xuXHRcdGxldCBwdWJsaXNoQm91Z2h0U2l0ZU51bUVsID0gZmlzaCgnLnB1Ymxpc2gtc2l0ZS1udW0nKTtcblx0XHRsZXQgcHVibGlzaFJlbmV3U2l0ZU51bUVsID0gZmlzaCgnLnB1Ymxpc2gtcmVuZXctc2l0ZS1udW0nKTtcblx0XHRsZXQgcHVibGlzaFJlbmV3VGltZUVsID0gZmlzaEFsbCgnLnB1Ymxpc2gtcmVuZXdhbC10aW1lJyk7XG5cdFx0bGV0IHB1Ymxpc2hSZW5ld0luZm9SZW5ld2luZ0VsID0gZmlzaCgnLnB1Ymxpc2gtcmVuZXctaW5mby1yZW5ld2luZycpO1xuXHRcdGxldCBwdWJsaXNoUmVuZXdJbmZvTm90UmVuZXdpbmdFbCA9IGZpc2goJy5wdWJsaXNoLXJlbmV3LWluZm8tbm90LXJlbmV3aW5nJyk7XG5cdFx0bGV0IHB1Ymxpc2hWaWV3UGF5bWVudExpbmtFbCA9IGZpc2hBbGwoJy5qcy12aWV3LXBheW1lbnQtaW5mbycpO1xuXHRcdGxldCBwdWJsaXNoT3BlbkNoYW5nZVBheW1lbnRCdXR0b25FbCA9IGZpc2hBbGwoJy5qcy1vcGVuLWNoYW5nZS1wYXltZW50Jyk7XG5cdFx0bGV0IGN1cnJlbnRDYXJkSW5mb1RleHRFbCA9IGZpc2goJy5jdXJyZW50LWNhcmQtaW5mbycpO1xuXHRcdGxldCB1cGRhdGVQYXltZW50TWV0aG9kTW9kYWxFbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWNoYW5nZS1wYXltZW50LW1ldGhvZCcpO1xuXHRcdGxldCB1cGRhdGVQYXltZW50TWV0aG9kRm9ybUVsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtY2hhbmdlLXBheW1lbnQtbWV0aG9kIC5wYXltZW50LWZvcm0nKTtcblx0XHRsZXQgcHVibGlzaENoYW5nZU51bU9mU2l0ZXNFbCA9IGZpc2goJy5qcy1jaGFuZ2UtbnVtYmVyLW9mLXB1Ymxpc2gtc2l0ZXMnKTtcblx0XHRsZXQgcHVibGlzaFJlZHVjZU51bU9mU2l0ZXNFbCA9IGZpc2goJy5qcy1yZWR1Y2UtbnVtYmVyLW9mLXB1Ymxpc2gtc2l0ZXMnKTtcblx0XHRsZXQgcHVibGlzaENoYW5nZVRvTW9udGhseUVsID0gZmlzaCgnLmpzLWNoYW5nZS1wdWJsaXNoLXRvLW1vbnRobHknKTtcblx0XHRsZXQgcHVibGlzaENoYW5nZVRvWWVhcmx5RWwgPSBmaXNoKCcuanMtY2hhbmdlLXB1Ymxpc2gtdG8teWVhcmx5Jyk7XG5cdFx0bGV0IHB1Ymxpc2hSZW5ld2FsRnJlcXVlbmN5RWwgPSBmaXNoKCcuc2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uLm1vZC1wdWJsaXNoLWZyZXF1ZW5jeScpO1xuXHRcdGxldCByZWR1Y2VTaXRlTnVtSW5wdXRFbCA9IGZpc2goJy5wdWJsaXNoLXJlZHVjZS1zaXRlcy1udW0nKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdGxldCByZWR1Y2VTaXRlQ29uZmlybUJ1dHRvbkVsID0gZmlzaCgnLmpzLXVwZGF0ZS1yZWR1Y2Utc2l0ZXMnKTtcblx0XHRsZXQgcHVibGlzaFN0b3BSZW5ld2FsRWwgPSBmaXNoKCcuanMtc3RvcC1wdWJsaXNoLWF1dG8tcmVuZXdhbCcpO1xuXHRcdGxldCBjb21tZXJjaWFsTGljZW5zZVBpdGNoRWwgPSBmaXNoKCcuY29tbWVyY2lhbC1saWNlbnNlLXBpdGNoJyk7XG5cdFx0bGV0IGV4aXN0aW5nQ29tbWVyY2lhbExpY2Vuc2VFbCA9IGZpc2goJy5leGlzdGluZy1jb21tZXJjaWFsLWxpY2Vuc2UnKTtcblx0XHRsZXQgYnVzaW5lc3NOYW1lSW5wdXRFbCA9IGZpc2goJy5idXNpbmVzcy1uYW1lLWlucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRsZXQgY29tbWVyY2lhbExpY2Vuc2VLZXlFbCA9IGZpc2goJy5jb21tZXJjaWFsLWxpY2Vuc2Uta2V5Jyk7XG5cdFx0bGV0IGNvbW1lcmNpYWxMaWNlbnNlQ29tcGFueUVsID0gZmlzaCgnLmNvbW1lcmNpYWwtbGljZW5zZS1jb21wYW55LW5hbWUnKTtcblx0XHRsZXQgY29tbWVyY2lhbExpY2Vuc2VTZWF0TnVtYmVyRWwgPSBmaXNoQWxsKCcuY29tbWVyY2lhbC1saWNlbnNlLXNlYXQtbnVtYmVyJyk7XG5cdFx0bGV0IGNvbW1lcmNpYWxMaWNlbnNlQ2FyZEVsID0gZmlzaCgnLmNhcmQubW9kLWNvbW1lcmNpYWwtbGljZW5zZScpO1xuXHRcdGxldCBjb21tZXJjaWFsTGljZW5zZU1vZGFsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtY29tbWVyY2lhbC1saWNlbnNlJyk7XG5cdFx0bGV0IGNvbW1lcmNpYWxMaWNlbnNlVGl0bGUgPSBmaXNoKCcubW9kYWwtY29udGFpbmVyLm1vZC1jb21tZXJjaWFsLWxpY2Vuc2UgLm1vZGFsLXRpdGxlJyk7XG5cdFx0bGV0IHBlcnNvbmFsTGljZW5zZU1vZGFsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtcGVyc29uYWwtbGljZW5zZScpO1xuXHRcdGxldCBwZXJzb25hbExpY2Vuc2VUaWVyRWwgPSBmaXNoKCcuY2F0YWx5c3QtdGllcicpO1xuXHRcdGxldCBwZXJzb25hbExpY2Vuc2VVcGdyYWRlQnV0dG9uRWwgPSBmaXNoKCcuY2F0YWx5c3QtdXBncmFkZS1idXR0b24nKTtcblx0XHRsZXQgY2xvc2VNb2RhbEJ1dHRvbkVscyA9IGZpc2hBbGwoJy5qcy1jbG9zZS1tb2RhbCwgLm1vZGFsLWNsb3NlLWJ1dHRvbiwgLm1vZGFsLWJnJyk7XG5cdFx0bGV0IGJ1eUNhdGFseXN0TGljZW5zZUNhcmRFbCA9IGZpc2goJy5jYXJkLm1vZC1jYXRhbHlzdCcpO1xuXHRcdGxldCBpbnNpZGVyT3B0aW9uRWwgPSBmaXNoKCcuY2FyZFtkYXRhLXRpZXI9XCJpbnNpZGVyXCJdJyk7XG5cdFx0bGV0IHN1cHBvcnRlck9wdGlvbkVsID0gZmlzaCgnLmNhcmRbZGF0YS10aWVyPVwic3VwcG9ydGVyXCJdJyk7XG5cdFx0bGV0IGNhdGFseXN0VGllckNhcmRzRWwgPSBmaXNoQWxsKCcubW9kYWwtY29udGFpbmVyLm1vZC1wZXJzb25hbC1saWNlbnNlIC5jYXJkJyk7XG5cdFx0bGV0IHN0cmlwZUNhdGFseXN0Rm9ybUVsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtcGVyc29uYWwtbGljZW5zZSAucGF5bWVudC1mb3JtJyk7XG5cdFx0bGV0IHN0cmlwZUJpekZvcm1FbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWNvbW1lcmNpYWwtbGljZW5zZSAucGF5bWVudC1mb3JtJyk7XG5cdFx0bGV0IGNvbW1lcmNpYWxMaWNlbnNlUmVuZXdhbFRvZ2dsZUVsID0gZmlzaCgnLmNvbW1lcmNpYWwtbGljZW5zZS1hdXRvLXJlbmV3YWwnKTtcblx0XHRsZXQgc3Bpbm5lckVsID0gZmlzaCgnLmxvYWRlci1jdWJlJyk7XG5cdFx0bGV0IGdvdG9TaWdudXBFbCA9IGZpc2goJy5qcy1nby10by1zaWdudXAnKTtcblx0XHRsZXQgZ290b0xvZ2luRWwgPSBmaXNoKCcuanMtZ28tdG8tbG9naW4nKTtcblx0XHRsZXQgZ290b0ZvcmdvdFBhc3NFbCA9IGZpc2goJy5qcy1nby10by1mb3Jnb3QtcGFzcycpO1xuXHRcdGxldCBmb3Jnb3RQYXNzRm9ybUVsID0gZmlzaCgnLmZvcmdvdC1wYXNzLWZvcm0nKTtcblx0XHRsZXQgZm9yZ290UGFzc1N1Y2Nlc3NNc2dFbCA9IGZpc2goJy5mb3Jnb3QtcGFzcy1mb3JtIC5tZXNzYWdlLm1vZC1zdWNjZXNzJyk7XG5cdFx0bGV0IGZvcmdvdFBhc3NFcnJvck1zZ0VsID0gZmlzaCgnLmZvcmdvdC1wYXNzLWZvcm0gLm1lc3NhZ2UubW9kLWVycm9yJyk7XG5cdFx0bGV0IGZvcmdvdFBhc3N3b3JkSW5wdXRFbCA9IGZpc2goJy5mb3Jnb3QtcGFzcy1lbWFpbCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cdFx0bGV0IHJlc2V0UGFzc0Zvcm1FbCA9IGZpc2goJy5yZXNldC1wYXNzLWZvcm0nKTtcblx0XHRsZXQgcmVzZXRQYXNzRmllbGRDb250YWluZXJFbCA9IGZpc2goJy5mb3Jnb3QtcGFzcy1lbWFpbC1jb250YWluZXInKTtcblx0XHRsZXQgcmVzZXRQYXNzTmV3UGFzc3dvcmRFbCA9IGZpc2goJy5yZXNldC1wYXNzLXBhc3N3b3JkJykgYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRsZXQgcmVzZXRQYXNzU3VjY2Vzc01zZ0VsID0gZmlzaCgnLnJlc2V0LXBhc3MtZm9ybSAubWVzc2FnZS5tb2Qtc3VjY2VzcycpO1xuXHRcdGxldCByZXNldFBhc3NFcnJvck1zZ0VsID0gZmlzaCgnLnJlc2V0LXBhc3MtZm9ybSAubWVzc2FnZS5tb2QtZXJyb3InKTtcblx0XHRsZXQgcmVzZXRQYXNzQnV0dG9uRWwgPSBmaXNoKCcuanMtcmVxdWVzdC1mb3Jnb3QnKTtcblx0XHRsZXQgcGVyc29uYWxMaWNlbnNlUGF5bWVudENvbnRhaW5lckVsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtcGVyc29uYWwtbGljZW5zZSAucGF5bWVudC1jb250YWluZXInKTtcblx0XHRsZXQgY29tbWVyY2lhbExpY2Vuc2VTZWF0RWwgPSBmaXNoKCcuY29tbWVyY2lhbC1saWNlbnNlLXNlYXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdGxldCBwYXltZW50RXJyb3JFbDogSFRNTEVsZW1lbnQgPSBudWxsO1xuXHRcdGxldCBwdWJsaXNoVXBncmFkZUJ1dHRvbkVsID0gZmlzaCgnLmpzLXVwZ3JhZGUtcHVibGlzaCcpO1xuXHRcdGxldCBwdWJsaXNoVXBncmFkZU1vZGFsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtY2hvb3NlLXB1Ymxpc2gtcGxhbicpO1xuXHRcdGxldCBwdWJsaXNoUmVkdWNlU2l0ZXNNb2RhbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLXB1Ymxpc2gtcmVkdWNlLXNpdGVzJyk7XG5cdFx0bGV0IHB1Ymxpc2hWaWV3UGF5bWVudE1ldGhvZE1vZGFsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2Qtdmlldy1wYXltZW50LW1ldGhvZCcpO1xuXHRcdGxldCBwdWJsaXNoUGxhbnNDYXJkc0VsID0gcHVibGlzaFVwZ3JhZGVNb2RhbC5maW5kQWxsKCcuY2FyZCcpO1xuXHRcdGxldCBwdWJsaXNoU2l0ZU51bUVsID0gcHVibGlzaFVwZ3JhZGVNb2RhbC5maW5kKCcucHVibGlzaC1zaXRlcy1udW0nKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdGxldCBzdHJpcGVQdWJsaXNoRm9ybUVsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtY2hvb3NlLXB1Ymxpc2gtcGxhbiAucGF5bWVudC1mb3JtJyk7XG5cdFx0bGV0IHBheXBhbFBheUltYWdlRWwgPSBmaXNoQWxsKCcucGF5cGFsLWJ1dHRvbicpO1xuXHRcdGxldCBwYXlwYWxQYXlNb2RhbEVsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtcGF5cGFsLXBheScpO1xuXHRcdGxldCBvcGVuVW5saW1pdGVkRWwgPSBmaXNoKCcuanMtb3Blbi11bmxpbWl0ZWQnKTtcblx0XHRsZXQgZG9uYXRpb25Nb2RhbEVsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtZG9uYXRpb24nKTtcblx0XHRsZXQgZG9uYXRpb25Gb3JtRWwgPSBmaXNoKCcubW9kYWwtY29udGFpbmVyLm1vZC1kb25hdGlvbiAucGF5bWVudC1mb3JtJyk7XG5cdFx0bGV0IHVubGltaXRlZERvbmF0aW9uQW1vdW50RWwgPSBmaXNoKCcuZG9uYXRpb24tYW1vdW50LWlucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcblx0XHRsZXQgdW5saW1pdGVkRG9uYXRlZEFtb3VudEVsID0gZmlzaCgnLmRvbmF0aW9uLWFtb3VudCcpO1xuXHRcdGxldCBtb2RhbHNFbCA9IGZpc2hBbGwoJy5tb2RhbC1jb250YWluZXInKTtcblx0XHRsZXQgc3luY1VwZ3JhZGVCdXR0b25FbCA9IGZpc2goJy5qcy11cGdyYWRlLXN5bmMnKTtcblx0XHRsZXQgc3luY1VwZ3JhZGVNb2RhbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWNob29zZS1zeW5jLXBsYW4nKTtcblx0XHRsZXQgc3luY1BsYW5zQ2FyZHNFbCA9IHN5bmNVcGdyYWRlTW9kYWwuZmluZEFsbCgnLmNhcmQnKTtcblx0XHRsZXQgc3RyaXBlU3luY0Zvcm1FbCA9IHN5bmNVcGdyYWRlTW9kYWwuZmluZCgnLnBheW1lbnQtZm9ybScpO1xuXHRcdGxldCBzeW5jQ2hhbmdlVG9Nb250aGx5RWwgPSBmaXNoKCcuanMtY2hhbmdlLXN5bmMtdG8tbW9udGhseScpO1xuXHRcdGxldCBzeW5jQ2hhbmdlVG9ZZWFybHlFbCA9IGZpc2goJy5qcy1jaGFuZ2Utc3luYy10by15ZWFybHknKTtcblx0XHRsZXQgc3luY1N0b3BSZW5ld2FsRWwgPSBmaXNoKCcuanMtc3RvcC1zeW5jLWF1dG8tcmVuZXdhbCcpO1xuXHRcdGxldCBzeW5jUmVuZXdUaW1lRWwgPSBmaXNoQWxsKCcuc3luYy1yZW5ld2FsLXRpbWUnKTtcblx0XHRsZXQgc3luY1JlbmV3SW5mb1JlbmV3aW5nRWwgPSBmaXNoKCcuc3luYy1yZW5ldy1pbmZvLXJlbmV3aW5nJyk7XG5cdFx0bGV0IHN5bmNSZW5ld0luZm9Ob3RSZW5ld2luZ0VsID0gZmlzaCgnLnN5bmMtcmVuZXctaW5mby1ub3QtcmVuZXdpbmcnKTtcblx0XHRsZXQgc3luY1JlbmV3YWxGcmVxdWVuY3lFbCA9IGZpc2goJy5zZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb24ubW9kLXN5bmMtZnJlcXVlbmN5Jyk7XG5cdFx0bGV0IGNvbW1lcmNpYWxSZW5ld1RpbWVFbCA9IGZpc2hBbGwoJy5jb21tZXJjaWFsLXJlbmV3YWwtdGltZScpO1xuXHRcdGxldCBjb21tZXJjaWFsUmVzdW1lUmVuZXdhbEVsID0gZmlzaCgnLmpzLXJlc3VtZS1jb21tZXJjaWFsLWF1dG8tcmVuZXdhbCcpO1xuXHRcdGxldCBjb21tZXJjaWFsU3RvcFJlbmV3YWxFbCA9IGZpc2goJy5qcy1zdG9wLWNvbW1lcmNpYWwtYXV0by1yZW5ld2FsJyk7XG5cdFx0bGV0IGNvbW1lcmNpYWxSZW5ld0luZm9SZW5ld2luZ0VsID0gZmlzaCgnLmNvbW1lcmNpYWwtcmVuZXctaW5mby1yZW5ld2luZycpO1xuXHRcdGxldCBjb21tZXJjaWFsUmVuZXdJbmZvTm90UmVuZXdpbmdFbCA9IGZpc2goJy5jb21tZXJjaWFsLXJlbmV3LWluZm8tbm90LXJlbmV3aW5nJyk7XG5cdFx0bGV0IGNvbW1lcmNpYWxMaWNlbnNlRXhwaXJ5RWwgPSBmaXNoQWxsKCcuY29tbWVyY2lhbC1saWNlbnNlLWV4cGlyeS10aW1lJyk7XG5cdFx0bGV0IHRvZ2dsZUVscyA9IGZpc2hBbGwoJy5jaGVja2JveC1jb250YWluZXInKTtcblx0XHRsZXQgY2xhaW1EaXNjb3JkQmFkZ2VCdXR0b25zID0gZmlzaEFsbCgnLmNsYWltLWRpc2NvcmQtYmFkZ2UtYnV0dG9uJyk7XG5cdFx0bGV0IGNsYWltRm9ydW1CYWRnZUJ1dHRvbnMgPSBmaXNoQWxsKCcuY2xhaW0tZm9ydW0tYmFkZ2UtYnV0dG9uJyk7XG5cdFx0bGV0IGRpc2NvcmRTdWNjZXNzTW9kYWwgPSBmaXNoKCcubW9kYWwtY29udGFpbmVyLm1vZC1kaXNjb3JkLXN1Y2Nlc3MnKTtcblx0XHRsZXQgZGlzY29yZEZhaWx1cmVNb2RhbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWRpc2NvcmQtZmFpbHVyZScpO1xuXHRcdGxldCBmb3J1bVN1Y2Nlc3NNb2RhbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWZvcnVtLXN1Y2Nlc3MnKTtcblx0XHRsZXQgZm9ydW1GYWlsdXJlTW9kYWwgPSBmaXNoKCcubW9kYWwtY29udGFpbmVyLm1vZC1mb3J1bS1mYWlsdXJlJyk7XG5cdFx0bGV0IGRpc2NvcmRFcnJvck1lc3NhZ2VFbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWRpc2NvcmQtZmFpbHVyZSAubWVzc2FnZS5tb2QtZXJyb3InKTtcblx0XHRsZXQgZm9ydW1FcnJvck1lc3NhZ2VFbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWZvcnVtLWZhaWx1cmUgLm1lc3NhZ2UubW9kLWVycm9yJyk7XG5cdFx0bGV0IGNhdGFseXN0UGF5bWVudFN1Y2Nlc3NNb2RhbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWNhdGFseXN0LXBheW1lbnQtc3VjY2VzcycpO1xuXHRcdGxldCBwdWJsaXNoUGF5bWVudFN1Y2Nlc3NNb2RhbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLXB1Ymxpc2gtcGF5bWVudC1zdWNjZXNzJyk7XG5cdFx0bGV0IHN5bmNQYXltZW50U3VjY2Vzc01vZGFsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2Qtc3luYy1wYXltZW50LXN1Y2Nlc3MnKTtcblx0XHRsZXQgY29tbWVyY2lhbExpY2Vuc2VDaGFuZ2VTZWF0RWwgPSBmaXNoKCcuanMtY29tbWVyY2lhbC1saWNlbnNlLWNoYW5nZS1zZWF0Jyk7XG5cdFx0bGV0IGNvbW1lcmNpYWxMaWNlbnNlUmVkdWNlU2VhdEVsID0gZmlzaCgnLmpzLWNvbW1lcmNpYWwtbGljZW5zZS1yZWR1Y2Utc2VhdCcpO1xuXHRcdGxldCBjb21tZXJjaWFsTGljZW5zZVJlZHVjZVNlYXRNb2RhbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWNvbW1lcmNpYWwtbGljZW5zZS1yZWR1Y2Utc2VhdHMnKTtcblx0XHRsZXQgY29tbWVyY2lhbExpY2Vuc2VSZWR1Y2VTZWF0SW5wdXRFbCA9IGZpc2goJy5jb21tZXJjaWFsLWxpY2Vuc2UtcmVkdWNlLXNlYXQtaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXHRcdGxldCBjb21tZXJjaWFsTGljZW5zZVJlZHVjZVNlYXRDb25maXJtRWwgPSBmaXNoKCcuanMtdXBkYXRlLXJlZHVjZS1zZWF0cycpO1xuXHRcdGxldCBjb21tZXJjaWFsTGljZW5zZVJlZHVjZVNlYXRFcnJvckVsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtY29tbWVyY2lhbC1saWNlbnNlLXJlZHVjZS1zZWF0cyAucGF5bWVudC1lcnJvcicpO1xuXG5cdFx0bGV0IHN0cmlwZVN0eWxlcyA9IHtcblx0XHRcdGJhc2U6IHtcblx0XHRcdFx0Y29sb3I6ICcjZGNkZGRlJyxcblx0XHRcdFx0aWNvbkNvbG9yOiAnI2RjZGRkZScsXG5cdFx0XHRcdGZvbnRGYW1pbHk6ICdJbnRlciwgc2Fucy1zZXJpZicsXG5cdFx0XHRcdGZvbnRTbW9vdGhpbmc6ICdhbnRpYWxpYXNlZCcsXG5cdFx0XHRcdGZvbnRTaXplOiAnMTZweCcsXG5cdFx0XHRcdCc6OnBsYWNlaG9sZGVyJzoge1xuXHRcdFx0XHRcdGNvbG9yOiAnIzg4ODg4OCdcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGludmFsaWQ6IHtcblx0XHRcdFx0Zm9udEZhbWlseTogJ0ludGVyLCBzYW5zLXNlcmlmJyxcblx0XHRcdFx0Y29sb3I6ICcjZmE3NTVhJyxcblx0XHRcdFx0aWNvbkNvbG9yOiAnI2ZhNzU1YSdcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0bGV0IGNhdGFseXN0TGljZW5zZVRpZXIgPSAnJztcblx0XHRsZXQgYnV5aW5nTGljZW5zZTogc3RyaW5nID0gbnVsbDtcblx0XHRsZXQgYnV5aW5nVmFyaWF0aW9uOiBzdHJpbmcgPSBudWxsO1xuXHRcdGxldCBidXlpbmdSZW5ldzogc3RyaW5nID0gbnVsbDtcblx0XHRsZXQgc2lnbnVwTW9kZSA9IGZhbHNlO1xuXHRcdGxldCByZXNldFBhc3N3b3JkSWQ6IHN0cmluZyA9IG51bGw7XG5cdFx0bGV0IHJlc2V0UGFzc3dvcmRLZXk6IHN0cmluZyA9IG51bGw7XG5cdFx0bGV0IHJlZnJlc2hBZnRlckNsb3NpbmcgPSBmYWxzZTtcblx0XHRsZXQgY29tbWVyY2lhbExpY2Vuc2U6IHsga2V5OiBzdHJpbmcsIGNvbXBhbnk6IHN0cmluZywgc2VhdHM6IG51bWJlciwgZXhwaXJ5OiBudW1iZXIsIHJlbmV3OiBzdHJpbmcgfSA9IG51bGw7XG5cdFx0bGV0IGlzVXBkYXRpbmdDb21tZXJjaWFsTGljZW5zZSA9IGZhbHNlO1xuXG5cdFx0bGV0IHN0cmlwZSA9ICh3aW5kb3cgYXMgYW55KS5TdHJpcGUoU1RSSVBFX1BVQkxJQ19LRVkpO1xuXHRcdGxldCBlbGVtZW50cyA9IHN0cmlwZS5lbGVtZW50cygpO1xuXHRcdGxldCBjYXJkID0gZWxlbWVudHMuY3JlYXRlKCdjYXJkJywge3N0eWxlOiBzdHJpcGVTdHlsZXN9KTtcblx0XHRsZXQgZGVjb2RlZFF1ZXJ5OiBhbnkgPSBudWxsO1xuXG5cdFx0Ly8gU2hvd3MgYSBzdWNjZXNzIG1lc3NhZ2Ugd2hlbiB0aGUgcGF5bWVudCBpcyBjb21wbGV0ZVxuXHRcdGxldCBvcmRlckNvbXBsZXRlID0gZnVuY3Rpb24gKHBheW1lbnRJbnRlbnRJZDogc3RyaW5nKSB7XG5cdFx0XHRyZXF1ZXN0KEZJTklTSF9TVFJJUEVfVVJMLCB7aW50ZW50X2lkOiBwYXltZW50SW50ZW50SWR9LCAoZXJyLCBkYXRhKSA9PiB7XG5cdFx0XHRcdHNldExvYWRpbmcoZmFsc2UpO1xuXG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRwYXltZW50RXJyb3JFbC5zZXRUZXh0KGVycik7XG5cdFx0XHRcdFx0cGF5bWVudEVycm9yRWwuc2hvdygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGxldCBjb21wYW55TmFtZSA9IGJ1c2luZXNzTmFtZUlucHV0RWwudmFsdWU7XG5cdFx0XHRcdFx0aWYgKGJ1eWluZ0xpY2Vuc2UgPT09ICdidXNpbmVzcycgJiYgIWlzVXBkYXRpbmdDb21tZXJjaWFsTGljZW5zZSkge1xuXHRcdFx0XHRcdFx0cmVxdWVzdChCSVpfUkVOQU1FX1VSTCwge2NvbXBhbnk6IGNvbXBhbnlOYW1lfSwgKGVyciwgZGF0YSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0XHRcdFx0cGF5bWVudEVycm9yRWwuc2V0VGV4dChlcnIpO1xuXHRcdFx0XHRcdFx0XHRcdHBheW1lbnRFcnJvckVsLnNob3coKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmIChidXlpbmdMaWNlbnNlID09PSAnY2F0YWx5c3QnKSB7XG5cdFx0XHRcdFx0XHRjbG9zZU1vZGFsKCk7XG5cdFx0XHRcdFx0XHRyZWZyZXNoQWZ0ZXJDbG9zaW5nID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGNhdGFseXN0UGF5bWVudFN1Y2Nlc3NNb2RhbC5zaG93KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKGJ1eWluZ0xpY2Vuc2UgPT09ICdwdWJsaXNoJykge1xuXHRcdFx0XHRcdFx0Y2xvc2VNb2RhbCgpO1xuXHRcdFx0XHRcdFx0cmVmcmVzaEFmdGVyQ2xvc2luZyA9IHRydWU7XG5cdFx0XHRcdFx0XHRwdWJsaXNoUGF5bWVudFN1Y2Nlc3NNb2RhbC5zaG93KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKGJ1eWluZ0xpY2Vuc2UgPT09ICdzeW5jJykge1xuXHRcdFx0XHRcdFx0Y2xvc2VNb2RhbCgpO1xuXHRcdFx0XHRcdFx0cmVmcmVzaEFmdGVyQ2xvc2luZyA9IHRydWU7XG5cdFx0XHRcdFx0XHRzeW5jUGF5bWVudFN1Y2Nlc3NNb2RhbC5zaG93KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKGRlY29kZWRRdWVyeS5wYXltZW50X2ludGVudCkge1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnNlYXJjaCA9ICcnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHRsZXQgY2xvc2VNb2RhbCA9ICgpID0+IHtcblx0XHRcdGlmIChyZWZyZXNoQWZ0ZXJDbG9zaW5nKSB7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y2FyZC51bm1vdW50KCk7XG5cdFx0XHRwZXJzb25hbExpY2Vuc2VQYXltZW50Q29udGFpbmVyRWwuaGlkZSgpO1xuXHRcdFx0bW9kYWxzRWwuZm9yRWFjaChlbCA9PiBlbC5oaWRlKCkpO1xuXHRcdFx0Y2F0YWx5c3RUaWVyQ2FyZHNFbC5mb3JFYWNoKGVsID0+IGVsLnJlbW92ZUNsYXNzKCdpcy1zZWxlY3RlZCcpKTtcblx0XHRcdHJlZnJlc2hBZnRlckNsb3NpbmcgPSBmYWxzZTtcblx0XHR9O1xuXG5cdFx0bGV0IGRlY29kZWRVcmwgPSBVcmxVdGlsLmRlY29kZVVybFF1ZXJ5KGhhc2gpO1xuXHRcdGlmIChkZWNvZGVkVXJsLm1vZGUgJiYgZGVjb2RlZFVybC5tb2RlID09PSAnc2lnbnVwJykge1xuXHRcdFx0cmVtb3ZlSGFzaCgpO1xuXHRcdFx0c3Bpbm5lckVsLmhpZGUoKTtcblx0XHRcdHNpZ251cEZvcm1FbC5zaG93KCk7XG5cdFx0XHRzaWdudXBNb2RlID0gdHJ1ZTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoZGVjb2RlZFVybC5tb2RlICYmIGRlY29kZWRVcmwubW9kZSA9PT0gJ2ZvcmdvdHBhc3MnKSB7XG5cdFx0XHRyZW1vdmVIYXNoKCk7XG5cdFx0XHRzcGlubmVyRWwuaGlkZSgpO1xuXHRcdFx0Zm9yZ290UGFzc0Zvcm1FbC5zaG93KCk7XG5cdFx0XHRzaWdudXBNb2RlID0gdHJ1ZTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoZGVjb2RlZFVybC5oYXNPd25Qcm9wZXJ0eSgnZm9yZ2V0cHcnKSAmJiBkZWNvZGVkVXJsLmlkICYmIGRlY29kZWRVcmwua2V5KSB7XG5cdFx0XHRyZW1vdmVIYXNoKCk7XG5cdFx0XHRyZXNldFBhc3N3b3JkSWQgPSBkZWNvZGVkVXJsLmlkO1xuXHRcdFx0cmVzZXRQYXNzd29yZEtleSA9IGRlY29kZWRVcmwua2V5O1xuXHRcdFx0c3Bpbm5lckVsLmhpZGUoKTtcblx0XHRcdHJlc2V0UGFzc0Zvcm1FbC5zaG93KCk7XG5cdFx0XHRzaWdudXBNb2RlID0gdHJ1ZTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoZGVjb2RlZFVybC5zdHJpcGUgJiYgZGVjb2RlZFVybC5zdHJpcGUgPT09ICdjb21wbGV0ZScpIHtcblx0XHRcdGxldCBwYXltZW50U2Vzc2lvbklkID0gZGVjb2RlZFVybC5zZXNzaW9uO1xuXHRcdFx0aWYgKHBheW1lbnRTZXNzaW9uSWQpIHtcblx0XHRcdFx0Ly8gY29udGludWUgdG8gY2hhcmdlIGZvciBjb21tZXJjaWFsL3BlcnNvbmFsIGxpY2Vuc2Vcblx0XHRcdH1cblx0XHR9XG5cblx0XHRkZWNvZGVkUXVlcnkgPSBVcmxVdGlsLmRlY29kZVVybFF1ZXJ5KHF1ZXJ5KTtcblxuXHRcdC8vIFVzZXIganVzdCBhdXRob3JpemVkIERpc2NvcmQgdG8ga25vdyB0aGVpciBpZGVudGl0eSwgbm93IGdyYW50IHRoZSBiYWRnZXNcblx0XHRpZiAoZGVjb2RlZFF1ZXJ5LmNvZGUpIHtcblx0XHRcdHJlcXVlc3QoQ0xBSU1fRElTQ09SRF9ST0xFX1VSTCwge1xuXHRcdFx0XHRjb2RlOiBkZWNvZGVkUXVlcnkuY29kZVxuXHRcdFx0fSwgKGVyciwgZGF0YSkgPT4ge1xuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0ZGlzY29yZEVycm9yTWVzc2FnZUVsLnNldFRleHQoZXJyKTtcblx0XHRcdFx0XHRkaXNjb3JkRmFpbHVyZU1vZGFsLnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRkaXNjb3JkU3VjY2Vzc01vZGFsLnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgbnVsbCwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRlbHNlIGlmIChkZWNvZGVkUXVlcnkucmVkaXJlY3Rfc3RhdHVzID09PSAnc3VjY2VlZGVkJyAmJiBkZWNvZGVkUXVlcnkucGF5bWVudF9pbnRlbnQpIHtcblx0XHRcdG9yZGVyQ29tcGxldGUoZGVjb2RlZFF1ZXJ5LnBheW1lbnRfaW50ZW50KTtcblx0XHR9XG5cblx0XHRzdHJpcGVDYXRhbHlzdEZvcm1FbC5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGZpc2hBbGwoJy5wYXltZW50LWVycm9yJykuZm9yRWFjaChlID0+IGUuaGlkZSgpKTtcblx0XHRcdC8vIENvbXBsZXRlIHBheW1lbnQgd2hlbiB0aGUgc3VibWl0IGJ1dHRvbiBpcyBjbGlja2VkXG5cdFx0XHQvLyBwYXlXaXRoQ2FyZChzdHJpcGUsIGNhcmQsIGRhdGEuY2xpZW50U2VjcmV0KTtcblx0XHRcdHNldExvYWRpbmcodHJ1ZSk7XG5cdFx0XHRuZXR3b3JrR2V0U3RyaXBlU2VjcmV0KCdjYXJkJywgKHNlY3JldDogc3RyaW5nKSA9PiBwYXlXaXRoQ2FyZChjYXJkLCBzZWNyZXQpKTtcblx0XHR9KTtcblxuXHRcdGZpc2hBbGwoJy53ZWNoYXQtcGF5LWJ1dHRvbicpLmZvckVhY2goZWwgPT4ge1xuXHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRcdGZpc2hBbGwoJy5wYXltZW50LWVycm9yJykuZm9yRWFjaChlID0+IGUuaGlkZSgpKTtcblx0XHRcdFx0c2V0TG9hZGluZyh0cnVlKTtcblx0XHRcdFx0bmV0d29ya0dldFN0cmlwZVNlY3JldCgnd2VjaGF0JywgKHNlY3JldDogc3RyaW5nKSA9PiBwYXlXaXRoV2VjaGF0KHNlY3JldCkpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRmaXNoQWxsKCcuYWxpcGF5LWJ1dHRvbicpLmZvckVhY2goZWwgPT4ge1xuXHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRcdGZpc2hBbGwoJy5wYXltZW50LWVycm9yJykuZm9yRWFjaChlID0+IGUuaGlkZSgpKTtcblx0XHRcdFx0c2V0TG9hZGluZyh0cnVlKTtcblx0XHRcdFx0bmV0d29ya0dldFN0cmlwZVNlY3JldCgnYWxpcGF5JywgKHNlY3JldDogc3RyaW5nKSA9PiBwYXlXaXRoQWxpcGF5KHNlY3JldCkpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRzdHJpcGVCaXpGb3JtRWwuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRmaXNoQWxsKCcucGF5bWVudC1lcnJvcicpLmZvckVhY2goZSA9PiBlLmhpZGUoKSk7XG5cblx0XHRcdGxldCBjb21wYW55TmFtZSA9IGJ1c2luZXNzTmFtZUlucHV0RWwudmFsdWU7XG5cblx0XHRcdGlmICghY29tcGFueU5hbWUgJiYgIWlzVXBkYXRpbmdDb21tZXJjaWFsTGljZW5zZSkge1xuXHRcdFx0XHRwYXltZW50RXJyb3JFbC5zZXRUZXh0KGBQbGVhc2UgZW50ZXIgYSBidXNpbmVzcyBuYW1lLmApO1xuXHRcdFx0XHRwYXltZW50RXJyb3JFbC5zaG93KCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGlzVXBkYXRpbmdDb21tZXJjaWFsTGljZW5zZSkge1xuXHRcdFx0XHRidXlpbmdSZW5ldyA9IGNvbW1lcmNpYWxMaWNlbnNlLnJlbmV3O1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxldCBhdXRvUmVuZXdhbCA9IGNvbW1lcmNpYWxMaWNlbnNlUmVuZXdhbFRvZ2dsZUVsLmhhc0NsYXNzKCdpcy1lbmFibGVkJyk7XG5cblx0XHRcdFx0aWYgKGF1dG9SZW5ld2FsKSB7XG5cdFx0XHRcdFx0YnV5aW5nUmVuZXcgPSAneWVhcmx5Jztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRidXlpbmdSZW5ldyA9ICcnO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIENvbXBsZXRlIHBheW1lbnQgd2hlbiB0aGUgc3VibWl0IGJ1dHRvbiBpcyBjbGlja2VkXG5cdFx0XHQvLyBwYXlXaXRoQ2FyZChzdHJpcGUsIGNhcmQsIGRhdGEuY2xpZW50U2VjcmV0KTtcblx0XHRcdHNldExvYWRpbmcodHJ1ZSk7XG5cdFx0XHRuZXR3b3JrR2V0U3RyaXBlU2VjcmV0KCdjYXJkJywgKHNlY3JldDogc3RyaW5nKSA9PiBwYXlXaXRoQ2FyZChjYXJkLCBzZWNyZXQpKTtcblx0XHR9KTtcblxuXHRcdGxldCBwYXlXaXRoQ2FyZCA9IGZ1bmN0aW9uIChjYXJkOiBzdHJpbmcsIGNsaWVudFNlY3JldDogc3RyaW5nKSB7XG5cdFx0XHRwYXltZW50RXJyb3JFbC5oaWRlKCk7XG5cdFx0XHRzdHJpcGUuY29uZmlybUNhcmRQYXltZW50KGNsaWVudFNlY3JldCwge1xuXHRcdFx0XHRwYXltZW50X21ldGhvZDoge1xuXHRcdFx0XHRcdGNhcmQ6IGNhcmRcblx0XHRcdFx0fVxuXHRcdFx0fSkudGhlbihmdW5jdGlvbiAocmVzdWx0OiBhbnkpIHtcblx0XHRcdFx0aWYgKHJlc3VsdC5lcnJvcikge1xuXHRcdFx0XHRcdC8vIFNob3cgZXJyb3IgdG8geW91ciBjdXN0b21lclxuXHRcdFx0XHRcdHNldExvYWRpbmcoZmFsc2UpO1xuXHRcdFx0XHRcdHBheW1lbnRFcnJvckVsLnNldFRleHQocmVzdWx0LmVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdHBheW1lbnRFcnJvckVsLnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHQvLyBUaGUgcGF5bWVudCBzdWNjZWVkZWQhXG5cdFx0XHRcdFx0b3JkZXJDb21wbGV0ZShyZXN1bHQucGF5bWVudEludGVudC5pZCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHRsZXQgcGF5V2l0aFdlY2hhdCA9IGZ1bmN0aW9uIChjbGllbnRTZWNyZXQ6IHN0cmluZykge1xuXHRcdFx0cGF5bWVudEVycm9yRWwuaGlkZSgpO1xuXHRcdFx0c3RyaXBlLmNvbmZpcm1XZWNoYXRQYXlQYXltZW50KGNsaWVudFNlY3JldCwge1xuXHRcdFx0XHRwYXltZW50X21ldGhvZF9vcHRpb25zOiB7XG5cdFx0XHRcdFx0d2VjaGF0X3BheToge1xuXHRcdFx0XHRcdFx0Y2xpZW50OiAnd2ViJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSkudGhlbihmdW5jdGlvbiAocmVzdWx0OiBhbnkpIHtcblx0XHRcdFx0aWYgKHJlc3VsdC5lcnJvcikge1xuXHRcdFx0XHRcdC8vIFNob3cgZXJyb3IgdG8geW91ciBjdXN0b21lclxuXHRcdFx0XHRcdHNldExvYWRpbmcoZmFsc2UpO1xuXHRcdFx0XHRcdHBheW1lbnRFcnJvckVsLnNldFRleHQocmVzdWx0LmVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdHBheW1lbnRFcnJvckVsLnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHQvLyBUaGUgcGF5bWVudCBzdWNjZWVkZWQhXG5cdFx0XHRcdFx0b3JkZXJDb21wbGV0ZShyZXN1bHQucGF5bWVudEludGVudC5pZCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHRsZXQgcGF5V2l0aEFsaXBheSA9IGZ1bmN0aW9uIChjbGllbnRTZWNyZXQ6IHN0cmluZykge1xuXHRcdFx0cGF5bWVudEVycm9yRWwuaGlkZSgpO1xuXHRcdFx0c3RyaXBlLmNvbmZpcm1BbGlwYXlQYXltZW50KGNsaWVudFNlY3JldCwge1xuXHRcdFx0XHRyZXR1cm5fdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZlxuXHRcdFx0fSkudGhlbihmdW5jdGlvbiAocmVzdWx0OiBhbnkpIHtcblx0XHRcdFx0aWYgKHJlc3VsdC5lcnJvcikge1xuXHRcdFx0XHRcdC8vIFNob3cgZXJyb3IgdG8geW91ciBjdXN0b21lclxuXHRcdFx0XHRcdHNldExvYWRpbmcoZmFsc2UpO1xuXHRcdFx0XHRcdHBheW1lbnRFcnJvckVsLnNldFRleHQocmVzdWx0LmVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdHBheW1lbnRFcnJvckVsLnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHQvLyBUaGUgcGF5bWVudCBzdWNjZWVkZWQhXG5cdFx0XHRcdFx0b3JkZXJDb21wbGV0ZShyZXN1bHQucGF5bWVudEludGVudC5pZCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHRsZXQgdXBkYXRlUHJpY2UgPSBmdW5jdGlvbiAoZGF0YTogYW55LCBjb250YWluZXJFbDogSFRNTEVsZW1lbnQpIHtcblx0XHRcdGxldCBzdWJUb3RhbEVsID0gY29udGFpbmVyRWwuZmluZCgnLnBheW1lbnQtbGluZS5tb2Qtc3VidG90YWwnKTtcblx0XHRcdGxldCBzdWJUb3RhbERlc2NFbCA9IGNvbnRhaW5lckVsLmZpbmQoJy5wYXltZW50LWxpbmUubW9kLXN1YnRvdGFsIC5wYXltZW50LWRlc2MnKTtcblx0XHRcdGxldCBzdWJUb3RhbEFtb3VudEVsID0gY29udGFpbmVyRWwuZmluZCgnLnBheW1lbnQtbGluZS5tb2Qtc3VidG90YWwgLnBheW1lbnQtYW1vdW50Jyk7XG5cdFx0XHRsZXQgZGlzY291bnRFbCA9IGNvbnRhaW5lckVsLmZpbmQoJy5wYXltZW50LWxpbmUubW9kLWRpc2NvdW50Jyk7XG5cdFx0XHRsZXQgZGlzY291bnREZXNjRWwgPSBjb250YWluZXJFbC5maW5kKCcucGF5bWVudC1saW5lLm1vZC1kaXNjb3VudCAucGF5bWVudC1kZXNjJyk7XG5cdFx0XHRsZXQgZGlzY291bnRBbW91bnRFbCA9IGNvbnRhaW5lckVsLmZpbmQoJy5wYXltZW50LWxpbmUubW9kLWRpc2NvdW50IC5wYXltZW50LWFtb3VudCcpO1xuXHRcdFx0bGV0IHRheEVsID0gY29udGFpbmVyRWwuZmluZCgnLnBheW1lbnQtbGluZS5tb2QtdGF4Jyk7XG5cdFx0XHRsZXQgdGF4RGVzY0VsID0gY29udGFpbmVyRWwuZmluZCgnLnBheW1lbnQtbGluZS5tb2QtdGF4IC5wYXltZW50LWRlc2MnKTtcblx0XHRcdGxldCB0YXhBbW91bnRFbCA9IGNvbnRhaW5lckVsLmZpbmQoJy5wYXltZW50LWxpbmUubW9kLXRheCAucGF5bWVudC1hbW91bnQnKTtcblx0XHRcdGxldCBjcmVkaXRFbCA9IGNvbnRhaW5lckVsLmZpbmQoJy5wYXltZW50LWxpbmUubW9kLWNyZWRpdCcpO1xuXHRcdFx0bGV0IGNyZWRpdEFtb3VudEVsID0gY29udGFpbmVyRWwuZmluZCgnLnBheW1lbnQtbGluZS5tb2QtY3JlZGl0IC5wYXltZW50LWFtb3VudCcpO1xuXHRcdFx0bGV0IHRvdGFsRGVzY0VsID0gY29udGFpbmVyRWwuZmluZCgnLnBheW1lbnQtbGluZS5tb2QtdG90YWwgLnBheW1lbnQtZGVzYycpO1xuXHRcdFx0bGV0IHRvdGFsQW1vdW50RWwgPSBjb250YWluZXJFbC5maW5kKCcucGF5bWVudC1saW5lLm1vZC10b3RhbCAucGF5bWVudC1hbW91bnQnKTtcblxuXHRcdFx0bGV0IHtzdWJ0b3RhbCwgZGVzYywgdGF4LCB0YXhEZXNjLCBkaXNjb3VudCwgZGlzY291bnREZXNjLCBjcmVkaXRVc2VkLCB0b3RhbH0gPSBkYXRhO1xuXG5cdFx0XHRpZiAoZGlzY291bnQgPT09IDApIHtcblx0XHRcdFx0ZGlzY291bnRFbC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZGlzY291bnRFbC5zaG93KCk7XG5cdFx0XHRcdGRpc2NvdW50QW1vdW50RWwuc2V0VGV4dChmb3JtYXRQcmljZShkaXNjb3VudCkpO1xuXHRcdFx0XHRkaXNjb3VudERlc2NFbC5zZXRUZXh0KGRpc2NvdW50RGVzYyB8fCAnJyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0YXggPT09IDApIHtcblx0XHRcdFx0dGF4RWwuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRheEVsLnNob3coKTtcblx0XHRcdFx0dGF4QW1vdW50RWwuc2V0VGV4dChmb3JtYXRQcmljZSh0YXgpKTtcblx0XHRcdFx0dGF4RGVzY0VsLnNldFRleHQodGF4RGVzYyB8fCAnJyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzdWJ0b3RhbCA9PT0gdG90YWwgJiYgZGlzY291bnQgPT09IDAgJiYgdGF4ID09PSAwKSB7XG5cdFx0XHRcdHN1YlRvdGFsRWwuaGlkZSgpO1xuXHRcdFx0XHR0b3RhbERlc2NFbC5zZXRUZXh0KGRlc2MpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHN1YlRvdGFsRWwuc2hvdygpO1xuXHRcdFx0XHRzdWJUb3RhbEFtb3VudEVsLnNldFRleHQoZm9ybWF0UHJpY2Uoc3VidG90YWwpKTtcblx0XHRcdFx0c3ViVG90YWxEZXNjRWwuc2V0VGV4dChkZXNjIHx8ICcnKTtcblx0XHRcdFx0dG90YWxEZXNjRWwuc2V0VGV4dCgnVG90YWwnKTtcblx0XHRcdH1cblxuXHRcdFx0Y3JlZGl0QW1vdW50RWwuc2V0VGV4dChmb3JtYXRQcmljZShjcmVkaXRVc2VkKSk7XG5cdFx0XHRjcmVkaXRFbC50b2dnbGUoY3JlZGl0VXNlZCAhPT0gMCk7XG5cblx0XHRcdHRvdGFsQW1vdW50RWwuc2V0VGV4dChmb3JtYXRQcmljZSh0b3RhbCkpO1xuXHRcdH07XG5cblx0XHQvKiAtLS0tLS0tIFVJIGhlbHBlcnMgLS0tLS0tLSAqL1xuXHRcdC8vIFNob3cgYSBzcGlubmVyIG9uIHBheW1lbnQgc3VibWlzc2lvblxuXHRcdGxldCBzZXRMb2FkaW5nID0gZnVuY3Rpb24gKGlzTG9hZGluZzogYm9vbGVhbikge1xuXHRcdFx0aWYgKGlzTG9hZGluZykge1xuXHRcdFx0XHQvLyBEaXNhYmxlIHRoZSBidXR0b24gYW5kIHNob3cgYSBzcGlubmVyXG5cdFx0XHRcdGZpc2hBbGwoJ2J1dHRvbi5zdWJtaXQnKS5mb3JFYWNoKHMgPT4gcy5hZGRDbGFzcygnbW9kLWRpc2FibGVkJykpO1xuXHRcdFx0XHRmaXNoQWxsKCcuc3Bpbm5lcicpLmZvckVhY2gocyA9PiBzLnJlbW92ZUNsYXNzKCdoaWRkZW4nKSk7XG5cdFx0XHRcdGZpc2hBbGwoJy5idXR0b24tdGV4dCcpLmZvckVhY2gocyA9PiBzLmFkZENsYXNzKCdoaWRkZW4nKSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZmlzaEFsbCgnYnV0dG9uLnN1Ym1pdCcpLmZvckVhY2gocyA9PiBzLnJlbW92ZUNsYXNzKCdtb2QtZGlzYWJsZWQnKSk7XG5cdFx0XHRcdGZpc2hBbGwoJy5zcGlubmVyJykuZm9yRWFjaChzID0+IHMuYWRkQ2xhc3MoJ2hpZGRlbicpKTtcblx0XHRcdFx0ZmlzaEFsbCgnLmJ1dHRvbi10ZXh0JykuZm9yRWFjaChzID0+IHMucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0bGV0IHRlc3RMb2dnZWRJbiA9ICgpID0+IHtcblx0XHRcdHJlcXVlc3QoVVNFUl9JTkZPX1VSTCwge30sIChlcnIsIGRhdGEpID0+IHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdGlmICghc2lnbnVwTW9kZSkge1xuXHRcdFx0XHRcdFx0c3Bpbm5lckVsLmhpZGUoKTtcblx0XHRcdFx0XHRcdGxvZ2luRm9ybUVsLnNob3coKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dXNlck5hbWVFbC5zZXRUZXh0KGRhdGEubmFtZSk7XG5cdFx0XHRcdFx0dXNlckVtYWlsRWwuc2V0VGV4dChkYXRhLmVtYWlsKTtcblx0XHRcdFx0XHRpZiAoZGF0YS5kb25hdGlvbikge1xuXHRcdFx0XHRcdFx0dW5saW1pdGVkRG9uYXRlZEFtb3VudEVsLnNldFRleHQoZm9ybWF0UHJpY2UoZGF0YS5kb25hdGlvbikpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzaWdudXBGb3JtRWwuaGlkZSgpO1xuXHRcdFx0XHRcdHNwaW5uZXJFbC5oaWRlKCk7XG5cdFx0XHRcdFx0d2VsY29tZUVsLnNob3coKTtcblxuXHRcdFx0XHRcdGlmIChkYXRhLmxpY2Vuc2UpIHtcblx0XHRcdFx0XHRcdGNhdGFseXN0TGljZW5zZVRpZXIgPSBkYXRhLmxpY2Vuc2U7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGNhdGFseXN0TGljZW5zZVRpZXIpIHtcblx0XHRcdFx0XHRcdGJ1eUNhdGFseXN0TGljZW5zZUNhcmRFbC5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0XHRwZXJzb25hbExpY2Vuc2VUaWVyRWwuc2V0VGV4dChkYXRhLmxpY2Vuc2UpO1xuXG5cdFx0XHRcdFx0XHQvLyBWSVAgY2FuJ3QgdXBncmFkZSBhbnkgbW9yZVxuXHRcdFx0XHRcdFx0aWYgKGNhdGFseXN0TGljZW5zZVRpZXIgIT09ICd2aXAnKSB7XG5cdFx0XHRcdFx0XHRcdHBlcnNvbmFsTGljZW5zZVVwZ3JhZGVCdXR0b25FbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRwYXltZW50RXJyb3JFbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLXBlcnNvbmFsLWxpY2Vuc2UgLnBheW1lbnQtZXJyb3InKTtcblx0XHRcdFx0XHRcdFx0XHRwZXJzb25hbExpY2Vuc2VNb2RhbC5zaG93KCk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRwZXJzb25hbExpY2Vuc2VVcGdyYWRlQnV0dG9uRWwuc2hvdygpO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChjYXRhbHlzdExpY2Vuc2VUaWVyID09PSAnc3VwcG9ydGVyJykge1xuXHRcdFx0XHRcdFx0XHRcdGluc2lkZXJPcHRpb25FbC5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdFx0c3VwcG9ydGVyT3B0aW9uRWwuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2UgaWYgKGNhdGFseXN0TGljZW5zZVRpZXIgPT09ICdpbnNpZGVyJykge1xuXHRcdFx0XHRcdFx0XHRcdGluc2lkZXJPcHRpb25FbC5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGJ1eUNhdGFseXN0TGljZW5zZUNhcmRFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdFx0XHRcdFx0cGF5bWVudEVycm9yRWwgPSBmaXNoKCcubW9kYWwtY29udGFpbmVyLm1vZC1wZXJzb25hbC1saWNlbnNlIC5wYXltZW50LWVycm9yJyk7XG5cdFx0XHRcdFx0XHRcdHBlcnNvbmFsTGljZW5zZU1vZGFsLnNob3coKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdGxldCBnZXRDdXJyZW50U3Vic2NyaXB0aW9uID0gKCkgPT4ge1xuXHRcdFx0cmVxdWVzdChMSVNUX1NVQlNDUklQVElPTl9VUkwsIHt9LCAoZXJyLCBkYXRhKSA9PiB7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhlcnIpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZGF0YS5idXNpbmVzcyAmJiBkYXRhLmJ1c2luZXNzICE9PSBudWxsICYmIGRhdGEuYnVzaW5lc3MuZXhwaXJ5ID49IERhdGUubm93KCkpIHtcblx0XHRcdFx0XHRjb21tZXJjaWFsTGljZW5zZSA9IGRhdGEuYnVzaW5lc3M7XG5cblx0XHRcdFx0XHRjb21tZXJjaWFsTGljZW5zZUtleUVsLnNldFRleHQoY29tbWVyY2lhbExpY2Vuc2Uua2V5KTtcblx0XHRcdFx0XHRjb21tZXJjaWFsTGljZW5zZUNvbXBhbnlFbC5zZXRUZXh0KGNvbW1lcmNpYWxMaWNlbnNlLmNvbXBhbnkpO1xuXHRcdFx0XHRcdGxldCBzZWF0ID0gY29tbWVyY2lhbExpY2Vuc2Uuc2VhdHM7XG5cdFx0XHRcdFx0bGV0IHNlYXRUZXh0ID0gc2VhdCA9PT0gMSA/ICcxIHNlYXQnIDogc2VhdCArICcgc2VhdHMnO1xuXHRcdFx0XHRcdGNvbW1lcmNpYWxMaWNlbnNlU2VhdE51bWJlckVsLmZvckVhY2goZWwgPT4gZWwuc2V0VGV4dChzZWF0VGV4dCkpO1xuXHRcdFx0XHRcdGNvbW1lcmNpYWxMaWNlbnNlRXhwaXJ5RWwuZm9yRWFjaChlbCA9PiBlbC5zZXRUZXh0KChuZXcgRGF0ZShjb21tZXJjaWFsTGljZW5zZS5leHBpcnkpLnRvTG9jYWxlRGF0ZVN0cmluZygpKSkpO1xuXHRcdFx0XHRcdGNvbW1lcmNpYWxMaWNlbnNlUGl0Y2hFbC5oaWRlKCk7XG5cdFx0XHRcdFx0ZXhpc3RpbmdDb21tZXJjaWFsTGljZW5zZUVsLnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRjb21tZXJjaWFsTGljZW5zZUNhcmRFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdFx0XHRcdGJ1eWluZ0xpY2Vuc2UgPSAnYnVzaW5lc3MnO1xuXHRcdFx0XHRcdFx0YnV5aW5nVmFyaWF0aW9uID0gcGFyc2VJbnQoY29tbWVyY2lhbExpY2Vuc2VTZWF0RWwudmFsdWUpLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRwYXltZW50RXJyb3JFbCA9IGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWNvbW1lcmNpYWwtbGljZW5zZSAucGF5bWVudC1lcnJvcicpO1xuXHRcdFx0XHRcdFx0Y29tbWVyY2lhbExpY2Vuc2VNb2RhbC5zaG93KCk7XG5cblx0XHRcdFx0XHRcdGNhcmQubW91bnQoJy5tb2RhbC1jb250YWluZXIubW9kLWNvbW1lcmNpYWwtbGljZW5zZSAuY2FyZC1lbGVtZW50Jyk7XG5cblx0XHRcdFx0XHRcdHVwZGF0ZUJpelByaWNlKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoZGF0YS5wdWJsaXNoKSB7XG5cdFx0XHRcdFx0bGV0IHtzaXRlcywgcmVuZXcsIHJlbmV3X3NpdGVzLCBleHBpcnlfdHMsIGVhcmx5YmlyZH0gPSBkYXRhLnB1Ymxpc2g7XG5cblx0XHRcdFx0XHRpZiAoZXhwaXJ5X3RzID49IERhdGUubm93KCkpIHtcblx0XHRcdFx0XHRcdGdldFB1Ymxpc2hDYXJkRWwuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXG5cdFx0XHRcdFx0XHRpZiAoc2l0ZXMgPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0cHVibGlzaEJvdWdodFNpdGVOdW1FbC5zZXRUZXh0KCcxIHNpdGUnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRwdWJsaXNoQm91Z2h0U2l0ZU51bUVsLnNldFRleHQoYCR7c2l0ZXN9IHNpdGVzYCk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChyZW5ld19zaXRlcyA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRwdWJsaXNoUmVuZXdTaXRlTnVtRWwuc2V0VGV4dCgnMSBzaXRlJyk7XG5cdFx0XHRcdFx0XHRcdHB1Ymxpc2hSZWR1Y2VOdW1PZlNpdGVzRWwuaGlkZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHB1Ymxpc2hSZW5ld1NpdGVOdW1FbC5zZXRUZXh0KGAke3JlbmV3X3NpdGVzfSBzaXRlc2ApO1xuXHRcdFx0XHRcdFx0XHRwdWJsaXNoUmVkdWNlTnVtT2ZTaXRlc0VsLnNob3coKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGV4cGlyeV90cykge1xuXHRcdFx0XHRcdFx0XHRsZXQgZGF0ZSA9IG5ldyBEYXRlKGV4cGlyeV90cyk7XG5cdFx0XHRcdFx0XHRcdHB1Ymxpc2hSZW5ld1RpbWVFbC5mb3JFYWNoKGVsID0+IGVsLnNldFRleHQoYG9uICR7ZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKX1gKSk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHB1Ymxpc2hSZW5ld0luZm9Ob3RSZW5ld2luZ0VsLmhpZGUoKTtcblxuXHRcdFx0XHRcdFx0bGV0IHJlbmV3YWxGcmVxdWVuY3lFbCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRcdFx0XHRcdGlmIChyZW5ldyA9PT0gJ3llYXJseScpIHtcblx0XHRcdFx0XHRcdFx0cHVibGlzaENoYW5nZVRvWWVhcmx5RWwuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRyZW5ld2FsRnJlcXVlbmN5RWwuY3JlYXRlU3Bhbih7dGV4dDogYFlvdVxcJ3JlIGN1cnJlbnRseSBvbiBhIGB9KTtcblx0XHRcdFx0XHRcdFx0cmVuZXdhbEZyZXF1ZW5jeUVsLmNyZWF0ZVNwYW4oe2NsczogJ3UtcG9wJywgdGV4dDogJ3llYXJseSd9KTtcblx0XHRcdFx0XHRcdFx0cmVuZXdhbEZyZXF1ZW5jeUVsLmNyZWF0ZVNwYW4oe3RleHQ6ICcgcGxhbi4nfSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChyZW5ldyA9PT0gJ21vbnRobHknKSB7XG5cdFx0XHRcdFx0XHRcdHB1Ymxpc2hDaGFuZ2VUb01vbnRobHlFbC5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdHJlbmV3YWxGcmVxdWVuY3lFbC5jcmVhdGVTcGFuKHt0ZXh0OiBgWW91XFwncmUgY3VycmVudGx5IG9uIGEgYH0pO1xuXHRcdFx0XHRcdFx0XHRyZW5ld2FsRnJlcXVlbmN5RWwuY3JlYXRlU3Bhbih7Y2xzOiAndS1wb3AnLCB0ZXh0OiAnbW9udGhseSd9KTtcblx0XHRcdFx0XHRcdFx0cmVuZXdhbEZyZXF1ZW5jeUVsLmNyZWF0ZVNwYW4oe3RleHQ6ICcgcGxhbi4nfSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChyZW5ldyA9PT0gJycpIHtcblx0XHRcdFx0XHRcdFx0cHVibGlzaFN0b3BSZW5ld2FsRWwuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRwdWJsaXNoUmVuZXdJbmZvTm90UmVuZXdpbmdFbC5zaG93KCk7XG5cdFx0XHRcdFx0XHRcdHB1Ymxpc2hSZW5ld0luZm9SZW5ld2luZ0VsLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0cmVuZXdhbEZyZXF1ZW5jeUVsLmNyZWF0ZVNwYW4oe3RleHQ6IGBZb3VcXCdyZSBub3QgY3VycmVudGx5IGJlaW5nIHJlbmV3ZWQuYH0pO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRwdWJsaXNoUmVuZXdhbEZyZXF1ZW5jeUVsLmVtcHR5KCk7XG5cdFx0XHRcdFx0XHRwdWJsaXNoUmVuZXdhbEZyZXF1ZW5jeUVsLmFwcGVuZENoaWxkKHJlbmV3YWxGcmVxdWVuY3lFbCk7XG5cblx0XHRcdFx0XHRcdHJlZHVjZVNpdGVOdW1JbnB1dEVsLnZhbHVlID0gc2l0ZXM7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGVhcmx5YmlyZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0ZmlzaCgnLnB1Ymxpc2gteWVhcmx5LXByaWNlLXBlci1tb250aCcpLnNldFRleHQoJzgnKTtcblx0XHRcdFx0XHRcdGZpc2goJy5wdWJsaXNoLXllYXJseS1wcmljZS1wZXIteWVhcicpLnNldFRleHQoJzk2Jyk7XG5cdFx0XHRcdFx0XHRmaXNoKCcucHVibGlzaC1tb250aGx5LXByaWNlLXBlci1tb250aCcpLnNldFRleHQoJzEwJyk7XG5cdFx0XHRcdFx0XHRmaXNoKCcucHVibGlzaC1tb250aGx5LXByaWNlLXBlci15ZWFyJykuc2V0VGV4dCgnMTIwJyk7XG5cblx0XHRcdFx0XHRcdGdldFB1Ymxpc2hDYXJkRWwuYWRkQ2xhc3MoJ2lzLWVhcmx5LWJpcmQnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoZGF0YS5zeW5jKSB7XG5cdFx0XHRcdFx0bGV0IHtyZW5ldywgZXhwaXJ5X3RzLCBlYXJseWJpcmR9ID0gZGF0YS5zeW5jO1xuXG5cdFx0XHRcdFx0aWYgKGV4cGlyeV90cyA+PSBEYXRlLm5vdygpKSB7XG5cdFx0XHRcdFx0XHRnZXRTeW5jQ2FyZEVsLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuXHRcdFx0XHRcdFx0aWYgKGV4cGlyeV90cykge1xuXHRcdFx0XHRcdFx0XHRsZXQgZGF0ZSA9IG5ldyBEYXRlKGV4cGlyeV90cyk7XG5cdFx0XHRcdFx0XHRcdHN5bmNSZW5ld1RpbWVFbC5mb3JFYWNoKGVsID0+IGVsLnNldFRleHQoYG9uICR7ZGF0ZS50b0xvY2FsZURhdGVTdHJpbmcoKX1gKSk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHN5bmNSZW5ld0luZm9Ob3RSZW5ld2luZ0VsLmhpZGUoKTtcblx0XHRcdFx0XHRcdGlmIChyZW5ldyA9PT0gJ3llYXJseScpIHtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKHJlbmV3ID09PSAnbW9udGhseScpIHtcblx0XHRcdFx0XHRcdFx0c3luY0NoYW5nZVRvTW9udGhseUVsLmhpZGUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKHJlbmV3ID09PSAnJykge1xuXHRcdFx0XHRcdFx0XHRzeW5jU3RvcFJlbmV3YWxFbC5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdHN5bmNSZW5ld0luZm9Ob3RSZW5ld2luZ0VsLnNob3coKTtcblx0XHRcdFx0XHRcdFx0c3luY1JlbmV3SW5mb1JlbmV3aW5nRWwuaGlkZSgpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRsZXQgcmVuZXdhbEZyZXF1ZW5jeUVsID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdFx0XHRcdFx0aWYgKHJlbmV3ID09PSAneWVhcmx5Jykge1xuXHRcdFx0XHRcdFx0XHRzeW5jQ2hhbmdlVG9ZZWFybHlFbC5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdHJlbmV3YWxGcmVxdWVuY3lFbC5jcmVhdGVTcGFuKHt0ZXh0OiBgWW91XFwncmUgY3VycmVudGx5IG9uIGEgYH0pO1xuXHRcdFx0XHRcdFx0XHRyZW5ld2FsRnJlcXVlbmN5RWwuY3JlYXRlU3Bhbih7Y2xzOiAndS1wb3AnLCB0ZXh0OiAneWVhcmx5J30pO1xuXHRcdFx0XHRcdFx0XHRyZW5ld2FsRnJlcXVlbmN5RWwuY3JlYXRlU3Bhbih7dGV4dDogJyBwbGFuLid9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKHJlbmV3ID09PSAnbW9udGhseScpIHtcblx0XHRcdFx0XHRcdFx0c3luY0NoYW5nZVRvTW9udGhseUVsLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0cmVuZXdhbEZyZXF1ZW5jeUVsLmNyZWF0ZVNwYW4oe3RleHQ6IGBZb3VcXCdyZSBjdXJyZW50bHkgb24gYSBgfSk7XG5cdFx0XHRcdFx0XHRcdHJlbmV3YWxGcmVxdWVuY3lFbC5jcmVhdGVTcGFuKHtjbHM6ICd1LXBvcCcsIHRleHQ6ICdtb250aGx5J30pO1xuXHRcdFx0XHRcdFx0XHRyZW5ld2FsRnJlcXVlbmN5RWwuY3JlYXRlU3Bhbih7dGV4dDogJyBwbGFuLid9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKHJlbmV3ID09PSAnJykge1xuXHRcdFx0XHRcdFx0XHRzeW5jU3RvcFJlbmV3YWxFbC5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdHN5bmNSZW5ld0luZm9Ob3RSZW5ld2luZ0VsLnNob3coKTtcblx0XHRcdFx0XHRcdFx0c3luY1JlbmV3SW5mb1JlbmV3aW5nRWwuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRyZW5ld2FsRnJlcXVlbmN5RWwuY3JlYXRlU3Bhbih7dGV4dDogYFlvdVxcJ3JlIG5vdCBjdXJyZW50bHkgYmVpbmcgcmVuZXdlZC5gfSk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHN5bmNSZW5ld2FsRnJlcXVlbmN5RWwuZW1wdHkoKTtcblx0XHRcdFx0XHRcdHN5bmNSZW5ld2FsRnJlcXVlbmN5RWwuYXBwZW5kQ2hpbGQocmVuZXdhbEZyZXF1ZW5jeUVsKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoZWFybHliaXJkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRmaXNoKCcuc3luYy15ZWFybHktcHJpY2UtcGVyLW1vbnRoJykuc2V0VGV4dCgnNCcpO1xuXHRcdFx0XHRcdFx0ZmlzaCgnLnN5bmMteWVhcmx5LXByaWNlLXBlci15ZWFyJykuc2V0VGV4dCgnNDgnKTtcblx0XHRcdFx0XHRcdGZpc2goJy5zeW5jLW1vbnRobHktcHJpY2UtcGVyLW1vbnRoJykuc2V0VGV4dCgnNScpO1xuXHRcdFx0XHRcdFx0ZmlzaCgnLnN5bmMtbW9udGhseS1wcmljZS1wZXIteWVhcicpLnNldFRleHQoJzYwJyk7XG5cblx0XHRcdFx0XHRcdGdldFN5bmNDYXJkRWwuYWRkQ2xhc3MoJ2lzLWVhcmx5LWJpcmQnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoZGF0YS5idXNpbmVzcykge1xuXHRcdFx0XHRcdGxldCB7cmVuZXcsIGV4cGlyeX0gPSBkYXRhLmJ1c2luZXNzO1xuXG5cdFx0XHRcdFx0aWYgKGV4cGlyeSA+PSBEYXRlLm5vdygpKSB7XG5cdFx0XHRcdFx0XHRjb21tZXJjaWFsTGljZW5zZUNhcmRFbC5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cblx0XHRcdFx0XHRcdGlmIChleHBpcnkpIHtcblx0XHRcdFx0XHRcdFx0bGV0IGRhdGUgPSBuZXcgRGF0ZShleHBpcnkpO1xuXHRcdFx0XHRcdFx0XHRjb21tZXJjaWFsUmVuZXdUaW1lRWwuZm9yRWFjaChlbCA9PiBlbC5zZXRUZXh0KGBvbiAke2RhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCl9YCkpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb21tZXJjaWFsUmVuZXdJbmZvTm90UmVuZXdpbmdFbC5oaWRlKCk7XG5cdFx0XHRcdFx0XHRpZiAocmVuZXcgPT09ICd5ZWFybHknKSB7XG5cdFx0XHRcdFx0XHRcdGNvbW1lcmNpYWxSZXN1bWVSZW5ld2FsRWwuaGlkZSgpO1xuXHRcdFx0XHRcdFx0XHRjb21tZXJjaWFsU3RvcFJlbmV3YWxFbC5zaG93KCk7XG5cdFx0XHRcdFx0XHRcdGNvbW1lcmNpYWxSZW5ld0luZm9Ob3RSZW5ld2luZ0VsLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0Y29tbWVyY2lhbFJlbmV3SW5mb1JlbmV3aW5nRWwuc2hvdygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAocmVuZXcgPT09ICcnKSB7XG5cdFx0XHRcdFx0XHRcdGNvbW1lcmNpYWxSZXN1bWVSZW5ld2FsRWwuc2hvdygpO1xuXHRcdFx0XHRcdFx0XHRjb21tZXJjaWFsU3RvcFJlbmV3YWxFbC5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdGNvbW1lcmNpYWxSZW5ld0luZm9Ob3RSZW5ld2luZ0VsLnNob3coKTtcblx0XHRcdFx0XHRcdFx0Y29tbWVyY2lhbFJlbmV3SW5mb1JlbmV3aW5nRWwuaGlkZSgpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAocmVuZXcgPT09ICd5ZWFybHknKSB7XG5cdFx0XHRcdFx0XHRcdHN5bmNDaGFuZ2VUb1llYXJseUVsLmhpZGUoKTtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAocmVuZXcgPT09ICcnKSB7XG5cdFx0XHRcdFx0XHRcdGNvbW1lcmNpYWxTdG9wUmVuZXdhbEVsLmhpZGUoKTtcblx0XHRcdFx0XHRcdFx0Y29tbWVyY2lhbFJlbmV3SW5mb05vdFJlbmV3aW5nRWwuc2hvdygpO1xuXHRcdFx0XHRcdFx0XHRjb21tZXJjaWFsUmVuZXdJbmZvUmVuZXdpbmdFbC5oaWRlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0bGV0IGF0dGVtcHRMb2dpbiA9ICgpID0+IHtcblx0XHRcdGxvZ2luRXJyb3JFbC5oaWRlKCk7XG5cdFx0XHRsb2dpbkZvcm1FbC5oaWRlKCk7XG5cdFx0XHRzcGlubmVyRWwuc2hvdygpO1xuXG5cdFx0XHRsZXQgZW1haWwgPSBlbWFpbEVsLnZhbHVlO1xuXHRcdFx0bGV0IHBhc3N3b3JkID0gcGFzc3dvcmRFbC52YWx1ZTtcblx0XHRcdGxldCBzaG93RXJyb3IgPSBmYWxzZTtcblxuXHRcdFx0aWYgKGVtYWlsID09PSAnJykge1xuXHRcdFx0XHRsb2dpbkVycm9yRWwuc2V0VGV4dCgnRW1haWwgY2Fubm90IGJlIGVtcHR5LicpO1xuXHRcdFx0XHRzaG93RXJyb3IgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoZW1haWwuaW5kZXhPZignQCcpID09PSAtMSkge1xuXHRcdFx0XHRsb2dpbkVycm9yRWwuc2V0VGV4dCgnRW1haWwgaXMgbm90IHZhbGlkLicpO1xuXHRcdFx0XHRzaG93RXJyb3IgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocGFzc3dvcmQgPT09ICcnKSB7XG5cdFx0XHRcdGxvZ2luRXJyb3JFbC5zZXRUZXh0KCdQYXNzd29yZCBjYW5ub3QgYmUgZW1wdHkuJyk7XG5cdFx0XHRcdHNob3dFcnJvciA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzaG93RXJyb3IpIHtcblx0XHRcdFx0bG9naW5Gb3JtRWwuc2hvdygpO1xuXHRcdFx0XHRzcGlubmVyRWwuaGlkZSgpO1xuXHRcdFx0XHRsb2dpbkVycm9yRWwuc2hvdygpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHJlcXVlc3QoTE9HSU5fVVJMLCB7XG5cdFx0XHRcdGVtYWlsOiBlbWFpbEVsLnZhbHVlLFxuXHRcdFx0XHRwYXNzd29yZDogcGFzc3dvcmRFbC52YWx1ZVxuXHRcdFx0fSwgKGVyciwgZGF0YSkgPT4ge1xuXHRcdFx0XHRpZiAoIWVycikge1xuXHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRsb2dpbkZvcm1FbC5zaG93KCk7XG5cdFx0XHRcdFx0c3Bpbm5lckVsLmhpZGUoKTtcblxuXHRcdFx0XHRcdGlmIChlcnIgPT09ICdMb2dpbiBmYWlsZWQnKSB7XG5cdFx0XHRcdFx0XHRsb2dpbkVycm9yRWwuc2V0VGV4dCgnTG9naW4gZmFpbGVkLCBwbGVhc2UgZG91YmxlIGNoZWNrIHlvdXIgZW1haWwgYW5kIHBhc3N3b3JkLicpO1xuXHRcdFx0XHRcdFx0bG9naW5FcnJvckVsLnNob3coKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHRsZXQgYXR0ZW1wdFNpZ251cCA9ICgpID0+IHtcblx0XHRcdHNpZ251cEVycm9yRWwuaGlkZSgpO1xuXHRcdFx0c2lnbnVwRm9ybUVsLmhpZGUoKTtcblx0XHRcdHNwaW5uZXJFbC5zaG93KCk7XG5cblx0XHRcdGxldCBuYW1lID0gc2lnbnVwTmFtZUVsLnZhbHVlO1xuXHRcdFx0bGV0IGVtYWlsID0gc2lnbnVwRW1haWxFbC52YWx1ZTtcblx0XHRcdGxldCBwYXNzd29yZCA9IHNpZ251cFBhc3N3b3JkRWwudmFsdWU7XG5cblx0XHRcdGxldCBzaG93RXJyb3IgPSBmYWxzZTtcblxuXHRcdFx0aWYgKG5hbWUgPT09ICcnKSB7XG5cdFx0XHRcdHNpZ251cEVycm9yRWwuc2V0VGV4dCgnTmFtZSBjYW5ub3QgYmUgZW1wdHkuJyk7XG5cdFx0XHRcdHNob3dFcnJvciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChlbWFpbCA9PT0gJycpIHtcblx0XHRcdFx0c2lnbnVwRXJyb3JFbC5zZXRUZXh0KCdFbWFpbCBjYW5ub3QgYmUgZW1wdHkuJyk7XG5cdFx0XHRcdHNob3dFcnJvciA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChlbWFpbC5pbmRleE9mKCdAJykgPT09IC0xKSB7XG5cdFx0XHRcdHNpZ251cEVycm9yRWwuc2V0VGV4dCgnRW1haWwgaXMgbm90IHZhbGlkLicpO1xuXHRcdFx0XHRzaG93RXJyb3IgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocGFzc3dvcmQgPT09ICcnKSB7XG5cdFx0XHRcdHNpZ251cEVycm9yRWwuc2V0VGV4dCgnUGFzc3dvcmQgY2Fubm90IGJlIGVtcHR5LicpO1xuXHRcdFx0XHRzaG93RXJyb3IgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc2hvd0Vycm9yKSB7XG5cdFx0XHRcdHNpZ251cEVycm9yRWwuc2hvdygpO1xuXHRcdFx0XHRzaWdudXBGb3JtRWwuc2hvdygpO1xuXHRcdFx0XHRzcGlubmVyRWwuaGlkZSgpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHJlcXVlc3QoU0lHTlVQX1VSTCwge1xuXHRcdFx0XHRuYW1lLCBlbWFpbCwgcGFzc3dvcmRcblx0XHRcdH0sIChlcnIsIGRhdGEpID0+IHtcblx0XHRcdFx0c2lnbnVwRm9ybUVsLnNob3coKTtcblx0XHRcdFx0c3Bpbm5lckVsLmhpZGUoKTtcblxuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0aWYgKGVyciA9PT0gJ0ludmFsaWQgZW1haWwgYWRkcmVzcycpIHtcblx0XHRcdFx0XHRcdHNpZ251cEVycm9yRWwuc2V0VGV4dCgnVGhlIGVtYWlsIGFkZHJlc3MgeW91IGVudGVyZWQgd2FzIGludmFsaWQuJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKGVyciA9PT0gJ0FscmVhZHkgc2lnbmVkIHVwJykge1xuXHRcdFx0XHRcdFx0c2lnbnVwRXJyb3JFbC5zZXRUZXh0KCdTZWVtcyBsaWtlIHlvdSBhbHJlYWR5IGhhdmUgYW4gYWNjb3VudCEgUGxlYXNlIGxvZyBpbi4nKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzaWdudXBFcnJvckVsLnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHRsZXQgYXR0ZW1wdEZvcmdvdFBhc3N3b3JkID0gKCkgPT4ge1xuXHRcdFx0Zm9yZ290UGFzc0Vycm9yTXNnRWwuaGlkZSgpO1xuXHRcdFx0Zm9yZ290UGFzc1N1Y2Nlc3NNc2dFbC5oaWRlKCk7XG5cblx0XHRcdGxldCBlbWFpbCA9IGZvcmdvdFBhc3N3b3JkSW5wdXRFbC52YWx1ZTtcblxuXHRcdFx0aWYgKCFlbWFpbCkge1xuXHRcdFx0XHRmb3Jnb3RQYXNzRXJyb3JNc2dFbC5zZXRUZXh0KCdQbGVhc2UgZmlsbCBvdXQgeW91ciBlbWFpbC4nKTtcblx0XHRcdFx0Zm9yZ290UGFzc0Vycm9yTXNnRWwuc2hvdygpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChlbWFpbC5pbmRleE9mKCdAJykgPT09IC0xKSB7XG5cdFx0XHRcdGZvcmdvdFBhc3NFcnJvck1zZ0VsLnNldFRleHQoJ0VtYWlsIGFkZHJlc3MgaXMgbm90IHZhbGlkIGFuZCBtdXN0IGNvbnRhaW4gXCJAXCIuJyk7XG5cdFx0XHRcdGZvcmdvdFBhc3NFcnJvck1zZ0VsLnNob3coKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0cmVxdWVzdChGT1JHT1RfUEFTU19VUkwsIHtlbWFpbCwgY2FwdGNoYTogJ2NhcHRjaGEnfSwgKGVyciwgZGF0YSkgPT4ge1xuXHRcdFx0XHRzcGlubmVyRWwuc2hvdygpO1xuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0Zm9yZ290UGFzc0Vycm9yTXNnRWwuc2V0VGV4dCgnU29tZXRoaW5nIHdlbnQgd3JvbmcsIHBsZWFzZSB0cnkgYWdhaW4uJyk7XG5cdFx0XHRcdFx0Zm9yZ290UGFzc0Vycm9yTXNnRWwuc2hvdygpO1xuXHRcdFx0XHRcdHNwaW5uZXJFbC5oaWRlKCk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yZ290UGFzc1N1Y2Nlc3NNc2dFbC5zZXRUZXh0KGBXZSBoYXZlIHNlbnQgYW4gZW1haWwgdG8gJHtlbWFpbH0gdG8gcmVzZXQgeW91ciBwYXNzd29yZC5gKTtcblx0XHRcdFx0Zm9yZ290UGFzc1N1Y2Nlc3NNc2dFbC5zaG93KCk7XG5cdFx0XHRcdHJlc2V0UGFzc0ZpZWxkQ29udGFpbmVyRWwuaGlkZSgpO1xuXHRcdFx0XHRyZXNldFBhc3NCdXR0b25FbC5oaWRlKCk7XG5cdFx0XHRcdHNwaW5uZXJFbC5oaWRlKCk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0bGV0IGF0dGVtcHRSZXNldFBhc3N3b3JkID0gKCkgPT4ge1xuXHRcdFx0cmVzZXRQYXNzU3VjY2Vzc01zZ0VsLmhpZGUoKTtcblx0XHRcdHJlc2V0UGFzc0Vycm9yTXNnRWwuaGlkZSgpO1xuXG5cdFx0XHRsZXQgcGFzc3dvcmQgPSByZXNldFBhc3NOZXdQYXNzd29yZEVsLnZhbHVlO1xuXG5cdFx0XHRpZiAoIXBhc3N3b3JkKSB7XG5cdFx0XHRcdHJlc2V0UGFzc0Vycm9yTXNnRWwuc2V0VGV4dCgnUGxlYXNlIHNldCBhIG5ldyBwYXNzd29yZC4nKTtcblx0XHRcdFx0cmVzZXRQYXNzRXJyb3JNc2dFbC5zaG93KCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0cmVxdWVzdChSRVNFVF9QQVNTX1VSTCwge1xuXHRcdFx0XHRwYXNzd29yZCxcblx0XHRcdFx0aWQ6IHJlc2V0UGFzc3dvcmRJZCxcblx0XHRcdFx0a2V5OiByZXNldFBhc3N3b3JkS2V5XG5cdFx0XHR9LCAoZXJyLCBkYXRhKSA9PiB7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRyZXNldFBhc3NFcnJvck1zZ0VsLnNldFRleHQoJ1NvbWV0aGluZyB3ZW50IHdyb25nLCBwbGVhc2UgdHJ5IGFnYWluLicpO1xuXHRcdFx0XHRcdHJlc2V0UGFzc0Vycm9yTXNnRWwuc2hvdygpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc2V0UGFzc1N1Y2Nlc3NNc2dFbC5pbm5lckhUTUwgPSBgWW91ciBwYXNzd29yZCBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgc2V0LiA8YSBocmVmPVwiL2FjY291bnRcIj5Mb2cgaW48L2E+YDtcblx0XHRcdFx0cmVzZXRQYXNzU3VjY2Vzc01zZ0VsLnNob3coKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHRsZXQgYXR0ZW1wdExvZ291dCA9ICgpID0+IHtcblx0XHRcdHJlcXVlc3QoTE9HT1VUX1VSTCwge30sIChlcnIsIGRhdGEpID0+IHtcblx0XHRcdFx0aWYgKCFlcnIpIHtcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coZGF0YSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHRsZXQgbmV0d29ya0dldFN0cmlwZVNlY3JldCA9IChtZXRob2Q6IHN0cmluZywgY2FsbGJhY2s6IChzZWNyZXQ6IHN0cmluZykgPT4gYW55KSA9PiB7XG5cdFx0XHRyZXF1ZXN0KFBBWV9VUkwsIHtcblx0XHRcdFx0dHlwZTogYnV5aW5nTGljZW5zZSxcblx0XHRcdFx0dmFyaWF0aW9uOiBidXlpbmdWYXJpYXRpb24sXG5cdFx0XHRcdHJlbmV3OiBidXlpbmdSZW5ldyxcblx0XHRcdFx0bWV0aG9kXG5cdFx0XHR9LCAoZXJyLCBkYXRhKSA9PiB7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRwYXltZW50RXJyb3JFbC5zZXRUZXh0KGVycik7XG5cdFx0XHRcdFx0cGF5bWVudEVycm9yRWwuc2hvdygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKGRhdGEuc2VjcmV0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdGxldCB1cGRhdGVCaXpQcmljZSA9ICgpID0+IHtcblx0XHRcdGlmIChpc1VwZGF0aW5nQ29tbWVyY2lhbExpY2Vuc2UpIHtcblx0XHRcdFx0YnV5aW5nVmFyaWF0aW9uID0gKHBhcnNlSW50KGJ1eWluZ1ZhcmlhdGlvbikgKyBjb21tZXJjaWFsTGljZW5zZS5zZWF0cykudG9TdHJpbmcoKTtcblx0XHRcdH1cblxuXHRcdFx0cGF5bWVudEVycm9yRWwuaGlkZSgpO1xuXHRcdFx0cmVxdWVzdChDSEVDS19QUklDRV9VUkwsIHtcblx0XHRcdFx0dHlwZTogYnV5aW5nTGljZW5zZSxcblx0XHRcdFx0dmFyaWF0aW9uOiBidXlpbmdWYXJpYXRpb25cblx0XHRcdH0sIChlcnIsIGRhdGEpID0+IHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdHBheW1lbnRFcnJvckVsLnNldFRleHQoZXJyKTtcblx0XHRcdFx0XHRwYXltZW50RXJyb3JFbC5zaG93KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dXBkYXRlUHJpY2UoZGF0YSwgZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtY29tbWVyY2lhbC1saWNlbnNlJykpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0dGVzdExvZ2dlZEluKCk7XG5cdFx0Z2V0Q3VycmVudFN1YnNjcmlwdGlvbigpO1xuXG5cdFx0bG9nb3V0QnV0dG9uRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRhdHRlbXB0TG9nb3V0KCk7XG5cdFx0fSk7XG5cblx0XHRsZXQgY29weUNvbW1lcmNpYWxMaWNlbnNlS2V5ID0gKCkgPT4ge1xuXHRcdFx0bGV0IGxpY2Vuc2VLZXkgPSBjb21tZXJjaWFsTGljZW5zZUtleUVsLmdldFRleHQoKTtcblx0XHRcdGNvcHlUZXh0VG9DbGlwYm9hcmQobGljZW5zZUtleSk7XG5cdFx0XHRjb21tZXJjaWFsTGljZW5zZUtleUVsLnNldFRleHQoJ0NvcGllZCEnKTtcblx0XHRcdGNvbW1lcmNpYWxMaWNlbnNlS2V5RWwuYWRkQ2xhc3MoJ2lzLWNvcGllZCcpO1xuXHRcdFx0Y29tbWVyY2lhbExpY2Vuc2VLZXlFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGNvcHlDb21tZXJjaWFsTGljZW5zZUtleSk7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0Y29tbWVyY2lhbExpY2Vuc2VLZXlFbC5yZW1vdmVDbGFzcygnaXMtY29waWVkJyk7XG5cdFx0XHRcdGNvbW1lcmNpYWxMaWNlbnNlS2V5RWwuc2V0VGV4dChsaWNlbnNlS2V5KTtcblx0XHRcdFx0Y29tbWVyY2lhbExpY2Vuc2VLZXlFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNvcHlDb21tZXJjaWFsTGljZW5zZUtleSk7XG5cdFx0XHR9LCA1MDApO1xuXHRcdH07XG5cblx0XHRjb21tZXJjaWFsTGljZW5zZUtleUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY29weUNvbW1lcmNpYWxMaWNlbnNlS2V5KTtcblxuXHRcdGNvbW1lcmNpYWxMaWNlbnNlU2VhdEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuXHRcdFx0YnV5aW5nTGljZW5zZSA9ICdidXNpbmVzcyc7XG5cblx0XHRcdGlmIChjb21tZXJjaWFsTGljZW5zZVNlYXRFbC52YWx1ZSA9PT0gJycpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGlzVXBkYXRpbmdDb21tZXJjaWFsTGljZW5zZSAmJiBwYXJzZUludChjb21tZXJjaWFsTGljZW5zZVNlYXRFbC52YWx1ZSkgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgbmV3U2VhdE51bSA9IHBhcnNlSW50KGNvbW1lcmNpYWxMaWNlbnNlU2VhdEVsLnZhbHVlKTtcblxuXHRcdFx0YnV5aW5nVmFyaWF0aW9uID0gbmV3U2VhdE51bS50b1N0cmluZygpO1xuXG5cdFx0XHR1cGRhdGVCaXpQcmljZSgpO1xuXHRcdH0pO1xuXG5cdFx0Y2F0YWx5c3RUaWVyQ2FyZHNFbC5mb3JFYWNoKGVsID0+IHtcblx0XHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0XHRjYXRhbHlzdFRpZXJDYXJkc0VsLmZvckVhY2goZWwgPT4gZWwucmVtb3ZlQ2xhc3MoJ2lzLXNlbGVjdGVkJykpO1xuXHRcdFx0XHRlbC5hZGRDbGFzcygnaXMtc2VsZWN0ZWQnKTtcblxuXHRcdFx0XHRidXlpbmdMaWNlbnNlID0gJ2NhdGFseXN0Jztcblx0XHRcdFx0YnV5aW5nVmFyaWF0aW9uID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRpZXInKTtcblxuXHRcdFx0XHRpZiAoIVsnaW5zaWRlcicsICdzdXBwb3J0ZXInLCAndmlwJ10uY29udGFpbnMoYnV5aW5nVmFyaWF0aW9uKSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlcXVlc3QoQ0hFQ0tfUFJJQ0VfVVJMLCB7XG5cdFx0XHRcdFx0dHlwZTogYnV5aW5nTGljZW5zZSxcblx0XHRcdFx0XHR2YXJpYXRpb246IGJ1eWluZ1ZhcmlhdGlvblxuXHRcdFx0XHR9LCAoZXJyLCBkYXRhKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdFx0cGF5bWVudEVycm9yRWwuc2V0VGV4dChlcnIpO1xuXHRcdFx0XHRcdFx0cGF5bWVudEVycm9yRWwuc2hvdygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHVwZGF0ZVByaWNlKGRhdGEsIGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLXBlcnNvbmFsLWxpY2Vuc2UnKSk7XG5cblx0XHRcdFx0XHRcdHBlcnNvbmFsTGljZW5zZVBheW1lbnRDb250YWluZXJFbC5zaG93KCk7XG5cdFx0XHRcdFx0XHRjYXJkLm1vdW50KCcubW9kYWwtY29udGFpbmVyLm1vZC1wZXJzb25hbC1saWNlbnNlIC5jYXJkLWVsZW1lbnQnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRjbG9zZU1vZGFsQnV0dG9uRWxzLmZvckVhY2goZWwgPT4ge1xuXHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU1vZGFsKTtcblx0XHR9KTtcblxuXHRcdGdvdG9TaWdudXBFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGxvY2F0aW9uLmhhc2ggPSAnI21vZGU9c2lnbnVwJztcblx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdH0pO1xuXG5cdFx0Z290b0xvZ2luRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJyc7XG5cdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHR9KTtcblxuXHRcdGdvdG9Gb3Jnb3RQYXNzRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRsb2NhdGlvbi5oYXNoID0gJyNtb2RlPWZvcmdvdHBhc3MnO1xuXHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0fSk7XG5cblx0XHRsb2dpbkZvcm1FbC5maW5kKCdmb3JtJykuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2dCkgPT4ge1xuXHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhdHRlbXB0TG9naW4oKTtcblx0XHR9KTtcblxuXHRcdHNpZ251cEZvcm1FbC5maW5kKCdmb3JtJykuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2dCkgPT4ge1xuXHRcdFx0ZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhdHRlbXB0U2lnbnVwKCk7XG5cdFx0fSk7XG5cblx0XHRmb3Jnb3RQYXNzRm9ybUVsLmZpbmQoJ2Zvcm0nKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZ0KSA9PiB7XG5cdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGF0dGVtcHRGb3Jnb3RQYXNzd29yZCgpO1xuXHRcdH0pO1xuXG5cdFx0cmVzZXRQYXNzRm9ybUVsLmZpbmQoJ2Zvcm0nKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZ0KSA9PiB7XG5cdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGF0dGVtcHRSZXNldFBhc3N3b3JkKCk7XG5cdFx0fSk7XG5cblx0XHRsZXQgdXBkYXRlUHVibGlzaFByaWNlID0gKCkgPT4ge1xuXHRcdFx0bGV0IHNlbGVjdGVkQ2FyZEVscyA9IHB1Ymxpc2hQbGFuc0NhcmRzRWwuZmlsdGVyKGVsID0+IGVsLmhhc0NsYXNzKCdpcy1zZWxlY3RlZCcpKTtcblx0XHRcdGlmIChzZWxlY3RlZENhcmRFbHMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGxldCByZW5ld2FsID0gc2VsZWN0ZWRDYXJkRWxzWzBdLmdldEF0dHJpYnV0ZSgnZGF0YS1yZW5ldycpO1xuXHRcdFx0bGV0IG51bVNpdGVzID0gcHVibGlzaFNpdGVOdW1FbC52YWx1ZS50b1N0cmluZygpO1xuXG5cdFx0XHRidXlpbmdMaWNlbnNlID0gJ3B1Ymxpc2gnO1xuXHRcdFx0YnV5aW5nVmFyaWF0aW9uID0gbnVtU2l0ZXM7XG5cdFx0XHRidXlpbmdSZW5ldyA9IHJlbmV3YWw7XG5cblx0XHRcdHBheW1lbnRFcnJvckVsLmhpZGUoKTtcblx0XHRcdHJlcXVlc3QoQ0hFQ0tfUFJJQ0VfVVJMLCB7XG5cdFx0XHRcdHR5cGU6ICdwdWJsaXNoJyxcblx0XHRcdFx0cmVuZXc6IHJlbmV3YWwsXG5cdFx0XHRcdHZhcmlhdGlvbjogbnVtU2l0ZXNcblx0XHRcdH0sIChlcnIsIGRhdGEpID0+IHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdHBheW1lbnRFcnJvckVsLnNldFRleHQoZXJyKTtcblx0XHRcdFx0XHRwYXltZW50RXJyb3JFbC5zaG93KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dXBkYXRlUHJpY2UoZGF0YSwgZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtY2hvb3NlLXB1Ymxpc2gtcGxhbicpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdGxldCB1cGRhdGVTeW5jUHJpY2UgPSAoKSA9PiB7XG5cdFx0XHRsZXQgc2VsZWN0ZWRDYXJkRWxzID0gc3luY1BsYW5zQ2FyZHNFbC5maWx0ZXIoZWwgPT4gZWwuaGFzQ2xhc3MoJ2lzLXNlbGVjdGVkJykpO1xuXHRcdFx0aWYgKHNlbGVjdGVkQ2FyZEVscy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0bGV0IHJlbmV3YWwgPSBzZWxlY3RlZENhcmRFbHNbMF0uZ2V0QXR0cmlidXRlKCdkYXRhLXJlbmV3Jyk7XG5cblx0XHRcdGJ1eWluZ0xpY2Vuc2UgPSAnc3luYyc7XG5cdFx0XHRidXlpbmdSZW5ldyA9IHJlbmV3YWw7XG5cblx0XHRcdHBheW1lbnRFcnJvckVsLmhpZGUoKTtcblx0XHRcdHJlcXVlc3QoQ0hFQ0tfUFJJQ0VfVVJMLCB7XG5cdFx0XHRcdHR5cGU6ICdzeW5jJyxcblx0XHRcdFx0cmVuZXc6IHJlbmV3YWxcblx0XHRcdH0sIChlcnIsIGRhdGEpID0+IHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdHBheW1lbnRFcnJvckVsLnNldFRleHQoZXJyKTtcblx0XHRcdFx0XHRwYXltZW50RXJyb3JFbC5zaG93KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dXBkYXRlUHJpY2UoZGF0YSwgc3luY1VwZ3JhZGVNb2RhbCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHRwdWJsaXNoVXBncmFkZUJ1dHRvbkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0cHVibGlzaFVwZ3JhZGVNb2RhbC5zaG93KCk7XG5cdFx0XHRjYXJkLm1vdW50KCcubW9kYWwtY29udGFpbmVyLm1vZC1jaG9vc2UtcHVibGlzaC1wbGFuIC5jYXJkLWVsZW1lbnQnKTtcblxuXHRcdFx0cGF5bWVudEVycm9yRWwgPSBmaXNoKCcubW9kYWwtY29udGFpbmVyLm1vZC1jaG9vc2UtcHVibGlzaC1wbGFuIC5wYXltZW50LWVycm9yJyk7XG5cdFx0XHR1cGRhdGVQdWJsaXNoUHJpY2UoKTtcblx0XHR9KTtcblxuXHRcdHB1Ymxpc2hQbGFuc0NhcmRzRWwuZm9yRWFjaCgoY2FyZEVsKSA9PiB7XG5cdFx0XHRjYXJkRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRcdHB1Ymxpc2hQbGFuc0NhcmRzRWwuZm9yRWFjaChlbCA9PiBlbC5yZW1vdmVDbGFzcygnaXMtc2VsZWN0ZWQnKSk7XG5cdFx0XHRcdGNhcmRFbC5hZGRDbGFzcygnaXMtc2VsZWN0ZWQnKTtcblxuXHRcdFx0XHRwdWJsaXNoVXBncmFkZU1vZGFsLmZpbmQoJy5wYXlwYWwtYnV0dG9uJykudG9nZ2xlKGNhcmRFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVuZXcnKSA9PT0gJ21vbnRobHknKTtcblxuXHRcdFx0XHR1cGRhdGVQdWJsaXNoUHJpY2UoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0cHVibGlzaFNpdGVOdW1FbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG5cdFx0XHR1cGRhdGVQdWJsaXNoUHJpY2UoKTtcblx0XHR9KTtcblxuXHRcdHN0cmlwZVB1Ymxpc2hGb3JtRWwuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRmaXNoQWxsKCcucGF5bWVudC1lcnJvcicpLmZvckVhY2goZSA9PiBlLmhpZGUoKSk7XG5cblx0XHRcdC8vIENvbXBsZXRlIHBheW1lbnQgd2hlbiB0aGUgc3VibWl0IGJ1dHRvbiBpcyBjbGlja2VkXG5cdFx0XHQvLyBwYXlXaXRoQ2FyZChzdHJpcGUsIGNhcmQsIGRhdGEuY2xpZW50U2VjcmV0KTtcblx0XHRcdHNldExvYWRpbmcodHJ1ZSk7XG5cdFx0XHRuZXR3b3JrR2V0U3RyaXBlU2VjcmV0KCdjYXJkJywgKHNlY3JldDogc3RyaW5nKSA9PiBwYXlXaXRoQ2FyZChjYXJkLCBzZWNyZXQpKTtcblx0XHR9KTtcblxuXHRcdHBheXBhbFBheUltYWdlRWwuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHBheXBhbFBheU1vZGFsRWwuc2hvdygpO1xuXHRcdH0pKTtcblxuXHRcdHB1Ymxpc2hDaGFuZ2VUb01vbnRobHlFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHJlcXVlc3QoVVBEQVRFX1BMQU5fVVJMLCB7dHlwZTogJ3B1Ymxpc2gnLCByZW5ldzogJ21vbnRobHknfSwgKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHB1Ymxpc2hDaGFuZ2VUb1llYXJseUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0cmVxdWVzdChVUERBVEVfUExBTl9VUkwsIHt0eXBlOiAncHVibGlzaCcsIHJlbmV3OiAneWVhcmx5J30sICgpID0+IHtcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRwdWJsaXNoU3RvcFJlbmV3YWxFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHJlcXVlc3QoVVBEQVRFX1BMQU5fVVJMLCB7dHlwZTogJ3B1Ymxpc2gnLCByZW5ldzogJyd9LCAoKSA9PiB7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0cHVibGlzaENoYW5nZU51bU9mU2l0ZXNFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHB1Ymxpc2hVcGdyYWRlTW9kYWwuc2hvdygpO1xuXHRcdFx0Y2FyZC5tb3VudCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtY2hvb3NlLXB1Ymxpc2gtcGxhbiAuY2FyZC1lbGVtZW50Jyk7XG5cblx0XHRcdHBheW1lbnRFcnJvckVsID0gZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtY2hvb3NlLXB1Ymxpc2gtcGxhbiAucGF5bWVudC1lcnJvcicpO1xuXHRcdFx0dXBkYXRlUHVibGlzaFByaWNlKCk7XG5cdFx0fSk7XG5cblx0XHRwdWJsaXNoUmVkdWNlTnVtT2ZTaXRlc0VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0cHVibGlzaFJlZHVjZVNpdGVzTW9kYWwuc2hvdygpO1xuXHRcdH0pO1xuXG5cdFx0cmVkdWNlU2l0ZUNvbmZpcm1CdXR0b25FbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGxldCBuZXdOdW1iZXJPZlNpdGVzID0gcGFyc2VJbnQocmVkdWNlU2l0ZU51bUlucHV0RWwudmFsdWUpO1xuXHRcdFx0cmVxdWVzdChSRURVQ0VfU0lURVNfVVJMLCB7c2l0ZXM6IG5ld051bWJlck9mU2l0ZXN9LCAoKSA9PiB7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0cHVibGlzaFZpZXdQYXltZW50TGlua0VsLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRyZXF1ZXN0KEdFVF9QQVlNRU5UX0lORk9fVVJMLCB7fSwgKGVycm9yLCBkYXRhKSA9PiB7XG5cdFx0XHRcdGlmIChkYXRhLmluZm8pIHtcblx0XHRcdFx0XHRjdXJyZW50Q2FyZEluZm9UZXh0RWwuc2V0VGV4dChgWW91J3JlIGN1cnJlbnRseSB1c2luZyBhICR7ZGF0YS5pbmZvfS5gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRjdXJyZW50Q2FyZEluZm9UZXh0RWwuc2V0VGV4dChgWW91IGN1cnJlbnRseSBkbyBub3QgaGF2ZSBhbnkgcGF5bWVudCBtZXRob2RzIG9uIGZpbGUuYCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwdWJsaXNoVmlld1BheW1lbnRNZXRob2RNb2RhbC5zaG93KCk7XG5cdFx0XHR9KTtcblx0XHR9KSk7XG5cblx0XHRwdWJsaXNoT3BlbkNoYW5nZVBheW1lbnRCdXR0b25FbC5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0dXBkYXRlUGF5bWVudE1ldGhvZE1vZGFsRWwuc2hvdygpO1xuXHRcdFx0cGF5bWVudEVycm9yRWwgPSB1cGRhdGVQYXltZW50TWV0aG9kTW9kYWxFbC5maW5kKCcucGF5bWVudC1lcnJvcicpO1xuXHRcdFx0Y2FyZC5tb3VudCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtY2hhbmdlLXBheW1lbnQtbWV0aG9kIC5jYXJkLWVsZW1lbnQnKTtcblx0XHR9KSk7XG5cblx0XHR1cGRhdGVQYXltZW50TWV0aG9kRm9ybUVsLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChldmVudCkgPT4ge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0c3RyaXBlLmNyZWF0ZVBheW1lbnRNZXRob2Qoe1xuXHRcdFx0XHR0eXBlOiAnY2FyZCcsXG5cdFx0XHRcdGNhcmQ6IGNhcmQsXG5cdFx0XHR9KS50aGVuKChkYXRhOiBhbnkpID0+IHtcblx0XHRcdFx0aWYgKGRhdGEucGF5bWVudE1ldGhvZCAmJiBkYXRhLnBheW1lbnRNZXRob2QuaWQpIHtcblx0XHRcdFx0XHRyZXF1ZXN0KFVQREFURV9QQVlNRU5UX0lORk9fVVJMLCB7XG5cdFx0XHRcdFx0XHRwYXltZW50X21ldGhvZF9pZDogZGF0YS5wYXltZW50TWV0aG9kLmlkXG5cdFx0XHRcdFx0fSwgKCkgPT4ge1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHBheW1lbnRFcnJvckVsLnNldFRleHQoJ0NvdWxkIG5vdCB1cGRhdGUgeW91ciBwYXltZW50IG1ldGhvZC4nKTtcblx0XHRcdFx0XHRwYXltZW50RXJyb3JFbC5zaG93KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0b3BlblVubGltaXRlZEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0ZG9uYXRpb25Nb2RhbEVsLnNob3coKTtcblx0XHRcdHBheW1lbnRFcnJvckVsID0gZG9uYXRpb25Nb2RhbEVsLmZpbmQoJy5wYXltZW50LWVycm9yJyk7XG5cdFx0XHRjYXJkLm1vdW50KCcubW9kYWwtY29udGFpbmVyLm1vZC1kb25hdGlvbiAuY2FyZC1lbGVtZW50Jyk7XG5cdFx0fSk7XG5cblx0XHRkb25hdGlvbkZvcm1FbC5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZXZlbnQpID0+IHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGZpc2hBbGwoJy5wYXltZW50LWVycm9yJykuZm9yRWFjaChlID0+IGUuaGlkZSgpKTtcblxuXHRcdFx0Ly8gQ29tcGxldGUgcGF5bWVudCB3aGVuIHRoZSBzdWJtaXQgYnV0dG9uIGlzIGNsaWNrZWRcblx0XHRcdC8vIHBheVdpdGhDYXJkKHN0cmlwZSwgY2FyZCwgZGF0YS5jbGllbnRTZWNyZXQpO1xuXHRcdFx0c2V0TG9hZGluZyh0cnVlKTtcblx0XHRcdG5ldHdvcmtHZXRTdHJpcGVTZWNyZXQoJ2NhcmQnLCAoc2VjcmV0OiBzdHJpbmcpID0+IHBheVdpdGhDYXJkKGNhcmQsIHNlY3JldCkpO1xuXHRcdH0pO1xuXG5cdFx0dW5saW1pdGVkRG9uYXRpb25BbW91bnRFbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG5cdFx0XHRidXlpbmdMaWNlbnNlID0gJ2RvbmF0aW9uJztcblx0XHRcdGJ1eWluZ1ZhcmlhdGlvbiA9ICh1bmxpbWl0ZWREb25hdGlvbkFtb3VudEVsLnZhbHVlQXNOdW1iZXIgKiAxMDApLnRvU3RyaW5nKCk7XG5cdFx0fSk7XG5cblx0XHRzeW5jVXBncmFkZUJ1dHRvbkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0c3luY1VwZ3JhZGVNb2RhbC5zaG93KCk7XG5cdFx0XHRjYXJkLm1vdW50KCcubW9kYWwtY29udGFpbmVyLm1vZC1jaG9vc2Utc3luYy1wbGFuIC5jYXJkLWVsZW1lbnQnKTtcblxuXHRcdFx0cGF5bWVudEVycm9yRWwgPSBmaXNoKCcubW9kYWwtY29udGFpbmVyLm1vZC1jaG9vc2Utc3luYy1wbGFuIC5wYXltZW50LWVycm9yJyk7XG5cdFx0XHR1cGRhdGVTeW5jUHJpY2UoKTtcblx0XHR9KTtcblxuXHRcdHN5bmNQbGFuc0NhcmRzRWwuZm9yRWFjaCgoY2FyZEVsKSA9PiB7XG5cdFx0XHRjYXJkRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRcdHN5bmNQbGFuc0NhcmRzRWwuZm9yRWFjaChlbCA9PiBlbC5yZW1vdmVDbGFzcygnaXMtc2VsZWN0ZWQnKSk7XG5cdFx0XHRcdGNhcmRFbC5hZGRDbGFzcygnaXMtc2VsZWN0ZWQnKTtcblxuXHRcdFx0XHRzeW5jVXBncmFkZU1vZGFsLmZpbmQoJy5wYXlwYWwtYnV0dG9uJykudG9nZ2xlKGNhcmRFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVuZXcnKSA9PT0gJ21vbnRobHknKTtcblxuXHRcdFx0XHR1cGRhdGVTeW5jUHJpY2UoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0c3RyaXBlU3luY0Zvcm1FbC5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGZpc2hBbGwoJy5wYXltZW50LWVycm9yJykuZm9yRWFjaChlID0+IGUuaGlkZSgpKTtcblxuXHRcdFx0Ly8gQ29tcGxldGUgcGF5bWVudCB3aGVuIHRoZSBzdWJtaXQgYnV0dG9uIGlzIGNsaWNrZWRcblx0XHRcdC8vIHBheVdpdGhDYXJkKHN0cmlwZSwgY2FyZCwgZGF0YS5jbGllbnRTZWNyZXQpO1xuXHRcdFx0c2V0TG9hZGluZyh0cnVlKTtcblx0XHRcdG5ldHdvcmtHZXRTdHJpcGVTZWNyZXQoJ2NhcmQnLCAoc2VjcmV0OiBzdHJpbmcpID0+IHBheVdpdGhDYXJkKGNhcmQsIHNlY3JldCkpO1xuXHRcdH0pO1xuXG5cdFx0c3luY0NoYW5nZVRvTW9udGhseUVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0cmVxdWVzdChVUERBVEVfUExBTl9VUkwsIHt0eXBlOiAnc3luYycsIHJlbmV3OiAnbW9udGhseSd9LCAoKSA9PiB7XG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0c3luY0NoYW5nZVRvWWVhcmx5RWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRyZXF1ZXN0KFVQREFURV9QTEFOX1VSTCwge3R5cGU6ICdzeW5jJywgcmVuZXc6ICd5ZWFybHknfSwgKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdHN5bmNTdG9wUmVuZXdhbEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0cmVxdWVzdChVUERBVEVfUExBTl9VUkwsIHt0eXBlOiAnc3luYycsIHJlbmV3OiAnJ30sICgpID0+IHtcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRjb21tZXJjaWFsU3RvcFJlbmV3YWxFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHJlcXVlc3QoVVBEQVRFX1BMQU5fVVJMLCB7dHlwZTogJ2J1c2luZXNzJywgcmVuZXc6ICcnfSwgKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdGNvbW1lcmNpYWxSZXN1bWVSZW5ld2FsRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRyZXF1ZXN0KFVQREFURV9QTEFOX1VSTCwge3R5cGU6ICdidXNpbmVzcycsIHJlbmV3OiAneWVhcmx5J30sICgpID0+IHtcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHR0b2dnbGVFbHMuZm9yRWFjaChlbCA9PiB7XG5cdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdFx0bGV0IGN1cnJlbnRDaGVja2VkID0gZWwuaGFzQ2xhc3MoJ2lzLWVuYWJsZWQnKTtcblx0XHRcdFx0aWYgKGN1cnJlbnRDaGVja2VkKSB7XG5cdFx0XHRcdFx0ZWwucmVtb3ZlQ2xhc3MoJ2lzLWVuYWJsZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRlbC5hZGRDbGFzcygnaXMtZW5hYmxlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdGNsYWltRGlzY29yZEJhZGdlQnV0dG9ucy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0bGV0IGRpc2NvcmRDbGllbnRJZCA9ICc4MjMyNzkxMzc2NDA0MTUyNjMnO1xuXHRcdFx0bGV0IHJlZGlyZWN0VXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgbG9jYXRpb24uaG9zdCArIGxvY2F0aW9uLnBhdGhuYW1lO1xuXHRcdFx0ZWwuYWRkQ2xhc3MoJ21vZC1kaXNhYmxlZCcpO1xuXHRcdFx0bG9jYXRpb24uaHJlZiA9IGBodHRwczovL2Rpc2NvcmQuY29tL2FwaS9vYXV0aDIvYXV0aG9yaXplP2NsaWVudF9pZD0ke2Rpc2NvcmRDbGllbnRJZH0mcmVkaXJlY3RfdXJpPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJlZGlyZWN0VXJsKX0mcmVzcG9uc2VfdHlwZT1jb2RlJnNjb3BlPWlkZW50aWZ5YDtcblx0XHR9KSk7XG5cblx0XHRjbGFpbUZvcnVtQmFkZ2VCdXR0b25zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRlbC5hZGRDbGFzcygnbW9kLWRpc2FibGVkJyk7XG5cdFx0XHRyZXF1ZXN0KENMQUlNX0ZPUlVNX1JPTEVfVVJMLCB7fSwgKGVyciwgZGF0YSkgPT4ge1xuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0Zm9ydW1FcnJvck1lc3NhZ2VFbC5zZXRUZXh0KGVycik7XG5cdFx0XHRcdFx0Zm9ydW1GYWlsdXJlTW9kYWwuc2hvdygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGZvcnVtU3VjY2Vzc01vZGFsLnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbC5yZW1vdmVDbGFzcygnbW9kLWRpc2FibGVkJyk7XG5cdFx0XHR9KTtcblx0XHR9KSk7XG5cblx0XHRjaGFuZ2VFbWFpbEJ1dHRvbkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y2hhbmdlRW1haWxNb2RhbEVsLnNob3coKTtcblx0XHR9KTtcblxuXHRcdGNvbmZpcm1DaGFuZ2VFbWFpbEJ1dHRvbkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y2hhbmdlRW1haWxFcnJvckVsLmhpZGUoKTtcblxuXHRcdFx0bGV0IG5ld0VtYWlsID0gY2hhbmdlRW1haWxOZXdFbWFpbElucHV0RWwudmFsdWU7XG5cdFx0XHRsZXQgcGFzc3dvcmQgPSBjaGFuZ2VFbWFpbFBhc3N3b3JkSW5wdXRFbC52YWx1ZTtcblxuXHRcdFx0aWYgKG5ld0VtYWlsID09PSAnJykge1xuXHRcdFx0XHRjaGFuZ2VFbWFpbEVycm9yRWwuc2V0VGV4dCgnTmV3IGVtYWlsIGNhbm5vdCBiZSBlbXB0eS4nKTtcblx0XHRcdFx0Y2hhbmdlRW1haWxFcnJvckVsLnNob3coKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAocGFzc3dvcmQgPT09ICcnKSB7XG5cdFx0XHRcdGNoYW5nZUVtYWlsRXJyb3JFbC5zZXRUZXh0KCdQYXNzd29yZCBjYW5ub3QgYmUgZW1wdHkuJyk7XG5cdFx0XHRcdGNoYW5nZUVtYWlsRXJyb3JFbC5zaG93KCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0cmVxdWVzdChDSEFOR0VfRU1BSUxfVVJMLCB7XG5cdFx0XHRcdHBhc3N3b3JkLFxuXHRcdFx0XHRlbWFpbDogbmV3RW1haWxcblx0XHRcdH0sIChlcnIsIGRhdGEpID0+IHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdGNoYW5nZUVtYWlsRXJyb3JFbC5zZXRUZXh0KGVycik7XG5cdFx0XHRcdFx0Y2hhbmdlRW1haWxFcnJvckVsLnNob3coKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Y2xvc2VNb2RhbCgpO1xuXHRcdFx0XHRcdHJlZnJlc2hBZnRlckNsb3NpbmcgPSB0cnVlO1xuXHRcdFx0XHRcdGNoYW5nZUluZm9TdWNjZXNzTW9kYWxFbC5zaG93KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0Y2hhbmdlTmFtZUJ1dHRvbkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y2hhbmdlTmFtZU1vZGFsRWwuc2hvdygpO1xuXHRcdH0pO1xuXG5cdFx0Y29uZmlybUNoYW5nZU5hbWVCdXR0b25FbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGNoYW5nZU5hbWVFcnJvckVsLmhpZGUoKTtcblxuXHRcdFx0bGV0IG5hbWUgPSBjaGFuZ2VOYW1lTmV3TmFtZUlucHV0RWwudmFsdWU7XG5cblx0XHRcdGlmIChuYW1lID09PSAnJykge1xuXHRcdFx0XHRjaGFuZ2VOYW1lRXJyb3JFbC5zZXRUZXh0KCdOZXcgbmFtZSBjYW5ub3QgYmUgZW1wdHkuJyk7XG5cdFx0XHRcdGNoYW5nZU5hbWVFcnJvckVsLnNob3coKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXF1ZXN0KENIQU5HRV9OQU1FX1VSTCwge1xuXHRcdFx0XHRuYW1lXG5cdFx0XHR9LCAoZXJyLCBkYXRhKSA9PiB7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRjaGFuZ2VOYW1lRXJyb3JFbC5zZXRUZXh0KGVycik7XG5cdFx0XHRcdFx0Y2hhbmdlTmFtZUVycm9yRWwuc2hvdygpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRjbG9zZU1vZGFsKCk7XG5cdFx0XHRcdFx0cmVmcmVzaEFmdGVyQ2xvc2luZyA9IHRydWU7XG5cdFx0XHRcdFx0Y2hhbmdlSW5mb1N1Y2Nlc3NNb2RhbEVsLnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRjaGFuZ2VQYXNzd29yZEJ1dHRvbkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y2hhbmdlUGFzc3dvcmRNb2RhbEVsLnNob3coKTtcblx0XHR9KTtcblxuXHRcdGNvbmZpcm1DaGFuZ2VQYXNzd29yZEJ1dHRvbkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0Y2hhbmdlUGFzc3dvcmRFcnJvckVsLmhpZGUoKTtcblxuXHRcdFx0bGV0IG9sZFBhc3N3b3JkID0gY2hhbmdlUGFzc3dvcmRPbGRQYXNzd29yZElucHV0RWwudmFsdWU7XG5cdFx0XHRsZXQgbmV3UGFzc3dvcmQgPSBjaGFuZ2VQYXNzd29yZE5ld1Bhc3N3b3JkSW5wdXRFbC52YWx1ZTtcblxuXHRcdFx0aWYgKG9sZFBhc3N3b3JkID09PSAnJykge1xuXHRcdFx0XHRjaGFuZ2VQYXNzd29yZEVycm9yRWwuc2V0VGV4dCgnQ3VycmVudCBwYXNzd29yZCBjYW5ub3QgYmUgZW1wdHkuJyk7XG5cdFx0XHRcdGNoYW5nZVBhc3N3b3JkRXJyb3JFbC5zaG93KCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9sZFBhc3N3b3JkID09PSAnJykge1xuXHRcdFx0XHRjaGFuZ2VQYXNzd29yZEVycm9yRWwuc2V0VGV4dCgnTmV3IHBhc3N3b3JkIGNhbm5vdCBiZSBlbXB0eS4nKTtcblx0XHRcdFx0Y2hhbmdlUGFzc3dvcmRFcnJvckVsLnNob3coKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXF1ZXN0KENIQU5HRV9QQVNTV09SRF9VUkwsIHtcblx0XHRcdFx0b2xkX3Bhc3N3b3JkOiBvbGRQYXNzd29yZCxcblx0XHRcdFx0bmV3X3Bhc3N3b3JkOiBuZXdQYXNzd29yZFxuXHRcdFx0fSwgKGVyciwgZGF0YSkgPT4ge1xuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0Y2hhbmdlUGFzc3dvcmRFcnJvckVsLnNldFRleHQoZXJyKTtcblx0XHRcdFx0XHRjaGFuZ2VQYXNzd29yZEVycm9yRWwuc2hvdygpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRjbG9zZU1vZGFsKCk7XG5cdFx0XHRcdFx0cmVmcmVzaEFmdGVyQ2xvc2luZyA9IHRydWU7XG5cdFx0XHRcdFx0Y2hhbmdlSW5mb1N1Y2Nlc3NNb2RhbEVsLnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRkZWxldGVBY2NvdW50QnV0dG9uRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRkZWxldGVBY2NvdW50TW9kYWxFbC5zaG93KCk7XG5cdFx0fSk7XG5cblx0XHRjb25maXJtRGVsZXRlQWNjb3VudEJ1dHRvbkVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRcdFx0ZGVsZXRlQWNjb3VudEVycm9yRWwuaGlkZSgpO1xuXG5cdFx0XHRsZXQgZW1haWwgPSBkZWxldGVBY2NvdW50RW1haWxJbnB1dEVsLnZhbHVlO1xuXHRcdFx0bGV0IHBhc3N3b3JkID0gZGVsZXRlQWNjb3VudFBhc3N3b3JkSW5wdXRFbC52YWx1ZTtcblxuXHRcdFx0aWYgKGVtYWlsID09PSAnJykge1xuXHRcdFx0XHRkZWxldGVBY2NvdW50RXJyb3JFbC5zZXRUZXh0KCdQbGVhc2UgZW50ZXIgeW91ciBlbWFpbCB0byBjb25maXJtIGFjY291bnQgZGVsZXRpb24uJyk7XG5cdFx0XHRcdGRlbGV0ZUFjY291bnRFcnJvckVsLnNob3coKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAocGFzc3dvcmQgPT09ICcnKSB7XG5cdFx0XHRcdGRlbGV0ZUFjY291bnRFcnJvckVsLnNldFRleHQoJ1BsZWFzZSBlbnRlciB5b3VyIHBhc3N3b3JkIHRvIGNvbmZpcm0gYWNjb3VudCBkZWxldGlvbi4nKTtcblx0XHRcdFx0ZGVsZXRlQWNjb3VudEVycm9yRWwuc2hvdygpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHJlcXVlc3QoREVMRVRFX0FDQ09VTlRfVVJMLCB7XG5cdFx0XHRcdGVtYWlsLFxuXHRcdFx0XHRwYXNzd29yZFxuXHRcdFx0fSwgKGVyciwgZGF0YSkgPT4ge1xuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0ZGVsZXRlQWNjb3VudEVycm9yRWwuc2V0VGV4dChlcnIpO1xuXHRcdFx0XHRcdGRlbGV0ZUFjY291bnRFcnJvckVsLnNob3coKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Y2xvc2VNb2RhbCgpO1xuXHRcdFx0XHRcdHJlZnJlc2hBZnRlckNsb3NpbmcgPSB0cnVlO1xuXHRcdFx0XHRcdGNoYW5nZUluZm9TdWNjZXNzTW9kYWxFbC5zaG93KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0Y29tbWVyY2lhbExpY2Vuc2VDaGFuZ2VTZWF0RWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb21tZXJjaWFsTGljZW5zZU1vZGFsLmFkZENsYXNzKCdpcy11cGRhdGluZycpO1xuXHRcdFx0cGF5bWVudEVycm9yRWwgPSBmaXNoKCcubW9kYWwtY29udGFpbmVyLm1vZC1jb21tZXJjaWFsLWxpY2Vuc2UgLnBheW1lbnQtZXJyb3InKTtcblx0XHRcdGNvbW1lcmNpYWxMaWNlbnNlTW9kYWwuc2hvdygpO1xuXHRcdFx0Y2FyZC5tb3VudCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtY29tbWVyY2lhbC1saWNlbnNlIC5jYXJkLWVsZW1lbnQnKTtcblxuXHRcdFx0YnV5aW5nTGljZW5zZSA9ICdidXNpbmVzcyc7XG5cdFx0XHRidXlpbmdWYXJpYXRpb24gPSBwYXJzZUludChjb21tZXJjaWFsTGljZW5zZVNlYXRFbC52YWx1ZSkudG9TdHJpbmcoKTtcblx0XHRcdGlzVXBkYXRpbmdDb21tZXJjaWFsTGljZW5zZSA9IHRydWU7XG5cdFx0XHRjb21tZXJjaWFsTGljZW5zZVRpdGxlLnNldFRleHQoJ0FkZCBzZWF0cycpO1xuXG5cdFx0XHR1cGRhdGVCaXpQcmljZSgpO1xuXHRcdH0pO1xuXG5cdFx0Y29tbWVyY2lhbExpY2Vuc2VSZWR1Y2VTZWF0RWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb21tZXJjaWFsTGljZW5zZVJlZHVjZVNlYXRNb2RhbC5zaG93KCk7XG5cdFx0fSk7XG5cblx0XHRjb21tZXJjaWFsTGljZW5zZVJlZHVjZVNlYXRDb25maXJtRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRjb21tZXJjaWFsTGljZW5zZVJlZHVjZVNlYXRFcnJvckVsLmhpZGUoKTtcblx0XHRcdGxldCByZWR1Y2VCeSA9IGNvbW1lcmNpYWxMaWNlbnNlUmVkdWNlU2VhdElucHV0RWwudmFsdWVBc051bWJlcjtcblx0XHRcdGxldCBjdXJyZW50U2VhdHMgPSBjb21tZXJjaWFsTGljZW5zZS5zZWF0cztcblxuXHRcdFx0aWYgKHJlZHVjZUJ5ID09PSAwKSB7XG5cdFx0XHRcdGNvbW1lcmNpYWxMaWNlbnNlUmVkdWNlU2VhdEVycm9yRWwuc2V0VGV4dCgnVGhlIG51bWJlciBvZiBzZWF0cyB0byByZW1vdmUgY2Fubm90IGJlIDAuJyk7XG5cdFx0XHRcdGNvbW1lcmNpYWxMaWNlbnNlUmVkdWNlU2VhdEVycm9yRWwuc2hvdygpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBuZXdTZWF0cyA9IGN1cnJlbnRTZWF0cyAtIHJlZHVjZUJ5O1xuXG5cdFx0XHRpZiAobmV3U2VhdHMgPCAwKSB7XG5cdFx0XHRcdGxldCBjdXJyZW50U2VhdFRleHQgPSBjdXJyZW50U2VhdHMgPT09IDEgPyAnMSBzZWF0JyA6IGN1cnJlbnRTZWF0cyArICcgc2VhdHMnO1xuXHRcdFx0XHRjb21tZXJjaWFsTGljZW5zZVJlZHVjZVNlYXRFcnJvckVsLnNldFRleHQoJ1lvdSBjdXJyZW50bHkgaGF2ZSAnICsgY3VycmVudFNlYXRUZXh0ICsgJyBhbmQgY2Fubm90IHJlbW92ZSBtb3JlIHNlYXRzIHRoYW4gdGhhdC4nKTtcblx0XHRcdFx0Y29tbWVyY2lhbExpY2Vuc2VSZWR1Y2VTZWF0RXJyb3JFbC5zaG93KCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0cmVxdWVzdChSRURVQ0VfQ09NTUVSQ0lBTF9MSUNFTlNFX1VSTCwge3NlYXRzOiBuZXdTZWF0c30sIChlcnIsIGRhdGEpID0+IHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdGNvbW1lcmNpYWxMaWNlbnNlUmVkdWNlU2VhdEVycm9yRWwuc2V0VGV4dChlcnIpO1xuXHRcdFx0XHRcdGNvbW1lcmNpYWxMaWNlbnNlUmVkdWNlU2VhdEVycm9yRWwuc2hvdygpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRjbG9zZU1vZGFsKCk7XG5cdFx0XHRcdFx0cmVmcmVzaEFmdGVyQ2xvc2luZyA9IHRydWU7XG5cdFx0XHRcdFx0Y2hhbmdlSW5mb1N1Y2Nlc3NNb2RhbEVsLnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRsZXQgY3VycmVudFJlZnVuZENoYXJnZUlkID0gJyc7XG5cdFx0bGV0IGludm9pY2VMaXN0RWwgPSBmaXNoKCcubW9kYWwtY29udGFpbmVyLm1vZC1pbnZvaWNlLWxpc3QnKTtcblxuXHRcdGZpc2goJy5qcy12aWV3LWludm9pY2VzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRzcGlubmVyRWwuc2hvdygpO1xuXHRcdFx0d2VsY29tZUVsLmhpZGUoKTtcblxuXHRcdFx0cmVxdWVzdChMSVNUX0lOVk9JQ0VTX1VSTCwge30sIChlcnIsIGRhdGEpID0+IHtcblx0XHRcdFx0c3Bpbm5lckVsLmhpZGUoKTtcblx0XHRcdFx0d2VsY29tZUVsLnNob3coKTtcblxuXHRcdFx0XHRpbnZvaWNlTGlzdEVsLnNob3coKTtcblx0XHRcdFx0bGV0IG1vZGFsQ29udGVudEVsID0gaW52b2ljZUxpc3RFbC5maW5kKCcuaW52b2ljZS1saXN0Jyk7XG5cdFx0XHRcdG1vZGFsQ29udGVudEVsLmVtcHR5KCk7XG5cblx0XHRcdFx0Zm9yIChsZXQgY2hhcmdlIG9mIGRhdGEpIHtcblx0XHRcdFx0XHRtb2RhbENvbnRlbnRFbC5jcmVhdGVEaXYoe2NsczogJ2ludm9pY2UtaXRlbSBzZXR0aW5nLWl0ZW0nfSwgZWwgPT4ge1xuXHRcdFx0XHRcdFx0ZWwuY3JlYXRlRGl2KHtjbHM6ICdzZXR0aW5nLWl0ZW0taW5mbyd9LCBlbCA9PiB7XG5cdFx0XHRcdFx0XHRcdGVsLmNyZWF0ZURpdih7dGV4dDogY2hhcmdlLmRlc2NyaXB0aW9uLCBjbHM6ICdzZXR0aW5nLWl0ZW0tbmFtZSd9KTtcblx0XHRcdFx0XHRcdFx0ZWwuY3JlYXRlRGl2KHtcblx0XHRcdFx0XHRcdFx0XHR0ZXh0OiAobmV3IERhdGUoY2hhcmdlLmNyZWF0ZWQgKiAxMDAwKSkudG9Mb2NhbGVTdHJpbmcoKSxcblx0XHRcdFx0XHRcdFx0XHRjbHM6ICdzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb24nXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRlbC5jcmVhdGVEaXYoe2NsczogJ3NldHRpbmctaXRlbS1jb250cm9sIG1vZC12ZXJ0aWNhbCd9LCBlbCA9PiB7XG5cdFx0XHRcdFx0XHRcdGVsLmNyZWF0ZUVsKCdidXR0b24nLCB7Y2xzOiAnbW9kLWN0YScsIHRleHQ6ICdWaWV3J30sIGVsID0+IHtcblx0XHRcdFx0XHRcdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhbW91bnQgPSAoY2hhcmdlLmFtb3VudCAvIDEwMCkudG9GaXhlZCgyKTtcblx0XHRcdFx0XHRcdFx0XHRcdGxldCByZWZ1bmRlZCA9IChjaGFyZ2UucmVmdW5kZWQgLyAxMDApLnRvRml4ZWQoMik7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgdG90YWwgPSAoKGNoYXJnZS5hbW91bnQgLSBjaGFyZ2UucmVmdW5kZWQpIC8gMTAwKS50b0ZpeGVkKDIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGhhc1JlZnVuZCA9IGNoYXJnZS5yZWZ1bmRlZCAhPT0gMDtcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBzYXZlZEJpbGxpbmdJbmZvID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2JpbGxpbmctaW5mbycpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRmaXNoKCcuaW52b2ljZS1kYXRlJykuc2V0VGV4dChuZXcgRGF0ZShwYXJzZUludChjaGFyZ2UuY3JlYXRlZCkgKiAxMDAwKS50b0xvY2FsZVN0cmluZygpKTtcblx0XHRcdFx0XHRcdFx0XHRcdGZpc2goJy5pbnZvaWNlLW51bWJlci10aXRsZScpLnNldFRleHQoY2hhcmdlLnJlY2VpcHRfbnVtYmVyIHx8IGNoYXJnZS5pZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRmaXNoKCcuaW52b2ljZS1udW1iZXInKS5zZXRUZXh0KGNoYXJnZS5yZWNlaXB0X251bWJlciB8fCBjaGFyZ2UuaWQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZmlzaCgnLmludm9pY2UtZGVzY3JpcHRpb24nKS5zZXRUZXh0KGNoYXJnZS5kZXNjcmlwdGlvbik7XG5cdFx0XHRcdFx0XHRcdFx0XHRmaXNoKCcuaW52b2ljZS1hbW91bnQnKS5zZXRUZXh0KGFtb3VudCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoaGFzUmVmdW5kKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZpc2goJy5pbnZvaWNlLWJveCAuaXRlbS5tb2QtcmVmdW5kJykuc2hvdygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRmaXNoKCcuaW52b2ljZS1yZWZ1bmQtYW1vdW50Jykuc2V0VGV4dChyZWZ1bmRlZCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZmlzaCgnLmludm9pY2UtYm94IC5pdGVtLm1vZC1yZWZ1bmQnKS5oaWRlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRmaXNoKCcuaW52b2ljZS10b3RhbCcpLnNldFRleHQodG90YWwpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoc2F2ZWRCaWxsaW5nSW5mbykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRmaXNoKCcuYmlsbGluZy1pbmZvJykuc2V0VGV4dChzYXZlZEJpbGxpbmdJbmZvKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0ZmlzaCgnLmJpbGxpbmctaW5mbycpLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgbmV3SW5mbyA9IGZpc2goJy5iaWxsaW5nLWluZm8nKS5nZXRUZXh0KCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdiaWxsaW5nLWluZm8nLCBuZXdJbmZvKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRmaXNoKCcubW9kYWwtY29udGFpbmVyLm1vZC1pbnZvaWNlLWRldGFpbCcpLnNob3coKTtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0aWYgKGNoYXJnZS5yZWZ1bmRhYmxlKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZWwuY3JlYXRlRWwoJ2EnLCB7dGV4dDogJ0dldCByZWZ1bmQnfSwgZWwgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRSZWZ1bmRDaGFyZ2VJZCA9IGNoYXJnZS5pZDtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRmaXNoKCcubW9kYWwtY29udGFpbmVyLm1vZC1jb25maXJtLXJlZnVuZCcpLnNob3coKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRmaXNoKCcuanMtY29uZmlybS1yZWZ1bmQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWludm9pY2UtbGlzdCcpLmhpZGUoKTtcblx0XHRcdGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLWNvbmZpcm0tcmVmdW5kJykuaGlkZSgpO1xuXG5cdFx0XHRzcGlubmVyRWwuc2hvdygpO1xuXHRcdFx0d2VsY29tZUVsLmhpZGUoKTtcblxuXHRcdFx0cmVxdWVzdChSRVFVRVNUX1JFRlVORF9VUkwsIHtjaGFyZ2U6IGN1cnJlbnRSZWZ1bmRDaGFyZ2VJZH0sIChlcnIsIGRhdGEpID0+IHtcblx0XHRcdFx0c3Bpbm5lckVsLmhpZGUoKTtcblx0XHRcdFx0d2VsY29tZUVsLnNob3coKTtcblxuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0ZmlzaCgnLnJlZnVuZC1mYWlsZWQtcmVhc29uJykuc2V0VGV4dChlcnIpO1xuXHRcdFx0XHRcdGZpc2goJy5tb2RhbC1jb250YWluZXIubW9kLXJlZnVuZC1mYWlsZWQnKS5zaG93KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0cmVmcmVzaEFmdGVyQ2xvc2luZyA9IHRydWU7XG5cdFx0XHRcdFx0ZmlzaCgnLm1vZGFsLWNvbnRhaW5lci5tb2QtcmVmdW5kLXN1Y2Nlc3MnKS5zaG93KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KTtcbn0sIDUwMCk7XG4iXSwKICAibWFwcGluZ3MiOiAiOztBQXFFTywrQkFBNkIsTUFBYztBQUNqRCxRQUFJLENBQUMsVUFBVSxhQUFhLENBQUMsVUFBVSxhQUFhO0FBRW5ELFVBQUksYUFBYSxTQUFTLGNBQWM7QUFDeEMsaUJBQVcsUUFBUTtBQUduQixpQkFBVyxNQUFNLE1BQU07QUFDdkIsaUJBQVcsTUFBTSxPQUFPO0FBQ3hCLGlCQUFXLE1BQU0sV0FBVztBQUU1QixlQUFTLEtBQUssWUFBWTtBQUUxQixVQUFJO0FBQ0gsbUJBQVc7QUFDWCxtQkFBVztBQUNYLGlCQUFTLFlBQVk7QUFBQSxlQUNiLEtBQVA7QUFBQTtBQUdGLGVBQVMsS0FBSyxZQUFZO0FBQzFCO0FBQUE7QUFHRCxjQUFVLFVBQVUsVUFBVTtBQUFBO0FBb0YvQixNQUFJLHNCQUFzQixPQUFPO0FBNkMxQixNQUFJLG9CQUFvQixvQkFBb0IsS0FBSyxVQUFVOzs7QUM5TjNELDJCQUF5QixNQUFjLE1BQWMsUUFBaUI7QUFDNUUsV0FBTyx1Q0FBdUMsT0FBTyxNQUFPLFdBQVUsVUFBVSxNQUFNO0FBQUE7OztBQ0NoRixtQkFBaUIsS0FBYSxNQUFXLFVBQXlDO0FBQ3hGLFNBQUs7QUFBQSxNQUNKLFFBQVE7QUFBQSxNQUNSO0FBQUEsTUFDQTtBQUFBLE1BQ0EsU0FBUyxDQUFDLFVBQVM7QUFDbEIsZ0JBQU8sS0FBSyxNQUFNO0FBQ2xCLFlBQUksTUFBSyxPQUFPO0FBQ2YsbUJBQVMsTUFBSztBQUNkO0FBQUE7QUFFRCxpQkFBUyxNQUFNO0FBQUE7QUFBQSxNQUVoQixPQUFPLENBQUMsUUFBUTtBQUNmLFlBQUksSUFBSSxPQUFPO0FBQ2QsbUJBQVMsSUFBSTtBQUNiO0FBQUE7QUFFRCxpQkFBUztBQUFBO0FBQUE7QUFBQTtBQUtaLE1BQU0sdUJBQXVCLGdCQUFnQixnQ0FBZ0M7QUFXN0Us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
