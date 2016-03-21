<?php

include 'echo.php';

function filter2array($filename) {
	$add = false;
	$shownum = 0;
	$hidenum = 0;
	$handle = @fopen($filename, 'r');
	if ( $handle ) {
		while ( ($buffer = fgets($handle, 4096)) !== false ) {
			$buffer = trim($buffer);
			if ( $buffer AND $buffer[0] != '#' ) {
				$filter[] = $buffer;
			}
		}
		fclose($handle);
		foreach ( $filter as $value ) {
			if ( strtolower($value) == 'show' ) {
				$shownum++;
				$ret[$value .'_' . $shownum] = array();
				continue;
			}
			if ( strtolower($value) == 'hide' ) {
				$hidenum++;
				$ret[$value . '_' . $hidenum] = array();
				continue;
			}
			end($ret);
			$ret[key($ret)][] = $value;
		}
		return $ret;
	}
	return false;
}

$filter = filter2array('test1.filter');
echo_array($filter);

?>