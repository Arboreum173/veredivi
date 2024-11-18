(function() {
	"use strict";
	
	// load SVG icons
	SVGInject(document.querySelectorAll("img[src$='.svg']"));
	
	// submit forms
	let formButtons = document.querySelectorAll("form button[type='submit']");
	
	for(let i = 0; i < formButtons.length; i++) {
		formButtons[i].addEventListener("click", function(e) {
			e.preventDefault();
			
			let form = this.closest("form");
			let data = new FormData(form);
			
			fetch("site/execute", {
				method: "POST",
				body: data
			})
				.then(function(response) { return response.json(); })
				.then(function(response) {
					makeResponse(response.code, form);
				});
		});
	}
	
	function getConfigResponse(id) {
		// find type and message of response
		for(let i = 0; i < CONFIG.responses.length; i++) {
			let cur = CONFIG.responses[i];
			if(cur.id === id) return cur;
		}
		
		return {
			"type": "error",
			"text": CONFIG.defaultError
		};
	}
	
	function makeResponse(id, form) {
		let response = getConfigResponse(id);
		
		let oldNotice = form.querySelector(".notice");
		if(oldNotice) {
			// collapse previous notice
			oldNotice.style.height = 0;
			oldNotice.addEventListener("transitionend", function(e) {
				if(e.propertyName === "height") {
					oldNotice.parentNode.removeChild(oldNotice);
					insertNotice();
				}
			});
		} else {
			insertNotice();
		}
		
		function insertNotice() {
			form.insertAdjacentHTML(
				"afterbegin",
				"<div class='notice'>" +
					"<div>" +
						"<span class='icon'>" +
							"<img src='img/" + response.type + ".svg' " +
								"onload='SVGInject(this);' />" +
						"</span>" +
						"<span class='text'>…</span>" +
						"<button class='close'>" +
							"<img src='img/close.svg' onload='SVGInject(this);' />" +
						"</button>" +
					"</div>" +
				"</div>"
			);
			
			let notice = form.querySelector(".notice");
			
			notice.querySelector(".text").textContent = response.text;
			notice.querySelector(".close").addEventListener("click", closeNotice);
			
			// expand effect
			notice.style.height = 0;
			setTimeout(function() {
				notice.style.height = notice.scrollHeight;
			}, 100);
		}
		
		function closeNotice(e) {
			e.preventDefault();
			
			let notice = this.closest(".notice");
			notice.style.height = 0;
			
			notice.addEventListener("transitionend", function(e) {
				if(e.propertyName === "height") {
					notice.parentNode.removeChild(notice);
				}
			});
		}
	}
	
	// eye to reveal/hide password
	let passwordEyes = document.querySelectorAll(".password-eye button");
	for(i = 0; i < passwordEyes.length; i++) {
		passwordEyes[i].addEventListener("click", function() {
			let input = this.closest(".input-group").querySelector("input");
			input.type = input.type === "text" ? "password" : "text";
			
			input.parentNode.classList.toggle("shown");
			
			input.classList.add("toggle");
			input.addEventListener("animationend", function() {
				input.classList.remove("toggle");
			});
		});
	}
	
	// enable submit button if required fields are filled out
	let requiredFields = document.querySelectorAll("form input[required]");
	
	for(i = 0; i < requiredFields.length; i++) {
		requiredFields[i].addEventListener("input", function() {
			let form = this.closest("form");
			let fields = form.querySelectorAll("input[required]");
			
			let isFilledOut = true;
			for(let i = 0; i < fields.length; i++) {
				if(!fields[i].value.trim()) isFilledOut = false;
			}
			
			form.querySelector("button[type='submit']").disabled =
				!isFilledOut ? "disabled" : "";
		});
	}
	
	function setTooltipMessage(message, text) {
		if(message.textContent === text) return;
		
		message.classList.add("toggle");
		message.textContent = text;
		message.addEventListener("animationend", function() {
			message.classList.remove("toggle");
		});
	}
	
	// check password strength
	let passwordFields = document.querySelectorAll(".checked-password input");
	
	for(i = 0; i < passwordFields.length; i++) {
		passwordFields[i].addEventListener("input", checkPassword);
	}
	
	// note: too long, maybe split into smaller functions
	function checkPassword() {
		let input = this.value;
		let qualityChecker = this.closest(".input-group")
			.querySelector(".quality-checker");
		let smiley = qualityChecker.querySelector(".smiley");
		let message = qualityChecker.querySelector(".tooltip .text");
		
		function changeSmiley(mode) {
			smiley.classList.remove("happy", "smile", "normal", "frown", "sad");
			if(mode) smiley.classList.add(mode);
		}
		
		if(!input) {
			changeSmiley(false);
			setTooltipMessage(message, CONFIG["registerPasswordEmpty"]);
			return;
		}
		
		// check if password fulfills minimum requirements
		// password too short
		if(input.length < CONFIG["passwordMinLength"]) {
			changeSmiley("sad");
			setTooltipMessage(message, getConfigResponse(9).text);
			return;
		}
		
		// password too long
		if(input.length > CONFIG["passwordMaxLength"]) {
			changeSmiley("sad");
			setTooltipMessage(message, getConfigResponse(10).text);
			return;
		}
		
		// lowercase and uppercase letter
		if(!input.match(/[a-z]/g) || !input.match(/[A-Z]/g)) {
			changeSmiley("sad");
			setTooltipMessage(message, getConfigResponse(11).text);
			return;
		}
		
		// number
		if(!input.match(/[0-9]/g)) {
			changeSmiley("sad");
			setTooltipMessage(message, getConfigResponse(12).text);
			return;
		}
		
		// special character
		if(!input.match(/[^a-zA-Z0-9]/g)) {
			changeSmiley("sad");
			setTooltipMessage(message, getConfigResponse(13).text);
			return;
		}
		
		// password is OK, measure quality
		function getOccurrences(regex) {
			return (input.match(regex) || []).length;
		}
		
		let strength = 0;
		
		// password length
		if(input.length >= 14) {
			strength++;
		} else {
			setTooltipMessage(message, CONFIG["passwordLength"]);
		}
		
		// letter case variation
		if(
			getOccurrences(/[a-z]/g) >= 2 &&
			getOccurrences(/[A-Z]/g) >= 2
		) {
			strength++;
		} else {
			setTooltipMessage(message, CONFIG["passwordLetterCase"]);
		}
		
		// numbers
		if(getOccurrences(/[0-9]/g) >= 2) {
			strength++;
		} else {
			setTooltipMessage(message, CONFIG["passwordNumbers"]);
		}
		
		// special characters
		if(getOccurrences(/[^a-zA-Z0-9]/g) >= 2) {
			strength++;
		} else {
			setTooltipMessage(message, CONFIG["passwordSpecial"]);
		}
		
		// evaluate password strength
		if(strength === 4) {
			changeSmiley("happy");
			setTooltipMessage(message, CONFIG["passwordExcellent"]);
		} else if(strength === 3) {
			changeSmiley("smile");
		}  else if(strength === 2) {
			changeSmiley("normal");
		} else {
			changeSmiley("frown");
		}
	}
	
	// automatically check nickname fields
	let nicknameFields = document.querySelectorAll(".checked-nickname input");
	
	for(i = 0; i < nicknameFields.length; i++) {
		nicknameFields[i].addEventListener("input", checkNickname);
	}
	
	// possibly too long as well
	function checkNickname() {
		let input = this.value.trim();
		let inputGroup = this.closest(".input-group");
		let message = inputGroup.querySelector(".tooltip");
		
		if(!input) {
			// empty
			inputGroup.classList.remove("loading", "valid", "invalid");
			setTooltipMessage(message, "");
		}
		
		let isTooShort = input.length < CONFIG["nicknameMinLength"];
		let isTooLong = input.length > CONFIG["nicknameMaxLength"];
		let hasInvalidChars = !input.match(/^[a-zA-Z0-9]+$/);
		
		if(isTooShort || isTooLong || hasInvalidChars) {
			// invalid
			inputGroup.classList.add("invalid");
			inputGroup.classList.remove("loading", "valid");
			
			if(isTooShort) {
				setTooltipMessage(message, CONFIG["nicknameTooShort"]);
			} else if(isTooLong) {
				setTooltipMessage(message, CONFIG["nicknameTooLong"]);
			} else if(hasInvalidChars) {
				setTooltipMessage(message, CONFIG["nicknameInvalid"]);
			}
		}
		
		// check nickname availability
		inputGroup.classList.add("loading");
		inputGroup.classList.remove("valid", "invalid");
		
		let data = new FormData();
		data.append("script", "check-nickname");
		data.append("nickname", input);
		
		fetch("site/execute", {
			method: "POST",
			body: data
		})
			.then(function(response) { return response.json(); })
			.then(function(response) {
				if(response.result) {
					// nickname already taken
					inputGroup.classList.add("invalid");
					inputGroup.classList.remove("loading", "valid");
					
					setTooltipMessage(message, CONFIG["nicknameTaken"]);
				} else {
					// nickname is OK
					inputGroup.classList.add("valid");
					inputGroup.classList.remove("loading", "invalid");
					
					setTooltipMessage(message, "");
				}
			});
	}
	
	// automatically check confirmation password
	let confirmPasswordFields = document.querySelectorAll(
		"input[name='confirm-password']"
	);
	
	for(i = 0; i < confirmPasswordFields.length; i++) {
		confirmPasswordFields[i].addEventListener("input", function() {
			let form = this.closest(".input-group").previousElementSibling.querySelector;
			
			// not finished yet, I think
		});
	}
})();