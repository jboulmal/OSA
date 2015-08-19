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
 * File Name   : ApplianceManager/ApplianceManager.php/index.php
 *
 * Created     : 2012-02
 * Authors     : Benoit HERARD <benoit.herard(at)orange.com>
 *
 * Description :
 *      Main HTML page for GUI bootstrapping AJAX app.
 *--------------------------------------------------------
 * History     :
 * 1.0.0 - 2012-10-01 : Release of the file
*/
 
require_once 'include/Constants.php';
require_once 'include/Settings.ini.php';
require_once 'include/Mobile_Detect.php';
$firstName="";
$lastName="";
$hdrs=getallheaders();
if (isset($hdrs[firstNameHeader])){
	$firstName=$hdrs[firstNameHeader];
}
if (isset($hdrs[lastNameHeader])){
	$lastName=$hdrs[lastNameHeader];
}
?>
<html>
	<head>
	
		<title>Open Services Access Appliance manager</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<!--		<link rel="stylesheet" media="all" type="text/css" href="css/jquery-ui.css" />
		<link rel="stylesheet" type="text/css" href="./css/dateTimePicker.css">
		<link rel="stylesheet" type="text/css" href="./css/orangeNursery.css">-->
		<?php
		/*$detect = new Mobile_Detect();
		if (!$detect->isMobile()) {
			echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"./css/checkbox-radio.css\">\n";
		}*/
		?>
		<link rel="stylesheet" type="text/css" href="./css/osa.css.php">
		

		<!--<script type="text/javascript" src="js/jquery-1.8.2.js"></script>
		<script type="text/javascript" src="js/jquery-ui-1.9.0.custom.min.js"></script>
				
		<script type="text/javascript" src="js/jquery-ui-timepicker-addon.js"></script>
		<script type="text/javascript" src="js/error.js"></script>
		<script type="text/javascript" src="js/users.js"></script>
		<script type="text/javascript" src="js/date.js"></script>
		<script type="text/javascript" src="js/groups.js"></script>
		<script type="text/javascript" src="js/services.js"></script>
		<script type="text/javascript" src="js/util.js"></script>
		<script type="text/javascript" src="js/quotas.js"></script>
		<script type="text/javascript" src="js/wait.js"></script>
		<script type="text/javascript" src="js/counters.js"></script>
		<script type="text/javascript" src="js/logs.js"></script>
		<script type="text/javascript" src="js/scrolltable.js"></script>
		<script type="text/javascript" src="js/touchScreenDevice.js"></script>-->
		<script type="text/javascript" src="js/osa.js.php"></script>
	
		<script>
			var mouseLeaveTimer;
			$('.selector').tooltip().on('mouseleave', function(e){
				var that = this;

				// close the tooltip later (maybe ...)
				mouseLeaveTimer = setTimeout(function(){
					$(that).tooltip('close');
				}, 100);

				// prevent tooltip widget to close the tooltip now
				e.stopImmediatePropagation(); 
			});

			$(document).on('mouseenter', '.ui-tooltip', function(e){
				// cancel tooltip closing on hover
				clearTimeout(mouseLeaveTimer);
			});

			$(document).on('mouseleave', '.ui-tooltip', function(){
				// make sure tooltip is closed when the mouse is gone
				$('.selector').tooltip('close');
			});			
		</script>
	</head>
	<body >
		<div id="waitScreen" class="rounded-corners"  style="position: absolute; z-index:3; visibility: hidden; background-color:#000000;  ">
		</div>
		<div id="logo" style="padding-left:10px;">
			<img src="./images/LogoTitle.jpg" />
		</div>
		<div id="title">
			<div style="padding-left:20px;">
				Welcome <b><?php echo $firstName?></b>
			</div>
		</div>
		
		<div id="menu"><?php include "include/menu.php"?></div>
		<div id="content">
		</div>
		<div id="footer">
		<hr>
			<span class="withRightBorder">
				Open Services Access V<?echo version?>
			</span>
		</div>
	</body>
</html>