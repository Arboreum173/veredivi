<?php

require __DIR__ . "/../top.php";

class Utility {
	// note: static methods are generally bad practice,
	// but in this case I thought it was OK
	public static function escapeHtml(string $str): string {
		return htmlspecialchars($str, ENT_QUOTES, "UTF-8");
	}
	
	public static function stringifyTimestamp(int $timestamp): string {
		return strftime("%m/%d/%Y", $timestamp);
	}
	
	public static function returnSiteConfig(): string {
		return "<script>var CONFIG = " . json_encode(CONFIG) . ";</script>";
	}
	
	public static function getHtmlHead(): string {
		return file_get_contents(SITE . "/site/head.html");
	}
	
	public static function getHtmlNavigation(): string {
		return file_get_contents(SITE . "/site/navigation.html");
	}
	
	public static function getHtmlScreenHint(): string {
		return file_get_contents(SITE . "/site/screen-hint.html");
	}
	
	public static function getInputTemp(string $var): string {
		$var = "temp_" . $var;
		if(isset($_SESSION[$var])) {
			$input = $_SESSION[$var];
			unset($_SESSION[$var]);
			
			return Utility::escapeHtml($input);
		}
		
		return "";
	}
	
	public static function returnRandomWords(): string {
		$randomWords = file_get_contents(SITE . "/site/random-words.json");
		
		return "<script>var RANDOM_WORDS = " . $randomWords . ";</script>";
	}
}