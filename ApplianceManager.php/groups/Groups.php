<?php
/*--------------------------------------------------------
 * Module Name : ApplianceManager
 * Version : 1.0.0
 *
 * Software Name : OpenServicesAccess
 * Version : 2.0
 *
 * Copyright (c) 2011 – 2014 Orange
 * This software is distributed under the Apache 2 license
 * <http://www.apache.org/licenses/LICENSE-2.0.html>
 *
 *--------------------------------------------------------
 * File Name   : ApplianceManager/ApplianceManager.php/groups/Groups.php
 *
 * Created     : 2013-11
 * Authors     : Benoit HERARD <benoit.herard(at)orange.com>
 *
 * Description :
 *      REST Handler
 * 
 *--------------------------------------------------------
 * History     :
 * 1.0.0 - 2013-11-12 : Release of the file
*/

require_once('../include/commonHeaders.php');

require_once 'groupDAO.php';
require_once '../users/userDAO.php';


class Groups{
	
	
	function getParameterValue($paramName, $request_data){
		if (isset($request_data[$paramName]) && $request_data[$paramName]!="" ){
			return $request_data[$paramName];
		}else{
			return NULL;
		}
	}
	
	/**
	 * @url GET
	 * @url GET :groupName
	 */
	function get($groupName=NULL, $request_data = NULL){
		try{
			return getGroup($groupName, $request_data);
		}catch (Exception $e){
			throw new RestException($e->getCode(), $e->getMessage());
		}
	}
	/**
	 * @url GET :groupName/members
	 */
	function getMembers($groupName, $request_data = NULL){
		try{
			return getGroupMembers($groupName, $request_data);
		}catch (Exception $e){
			throw new RestException($e->getCode(), $e->getMessage());
		}
	}

	/**
	 * @url POST 
	 * @url POST :groupName
	 */
	function create($groupName = NULL, $request_data = NULL){
		try{
			return addGroup($groupName,  $this->getParameterValue("description", $request_data));
		}catch (Exception $e){
			throw new RestException($e->getCode(), $e->getMessage());
		}
	}
	/**
	 * @url DELETE 
	 * @url DELETE :groupName
	 */
	function delete($groupName = NULL){
		try{
			return deleteGroup($groupName);
		}catch (Exception $e){
			throw new RestException($e->getCode(), $e->getMessage());
		}
	}
	/**
	 * @url PUT 
	 * @url PUT :groupName
	 */
	function update($groupName = NULL, $request_data = NULL){
		try{
			return updateGroup($groupName,  $this->getParameterValue("description", $request_data));
		}catch (Exception $e){
			throw new RestException($e->getCode(), $e->getMessage());
		}
	}
	
	
	/**
	 * @url GET :groupName/users
	 */
	 function getGroupMembers($groupName){
		try{
			return getGroupMembers($groupName);
		}catch (Exception $e){
			throw new RestException($e->getCode(), $e->getMessage());
		}
	 }
	/**
	 * @url PUT :groupName/users/:userName
	 */
	 function addGroupMember($groupName, $userName){
		try{
			return addUserToGroup($userName, $groupName);
		}catch (Exception $e){
			throw new RestException($e->getCode(), $e->getMessage());
		}
	 }
	/**
	 * @url DELETE :groupName/users/:userName
	 */
	 function removeGroupMember($groupName, $userName){
		try{
			return removeUserFromGroup($userName, $groupName);
		}catch (Exception $e){
			throw new RestException($e->getCode(), $e->getMessage());
		}
	 }
	 
}
