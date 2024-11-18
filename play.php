<?php
	
	require __DIR__ . "/php/top.php";
	
?>
<html>
<head>
	<title><?php echo CONFIG["siteName"] . " | "; ?>Play</title>
	<?php echo Utility::getHtmlHead(); ?>
	<link rel="stylesheet" type="text/css" href="css/play.css" />
</head>
<body class="no-scroll">
	<div id="win-banner" class="banner green"><div>YOU DID IT</div></div>
	<div id="lose-banner" class="banner"><div>GAME OVER</div></div>
	<main id="main">
		<div>
			<section id="word"></section>
			<section id="puzzle">
				<section id="smiley" class="happy">
					<div class="head">
						<div class="left-eye"></div>
						<div class="right-eye"></div>
						<div class="mouth"></div>
					</div>
				</section>
				<section id="buttons">
					<div>
						<section id="letters"></section>
						<section id="goodies">
							<button id="hint" class="button red square"><img src="img/light-bulb.svg" /></button>
						</section>
					</div>
				</section>
			</section>
		</div>
	</main>
	<?php echo Utility::getHtmlScreenHint(); ?>
	<div id="input-word" class="cover">
		<div>
			<img src="img/veredivi.svg" class="logo" />
			<p>Enter a word to guess (up to 20 characters).</p>
			<form>
				<section class="input-group horizontal">
					<div class="input-button">
						<input type="text" id="word-input" autofocus />
						<div class="tooltip">
							<button type="button" id="random-word" class="anchor">
								<img src="img/light-bulb.svg" />
							</button>
							<span class="text">I need inspiration!</span>
						</div>
					</div>
					<div class="validator"></div>
				</section>
				<button type="submit" id="word-input-submit" class="button" disabled>Let’s go!</button>
			</form>
		</div>
	</div>
	<?php echo Utility::returnSiteConfig() .
		Utility::returnRandomWords(); ?>
	<script src="js/svg-inject.min.js"></script>
	<script src="js/play.js"></script>
</body>
</html>