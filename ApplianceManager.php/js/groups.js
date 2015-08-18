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
 * File Name   : ApplianceManager/ApplianceManager.php/js/groups.js
 *
 * Created     : 2012-02
 * Authors     : Benoit HERARD <benoit.herard(at)orange.com>
 *
 * Description :
 *      .../...
 *--------------------------------------------------------
 * History     :
 * 1.0.0 - 2012-10-01 : Release of the file
*/

			var groupModified;
			var groupDescToolTip="Enter here the group description\nIt is only used for information purpose";
			var groupNameToolTip="Enter the group name here.\nDon't use special chars.\nGroup name is used to manage authorization on services.\nGroup name is group identifier and can not be modified.";
			var editGroupToolTip="Edit this group";
			var deleteGroupToolTip="Delete this group";
			var addGroupToolTip="Add a new group to the system";		
					
			var groupNameFilterPrevVal="";
			var groupDescritpionFilterPrevVal="";
			var currentGroup;
					
			function  resetGroupFilter(){
				groupNameFilterPrevVal="";
				groupDescritpionFilterPrevVal="";
				
				$('#groupNameFilter').val("")
				$('#groupDescritpionFilter').val("")
				showGroups();
			}
					
			function handelGroupFilterFormKeypress(e) {
				if (e.keyCode == 13) {
					showGroups();
					return false;
				}
			}					
			function setGroupModified(isModified){
				groupModified=isModified;
				if (isModified){
					setActionButtonEnabled('saveGroup',true);
					setActionButtonEnabled('groupMembers',false);
				}else{
					setActionButtonEnabled('saveGroup',false);
					setActionButtonEnabled('groupMembers',true);
				}
			}


			function startEditGroup(groupURI){
				$.getJSON(groupURI, editGroup).error(displayErrorV2);
			}
			
			
						
			function updateGroup(groupURI){
				desc = "description=" + encodeURIComponent(document.getElementById("groupDesc").value);
				$.ajax({
					  url: groupURI + "?" + desc,
					  dataType: 'json',
					  type:'PUT',
					  data: desc,
					  success: showGroups,
					  error: displayErrorV2
					});
				
			}
			function editGroup(group){
				currentGroup=group;

				strHTML="";
				strHTML+="<center>";
				strHTML+="<h1>";
				strHTML+="Group " + group.groupName + " properties";
				strHTML+="</h1>";
				strHTML+="<hr>";
				strHTML+="<form>";
				strHTML+="<table class=\"tabular_table\">";
				strHTML+="<tr class=\"tabular_table_body\">";
				strHTML+="<th>Group name:</th>";
				strHTML+="<td>" + group.groupName + "</td>";
				strHTML+="<tr class=\"tabular_table_body\">";
				strHTML+="<th>Description:</th>";
				strHTML+="<td><input class=\"inputText\"  title=\"" + groupDescToolTip + "\" type='text' id='groupDesc' value=\"" + group.description + "\" onchange=\"setGroupModified(true)\" onkeypress=\"setGroupModified(true)\"></td>";
				strHTML+="</tr>";
				strHTML+="</table>";
				strHTML+="<br>";
				strHTML+="<input type=\"button\" id=\"saveGroup\" onclick=\"updateGroup('" + group.uri + "')\" value=\"Save\" class=\"button_orange\">&nbsp;";
				strHTML+="<input type=\"button\" id=\"cancelGroup\"  onclick=\"showGroups()\" value=\"Cancel\" class=\"button_orange\">";
				strHTML+="<input type=\"button\" id=\"groupMembers\"  onclick=\"showMembers()\" value=\"Members\" class=\"button_orange\">";
				strHTML+="</form>";
				strHTML+="</center>";
				
				c=document.getElementById('content');
				c.innerHTML=strHTML;
				setGroupModified(false);

			}

			
			function saveNewGroup(){
				desc = "description=" + encodeURIComponent(document.getElementById("groupDesc").value);
				groupName="groupName=" + encodeURIComponent(document.getElementById("groupName").value);
				$.ajax({
					  url: "groups/?" + desc + "&" + groupName, 
					  dataType: 'json',
					  type:'POST',
					  data: desc,
					  success: showGroups,
					  error: displayErrorV2
					});
				
				
			}
			
			function addGroup(){
				strHTML="";
				strHTML+="<center>";
				strHTML+="<h1>";
				strHTML+="New Group properties";
				strHTML+="</h1>";
				strHTML+="<hr>";
				strHTML+="<form>";
				strHTML+="<table class=\"tabular_table\">";
				strHTML+="<tr class=\"tabular_table_body\">";
				strHTML+="<th>Group name:</th>";
				strHTML+="<td><input class=\"inputText\" title=\"" + groupNameToolTip + "\" type=\"text\" id=\"groupName\" onchange=\"setGroupModified(true)\" onkeypress=\"setGroupModified(true)\"></td>";
				strHTML+="<tr class=\"tabular_table_body\">";
				strHTML+="<th>Description:</th>";
				strHTML+="<td><input class=\"inputText\" title=\"" + groupDescToolTip + "\" type='text' id='groupDesc' onchange=\"setGroupModified(true)\" onkeypress=\"setGroupModified(true)\"></td>";
				strHTML+="</tr>";
				strHTML+="</table>";
				strHTML+="<br>";
				strHTML+="<input type=\"button\" id=\"saveGroup\" onclick=\"saveNewGroup()\" value=\"OK\" class=\"button_orange\">&nbsp;";
				strHTML+="<input type=\"button\" onclick=\"showGroups()\" value=\"Cancel\" class=\"button_orange\">";
				strHTML+="</form>";
				strHTML+="</center>";
				
				c=document.getElementById('content');
				c.innerHTML=strHTML;
				setGroupModified(false);
			}

			
			
			function displayGroupList(groupList){
				
				strHTML="";
				strHTML+="<center>";
				strHTML+="<h1>";
				strHTML+=groupList.length + " groups found"
				strHTML+="</h1>";
				strHTML+="<hr>";
				strHTML+= "<form onkeypress=\"return handelGroupFilterFormKeypress(event)\">";
				strHTML+= "<table class=\"tabular_table searchFormTable\" >";	
				strHTML+= "	<tr class=\"tabular_table_body\">";	
				strHTML+= "		<th>group name</th> <td><input type=\"text\" id=\"groupNameFilter\" value=\"" + groupNameFilterPrevVal + "\"></td>";	
				strHTML+= "		<th>description</th> <td><input type=\"text\" id=\"groupDescritpionFilter\" value=\"" + groupDescritpionFilterPrevVal + "\"></td>";	
				strHTML+= "		<td><input type=\"button\" class=\"button_orange\" value=\"filter\" onclick=\"showGroups()\"><input type=\"button\" class=\"button_white\" value=\"reset\" onclick=\"resetGroupFilter()\"></th> ";	
				strHTML+= "	</tr>";	
				strHTML+= "</table>";	
				strHTML+= "</form>";	
				if (groupList.length>0){
					strHTML+="<table id=\"groupsList\"class=\"tabular_table scroll\">";
					strHTML+="<thead><tr class=\"tabular_table_header\">";
					strHTML+="<th>Groupname</th>";
					strHTML+="<th>Description</th>";
					strHTML+="<th>Actions</th>";
					strHTML+="</tr></thead><tbody>";
					for (i=0;i<groupList.length;i++){
						strHTML+="<tr class=\"tabular_table_body" +  (i%2) + "\">";
						strHTML+="<td>" + groupList[i].groupName + "</td>";
						strHTML+="<td>" + groupList[i].description + "</td>";
						strHTML+="<td class=\"action\">";
						strHTML+="<a title=\""+ editGroupToolTip + "\" href=\"javascript:startEditGroup('" + groupList[i].uri + "')\"><img border=\"0\" src=\"images/edit.gif\"></a>";
						if (groupList[i].groupName != "Admin" && groupList[i].groupName != "valid-user"){
							strHTML+="<a   title=\"" + deleteGroupToolTip + "\" href=\"javascript:deleteGroup('" + groupList[i].uri + "', '" + groupList[i].groupName + "')\"><img border=\"0\" src=\"images/delete.gif\"></a>";
						}
						strHTML+="</td>";
						strHTML+="</tr>";
					}
					strHTML+="</tbody></table>";
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
				touchScroll("groupsList_body_wrap");

				
			}

			
			function deleteGroup(groupURI, groupName){
				
				
				if (confirm("Are you sure to want to remove group " + groupName + "?")){
					$.ajax({
						  url: groupURI,
						  dataType: 'json',
						  type:'DELETE',
						  //data: data,
						  success: showGroups,
						  error: displayErrorV2
						});
				}
				
			}
			
			
			function showGroups(){

				prms="order=groupName";
				prms=prms + "&groupNameFilter=" + encodeURIComponent(getFilterValue('groupNameFilter'));
				prms=prms + "&groupDescritpionFilter=" + encodeURIComponent(getFilterValue('groupDescritpionFilter'));

				$.ajax({
					url : './groups/',
					dataType : 'json',
					type : 'GET',
					data: prms,
					success : displayGroupList,
					error : displayErrorV2
				});

			}
			
			
function displayGroupMembers(userList) {

	strHTML = "";
	strHTML += "<center>";
	strHTML += "<h2>";
	strHTML += currentGroup.groupName + "'s members ";
	strHTML += "</h2>";
	if (userList.length > 0) {
		strHTML += "			<table class=\"tabular_table scroll\">";
		strHTML += "				<thead>";
		strHTML += "				<tr class=\"tabular_table_header\">";
		strHTML += "					<th>User name</th>";
		strHTML += "					<th>First name</th>";
		strHTML += "					<th>Last name</th>";
		strHTML += "					<th>email</th>";
		strHTML += "				</tr>";
		strHTML += "				</thead></tbody>";
		for (i = 0; i < userList.length; i++) {
			strHTML += "			<tr class=\"tabular_table_body" + (i % 2) + "\">";
			strHTML += "				<td>" + userList[i].userName + "</td>";
			strHTML += "				<td>" + userList[i].firstName + "</td>";
			strHTML += "				<td>" + userList[i].lastName + "</td>";
			strHTML += "				<td>" + userList[i].emailAddress + "</td>";
			strHTML += "			</tr>";
		}
		strHTML += "			</tbody>";
		strHTML += "			</table>";
		strHTML += "<br><input type=\"button\" class=\"button_orange\" onclick=\"editGroup(currentGroup)\" value=\"Done\">&nbsp;";

		c=document.getElementById('content');
		c.innerHTML=strHTML;
	}	
}
			
			function showMembers(){


				$.ajax({
					url : currentGroup.uri + '/members',
					dataType : 'json',
					type : 'GET',
					data: 'order=userName',
					success : displayGroupMembers,
					error : displayErrorV2
				});

			}

			
			
			
			
//Event 			
			$(
					function (){
						$('#listGroup').click(resetGroupFilter);
						$('#addGroup').click(addGroup);
					}
				);
