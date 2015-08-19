/*--------------------------------------------------------
 * Module Name : ApplianceManager
 * Version : 1.0.0
 *
 * Software Name : OpenNodesAccess
 * Version : 1.0
 *
 * Copyright (c) 2011 – 2014 Orange
 * This software is distributed under the Apache 2 license
 * <http://www.apache.org/licenses/LICENSE-2.0.html>
 *
 *--------------------------------------------------------
 * File Name   : ApplianceManager/ApplianceManager.php/js/nodes.js
 *
 * Created     : 2012-02
 * Authors     : Benoit HERARD <benoit.herard(at)orange.com>
 *
 * Description :
 *      AJAX MAnagement for nodes
 *--------------------------------------------------------
 * History     :
 * 1.0.0 - 2012-10-01 : Release of the file
*/

			var currentNode;
			var nodeModified;
			var removeSSLSetting=false;
			var removeCASSLSetting=false;

			var nodeNameToolTip="Enter the node name here<br>Node name is node identifier and can not be changed later";
			var localIPToolTip="Enter the IP address on witch the node is binded (* for any available)";
			var portToolTip="Enter the port on witch the node listen";
			var serverFQDNToolTip="Enter a fully qulified node name (like mynode.mydomain.com)";
			var nodeDescriptionToolTip="Enter the node description";
			var isHTTPSToolTip="Check this box if the node should use HTTPS instead of HTTP";
			var isBasicAuthEnabledToolTip="Check this box if the node should support basic authentication mode";
			var isCookieAuthEnabledToolTip="Check this box if the node should support cookie based authentication mode";
			var manageCAcertToolTip="Check this checkbox if you need to add CA cert and CA-Chain cert";

			var editNodeToolTip="Edit this node";
			var deleteNodeToolTip="Delete this node";
			var addNodeTooTip="Add a new servie to the system";
			
			
			var nodeNameFilterPrevVal="";
			var nodeDescriptionFilterPrevVal="";
			var localIPFilterPrevVal="";
			var portFilterPrevVal="";
			var serverFQDNFilterPrevVal="";

			function setNodeModified(isModified){
				nodeModified=isModified;
				if (isModified){
					setActionButtonEnabled('saveNode',true);
				}else{
					setActionButtonEnabled('saveNode',false);
				}
				if ($('#isHTTPS').is(':checked')){
					$('#tabs').tabs( "enable", 1);
				}else{
					$('#tabs').tabs( "disable", 1);
				}
				
				if ($("#additionalConfiguration").val() != ""){
					$("#warnAdditionalConfig").show();
				}else{
					$("#warnAdditionalConfig").hide();
				}
				
			}

			function startEditNode(nodeURI){
				$.getJSON(nodeURI, editNode).error(displayErrorV2);
			}
						
			function updateNode(nodeURI){
				saveOrUpdateNode('PUT');
			}

			function startResetCASSL(){
				if (confirm("Do you realy want to delete existing Certification Authority SSL setting?")){
					removeCASSLSetting=true;
					setNodeModified(true);
					clearFileInput("CAfileuploadFLD");
					clearFileInput("CHAINfileuploadFLD");

					$("#lblCa").html("Add CA cert.");
					$("#lblChain").html("Add chain cert.");

				}
				
			}
			function startResetSSL(){
				if (confirm("Do you realy want to delete existing SSL setting?")){
					removeSSLSetting=true;
					setNodeModified(true);
					clearFileInput("PKfileuploadFLD");
					clearFileInput("CERTfileuploadFLD");
				}
				
			}
			function loadNodeServices(nodeURI){
				showWait();
				$.getJSON(nodeURI + "/services/", displayNodeServices).error(displayErrorV2);
			}
			function displayNodeServices(serviceList){
				
				hideWait();
				strHTML="";
				strHTML+="<center>";
				strHTML+="<h1>";
				strHTML+=serviceList.length + " services found";
				strHTML+="</h1>";
				strHTML+="<hr>";
				if (serviceList.length>0){
					strHTML+="<table id=\"servicesList\" class=\"tabular_table scroll choices-border\" >\n";
					strHTML+="	<thead>\n";
					strHTML+="		<tr class=\"tabular_table_header\">\n";
					strHTML+="			<th>Service name</th>\n";
					strHTML+="			<th>On</th>\n";
					strHTML+="			<th>Group name</th>\n";
					strHTML+="			<th>Frontend endpoint</th>\n";
					strHTML+="			<th>Backend endpoint</th>\n";
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
						strHTML+="		</tr>\n";
					}
					strHTML+="	</tbody>\n";
					strHTML+=" </table>\n";
				}
				strHTML+="</center>";

				c=document.getElementById('tabs-node-services');
				c.innerHTML=strHTML;
				/* make the table scrollable with a fixed header */
				$("table.scroll").createScrollableTable({
					width: '800px',
					height: '350px',
					border: '0px'
				});
				touchScroll("servicesList_body_wrap");
			
			}
			function clearFileInput(id)
			{
				var oldInput = document.getElementById(id);
				
				var newInput = document.createElement("input");
				
				newInput.type = "file";
				newInput.id = oldInput.id;
				newInput.name = oldInput.name;
				newInput.className = oldInput.className;
				newInput.style.cssText = oldInput.style.cssText;
				// copy any other relevant attributes
				
				oldInput.parentNode.replaceChild(newInput, oldInput);
			}
			function toggleAuthority(){
				$("#sslAuthority").toggle();
				if (!$('#manageCaCert').is(':checked')){
					clearFileInput("CAfileuploadFLD");
					clearFileInput("CHAINfileuploadFLD");
					
					
				}
			}
			
			function generateNodeProperties(node){
				var strHTML;
				
				nodeName="";
				localIP="";
				port="";
				nodeDescription="";
				serverFQDN="";
				cbIsHTTPS="checked";
				cbIsBasicAuthEnabled="checked";
				cbIsCookieAuthEnabled="checked";
				additionalConfiguration="";
				cbManageCAEnabled="";
				if (node != null){
					localIP=node.localIP;
					port=node.port;
					nodeDescription=node.nodeDescription;
					serverFQDN=node.serverFQDN;
					nodeName=node.nodeName;
					additionalConfiguration=node.additionalConfiguration;
					if (node.isCookieAuthEnabled==0){
						cbIsCookieAuthEnabled="";
					}
					if (node.isBasicAuthEnabled==0){
						cbIsBasicAuthEnabled="";
					}
					if (node.isHTTPS==0){
						cbIsHTTPS="";
					}
					if (node.caUri != "" || node.chainUri!=""){
						cbManageCAEnabled="checked";
					}
					
					
				}
				
				strHTML="";
				strHTML+="<table class=\"tabular_table choices-border\" width=\"800px\">\n";
				strHTML+="	<tr id=\"mainForm\" class=\"tabular_table_body\">\n";
				strHTML+="		<td>\n";
				strHTML+="			<div id=\"tabs\">\n";
				strHTML+="				<ul>\n";
				strHTML+="					<li><a  href=\"#tabs-general\">General</a></li>\n";
				strHTML+="					<li><a  href=\"#tabs-SSL\">SSL certs and key</a></li>\n";
				if(node != null){
					strHTML+="					<li><a  href=\"#tabs-node-services\" onclick=\"loadNodeServices('" + node.uri+ "')\">Services</a></li>\n";
				}
				strHTML+="					<li><a href=\"#tabs-node-advance\" >Advance</a></li>\n";
				strHTML+="				</ul>\n";

							strHTML+="	<div id=\"tabs-node-services\">\n";
							strHTML+="	</div>\n";
							strHTML+="	<div id=\"tabs-node-advance\">\n";
							strHTML+="		<table>\n";
							strHTML+="			<tr class=\"tabular_table_body\">\n";
							strHTML+="				<td colspan=\"2\">\n";
							strHTML+="					<br><p id=\"warnAdditionalConfig\" class=\"errorMessage\">ATTENTION: Using additional apache configuration directives may corrupt entire configuration if directives are not...</p>\n";
							strHTML+="				</td>\n";
							strHTML+="			</tr>\n";
							strHTML+="			<tr class=\"tabular_table_body\">\n";
							strHTML+="				<th>Addtional apache directive:</th>\n";
							strHTML+="				<td><textarea rows=\"10\"  title=\"" + additionalConfigurationToolTip + "\"   id=\"additionalConfiguration\" onClick=\"setNodeModified(true)\"  onchange=\"setNodeModified(true)\" onkeypress=\"setNodeModified(true)\">" + additionalConfiguration + "</textarea></td>\n";
							strHTML+="			</tr>\n";
							strHTML+="		</table>\n";
							strHTML+="	</div>\n";

				strHTML+="				<div id=\"tabs-general\">\n";
									strHTML+="<table class=\"tabular_table choices-border \">\n";
									strHTML+="	<tbody class=\"tabular_table_body\">\n";
									strHTML+="		<tr>\n";
									strHTML+="			<th>Node name:</th>\n";
									if (node==null){
										strHTML+="		<td><input class=\"inputText\"  title=\"" + nodeNameToolTip + "\" type=\"text\" id=\"nodeNameFld\" value=\"\" onchange=\"setNodeModified(true)\" onkeypress=\"setNodeModified(true)\"></td>\n";
									}else{
										strHTML+="		<td><input type=\"hidden\" id=\"nodeNameFld\" value=\"" + node.nodeName + "\" >" + node.nodeName + "</td>\n";
									}
									strHTML+="			<th><label  title=\"" + isHTTPSToolTip + "\">Use HTTPS:</label></th>\n";
									strHTML+="			<td><input  title=\"" + isHTTPSToolTip + "\" type=\"checkbox\" id=\"isHTTPS\" onClick=\"setNodeModified(true)\"  onchange=\"setNodeModified(true)\" onkeypress=\"setNodeModified(true)\"" + cbIsHTTPS + " ><label for=\"isHTTPS\"></label></td>\n";

									strHTML+="		</tr>\n";
									strHTML+="		<tr>\n";
									strHTML+="			<th>Local IP:</th>\n";
									strHTML+="			<td><input class=\"inputText\"  title=\"" + localIPToolTip + "\" type=\"text\" id=\"localIP\" value=\"" + localIP + "\" onchange=\"setNodeModified(true)\" onkeypress=\"setNodeModified(true)\"></td>\n";
									strHTML+="			<th>Port:</th>\n";
									strHTML+="			<td><input class=\"inputText\"  title=\"" + portToolTip + "\" type=\"text\" id=\"port\" value=\"" + port + "\" onchange=\"setNodeModified(true)\" onkeypress=\"setNodeModified(true)\"></td>\n";
									strHTML+="		</tr>\n";
									strHTML+="		<tr>\n";
									strHTML+="			<th>Server FQDN:</th>\n";
									strHTML+="			<td><input class=\"inputText\"  title=\"" + serverFQDNToolTip + "\" type=\"text\" id=\"serverFQDN\" value=\"" + serverFQDN + "\" onchange=\"setNodeModified(true)\" onkeypress=\"setNodeModified(true)\"></td>\n";
									strHTML+="			<th>Description:</th>\n";
									strHTML+="			<td><input class=\"inputText\"  title=\"" + nodeDescriptionToolTip + "\" type=\"text\" id=\"nodeDescription\" value=\"" + nodeDescription + "\" onchange=\"setNodeModified(true)\" onkeypress=\"setNodeModified(true)\"></td>\n";
									strHTML+="		</tr>\n";
									strHTML+="		<tr>\n";
									strHTML+="			<td colspan=\"4\"><hr></td>\n";
									strHTML+="		</tr>\n";
									strHTML+="		<tr>\n";
									strHTML+="			<th><label  title=\"" + isBasicAuthEnabledToolTip + "\">Use basic authentication:</label></th>\n";
									strHTML+="			<td><input  title=\"" + isBasicAuthEnabledToolTip + "\" type=\"checkbox\" id=\"isBasicAuthEnabled\" onClick=\"setNodeModified(true)\"  onchange=\"setNodeModified(true)\" onkeypress=\"setNodeModified(true)\"" + cbIsBasicAuthEnabled + " ><label for=\"isBasicAuthEnabled\"></label></td>\n";
									strHTML+="			<th><label  title=\"" + isCookieAuthEnabledToolTip + "\">Use cookie authentication:</label></th>\n";
									strHTML+="			<td><input  title=\"" + isCookieAuthEnabledToolTip + "\" type=\"checkbox\" id=\"isCookieAuthEnabled\" onClick=\"setNodeModified(true)\"  onchange=\"setNodeModified(true)\" onkeypress=\"setNodeModified(true)\"" + cbIsCookieAuthEnabled + " ><label for=\"isCookieAuthEnabled\"></label></td>\n";
									strHTML+="		</tr>\n";
									strHTML+="	</tbody>\n";
									strHTML+="</table>\n";
				strHTML+="				</div>\n";
				strHTML+="				<div id=\"tabs-SSL\">\n";
				strHTML+="					<form enctype=\"multipart/form-data\">\n";
				strHTML+="					<div id=\"fileupload\"/>"
				strHTML+="					<table class=\"tabular_table choices-border \" width=\"100%\">\n";
				strHTML+="						<tbody class=\"tabular_table_body\">\n";
				strHTML+="							<tr>\n";
				strHTML+="								<th>Private key</th>\n";
				strHTML+="								<td><input class=\"inputFile\" id=\"PKfileuploadFLD\" type=\"file\"  onchange=\"setNodeModified(true)\" ></td>\n";
				strHTML+="							</tr>\n";
				strHTML+="							<tr>\n";
				strHTML+="								<th>Certificate</th>\n";
				strHTML+="								<td><input id=\"CERTfileuploadFLD\" type=\"file\" class=\"inputFile\" onchange=\"setNodeModified(true)\" ></td>\n";
				strHTML+="							</tr>\n";
				strHTML+="						</tbody>\n";
				strHTML+="					</table>\n";
				strHTML+="					</form>\n";
				strHTML+="				</div>\n";
				
				lblCa="Add CA cert.";
				lblChain="Add chain cert.";
				if(node != null){
					strHTML+="					<hr>\n";
					strHTML+="					<input type=\"button\" onclick=\"startResetSSL()\" value=\"Reset existing key and certificate\" class=\"button_orange\">\n"
					if (node.caUri != "") {
						lblCa = "Change current CA cert.";
					}
					if (node.chainUri != "") {
						lblChain = "Change current chain cert.";
					}
				}
				strHTML+="			    <hr><input  title=\"" + manageCAcertToolTip + "\" type=\"checkbox\" id=\"manageCaCert\" " + cbManageCAEnabled + " onclick=\"toggleAuthority()\"><label for=\"manageCaCert\">Manage Certification Authority certificates</label><br>\n";;
				strHTML+="				<div id=\"sslAuthority\"\n";
				strHTML+="					<form enctype=\"multipart/form-data\">\n";
				strHTML+="					<div id=\"fileupload\"/>"
				strHTML+="					<table class=\"tabular_table choices-border \" width=\"100%\">\n";
				strHTML+="						<tbody class=\"tabular_table_body\">\n";
				strHTML+="							<tr>\n";
				strHTML+="								<th><div id=\"lblCa\">" + lblCa + "</div></th>\n";
				strHTML+="								<td><input class=\"inputFile\" id=\"CAfileuploadFLD\" type=\"file\"  onchange=\"setNodeModified(true)\" ></td>\n";
				strHTML+="							</tr>\n";
				strHTML+="							<tr>\n";
				strHTML+="								<th><div id=\"lblChain\">" + lblChain + "</div></th>\n";
				strHTML+="								<td><input id=\"CHAINfileuploadFLD\" type=\"file\" class=\"inputFile\" onchange=\"setNodeModified(true)\" ></td>\n";
				strHTML+="							</tr>\n";
				strHTML+="						</tbody>\n";
				strHTML+="					</table>\n";
				strHTML+="					</form>\n";
				if(node != null){
					strHTML+="					<hr>\n";
					strHTML+="					<input type=\"button\" onclick=\"startResetCASSL()\" value=\"Remove existing CA and Chain certificates\" class=\"button_orange\">\n"
				}
				strHTML+="				</div>\n";





				strHTML+="			</div>\n";
				strHTML+="		</td>\n";
				strHTML+="	</tr>\n";
				strHTML+="</table>\n";
				return strHTML;
			}
			
			function editNode(node){

				currentNode=node;
				strHTML="";
				strHTML+="<center>";
				strHTML+="<h1>";
				strHTML+="Node properties";
				strHTML+="</h1>";
				strHTML+="<hr>"; 
				strHTML+="<form>";
				strHTML+=generateNodeProperties(node);
				strHTML+="<br>";
				strHTML+="<input type=\"button\" id=\"saveNode\" onclick=\"updateNode('" + node.uri + "')\" value=\"Save\" class=\"button_orange\">&nbsp;";
				strHTML+="<input type=\"button\" onclick=\"showNodes()\" value=\"Cancel\" class=\"button_orange\">";
				strHTML+="</form>";
				strHTML+="</center>";
				
				c=document.getElementById('content');
				c.innerHTML=strHTML;
				if (node.caUri == "" && node.chainUri==""){
					$('#sslAuthority').hide();
				}
				$(function() {
					$( "#tabs" ).tabs();
				});

				$("#mainForm").height($("#tabs").height()+10);
				$("#mainForm").click(function(){
						$("#mainForm").height($("#tabs").height()+10);
				});
				setNodeModified(false);
				removeSSLSetting=false;
				removeCASSLSetting=false;
			}

			
			function saveOrUpdateNode(method){
				if (!$('#isCookieAuthEnabled').is(':checked') && !$('#isBasicAuthEnabled').is(':checked') ){
					alert("At least one authentication methode (basic authentication or cookie authentication) should be enabled");
					return false;
				}
				
				showWait();
				 var uploadPrivKeyFLD=document.getElementById("PKfileuploadFLD");
				 var uploadCertFLD=document.getElementById("CERTfileuploadFLD");
				 var uploadCaFLD=document.getElementById("CAfileuploadFLD");
				 var uploadChainFLD=document.getElementById("CHAINfileuploadFLD");
				del=true;
				if (removeSSLSetting && uploadPrivKeyFLD.files.length==0 && uploadCertFLD.files.length==0){
					del=false;
					
					$.ajax({
					  url: "nodes/" + currentNode.nodeName + "/cert" ,
					  dataType: 'json',
					  async: false,
					  type:'DELETE',
					  success: function (e){
						  del=true;
					  },
					  error: displayErrorV2
					});
					if (del){
						del=false;
						$.ajax({
						  url: "nodes/" + currentNode.nodeName + "/privateKey" ,
						  dataType: 'json',
						  type:'DELETE',
						  async: false,
						  success: function (e){
							  del=true;
						  },
						  error: displayErrorV2
						});
					
					}
				}	
				if (removeCASSLSetting && uploadCaFLD.files.length==0){
					if (del){
						del=false;
						$.ajax({
						  url: "nodes/" + currentNode.nodeName + "/ca" ,
						  dataType: 'json',
						  type:'DELETE',
						  async: false,
						  success: function (e){
							  del=true;
						  },
						  error: displayErrorV2
						});
					
					}
				}	
				if (removeCASSLSetting && uploadChainFLD.files.length==0){
					if (del){
						del=false;
						$.ajax({
						  url: "nodes/" + currentNode.nodeName + "/chain" ,
						  dataType: 'json',
						  type:'DELETE',
						  async: false,
						  success: function (e){
							  del=true;
						  },
						  error: displayErrorV2
						});
					
					}
				}	
				if (!del){
					hideWait();
					return false;
				}
				
				nodeName="nodeName=" + encodeURIComponent($("#nodeNameFld").val());
				localIP="localIP=" + encodeURIComponent(document.getElementById("localIP").value);
				port="port=" + encodeURIComponent(document.getElementById("port").value);
				nodeDescription="nodeDescription=" + encodeURIComponent(document.getElementById("nodeDescription").value);
				additionalConfiguration="additionalConfiguration=" + encodeURIComponent($("#additionalConfiguration").val());
				serverFQDN="serverFQDN=" + encodeURIComponent(document.getElementById("serverFQDN").value);
				if (document.getElementById("isHTTPS").checked){
					isHTTPS="isHTTPS=1";
				}else{
					isHTTPS="isHTTPS=0";
				}
				if (document.getElementById("isBasicAuthEnabled").checked){
					isBasicAuthEnabled="isBasicAuthEnabled=1";
				}else{
					isBasicAuthEnabled="isBasicAuthEnabled=0";
				}
				if (document.getElementById("isCookieAuthEnabled").checked){
					isCookieAuthEnabled="isCookieAuthEnabled=1";
				}else{
					isCookieAuthEnabled="isCookieAuthEnabled=0";
				}
				postData=localIP + 
		  		"&" + serverFQDN + 
		  		"&" + port + 
		  		"&" + isBasicAuthEnabled + 
		  		"&" + isCookieAuthEnabled + 
		  		"&" + nodeDescription + 
		  		"&" + additionalConfiguration + 
		  		"&" + isHTTPS;
				if (method=='PUT'){
					businessUrl="nodes/" + encodeURIComponent(document.getElementById("nodeNameFld").value);
				}else{
					businessUrl="nodes/";
					postData="nodeName=" +encodeURIComponent(document.getElementById("nodeNameFld").value) + "&" + postData;
				}
				if (method=='POST'){
					//In case of create, first create to be able to update SSL setting in next step
					postOk=false;
					$.ajax({
						  url: businessUrl ,
						  dataType: 'json',
						  type:method,
						  data: postData + "&apply=0",
						  async: false,
						  success: function(){postOk=true},
						  error: displayErrorV2
						});
					if (!postOk){
						return false;
					}
				 }

				 error=false;
				 ssl=false;
				 nodeURI="nodes/" + encodeURIComponent(document.getElementById("nodeNameFld").value);
				 if (uploadPrivKeyFLD.files.length>0){
					$('#fileupload').fileupload();
					$('#fileupload').fileupload('send', {async: false, files: uploadPrivKeyFLD.files, url:nodeURI + "/privateKey"})
						.error(function (jqXHR, textStatus, errorThrown) {error=error||true; $('#fileupload').fileupload('destroy');displayErrorV2(jqXHR, textStatus, errorThrown)});
					ssl=true;
					$('#fileupload').fileupload('destroy');
				 }
				 if (uploadCertFLD.files.length>0){
					$('#fileupload').fileupload();
					$('#fileupload').fileupload('send', {async: false, files: uploadCertFLD.files, url:nodeURI + "/cert"})
						.error(function (jqXHR, textStatus, errorThrown) {error=error||true; $('#fileupload').fileupload('destroy');displayErrorV2(jqXHR, textStatus, errorThrown)});
						ssl=true;
					$('#fileupload').fileupload('destroy');
				 }
				 if (uploadCaFLD.files.length>0){
					$('#fileupload').fileupload();
					$('#fileupload').fileupload('send', {async: false, files: uploadCaFLD.files, url:nodeURI + "/ca"})
						.error(function (jqXHR, textStatus, errorThrown) {error=error||true; $('#fileupload').fileupload('destroy');displayErrorV2(jqXHR, textStatus, errorThrown)});
						ssl=true;
					$('#fileupload').fileupload('destroy');
				 }
				 if (uploadChainFLD.files.length>0){
					$('#fileupload').fileupload();
					$('#fileupload').fileupload('send', {async: false, files: uploadChainFLD.files, url:nodeURI + "/chain"})
						.error(function (jqXHR, textStatus, errorThrown) {error=error||true; $('#fileupload').fileupload('destroy');displayErrorV2(jqXHR, textStatus, errorThrown)});
						ssl=true;
					$('#fileupload').fileupload('destroy');
				 }
				 if (error){
					 return false;
				 }
				 //Anyway, update and apply config
				$.ajax({
					  url: businessUrl ,
					  dataType: 'json',
					  type:'PUT',
					  data: postData,
					  success: showNodes,
					  error: displayErrorV2
					});

			}
			
			function saveNewNode(){
				saveOrUpdateNode('POST');
			}
			
			
			function setQuotasVisibility(){
				
				reqSec="";
				reqDay="";
				reqMonth="";
				userQuotas="";
				if (currentNode != null){
					if (document.getElementById("isUserQuotasEnabled")!=null){
						if (document.getElementById("isUserQuotasEnabled").checked){
							currentNode.isUserQuotasEnabled=1;
						}else{
							currentNode.isUserQuotasEnabled=0;
						}
					}
					reqSec = currentNode.reqSec;
					reqDay = currentNode.reqDay;
					reqMonth=currentNode.reqMonth;
					userQuotas=(currentNode.isUserQuotasEnabled!=0);
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
					strHTML+="							<td><input class=\"inputNumber\"  title=\"" + perSecToolTip + "\"  type=\"text\" id=\"reqSec\" value=\"" + reqSec + "\"  onchange=\"setNodeModified(true)\" onkeypress=\"setNodeModified(true)\"></td>";
					strHTML+="						</tr>";
					strHTML+="						<tr  class=\"tabular_table_body\">";
					strHTML+="							<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maximun per day:</th>";
					strHTML+="							<td><input class=\"inputNumber\"  title=\"" + perDayToolTip + "\" type=\"text\" id=\"reqDay\"  value=\"" + reqDay + "\"  onchange=\"setNodeModified(true)\" onkeypress=\"setNodeModified(true)\"></td>";
					strHTML+="						</tr>";
					strHTML+="						<tr  class=\"tabular_table_body\">";
					strHTML+="							<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maximun per month:</th>";
					strHTML+="							<td><input class=\"inputNumber\"  title=\"" + perMonthToolTip + "\"  type=\"text\" id=\"reqMonth\"  value=\"" + reqMonth + "\" onchange=\"setNodeModified(true)\" onkeypress=\"setNodeModified(true)\"></td>";
					strHTML+="						</tr>";
				}
				strHTML+="						<tr id=\"userQuota\" class=\"tabular_table_body\">";
				strHTML+="							<th>Need user quotas control:</th>";
				strHTML+="							<td><input title=\"" + userQuotaToolTip + "\" type=\"checkbox\" id=\"isUserQuotasEnabled\"  onchange=\"setNodeModified(true)\" onClick=\"setNodeModified(true)\"><label for=\"isUserQuotasEnabled\"></label></td>";
				strHTML+="						</tr>";
				strHTML+="					</table>";

				q=document.getElementById('quotas');
				q.innerHTML=strHTML;
				document.getElementById("isUserQuotasEnabled").checked=userQuotas;
				checkUserAuth();
				setNodeModified(nodeModified);
				
			}
			
			function addNode(){
				currentNode=null;
				strHTML="";
				strHTML+="<center>";
				strHTML+="<h1>";
				strHTML+="New Node properties";
				strHTML+="</h1>";
				strHTML+="<hr>";
				strHTML+="<form>";
				strHTML+=generateNodeProperties(null);
				strHTML+="<br>";
				strHTML+="<input type=\"button\" id=\"saveNode\" onclick=\"saveNewNode()\" value=\"Save\" class=\"button_orange\">&nbsp;";
				strHTML+="<input type=\"button\" onclick=\"showNodes()\" value=\"Cancel\" class=\"button_orange\">";
				strHTML+="</form>";
				strHTML+="</center>";
				
				c=document.getElementById('content');
				c.innerHTML=strHTML;
				$('#sslAuthority').hide();
				$(function() {
					$( "#tabs" ).tabs();
				});

				$("#mainForm").height($("#tabs").height()+10);
				$("#mainForm").click(function(){
						$("#mainForm").height($("#tabs").height()+10);
				});
				setNodeModified(false);
				removeSSLSetting=false;
				removeCASSLSetting=false;
			}

function handelNodeFilterFormKeypress(e) {
	if (e.keyCode == 13) {
		showNodes();
		return false;
	}
}			
			
			function displayNodeList(nodeList){
				
				
				hideWait();
				strHTML="";
				strHTML+="<center>";
				strHTML+="<h1>";
				strHTML+=nodeList.length + " nodes found";
				strHTML+="</h1>";
				strHTML+="<hr>";
				strHTML += "<form onkeypress=\"return handelNodeFilterFormKeypress(event)\">";
				strHTML += "<table class=\"tabular_table searchFormTable\" >";	
				strHTML += "	<tr class=\"tabular_table_body\">";	
				strHTML += "		<th>node name</th> <td><input type=\"text\" id=\"nodeNameFilter\" value=\"" + nodeNameFilterPrevVal + "\"></td>";	
				strHTML += "		<th>node description</th> <td><input type=\"text\" id=\"nodeDescriptionFilter\" value=\"" + nodeDescriptionFilterPrevVal + "\"></td>";	
				strHTML += "		<th>server FQDN</th> <td><input type=\"text\" id=\"serverFQDNFilter\" value=\"" + serverFQDNFilterPrevVal + "\"></td>";	
				strHTML += "	</tr>";	
				strHTML += "	<tr class=\"tabular_table_body\">";	
				strHTML += "		<th>Local IP</th> <td><input type=\"text\" id=\"localIPFilter\"value=\"" + localIPFilterPrevVal + "\"></td>";	
				strHTML += "		<th>port</th> <td><input type=\"text\" id=\"portFilter\" value=\"" + portFilterPrevVal + "\"></td>";	
				strHTML += "		<td colspan=\"2\"><input type=\"button\" class=\"button_orange\" value=\"filter\" onclick=\"showNodes()\"><input type=\"button\" class=\"button_white\" value=\"reset\" onclick=\"resetNodeFilter()\"></th> ";	
				strHTML += "	</tr>";	
				strHTML += "</table>";	
				strHTML += "</form>";
				if (nodeList.length>0){	
					strHTML+="<table id=\"nodesList\" class=\"tabular_table scroll choices-border\" >\n";
					strHTML+="	<thead>\n";
					strHTML+="		<tr class=\"tabular_table_header\">\n";
					strHTML+="			<th>Node name</th>\n";
					strHTML+="			<th>SSL</th>\n";
					strHTML+="			<th>FQDN</th>\n";
					strHTML+="			<th>Binding</th>\n";
					strHTML+="			<th>Description</th>\n";
					strHTML+="			<th>Actions</th>\n";
					strHTML+="		</tr>\n";
					strHTML+="	</thead>\n";
					strHTML+="	<tbody>\n";
					for (i=0;i<nodeList.length;i++){
						strHTML+="		<tr class=\"tabular_table_body" +  (i%2) + "\">\n";
						strHTML+="			<td title=\"" + nodeList[i].nodeName + "\">" + nodeList[i].nodeName + "</td>\n";
						if (nodeList[i].isHTTPS==1){
							cbIsHTTPS="checked";
						}else{
							cbIsHTTPS=""
						}
						
						strHTML+="			<td class=\"isPublished\"><input  title=\"" + isPublishedToolTip + "\" type=\"checkbox\" id=\"isPublished" + i + "\" " + cbIsHTTPS + " disabled><label for=\"isPublished" + i + "\"></label></td>\n";

						strHTML+="			<td title=\"" + nodeList[i].serverFQDN + "\">" + nodeList[i].serverFQDN  + "</td>\n";
						strHTML+="			<td title=\"" + nodeList[i].localIP +":" + nodeList[i].port + "\">" + nodeList[i].localIP +":" + nodeList[i].port + "</td>\n";
						strHTML+="			<td title=\"" + nodeList[i].nodeDescription + "\">" + nodeList[i].nodeDescription + "</td>\n";
						strHTML+="			<td class=\"action\">\n";
						strHTML+="				<a title=\"" + editNodeToolTip + "\"  href=\"javascript:startEditNode('" + nodeList[i].uri + "')\"><img  border=\"0\" src=\"images/edit.gif\"></a><a title=\"" + deleteNodeToolTip + "\"  href=\"javascript:deleteNode('" + nodeList[i].uri + "', '" + nodeList[i].nodeName + "')\"><img border=\"0\" src=\"images/delete.gif\"></a>\n";
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
				touchScroll("nodesList_body_wrap");
			
			}

			
			function deleteNode(nodeURI, nodeName){
				
				
				if (confirm("Are you sure to want to remove node " + nodeName + "?")){
					showWait();
					$.ajax({
						  url: nodeURI,
						  dataType: 'json',
						  type:'DELETE',
						  //data: data,
						  success: showNodes,
						  error: displayErrorV2
						});
				}
				
			}
			
			function  resetNodeFilter(){
				$('#nodeNameFilter').val("");
				$('#nodeDescriptionFilter').val("")
				$('#localIPFilter').val("");
				$('#portFilter').val("");
				$('#serverFQDNFilter').val("");
				showNodes();
			}
			
			function showNodes(){
				prms="order=nodeName";
				prms=prms + "&nodeNameFilter=" + encodeURIComponent(getFilterValue('nodeNameFilter'));
				prms=prms + "&nodeDescriptionFilter=" + encodeURIComponent(getFilterValue('nodeDescriptionFilter'));
				prms=prms + "&localIPFilter=" + encodeURIComponent(getFilterValue('localIPFilter'));
				prms=prms + "&portFilter=" + encodeURIComponent(getFilterValue('portFilter'));
				prms=prms + "&serverFQDNFilter=" + encodeURIComponent(getFilterValue('serverFQDNFilter'));



				$.ajax({
					url : './nodes/',
					dataType : 'json',
					type : 'GET',
					data: prms,
					success : displayNodeList,
					error : displayErrorV2
				});
			}

			
			
			
			
//Event 			
			$(
					function (){
						$('#listNode').click(resetNodeFilter);
						$('#addNode').click(addNode);
					}
				);