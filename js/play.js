(function() {
	"use strict";
	
	// load SVG icons
	SVGInject(document.querySelectorAll("img[src$='.svg']"));
	
	// initialize variables
	let word = "";
	let wantedLetters = [];
	
	let main = document.getElementById("main");
	let smiley = document.getElementById("smiley");
	let wordBox = document.getElementById("word");
	let letterButtons = document.getElementById("letters");
	let goodieButtons = document.getElementById("goodies");
	let hintButton = document.getElementById("hint");
	let winBanner = document.getElementById("win-banner");
	let loseBanner = document.getElementById("lose-banner");
	
	let inputWordDialog = document.getElementById("input-word");
	let wordInputBox = document.getElementById("word-input");
	let wordInputSubmit = document.getElementById("word-input-submit");
	let randomWordButton = document.getElementById("random-word");
	
	let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	
	// unicode list of letters with diacritics
	let diacriticsMap = {
		"\u00C1": "A",
		"\u00C0": "A",
		"\u00C2": "A",
		"\u00C3": "A",
		"\u0102": "A",
		"\u00C4": "A",
		"\u00C5": "A",
		"\u0100": "A",
		"\u0104": "A",
		"\u00C6": "A",
		"\u0106": "C",
		"\u010C": "C",
		"\u00C7": "C",
		"\u010A": "C",
		"\u010E": "D",
		"\u0110": "D",
		"\u00C9": "E",
		"\u00C8": "E",
		"\u00CA": "E",
		"\u011A": "E",
		"\u00CB": "E",
		"\u0112": "E",
		"\u0118": "E",
		"\u0116": "E",
		"\u00C6": "E",
		"\u0152": "E",
		"\u011E": "G",
		"\u0120": "G",
		"\u0122": "G",
		"\u00CD": "I",
		"\u00CC": "I",
		"\u00CE": "I",
		"\u00CF": "I",
		"\u012A": "I",
		"\u0130": "I",
		"\u012E": "I",
		"\u0136": "K",
		"\u0141": "L",
		"\u0139": "L",
		"\u013D": "L",
		"\u013B": "L",
		"\u0143": "N",
		"\u0147": "N",
		"\u00D1": "N",
		"\u0145": "N",
		"\u00D3": "O",
		"\u00D2": "O",
		"\u00D4": "O",
		"\u00D5": "O",
		"\u00D6": "O",
		"\u014C": "O",
		"\u0150": "O",
		"\u00D8": "O",
		"\u0152": "O",
		"\u0158": "R",
		"\u0154": "R",
		"\u015A": "S",
		"\u0160": "S",
		"\u015E": "S",
		"\u0218": "S",
		"\u1E9E": "S",
		"\u0164": "T",
		"\u021A": "T",
		"\u00DE": "T",
		"\u00DA": "U",
		"\u00D9": "U",
		"\u00DB": "U",
		"\u00DC": "U",
		"\u016A": "U",
		"\u016E": "U",
		"\u0170": "U",
		"\u0172": "U",
		"\u00DD": "Y",
		"\u0178": "Y",
		"\u0179": "Z",
		"\u017D": "Z",
		"\u017B": "Z"
	};
	let diacriticsList = Object.keys(diacriticsMap);
	let diacriticExp = new RegExp("[" + diacriticsList.join("") + "]", "g");
	
	let letters = alphabet.concat(diacriticsList);
	let letterExp = new RegExp("[" + letters.join("") + "]", "g");
	
	// add letter buttons
	for(let i = 0; i < alphabet.length; i++) {
		let button = document.createElement("button");
		
		button.classList.add("button", "square")
		button.textContent = alphabet[i];
		
		letterButtons.appendChild(button);
	}
	
	// automatically update size of letter boxes to fit screen
	function updateLetterBoxes() {
		let count = word.length < 10 ? 10 : word.length;
		
		let margin = parseFloat(window.getComputedStyle(
			wordBox.firstChild).marginLeft) * 2;
		
		let letterWidth = Math.floor(main.clientWidth / count) - margin;
		let letterHeight = Math.round(letterWidth * 1.33);
		
		let fontSize = Math.round(letterWidth * 1.33);
		
		wordBox.style.fontSize = fontSize + "px";
		
		// apply calculated dimensions to each letter box
		for(let i = 0; i < wordBox.children.length; i++) {
			let cur = wordBox.children.item(i);
			// skip non-alphabetic characters
			if(cur.className === "char") continue;
			
			cur.style.width = letterWidth + "px";
			cur.style.height = letterHeight + "px";
		}
	}
	
	// check input word
	wordInputBox.addEventListener("input", checkInput);
	
	function checkInput() {
		let input = wordInputBox.value.trim()
			.replace(/ß/g, "\u1E9E") // convert to capital eszett
			.toUpperCase() // lowercase “ß” won’t become “SS”
			.replace(/\s+/g, " "); // whitespace should be single space
		
		let isValid = (
			input.length >= CONFIG["gameMinLength"] &&
			input.length <= CONFIG["gameMaxLength"] &&
			// at least two letters
			(input.match(letterExp) || []).length >= 2
		);
		
		let inputGroup = wordInputBox.closest(".input-group");
		
		if(!input) {
			// empty
			inputGroup.classList.remove("valid", "invalid");
			wordInputSubmit.disabled = "disabled";
			word = "";
		} else if(isValid) {
			// valid
			inputGroup.classList.add("valid");
			inputGroup.classList.remove("invalid");
			wordInputSubmit.disabled = "";
			word = input;
		} else {
			// invalid
			inputGroup.classList.add("invalid");
			inputGroup.classList.remove("valid");
			wordInputSubmit.disabled = "disabled";
			word = "";
		}
	}
	
	// click to submit word
	wordInputSubmit.addEventListener("click", function(e) {
		e.preventDefault();
		startGame();
	});
	
	// press enter to submit word
	wordInputBox.addEventListener("keydown", function(e) {
		if(e.key === "Enter" && this.classList.contains("valid")) {
			e.preventDefault();
			startGame();
		}
	});
	
	function startGame() {
		// insert letters
		for(let i = 0; i < word.length; i++) {
			if(!letters.includes(word[i])) {
				// insert special character
				let character = document.createElement("span");
				character.className = "char";
				character.textContent = word[i];
				wordBox.appendChild(character);
				continue;
			}
			
			let letterItem = document.createElement("div");
			let letterInner = document.createElement("span");
			
			letterItem.className = "letter";
			letterItem.appendChild(letterInner);
			
			wordBox.appendChild(letterItem);
			
			let letter = word[i];
			if(diacriticsList.includes(word[i])) {
				// remove diacritic
				letter = diacriticsMap[word[i]];
			}
			
			// list of letters to click
			if(!wantedLetters.includes(letter)) {
				wantedLetters.push(letter);
			}
		}
		
		updateLetterBoxes();
		window.addEventListener("resize", updateLetterBoxes);
		
		// hide input dialog
		inputWordDialog.classList.add("puff");
		inputWordDialog.addEventListener("animationend", function() {
			inputWordDialog.classList.remove("puff");
			inputWordDialog.classList.add("hidden");
		});
	}
	
	// clicked a letter
	letterButtons.addEventListener("click", function(e) {
		if(e.target.tagName !== "BUTTON") return;
		pickLetter(e.target);
	});
	
	function pickLetter(letterButton) {
		let letter = letterButton.textContent;
		
		// remove diacritics from word
		let plainWord = word.replace(diacriticExp, function(diacritic) {
			return diacriticsMap[diacritic];
		});
		
		if(!plainWord.includes(letter)) {
			// wrong letter
			changeSmiley("worse");
			if(smiley.className === "dead") {
				setTimeout(function() {
					gameOver();
				}, 500);
			}
			return;
		}
		
		for(let i = 0; i < plainWord.length; i++) {
			if(plainWord[i] !== letter) continue;
			
			// make letter bounce in
			let letterInner = wordBox.children.item(i)
				.querySelector("span");
			letterInner.textContent = word[i];
			letterInner.className = "bounce";
		}
		
		// remove letter from list
		wantedLetters.splice(wantedLetters.indexOf(letter), 1);
		
		if(wantedLetters.length === 0) gameWon();
		
		letterButton.disabled = "disabled";
	}
	
	function changeSmiley(mode) {
		let smileyStates = [
			"happy",
			"smile",
			"normal",
			"frown",
			"sad",
			"dead"
		];
		
		if(mode === "worse" || mode === "better") {
			// change relative to state
			let curState = smileyStates.indexOf(smiley.className);
			let newState = curState + (mode === "worse" ? 1 : -1);
			
			smiley.className = smileyStates[newState];
		} else if(smileyStates.includes(mode)) {
			// set to specific mode
			smiley.className = mode;
		}
	}
	
	function gameOver() {
		hintButton.disabled = "disabled";
		
		loseBanner.classList.add("fly-in");
		loseBanner.addEventListener("animationend", function() {
			loseBanner.classList.remove("fly-in");
			changeSmiley("happy");
			
			wantedLetters = [];
			
			// clear letters
			for(let i = 0; i < wordBox.children.length; i++) {
				let letterInner = wordBox.children.item(i)
					.querySelector("span");
				letterInner.textContent = "";
				letterInner.className = "";
			}
			
			// clear clicked letters
			for(i = 0; i < letterButtons.children.length; i++) {
				letterButtons.children.item(i).disabled = "";
			}
		});
	}
	
	function gameWon() {
		changeSmiley("happy");
		
		hintButton.disabled = "disabled";
		
		let i = 0;
		let timer = setInterval(function() {
			// highlight all letters as effect
			wordBox.children.item(i).classList.add("highlight");
			
			if(!word[++i]) clearInterval(timer);
		}, 100);
		
		// when effect finished
		wordBox.lastChild.addEventListener("animationend", function(e) {
			if(e.animationName.includes("highlight")) {
				// clear highlight class
				for(let i = 0; i < wordBox.children.length; i++) {
					wordBox.children.item(i).classList.remove("highlight");
				}
				
				showBanner();
			}
		});
		
		function showBanner() {
			winBanner.classList.add("fly-in");
			winBanner.addEventListener("animationend", function() {
				winBanner.classList.remove("fly-in");
			});
		}
	}
	
	hintButton.addEventListener("click", function() {
		// reveal random missing letter
		let randomIndex = Math.floor(Math.random() * wantedLetters.length);
		let letterIndex = alphabet.indexOf(wantedLetters[randomIndex]);
		let letterButton = letterButtons.children.item(letterIndex);
		
		// start petals effect
		drawPetals(hintButton, letterButton, function() {
			pickLetter(letterButton);
		});
	});
	
	function drawPetals(fromEl, toEl, callback) {
		// get position of elements
		let fromElPos = fromEl.getBoundingClientRect();
		let fromX = fromElPos.x + fromEl.clientWidth / 2;
		let fromY = fromElPos.y + fromEl.clientHeight / 2;
		
		let toElPos = toEl.getBoundingClientRect();
		let toX = toElPos.x + toEl.clientWidth / 2;
		let toY = toElPos.y + toEl.clientHeight / 2;
		
		let diffX = toX - fromX;
		let diffY = toY - fromY;
		let diff = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
		
		let petalPercent = 0.03;
		let petalCount = Math.floor(diff * petalPercent);
		let lastX = 0;
		let petalList = [];
		
		// make petals fly along a curve
		for(let i = 0; i < petalCount; i++) {
			let randX = Math.floor(Math.random() * 30) - 15;
			let randY = Math.floor(Math.random() * 30) - 15;
			
			lastX += diffX / petalCount;
			let x = fromX + lastX + randX;
			
			let y = fromY + Math.pow((i + 1) / petalCount, 3) * diffY + randY;
			
			petalList.push({ "x": x, "y": y });
		}
		
		// add petals one after the other
		i = 0;
		let timer = setInterval(function() {
			let isLast = !petalList[i + 1];
			// apply puff effect on last petal
			addPetal(petalList[i].x, petalList[i].y, isLast);
			i++;
			
			if(isLast) {
				clearInterval(timer);
				callback();
			}
		}, 20);
	}
	
	function addPetal(x, y, puff) {
		let petal = document.createElement("div");
		petal.className = "petal";
		
		// random petal size
		petal.style.width = Math.floor(Math.random() * 4) + 12;
		petal.style.height = Math.floor(Math.random() * 4) + 12;
		
		petal.style.left = x + "px";
		petal.style.top = y + "px";
		
		if(puff) {
			petal.classList.add("puff");
		} else {
			// random duration and opacity
			let duration = Math.floor(Math.random() * 800) + 300;
			petal.style.animationDuration = duration + "ms";
			console.log(petal.style.animationDuration);
			petal.style.filter = "opacity(" + (Math.random() * 0.5 + 0.5) + ")";
		}
		
		goodieButtons.appendChild(petal);
		
		// remove petal afterwards
		petal.addEventListener("animationend", function() {
			petal.parentNode.removeChild(petal);
		});
	}
	
	// generate random word
	randomWordButton.addEventListener("click", function() {
		let randomWord = "";
		do {
			let rand = Math.floor(Math.random() * RANDOM_WORDS.length);
			randomWord = RANDOM_WORDS[rand];
		} while(randomWord === wordInputBox.value);
		wordInputBox.value = randomWord;
		
		checkInput();
		
		wordInputBox.classList.add("toggle");
		wordInputBox.addEventListener("animationend", function() {
			wordInputBox.classList.remove("toggle");
		});
	});
})();