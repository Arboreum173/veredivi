<?php

if(
	!is_string($_POST["script"]) ||
	!preg_match("/^[a-z-]{1,30}$/", $_POST["script"])
) {
	throw new \Exception("Invalid file name");
}

$file = $_POST["script"] . ".php";

$dir = __DIR__ . "/../php/script/";
$list = array_diff(scandir($dir), ["..", "."]);

if(in_array($file, $list)) {
	require $dir . $file;
}