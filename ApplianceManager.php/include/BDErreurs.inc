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
 * File Name   : ApplianceManager/ApplianceManager.php/include/BDErreurs.inc
 *
 * Created     : 2012-02
 * Authors     : Benoit HERARD <benoit.herard(at)orange.com>
 *
 * Description :
 *      Handels database error (error object)
 * 		Old Old module....  methods in Frensh
 * 
 *--------------------------------------------------------
 * History     :
 * 1.0.0 - 2012-10-01 : Release of the file
*/



	//Classe BdErrors : Erreurs d'acces a la BD
	// Presuppose que Logs.inc est deja inclus
	class BdErrors {
		var $Num, $Action, $Texte, $pDir;
		
		//Constructeur : Initialise les variables internes
		function BdErrors(){
			$this->Num=0;
			$this->Action="";
			$this->Texte="";
			$this->pDir=trim(dirname(dirname(__FILE__)));
			if ($this->pDir=="" or $this->pDir="."){
				$this->pDir="./";
			}
		}

		//Observateur : Retourne le texte de l'erreur		
		function GetTexte(){
			return($this->Texte);
		}
		
		//Observateur : Retourne l'action ayant declenche l'erreur
		function GetAction(){
			return($this->Action);
		}
		
		//Observateur : Retourne le numero d'erreur
		function GetNum(){
			return($this->Num);
		}
		
		//Methode : Fixe l'action ayant declenche l'errur
		//	$pAction : Action
		function SetAction($pAction){
			$this->Action=$pAction;
		}
		
		//Methode : Fixe le texte de l'erreur
		//	$pTExte : Texte de l'erreur
		function SetTexte($pTexte){
			$this->Texte=$pTexte;
		}
		
		//Methode : Fixe le numero de l'erreur
		//	$pNum : Numero d'erreur
		function SetNum($pNum){
			$this->Num=$pNum;
		}
		
		//Methode : Affiche une page d'erreur
		//La page :
		//	s'appelle Erreur.php3
		//	Recoi un parametre MSGERR qui contient le texte de l'erreur
		//	Se trouve dans le repertoire HTTP pere de celui ou se trouve ce fichier
		//	N'est afficher que si le browser accepte le JavaScript
		function AffError(){
	
			if ($this->Num != 0){
				LogErr($this->Action, $this->Texte);
				//echo "Err=" . $this->Texte . "-" . $this->pDir;
				//exit;
				echo "<script language=\"JavaScript\">";
				echo "location=\"" . $this->pDir . "/Erreur.php?MSGERR=" . urlencode($this->Texte) . "\"";
				echo "</script>";
	 			exit;
			}
		}
	
		
	}
?>