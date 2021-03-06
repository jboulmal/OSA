<?php
/*--------------------------------------------------------
 * Module Name : ApplianceManager
 * Version : 1.0.0
 *
 * Software Name : OpenServicesAccess
 * Version : 1.0
 *
 * Copyright (c) 2011 – 2014 Orange
 * This software is distributed under the Apache 2 license
 * <http://www.apache.org/licenses/LICENSE-2.0.html>
 *
 *--------------------------------------------------------
 * File Name   : ApplianceManager/ApplianceManager.php/resources/json/Logs.php
 *
 * Created     : 2012-02
 * Authors     : Benoit HERARD <benoit.herard(at)orange.com>
 *
 * Description :
 *      Various functions to managed paginated lists
 *--------------------------------------------------------
 * History     :
 * 1.0.0 - 2012-10-01 : Release of the file
*/
require_once "../objects/ApplianceObject.class.php";

function generatePreviousLink($uri, $currentOffset){
	$applianceObject = new ApplianceObject();
	$uriPrefix = $applianceObject->getPublicUriPrefix();

	$queryString="";
	foreach ($_REQUEST as $prm => $prmValue){
		if ($prm != "offset"){
			if ($queryString != ""){
				$queryString=$queryString . "&";
			}
			$queryString=$queryString . $prm . "=" . urlencode($prmValue);
		}
	}

	if ($currentOffset==0){
		$previous="";
	}else{
		$previous=$uriPrefix . $uri . "/?" . $queryString . "&offset=" . ($currentOffset-1);
	}
	return $previous;
}

function generateNextLink($uri, $currentOffset, $pageCount, $listCount){
		$applianceObject = new ApplianceObject();
		$uriPrefix = $applianceObject->getPublicUriPrefix();

		$queryString="";
		foreach ($_REQUEST as $prm => $prmValue){
			if ($prm != "offset"){
				if ($queryString != ""){
					$queryString=$queryString . "&";
				}
				$queryString=$queryString . $prm . "=" . urlencode($prmValue);
			}
		}
		if ($pageCount + ($currentOffset * recordCountPerPage) < $listCount){
			$next = $previous=$uriPrefix . $uri . "/?" . $queryString . "&offset=" . ($currentOffset+1);
		}else{
			$next="";
		}
		return $next;
}
?>
