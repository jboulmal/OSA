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
 * File Name   : ApplianceManager/ApplianceManager.php/js/services.js
 *
 * Created     : 2012-02
 * Authors     : Benoit HERARD <benoit.herard(at)orange.com>
 *
 * Description :
 *      AJAX MAnagement for services
 *--------------------------------------------------------
 * History     :
 * 1.0.0 - 2012-10-01 : Release of the file
*/

			var currentService;
			var currentServiceGroup;
			var serviceModified;

			var availableNodesToolTip = "List of nodes on which current service is available<br>Multi selection is possible";
			var serviceNameToolTip="Enter the service name here<br>Service name is service identifier and can not be changed later";
			var isUserAuthenticationToolTip="If this checkbox is checked, basic authentication will activated on this service";
			var serviceGroupToolTip="Group of users allowed to use this service.<br>Members of this group will be allowed to use this service"; 
			var isPublishedToolTip="If this checkbox is checked, the service is available on publishing nodes.<br>If not, the service can not be used"; 
			var frontEndToolTip="Service's controls are applied to URL<br>called on publishing node begining with this value.<br>Must begin with a /<br>Ex.:<br>/demo";
			var backEndURLToolTip="Backend on which request are proxified<br>Can either be http or https<br>ex.:<br>http://backendserver.private.net/demo"; 
			var identityForwardingToolTip="If this checkbox is checked, HTTP headers containing consumer identity are send to backend"; 
			var backendUserToolTip="If backend system requires basic authentication, enter here the username to use to connect it";
			var backendPasswordToolTip="If backend system requires basic authentication, enter here the username's password to use to connect it";
			var serviceQuotaToolTip="If this checkbox is checked, quotas management on this service are activated<br>Quotas are applied globally (maximum values allowed for all consumers)";
			var perSecToolTip="Maximum number of request per second send to backend";
			var perDayToolTip="Maximum number of request per day send to backend";
			var perMonthToolTip="Maximum number of request per month send to backend";
			var userQuotaToolTip="If this checkbox is checked,<br>quotas management on this service user per user are activated.";
			var logHitToolTip="If this checkbox is checked, hits on this service are recorded in logs<br>Use with care, it may dramatically slow down the system....";
			var additionalConfigurationToolTip="Enter here addtional Apache directive configuration.<br>CAUTION use wih care: it may corrupt entire configuration";
			var serviceOnAllNodesToolTip="If this checkbopx is check, servie will be available on evry nodes, else only on selected list";
			var isAnonymousAllowedToolTip="Even if an authorization is set (group or valid user, resource can be acceded without authentication. In such a case, up to back to process properly depending on the fact the user is connected or not";
			var loginFormUriToolTip="(optional) This URL is used to redirect unauthenticated users on nodes where cookie auth is enabled";

			var editServiceToolTip="Edit this service";
			var deleteServiceToolTip="Delete this service";
			var addServiceTooTip="Add a new servie to the system";
			
			
			var serviceNameFilterPrevVal="";
			var serviceGroupNameFilterPrevVal="";
			var frontEndEndPointFilterPrevVal="";
			var backEndEndPointFilterPrevVal="";

			function setServiceModified(isModified){
				serviceModified=isModified;
				if (isModified){
					setActionButtonEnabled('saveService',true);
				}else{
					setActionButtonEnabled('saveService',false);
				}
				if (document.getElementById("additionalConfiguration").value != ""){
					$("#warnAdditionalConfig").show();
				}else{
					$("#warnAdditionalConfig").hide();
				}

			}
			

			function startEditService(serviceURI){
				$.getJSON(serviceURI, editService).error(displayErrorV2);
			}
			
			function startPopulateGroups(){
				$.getJSON("groups/", populateGroups).error(displayErrorV2);
			}
			
			function populateGroups(groupList){
				if (groupList.length>0){
					strHTML="";
					strHTML+="<select class=\"inputText\"  title=\"" + serviceGroupToolTip + "\" name=\"groupName\" id=\"groupName\"  onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\">";
					strHTML+="<option name=\"none\" value=\"\" >-- Choose one --</option>";
					for (i=0;i<groupList.length;i++){
						if (groupList[i].uri == currentServiceGroup){
							sel="SELECTED";
						}else{
							sel="";
						}
						strHTML+="<option name=\"" + groupList[i].groupName + "\" value=\"" + groupList[i].groupName + "\" " + sel + " >";
						if (groupList[i].description===""){
							strHTML +=groupList[i].groupName
						}else{
							strHTML +=groupList[i].description;
						}
						strHTML += "</option>";
					}
					strHTML+="</select>";
					c=document.getElementById('groupList');
					c.innerHTML=strHTML;
				}
				
			}
			
			function updateService(serviceURI){
				saveOrUpdateService('PUT');
			}

			function checkUserAuth(){
				if (document.getElementById("isUserAuthenticationEnabled").checked){
					 $('#allowAnonymous').show();
					 $('#group').show();
					 $('#idForwarding').show();
					 $('#userQuota').show();
					 $('#loginForm').show();
					 if (document.getElementById("isAnonymousAllowed").checked){
						$('#isIdentityForwardingEnabled').prop("checked", true);
						$('#isIdentityForwardingEnabled').prop("disabled", true);
					 }else{
						$('#isIdentityForwardingEnabled').prop("disabled", false);
					 }
						 
				}else{
					 $('#loginForm').hide();
					 $('#allowAnonymous').hide();
					 $('#group').hide();
					 $('#idForwarding').hide();
					 $('#userQuota').hide();
				}
				setServiceModified(true);
			}
			
			function generateServiceProperties(service){
				var strHTML;
				
				serviceName="";
				frontEndEndPoint="";
				backEndEndPoint="";
				backEndUsername="";
				backEndPassword="";
				cbIdentFwd="";
				cbIsPublished="checked";
				cbIsUserAuthenticationEnabled="checked";
				cbIsAnonymousAllowed="";
				cbIsHitLoggingEnabled="";
				cbOnAllNodes="checked";
				additionalConfiguration="";
				loginFormUri="";
				if (service != null){
					frontEndEndPoint=service.frontEndEndPoint;
					backEndEndPoint=service.backEndEndPoint;
					backEndUsername=service.backEndUsername;
					backEndPassword=service.backEndPassword;
					if (service.isIdentityForwardingEnabled==1){
						cbIdentFwd="checked";
					}
					if (service.isPublished==0){
						cbIsPublished="";
					}
					if (service.isUserAuthenticationEnabled==0){
						cbIsUserAuthenticationEnabled="";
					}
					if (service.isHitLoggingEnabled==1){
						cbIsHitLoggingEnabled="checked";
					}
					if (service.isAnonymousAllowed==1){
						cbIsAnonymousAllowed="checked";
					}
					additionalConfiguration=service.additionalConfiguration;
					if (service.onAllNodes==0){
						cbOnAllNodes="";
					}
					loginFormUri=service.loginFormUri;
					
				}
				
				strHTML="";
				strHTML+="<table class=\"tabular_table choices-border\" width=\"800px\">\n";
				strHTML+="<tr id=\"mainForm\" class=\"tabular_table_body\">\n";
				strHTML+="<td><div id=\"tabs\">\n";
				strHTML+="	<ul>\n";
				strHTML+="		<li><a  href=\"#tabs-general\">General</a></li>\n";
				strHTML+="		<li><a  href=\"#tabs-frontEnd\">Frontend authentication</a></li>\n";
				strHTML+="		<li><a  href=\"#tabs-backEnd\">Backend credentials and identity</a></li>\n";
				strHTML+="		<li><a  href=\"#tabs-quotas\">Quotas</a></li>\n";
				strHTML+="		<li><a  href=\"#tabs-nodes\">Nodes</a></li>\n";
				strHTML+="		<li><a  href=\"#tabs-advance\">Advance</a></li>\n";
				strHTML+="	</ul>\n";
				strHTML+="	<div id=\"tabs-general\">\n";
				strHTML+="		<table>\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<th>Service name:</th>\n";
				if (service==null){
					strHTML+="			<td><input class=\"inputText\"  title=\"" + serviceNameToolTip + "\" type=\"text\" id=\"serviceName\" value=\"\" onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\"></td>\n";
				}else{
					strHTML+="			<td><input type=\"hidden\" id=\"serviceName\" value=\"" + service.serviceName + "\" >" + service.serviceName + "</td>\n";
				}
				strHTML+="			</tr>\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<th>Is published:</th>\n";
				strHTML+="				<td><input  title=\"" + isPublishedToolTip + "\" type=\"checkbox\" id=\"isPublished\" onClick=\"setServiceModified(true)\"  onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\"" + cbIsPublished + " ><label for=\"isPublished\"></label></td>\n";
				strHTML+="			</tr>\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<th>Frontend alias:</th>\n";
				strHTML+="				<td><input class=\"inputText\" title=\"" + frontEndToolTip + "\" type=\"text\" id=\"frontEndEndPoint\" value=\"" + frontEndEndPoint + "\"  onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\"></td>\n";
				strHTML+="			</tr>\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<th>Backend URL:</th>\n";
				strHTML+="				<td><input class=\"inputText\"  title=\"" + backEndURLToolTip + "\" type=\"text\" id=\"backEndEndPoint\" value=\"" + backEndEndPoint + "\"  onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\"></td>\n";
				strHTML+="			</tr>\n";
				strHTML+="		</table>\n";
				strHTML+="	</div>\n";
				strHTML+="	<div id=\"tabs-frontEnd\">\n";
				strHTML+="		<table>\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<th>Enable user authentication:</th>\n";
				strHTML+="				<td><input title=\"" + isUserAuthenticationToolTip + "\"  type=\"checkbox\" id=\"isUserAuthenticationEnabled\" onClick=\"checkUserAuth()\"  onchange=\"checkUserAuth()\" onkeypress=\"checkUserAuth()\"" + cbIsUserAuthenticationEnabled + "><label for=\"isUserAuthenticationEnabled\"></label></td>\n";
				strHTML+="			</tr>\n";
				strHTML+="			<tr id=\"group\" class=\"tabular_table_body\">\n";
				strHTML+="				<th>Group:</th>\n";
				strHTML+="				<td><div id='groupList'></div></td>\n";
				strHTML+="			</tr>\n";
				strHTML+="			<tr id=\"loginForm\" class=\"tabular_table_body\">\n";
				strHTML+="				<th>Login form URL:</th>\n";
				strHTML+="				<td><input class=\"inputText\" title=\"" + loginFormUriToolTip + "\" type=\"text\" id=\"loginFormUri\"  value=\"" + loginFormUri + "\"  onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\"></td>\n";
				strHTML+="			</tr>\n";
				strHTML+="			<tr id=\"allowAnonymous\" class=\"tabular_table_body\">\n";
				strHTML+="				<th>Also allow anonymous access:</th>\n";
				strHTML+="				<td><input title=\"" + isAnonymousAllowedToolTip + "\"  type=\"checkbox\" id=\"isAnonymousAllowed\" " + cbIsAnonymousAllowed + " onClick=\"checkUserAuth()\"  onchange=\"checkUserAuth()\" onkeypress=\"checkUserAuth()\"><label for=\"isAnonymousAllowed\"></label></td>\n";
				strHTML+="			</tr>\n";
				strHTML+="		</table>\n";
				strHTML+="	</div>\n";
				strHTML+="	<div id=\"tabs-backEnd\">\n";
				strHTML+="		<table>\n";
				strHTML+="			<tr id=\"idForwarding\" class=\"tabular_table_body\">\n";
				strHTML+="				<th>Need consumer<br>identity forwarding:</th>\n";
				strHTML+="				<td><input title=\"" + identityForwardingToolTip + "\"  type=\"checkbox\" id=\"isIdentityForwardingEnabled\" onClick=\"setServiceModified(true)\"  onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\"" + cbIdentFwd + "><label for=\"isIdentityForwardingEnabled\"></label></td>\n";
				strHTML+="			</tr>\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<th>Username (basic auth):</th>\n";
				strHTML+="				<td><input class=\"inputText\"  title=\"" + backendUserToolTip + "\"  type=\"text\" id=\"backEndUsername\" value=\"" + backEndUsername + "\"  onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\"></td>\n";
				strHTML+="			</tr>\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<th>Password (basic auth):</th>\n";
				strHTML+="				<td><input class=\"inputText\"  title=\"" + backendPasswordToolTip + "\" type=\"password\" id=\"backEndPassword\" value=\"" + backEndPassword + "\"  onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\"></td>\n";
				strHTML+="			</tr>\n";
				strHTML+="		</table>\n";
				strHTML+="	</div>\n";
				strHTML+="	<div id=\"tabs-quotas\">\n";
				strHTML+="		<table >\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<th>Need global quotas control:</th>\n";
				strHTML+="				<td align=\"left\"><input title=\"" + serviceQuotaToolTip + "\"  type=\"checkbox\" id=\"isGlobalQuotasEnabled\" onClick=\"setQuotasVisibility();setServiceModified(true)\"  onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\"><label for=\"isGlobalQuotasEnabled\"></label></td>\n";
				strHTML+="			</tr>\n";
				strHTML+="		</table>\n";
				strHTML+="		<table>\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<td>\n";
				strHTML+="					<div id=\"quotas\">\n";
				strHTML+="					</div>\n";
				strHTML+="				</td>\n";
				strHTML+="			</tr>\n";
				strHTML+="		</table>\n";
				strHTML+="	</div>\n";
				strHTML+="	<div id=\"tabs-nodes\">\n";
				strHTML+="		<table >\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<th>Available on all active nodes</th>\n";
				strHTML+="				<td align=\"left\"><input title=\"" + serviceOnAllNodesToolTip + "\"  type=\"checkbox\" id=\"onAllNodes\" onClick=\"setNodesVisiblility();setServiceModified(true)\"  onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\" " + cbOnAllNodes + "><label for=\"onAllNodes\"></label></td>\n";
				strHTML+="			</tr>\n";
				strHTML+="		</table>\n";
				strHTML+="		<div id=\"publishedOnNodes\">\n";
				strHTML+="			<table >\n";
				strHTML+="				<tr class=\"tabular_table_body\">\n";
				strHTML+="					<th  valign=\"top\">Services is avalable on nodes</th>\n";
				strHTML+="					<th><div id=\"nodeList\"/></th>\n";
				strHTML+="				</tr>\n";
				strHTML+="			</table>\n";
				strHTML+="		</div>\n";
				strHTML+="	</div>\n";
				strHTML+="	<div id=\"tabs-advance\">\n";
				strHTML+="		<table >\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<th>Log hits:</th>\n";
				strHTML+="				<td><input title=\"" + logHitToolTip + "\"  type=\"checkbox\" id=\"isHitLoggingEnabled\" onClick=\"setServiceModified(true)\"  onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\"" + cbIsHitLoggingEnabled + "><label for=\"isHitLoggingEnabled\"></label></td>\n";
				strHTML+="			</tr>\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<th colspan=\"2\"><hr></th>\n";
				strHTML+="			</tr>\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<td colspan=\"2\">\n";
				strHTML+="					<br><p id=\"warnAdditionalConfig\" class=\"errorMessage\">ATTENTION: Using additional apache configuration directives may corrupt entire configuration if directives are not valid...</p>\n";
				strHTML+="				</td>\n";
				strHTML+="			</tr>\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<th>Addtional apache directive:</th>\n";
				strHTML+="				<td><textarea rows=\"10\"  title=\"" + additionalConfigurationToolTip + "\"   id=\"additionalConfiguration\" onClick=\"setServiceModified(true)\"  onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\">" + additionalConfiguration + "</textarea></td>\n";
				strHTML+="				</td>\n";
				strHTML+="			</tr>\n";
				strHTML+="			<tr class=\"tabular_table_body\">\n";
				strHTML+="				<td colspan=\"2\">In addition to standard apache variables, refering to the node where request is handled, you may use here:";
				strHTML+="					<ul>\n";
				strHTML+="						<li>\n";
				strHTML+="							%{publicServerProtocol}e as protocol used (i.e http:// or https://)\n"
				strHTML+="						</li>\n";
				strHTML+="						<li>\n";
				strHTML+="							%{publicServerName}e server name\n"
				strHTML+="						</li>\n";
				strHTML+="						<li>\n";
				strHTML+="							%{publicServerPort}e server port\n"
				strHTML+="						</li>\n";
				strHTML+="						<li>\n";
				strHTML+="							%{frontEndEndPoint}e frontEndPoint\n"
				strHTML+="						</li>\n";
				strHTML+="						<li>\n";
				strHTML+="							%{publicServerPrefix}e concatenation of previous variables (ex: https//public.node.com:8443/myservice)\n"
				strHTML+="						</li>\n";
				strHTML+="						<br>Ex:<br>RequestHeader set Public-Root-URI \"%{publicServerProtocol}e%{publicServerName}e:%{publicServerPort}e/%{frontEndEndPoint}e\"";
				strHTML+="					</ul>\n";
				strHTML+="				</td>\n";
				strHTML+="			</tr>\n";
				strHTML+="		</table>\n";
				strHTML+="	</div>\n";
				strHTML+="</div></td></tr></table>\n";
				
				
				return strHTML;
			}
			
			function editService(service){

				currentService=service;
				currentServiceGroup=service.groupUri;
				currentServiceGroupName=service.groupName;
				strHTML="";
				strHTML+="<center>";
				strHTML+="<h1>";
				strHTML+="Service properties";
				strHTML+="</h1>";
				strHTML+="<hr>"; 
				strHTML+="<form>";
				strHTML+=generateServiceProperties(service);
				strHTML+="<br>";
				strHTML+="<input type=\"button\" id=\"saveService\" onclick=\"updateService('" + service.uri + "')\" value=\"Save\" class=\"button_orange\">&nbsp;";
				strHTML+="<input type=\"button\" onclick=\"showServices()\" value=\"Cancel\" class=\"button_orange\">";
				strHTML+="</form>";
				strHTML+="</center>";
				
				c=document.getElementById('content');
				c.innerHTML=strHTML;

				$(function() {
					$( "#tabs" ).tabs();
				});
				
				document.getElementById("isGlobalQuotasEnabled").checked=!(service.isGlobalQuotasEnabled==0);
				setQuotasVisibility();
				setNodesVisiblility();
				startPopulateGroups();
				checkUserAuth();
				setServiceModified(false);
				$("#mainForm").height($("#tabs").height()+10);
				$("#mainForm").click(function(){
						$("#mainForm").height($("#tabs").height()+10);
				});
			}

			
			function saveOrUpdateService(method){
				isUserAuthenticationEnabled="isUserAuthenticationEnabled=0";
				isHitLoggingEnabled="isHitLoggingEnabled=0";
				isUserQuotasEnabled="isUserQuotasEnabled=0";
				isGlobalQuotasEnabled="isGlobalQuotasEnabled=0";
				isIdentityForwardingEnabled="isIdentityForwardingEnabled=0";
				isAnonymousAllowed="isAnonymousAllowed=0";
				isPublished="isPublished=1";
				serviceName="serviceName=" + encodeURIComponent(document.getElementById("serviceName").value);
				frontEndEndPoint="frontEndEndPoint=" + encodeURIComponent(document.getElementById("frontEndEndPoint").value);
				backEndEndPoint="backEndEndPoint=" + encodeURIComponent(document.getElementById("backEndEndPoint").value);
				backEndUsername="backEndUsername=" + encodeURIComponent(document.getElementById("backEndUsername").value);
				backEndPassword="backEndPassword=" + encodeURIComponent(document.getElementById("backEndPassword").value);
				groupName="groupName=" + encodeURIComponent(document.getElementById("groupName").value);
				additionalConfiguration="additionalConfiguration=" + encodeURIComponent(document.getElementById("additionalConfiguration").value);

				loginFormUri="loginFormUri="+ encodeURIComponent(document.getElementById("loginFormUri").value);

				if  ($('#onAllNodes').attr('checked')) {
					onAllNodes="onAllNodes=1";
				}else{
					onAllNodes="onAllNodes=0";
				}
				if (document.getElementById("isGlobalQuotasEnabled").checked){
					isGlobalQuotasEnabled="isGlobalQuotasEnabled=1";
					reqSec="reqSec=" + document.getElementById("reqSec").value;
					reqDay="reqDay=" + document.getElementById("reqDay").value;
					reqMonth="reqMonth=" + document.getElementById("reqMonth").value;
				}
				if (document.getElementById("isUserQuotasEnabled").checked){
					isUserQuotasEnabled="isUserQuotasEnabled=1";
				}
				if (!document.getElementById("isPublished").checked){
					isPublished="isPublished=0";
				}
				if (document.getElementById("isIdentityForwardingEnabled").checked){
					isIdentityForwardingEnabled="isIdentityForwardingEnabled=1";
				}
				if (document.getElementById("isUserAuthenticationEnabled").checked){
					isUserAuthenticationEnabled="isUserAuthenticationEnabled=1";
				}else{
					isUserQuotasEnabled="isUserQuotasEnabled=0";
					isIdentityForwardingEnabled="isIdentityForwardingEnabled=0";
				}
				if (document.getElementById("isHitLoggingEnabled").checked){
					isHitLoggingEnabled="isHitLoggingEnabled=1";
				}
				if (document.getElementById("isAnonymousAllowed").checked){
					isAnonymousAllowed="isAnonymousAllowed=1";
				}
				postData=isUserQuotasEnabled + 
		  		"&" + isGlobalQuotasEnabled + 
		  		"&" + isIdentityForwardingEnabled + 
		  		"&" + isPublished + 
		  		"&" + frontEndEndPoint + 
		  		"&" + backEndEndPoint +
		  		"&" + backEndUsername +
		  		"&" + backEndPassword +
		  		"&" + groupName +
		  		"&" + isUserAuthenticationEnabled + 
		  		"&" + isHitLoggingEnabled +
		  		"&" + onAllNodes +
		  		"&" + additionalConfiguration +
		  		"&" + isAnonymousAllowed +
		  		"&" + loginFormUri;
				if (document.getElementById("isGlobalQuotasEnabled").checked){
					postData+="&" + reqSec +
					"&" + reqDay +
					"&" + reqMonth;
				}
				if (method=='PUT'){
					businessUrl="services/" + encodeURIComponent(document.getElementById("serviceName").value);
				}else{
					businessUrl="services/";
					postData="serviceName=" +encodeURIComponent(document.getElementById("serviceName").value) + "&" + postData ;
				}
				if (!$('#onAllNodes').attr('checked')){
					postData = postData + "&noApply=";
				}
				showWait();
				$.ajax({
					  url: businessUrl ,
					  dataType: 'json',
					  type:method,
					  data: postData,
					  success: manageNodesList,
					  error: displayErrorV2
					});
			}
			
			function manageNodesList(){
				nodes = document.getElementById('serviceNodesList');
				if (!$('#onAllNodes').attr('checked') ){
					// count selected item to be able to start reload page on last one
					var selectedNodes = new Array();
					selectedCount=0;
					for (i = 0; i < nodes.options.length; i++) {
						if (nodes.options[i].selected) {
							selectedNodes[selectedCount]=nodes.options[i].value
							selectedCount++;
						}
					}
					$.ajax({
						  url: "services/" + encodeURIComponent($('#serviceName').val()) + "/nodes/" ,
						  dataType: 'json',
						  data: JSON.stringify(selectedNodes),
						  contentType: 'application/json; charset=utf-8',
						  type:"POST",
						  success: showServices,
						  error: displayErrorV2
						});
				}else{
					showServices();
				}
			}
			
			function saveNewService(){
				saveOrUpdateService('POST');
			}
			
			
			function setNodesVisiblility(){
				if ($('#onAllNodes').attr('checked')){
					$('#publishedOnNodes').hide();
				}else{
					$('#publishedOnNodes').show();
					$.getJSON("services/" + encodeURIComponent($('#serviceName').val()) + "/nodes/?order=nodeName", displayServiceNodes).error(displayErrorV2);
				}
			}
			function setQuotasVisibility(){
				
				reqSec="";
				reqDay="";
				reqMonth="";
				userQuotas="";
				if (currentService != null){
					if (document.getElementById("isUserQuotasEnabled")!=null){
						if (document.getElementById("isUserQuotasEnabled").checked){
							currentService.isUserQuotasEnabled=1;
						}else{
							currentService.isUserQuotasEnabled=0;
						}
					}
					reqSec = currentService.reqSec;
					reqDay = currentService.reqDay;
					reqMonth=currentService.reqMonth;
					userQuotas=(currentService.isUserQuotasEnabled!=0);
				}else{
					if (document.getElementById("isUserQuotasEnabled")!=null){
						userQuotas=document.getElementById("isUserQuotasEnabled").checked;
					}
				}
				gc= document.getElementById('isGlobalQuotasEnabled');
				strHTML="";
				strHTML+="					<table >";
				if (gc.checked){
					strHTML+="						<tr  class=\"tabular_table_body\">";
					strHTML+="							<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maximun per second:</th>";
					strHTML+="							<td><input class=\"inputNumber\"  title=\"" + perSecToolTip + "\"  type=\"text\" id=\"reqSec\" value=\"" + reqSec + "\"  onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\"></td>";
					strHTML+="						</tr>";
					strHTML+="						<tr  class=\"tabular_table_body\">";
					strHTML+="							<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maximun per day:</th>";
					strHTML+="							<td><input class=\"inputNumber\"  title=\"" + perDayToolTip + "\" type=\"text\" id=\"reqDay\"  value=\"" + reqDay + "\"  onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\"></td>";
					strHTML+="						</tr>";
					strHTML+="						<tr  class=\"tabular_table_body\">";
					strHTML+="							<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maximun per month:</th>";
					strHTML+="							<td><input class=\"inputNumber\"  title=\"" + perMonthToolTip + "\"  type=\"text\" id=\"reqMonth\"  value=\"" + reqMonth + "\" onchange=\"setServiceModified(true)\" onkeypress=\"setServiceModified(true)\"></td>";
					strHTML+="						</tr>";
				}
				strHTML+="						<tr id=\"userQuota\" class=\"tabular_table_body\">";
				strHTML+="							<th>Need user quotas control:</th>";
				strHTML+="							<td><input title=\"" + userQuotaToolTip + "\" type=\"checkbox\" id=\"isUserQuotasEnabled\"  onchange=\"setServiceModified(true)\" onClick=\"setServiceModified(true)\"><label for=\"isUserQuotasEnabled\"></label></td>";
				strHTML+="						</tr>";
				strHTML+="					</table>";

				q=document.getElementById('quotas');
				q.innerHTML=strHTML;
				document.getElementById("isUserQuotasEnabled").checked=userQuotas;
				checkUserAuth();
				setServiceModified(serviceModified);
				
			}
			
			function addService(){
				currentService=null;
				currentServiceGroup=null;
				strHTML="";
				strHTML+="<center>";
				strHTML+="<h1>";
				strHTML+="New Service properties";
				strHTML+="</h1>";
				strHTML+="<hr>";
				strHTML+="<form>";
				strHTML+=generateServiceProperties(null);
				strHTML+="<br>";
				strHTML+="<input type=\"button\" id=\"saveService\" onclick=\"saveNewService()\" value=\"Save\" class=\"button_orange\">&nbsp;";
				strHTML+="<input type=\"button\" onclick=\"showServices()\" value=\"Cancel\" class=\"button_orange\">";
				strHTML+="</form>";
				strHTML+="</center>";
				
				c=document.getElementById('content');
				c.innerHTML=strHTML;

				$(function() {
					$( "#tabs" ).tabs();
				});

				startPopulateGroups();
				setQuotasVisibility();
				setNodesVisiblility();
				setServiceModified(false);

				$("#mainForm").height($("#tabs").height()+10);
				$("#mainForm").click(function(){
						$("#mainForm").height($("#tabs").height()+10);
				});

			}

function handelServiceFilterFormKeypress(e) {
	if (e.keyCode == 13) {
		showServices();
		return false;
	}
}			
			function displayServiceNodes(nodeList){
					strHTML = "";
					strHTML += "<center><select title=\""
							+ availableNodesToolTip
							+ "\" name=\"serviceNodesList\" id=\"serviceNodesList\" size=\"15\" multiple  class=\"serviceNodesList\" onChange=\"setServiceModified(true)\"> ";
					for (i = 0; i < nodeList.length; i++) {
						if (nodeList[i].published==1){
							selected=" SELECTED ";
						}else{
							selected="";
						}
						port="";
						if(nodeList[i].node.isHTTPS==1){
							nodePrefix="https://";
							if (nodeList[i].node.port != 443){
								port=":" + nodeList[i].node.port;
							}
						}else{
							nodePrefix="http://";
							if (nodeList[i].node.port != 80){
								port=":" + nodeList[i].node.port;
							}
						}
						strHTML += "<option name=\"" + nodeList[i].node.nodeName
								+ "\" value=\"" + nodeList[i].node.nodeName + "\"" + selected + ">"
								+ nodeList[i].node.nodeName +  " (" + nodePrefix + nodeList[i].node.serverFQDN + port+ ")</option>";
					}
					strHTML += "</select><br><br>";
					c = document.getElementById('nodeList');
					c.innerHTML = strHTML;

			}
			function displayServiceList(serviceList){
				
				
				hideWait();
				strHTML="";
				strHTML+="<center>";
				strHTML+="<h1>";
				strHTML+=serviceList.length + " services found";
				strHTML+="</h1>";
				strHTML+="<hr>";
				strHTML += "<form onkeypress=\"return handelServiceFilterFormKeypress(event)\">";
				strHTML += "<table class=\"tabular_table searchFormTable\" >";	
				strHTML += "	<tr class=\"tabular_table_body\">";	
				strHTML += "		<th>service name</th> <td><input type=\"text\" id=\"serviceNameFilter\" value=\"" + serviceNameFilterPrevVal + "\"></td>";	
				strHTML += "		<th>group name</th> <td><input type=\"text\" id=\"serviceGroupNameFilter\" value=\"" + serviceGroupNameFilterPrevVal + "\"></td>";	
				strHTML += "		<th>&nbsp;</th> <td>&nbsp;</td>";	
				strHTML += "	</tr>";	
				strHTML += "	<tr class=\"tabular_table_body\">";	
				strHTML += "		<th>frontend endpoint</th> <td><input type=\"text\" id=\"frontEndEndPointFilter\"value=\"" + frontEndEndPointFilterPrevVal + "\"></td>";	
				strHTML += "		<th>backend endpoint</th> <td><input type=\"text\" id=\"backEndEndPointFilter\" value=\"" + backEndEndPointFilterPrevVal + "\"></td>";	
				strHTML += "		<td colspan=\"2\"><input type=\"button\" class=\"button_orange\" value=\"filter\" onclick=\"showServices()\"><input type=\"button\" class=\"button_white\" value=\"reset\" onclick=\"resetServiceFilter()\"></th> ";	
				strHTML += "	</tr>";	
				strHTML += "</table>";	
				strHTML += "</form>";	
				if (serviceList.length>0){
					strHTML+="<table id=\"servicesList\" class=\"tabular_table scroll choices-border\" >\n";
					strHTML+="	<thead>\n";
					strHTML+="		<tr class=\"tabular_table_header\">\n";
					strHTML+="			<th>Service name</th>\n";
					strHTML+="			<th>On</th>\n";
					strHTML+="			<th>Group name</th>\n";
					strHTML+="			<th>Frontend endpoint</th>\n";
					strHTML+="			<th>Backend endpoint</th>\n";
					strHTML+="			<th>Actions</th>\n";
					strHTML+="		</tr>\n";
					strHTML+="	</thead>\n";
					strHTML+="	<tbody>\n";
					for (i=0;i<serviceList.length;i++){
						strHTML+="		<tr class=\"tabular_table_body" +  (i%2) + "\">\n";
						strHTML+="			<td title=\"" + serviceList[i].serviceName + "\">" + serviceList[i].serviceName + "</td>\n";
						if (serviceList[i].isPublished==1){
							cbPublishedCheck="checked";
						}else{
							cbPublishedCheck=""
						}
						
						strHTML+="			<td class=\"isPublished\"><input  title=\"" + isPublishedToolTip + "\" type=\"checkbox\" id=\"isPublished" + i + "\" " + cbPublishedCheck + " disabled><label for=\"isPublished" + i + "\"></label></td>\n";

						strHTML+="			<td title=\"" + serviceList[i].groupName + "\">" + serviceList[i].groupName  + "</td>\n";
						strHTML+="			<td title=\"" + serviceList[i].frontEndEndPoint + "\">" + serviceList[i].frontEndEndPoint + "</td>\n";
						strHTML+="			<td title=\"" + serviceList[i].backEndEndPoint + "\">" + serviceList[i].backEndEndPoint + "</td>\n";
						strHTML+="			<td class=\"action\">\n";
						strHTML+="				<a title=\"" + editServiceToolTip + "\"  href=\"javascript:startEditService('" + serviceList[i].uri + "')\"><img  border=\"0\" src=\"images/edit.gif\"></a>";
						if (!serviceList[i].serviceName.startsWith("ApplianceManagerAdmin")){
							strHTML+="				<a title=\"" + deleteServiceToolTip + "\"  href=\"javascript:deleteService('" + serviceList[i].uri + "', '" + serviceList[i].serviceName + "')\"><img border=\"0\" src=\"images/delete.gif\"></a>\n";
						}
						strHTML+="			</td>\n";
						strHTML+="		</tr>\n";
					}
					strHTML+="	</tbody>\n";
					strHTML+=" </table>\n";
				}
				strHTML+="</center>";

				c=document.getElementById('content');
				c.innerHTML=strHTML;
				/* make the table scrollable with a fixed header */
				$("table.scroll").createScrollableTable({
					width: '800px',
					height: '350px',
					border: '0px'
				});
				touchScroll("servicesList_body_wrap");
			
			}

			
			function deleteService(serviceURI, serviceName){
				
				
				if (confirm("Are you sure to want to remove service " + serviceName + "?")){
					showWait();
					$.ajax({
						  url: serviceURI,
						  dataType: 'json',
						  type:'DELETE',
						  //data: data,
						  success: showServices,
						  error: displayErrorV2
						});
				}
				
			}
			
			function  resetServiceFilter(){
				$('#serviceNameFilter').val("");
				$('#serviceGroupNameFilter').val("")
				$('#frontEndEndPointFilter').val("");
				$('#backEndEndPointFilter').val("");
				showServices();
			}
			
			function showServices(){
				prms="order=serviceName";
				prms=prms + "&serviceNameFilter=" + encodeURIComponent(getFilterValue('serviceNameFilter'));
				prms=prms + "&groupNameFilter=" + encodeURIComponent(getFilterValue('serviceGroupNameFilter'));
				prms=prms + "&frontEndEndPointFilter=" + encodeURIComponent(getFilterValue('frontEndEndPointFilter'));
				prms=prms + "&backEndEndPointFilter=" + encodeURIComponent(getFilterValue('backEndEndPointFilter'));

				$.ajax({
					url : './services/',
					dataType : 'json',
					type : 'GET',
					data: prms,
					success : displayServiceList,
					error : displayErrorV2
				});
			}

			
			
			
			
//Event 			
			$(
					function (){
						$('#listService').click(resetServiceFilter);
						$('#addService').click(addService);
					}
				);
