<?php

if(!isset($_SESSION)) {
	session_name("veredivi");
	session_start();
}

if(!defined("SITE")) define("SITE", __DIR__ . "/..");

if(!defined("CONFIG")) {
	$config = json_decode(file_get_contents(SITE . "/site/site.json"), true);
	
	// parse variables in config properties
	array_walk_recursive($config, function(&$val, $prop) use($config) {
		if(!is_string($val)) return;
		
		$val = preg_replace_callback(
			"/{{(.+?)}}/",
			function($matches) use($config) {
				$prop = $matches[1];
				
				if($prop === "currentNickname") {
					return isset($_SESSION["username"]) ? $_SESSION["username"] : "";
				}
				
				if(isset($config[$prop])) {
					$val = $config[$prop];
					
					if(is_string($val) || is_numeric($val)) {
						return $val;
					} else {
						throw new \Exception("Config property must either " .
							"resolve to a string or a number");
					}
				} else {
					throw new \Exception("Config property " . $prop . " not found");
				}
			},
			$val
		);
	});
	
	define("CONFIG", $config);
}

spl_autoload_register(function($class) {
	$file = __DIR__ . "/classes/" . $class . ".php";
	if(is_readable($file)) require_once $file;
});