<?php
	
	require __DIR__ . "/php/top.php";
	
	$token = Token::generate();
	
?>
<html>
<head>
	<title><?php echo CONFIG["siteName"] . " | "; ?>Sign In</title>
	<?php echo Utility::getHtmlHead(); ?>
</head>
<body>
	<?php echo Utility::getHtmlNavigation(); ?>
	<header id="header">
		<h1>Sign In</h1>
	</header>
	<main id="main">
		<form method="POST">
			<input type="hidden" name="script" value="sign-in" />
			<input type="hidden" name="token" value="<?php echo $token; ?>" />
			<section class="input-group checked-nickname">
				<label for="nickname">Nickname</label>
				<input type="text" id="nickname" name="nickname" required autofocus />
			</section>
			<section class="input-group">
				<label for="password">Password</label>
				<div class="input-button password-eye">
					<input type="password" id="password" name="password" required />
					<button type="button"><img src="img/eye.svg" /></button>
				</div>
			</section>
			<button type="submit" class="button" disabled>Let’s go!</button>
		</form>
		<p class="note">Don’t have an account yet? <a href="register">Register here.</a></p>
	</main>
	<?php
		echo Utility::getHtmlScreenHint() .
			Utility::returnSiteConfig();
	?>
	<script src="js/svg-inject.min.js"></script>
	<script src="js/forms.js"></script>
</body>
</html>