<?php

require __DIR__ . "/../top.php";

class Token {
	public static function generate(): string {
		$_SESSION["token"] = bin2hex(random_bytes(16));
		$_SESSION["token_time"] = time();
		
		return $_SESSION["token"];
	}
	
	public static function validate(string $token): int {
		$response_id = 0;
		
		// bad request
		if($_SERVER["REQUEST_METHOD"] !== "POST") {
			$response_id = 1;
		}
		
		// invalid token
		if(
			!isset($_SESSION["token"]) ||
			!hash_equals($_SESSION["token"], $token)
		) {
			$response_id = 2;
		}
		
		// token expired
		if(time() - $_SESSION["token_time"] > 1800) {
			$response_id = 3;
		}
		
		if($response_id !== 0) {
			unset($_SESSION["token"], $_SESSION["token_time"]);
			$_SESSION["response_id"] = $response_id;
		}
		
		return $response_id;
	}
}