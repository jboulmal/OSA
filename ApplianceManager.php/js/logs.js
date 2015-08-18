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
 * File Name   : ApplianceManager/ApplianceManager.php/js/logs.js
 *
 * Created     : 2012-02
 * Authors     : Benoit HERARD <benoit.herard(at)orange.com>
 *
 * Description :
 *      AJAX Management for logs
 *--------------------------------------------------------
 * History     :
 * 1.0.0 - 2012-10-01 : Release of the file
*/

			var	logSearch_userName="";
			var logSearch_serviceName="";
			var logSearch_status="";
			var logSearch_message="";
			var logSearch_from="";
			var	logSearch_until="";
			var logSearch_frontEndEndPoint="";
			
			var logRegExComp="<br>(may include * for any string)";
			var logServiceNameToolTip="Choose the service for which you want to find logs or leave empty for any." + logRegExComp;
			var logUserNameToolTip="Choose the user for which you want to find logs or leaves empty for any." + logRegExComp;
			var logHTTPStatusToolTip="Enter the HTTP Status of the response send to consumer for which you want to find logs or leave empty for any.";
			var logFromToolTip="Enter the date/time from which logs where recorded or leave empty for any.";
			var logUntilToolTip="Enter date/time until which logs where recorded. Leave empty for any.";
			var logMessageToolTip="Enter the error message returned to consumer. Leave empty for any" + logRegExComp;
			var logFrontEndEndPointToolTip="Enter the error message returned to consumer. Leave empty for any" + logRegExComp;
			


			var nextFetch="";
			var previousFetch="";
			var fetchingMore=0;

			function resetSearchLogs(){
				logSearch_userName="";
				logSearch_serviceName="";
				logSearch_status="";
				logSearch_message="";
				logSearch_from="";
				logSearch_until="";
				logSearch_frontEndEndPoint="";
				
				searchLogs();
			}
			
			function generateLogsTableRows(logsList){
				strHTML="";
				for (i=0;i<logsList.length;i++){
					strHTML+="<tr class=\"tabular_table_body" +  (i%2) + " item\">";
					strHTML+="<td  title=\"" + logsList[i].serviceName + "\" class=\"serviceName\">"  +logsList[i].serviceName + "</td>";
					strHTML+="<td title=\"" + logsList[i].userName + "\">" + logsList[i].userName + "&nbsp;</td>";
					strHTML+="<td title=\"" + logsList[i].frontEndUri + "\">" + logsList[i].frontEndUri + "</td>";
					strHTML+="<td class=\"status\">" + logsList[i].status + "</td>";
					strHTML+="<td>" + logsList[i].message + "</td>";
					D= new Date();
					D.setISO8601(logsList[i].timeStamp);
					strHTML+="<td>" + D.format("mm/dd/yyyy HH:MM:ss") + "</td>";
					strHTML+="</tr>";
				}
				return strHTML;
		    }
			
			function displayLogsList(logsList){
				
				
				strHTML="";
				strHTML+="<center>";
				strHTML+="<h1>";
				strHTML+="<div id=\"logsCount\">" + logsList.length + " hits found</div>";
				strHTML+="</h1>";
				strHTML+="<hr>";
				if (logsList.logs.length>0){
					strHTML+="<table id=\"logsList\" class=\"tabular_table scroll\">";
					strHTML+="<thead><tr class=\"tabular_table_header\">";
					strHTML+="<th>Service name</th>";
					strHTML+="<th>User name</th>";
					strHTML+="<th>Frontend endpoint</th>";
					strHTML+="<th>Status</th>";
					strHTML+="<th>Message</th>";
					strHTML+="<th>Timestamp</th>";
					strHTML+="</tr></thead><tbody>";
					strHTML+=generateLogsTableRows(logsList.logs);
					strHTML+="</tbody>";
					strHTML+="</table>";
					nextFetch = logsList.next;
					previousFetch=logsList.previous;
				}else{
					nextFetch = "";
					previousFetch="";
				}
				fetchingMore=0;
				strHTML+="<br>";
				strHTML+="<input type=\"button\" id=\"back\" onclick=\"searchLogs()\" value=\"Back\" class=\"button_orange\">&nbsp;";
				strHTML+="<input type=\"button\" id=\"refresh\" onclick=\"executeSearchLog()\" value=\"Refresh\" class=\"button_orange\">&nbsp;";
				strHTML+="</center>";

				c=document.getElementById('content');
				c.innerHTML=strHTML;
				hideWait();
				/* make the table scrollable with a fixed header */
				$("table.scroll").createScrollableTable({
					width: '800px',
					height: '350px',
					border: '0px'
				});
				$("#logsList_body_wrap").scroll(function(){
					var item=$('.item:last');
					var wrap=$("#logsList_body_wrap");
						/* If last item appear and we are not fetching and there something to fetch then fetch next*/
						if ((wrap.offset().top + wrap.height() - item.height() )> item.offset().top && fetchingMore==0 && nextFetch!=""){
							fetchingMore=1;
							showWait();
							$.ajax({
								url: nextFetch,
								dataType: 'json',
								type:'GET',
								success: addFetch,
								error: displayError
							});

						}
							
				});
				touchScroll("logsList_body_wrap");
}

			function addFetch(logsList){
					hideWait();
					fetchingMore=0;
					nextFetch = logsList.next;
					previousFetch=logsList.previous;
					$("#logsCount").html(logsList.length + " hits found");
					$('.item:last').after(generateLogsTableRows(logsList.logs));
			}
			
			function startPopulateAutoCompleteServices(){
				$.getJSON("services/?withLog=&order=serviceName", populatePopulateAutoCompleteServices).error(displayError);
			}
			function startPopulateAutoCompleteUsers(){
				$.getJSON("users/?withLog=&order=userName", populatePopulateAutoCompleteUsers).error(displayError);
			}
			function populatePopulateAutoCompleteServices(servicesList){
				var serviceListAutoComplete=new Array();
				var autoCompIdx=0;
				for (i=0;i<servicesList.length;i++){
					if (servicesList[i].isHitLoggingEnabled==1){
						serviceListAutoComplete[autoCompIdx++]=servicesList[i].serviceName;
					}
				}

				$( "#serviceName" ).autocomplete({
								source: serviceListAutoComplete,
								minLength: 0
				});
			}
			function populatePopulateAutoCompleteUsers(usersList){
				var userListAutoComplete=new Array();
				userListAutoComplete[0]="None"
				for (i=0;i<usersList.length;i++){
					userListAutoComplete[i+1]=usersList[i].userName
				}

				$( "#userName" ).autocomplete({
								source: userListAutoComplete,
								minLength: 0
				});
			}
			

			function startSearchLogs(){
				logSearch_userName=document.getElementById("userName").value;
				logSearch_serviceName=document.getElementById("serviceName").value;
				logSearch_status=document.getElementById("httpStatus").value;
				logSearch_message=document.getElementById("message").value;
				logSearch_frontEndEndPoint=document.getElementById("frontEndEndPoint").value;
				logSearch_from=document.getElementById("from").value;
				logSearch_until=document.getElementById("until").value;

				executeSearchLog();
			}
			
			function executeSearchLog(){
				queryString="";
				if (logSearch_serviceName != ""){
					queryString+="serviceName=" + encodeURIComponent(logSearch_serviceName) + "&";
				}
				
				if (logSearch_userName != ""){
					if (queryString != ""){
						queryString +="&";
					}
					if (logSearch_userName=="None"){
						queryString+="userName=";
					}else{
						queryString+="userName=" + encodeURIComponent(logSearch_userName) ;
					}
				}
				if (logSearch_frontEndEndPoint != ""){
					if (queryString != ""){
						queryString +="&";
					}
					queryString+="frontEndEndPoint=" + encodeURIComponent(logSearch_frontEndEndPoint) ;
				}
				if (logSearch_status != ""){
					if (queryString != ""){
						queryString +="&";
					}
					queryString+="status=" + encodeURIComponent(logSearch_status) ;
				}
				if (logSearch_message != ""){
					if (queryString != ""){
						queryString +="&";
					}
					queryString+="message=" + encodeURIComponent(logSearch_message) ;
				}
				if (logSearch_from != ""){
					if (queryString != ""){
						queryString +="&";
					}
					D = new Date(logSearch_from + ":00");
					//D.setISO8601();
					queryString+="from=" + encodeURIComponent(D.format("isoUtcDateTime")) ;
				}
				if (logSearch_until != ""){
					if (queryString != ""){
						queryString +="&";
					}
					D = new Date(logSearch_until + ":00");
					//D.setISO8601(logSearch_until + ":00");
					queryString+="until=" + encodeURIComponent(D.format("isoUtcDateTime")) ;
				}
				go=true;
				if (queryString == ""){
					go=confirm("Execute a query without any criteria can be very long and generate heavy load on appliance.\nContinue anyway?");
				}
				if (go){
					if (queryString != ""){
						queryString +="&";
					}
					queryString +="order=" + encodeURIComponent("timeStamp desc") ;
					showWait();
					$.ajax({
						  url: "logs/?" + queryString,
						  dataType: 'json',
						  type:'GET',
						  success: displayLogsList,
						  error: displayError
						});
				}
			}
			
			function searchLogs(){
				strHTML="";
				strHTML+="<center>";
				strHTML+="<h1>";
				strHTML+="Search for logs";
				strHTML+="</h1>";
				strHTML+="<hr>";
				strHTML+="<table class=\"tabular_table\">";
				strHTML+="	<tr class=\"tabular_table_body\">";
				strHTML+="		<th>Service Name:</th>";
				strHTML+="		<td colspan=\"3\"><input class=\"inputText\" title=\"" + logServiceNameToolTip + "\" type\"text\" id=\"serviceName\" value=\"" + logSearch_serviceName + "\" onfocus=\"javascript:$(this).autocomplete('search',$(this).value);\"></td>";
				strHTML+="	<tr class=\"tabular_table_body\">";
				strHTML+="		<th>User name:</th>";
				strHTML+="		<td colspan=\"3\"><input class=\"inputText\" title=\"" + logUserNameToolTip + "\"  type\"text\" id=\"userName\" value=\"" + logSearch_userName + "\"onfocus=\"javascript:$(this).autocomplete('search',$(this).value);\"></td>";
				strHTML+="	</tr>";
				strHTML+="	<tr class=\"tabular_table_body\">";
				strHTML+="		<th>Frontend endpoint:</th>";
				strHTML+="		<td colspan=\"3\"><input class=\"inputText\"  title=\"" + logFrontEndEndPointToolTip + "\" type\"text\" value=\"" + logSearch_frontEndEndPoint + "\" id=\"frontEndEndPoint\"></td>";
				strHTML+="	</tr>";
				strHTML+="	<tr class=\"tabular_table_body\">";
				strHTML+="		<th>HTTP Status:</th>";
				strHTML+="		<td colspan=\"3\"><input  class=\"inputText\" title=\"" + logHTTPStatusToolTip + "\" type\"text\" value=\"" + logSearch_status + "\"id=\"httpStatus\"></td>";
				strHTML+="	</tr>";
				strHTML+="	<tr class=\"tabular_table_body\">";
				strHTML+="		<th>Message:</th>";
				strHTML+="		<td colspan=\"3\"><input class=\"inputText\"  title=\"" + logMessageToolTip + "\" type\"text\" value=\"" + logSearch_message + "\" id=\"message\"></td>";
				strHTML+="	</tr>";
				strHTML+="	<tr class=\"tabular_table_body\">";
				strHTML+="		<th>From:</th><td><input title=\"" + logFromToolTip + "\"  class=\"inputDT\" value=\"" + logSearch_from + "\" type=\"text\" id=\"from\"></td>";
				strHTML+="		<th>Until:</th><td><input  title=\"" + logUntilToolTip + "\" class=\"inputDT\"  type=\"text\" value=\"" + logSearch_until + "\" id=\"until\"></td>";
				strHTML+="	</tr>";
				strHTML+="</table>";
				strHTML+="<br>";
				strHTML+="<input type=\"button\" id=\"seach\" onclick=\"startSearchLogs()\" value=\"Search\" class=\"button_orange\">&nbsp;";
				strHTML+="<input type=\"button\" id=\"reset\" onclick=\"resetSearchLogs()\" value=\"Reset\" class=\"button_orange\">&nbsp;";
				strHTML+="</form>";
				strHTML+="<hr>";
				strHTML+="</center>";
				startPopulateAutoCompleteServices();
				startPopulateAutoCompleteUsers();
				c=document.getElementById('content');
				c.innerHTML=strHTML;
				$('#from').datetimepicker();
				$('#until').datetimepicker();

			}

				
//Event 			
			$(
				function (){
					$('#searchLogs').click(searchLogs);
				}
			)
