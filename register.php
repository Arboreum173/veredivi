<?php
	
	require __DIR__ . "/php/top.php";
	
	$token = Token::generate();
	
?>
<html>
<head>
	<title><?php echo CONFIG["siteName"] . " | "; ?>Register</title>
	<?php echo Utility::getHtmlHead(); ?>
</head>
<body>
	<?php echo Utility::getHtmlNavigation(); ?>
	<header id="header">
		<h1>Register</h1>
	</header>
	<main id="main">
		<p class="note">Already have an account? <a href="sign-in">Sign in here.</a></p>
		<hr />
		<form method="POST">
			<input type="hidden" name="script" value="register" />
			<input type="hidden" name="token" value="<?php echo $token; ?>" />
			<section class="input-group checked-nickname">
				<label for="nickname">Nickname</label>
				<div class="horizontal">
					<input type="text" id="nickname" name="nickname" required autofocus />
					<div class="tooltip">
						<div class="validator"></div>
						<span class="text"><?php echo CONFIG["nicknameRegisterEmpty"]; ?></span>
					</div>
				</div>
			</section>
			<section class="input-group checked-password">
				<label for="password">Password</label>
				<div class="horizontal">
					<div class="input-button password-eye">
						<input type="password" id="password" name="password" required />
						<button type="button"><img src="img/eye.svg" /></button>
					</div>
					<div class="quality-checker tooltip">
						<div class="smiley anchor">
							<div class="left-eye"></div>
							<div class="right-eye"></div>
							<div class="mouth"></div>
						</div>
						<span class="text"><?php echo CONFIG["passwordRegisterEmpty"]; ?></span>
					</div>
				</div>
			</section>
			<section class="input-group">
				<label for="confirm-password">Confirm Password</label>
				<div class="input-button password-eye">
					<div class="horizontal">
						<input type="password" id="confirm-password" name="confirm-password" required />
						<div class="validator"></div>
					</div>
					<button type="button"><img src="img/eye.svg" /></button>
				</div>
			</section>
			<button type="submit" class="button" disabled>Let’s go!</button>
		</form>
	</main>
	<?php
		echo Utility::getHtmlScreenHint() .
			Utility::returnSiteConfig();
	?>
	<script src="js/svg-inject.min.js"></script>
	<script src="js/forms.js"></script>
</body>
</html>