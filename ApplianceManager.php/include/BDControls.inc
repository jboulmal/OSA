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
 * File Name   : ApplianceManager/ApplianceManager.php/include/BDControls.inc
 *
 * Created     : 2012-02
 * Authors     : Benoit HERARD <benoit.herard(at)orange.com>
 *
 * Description :
 *      Old fashion...... Generate HTML components from sql request
 * 		Old old module.... method in frensh.......SSS
 *--------------------------------------------------------
 * History     :
 * 1.0.0 - 2012-10-01 : Release of the file
*/


	/*--AffCombo-----------------------------------------------------------------------------------*/
	/* Generer le texte HTML d'un <SELECT> a partir d'une table                                    */
	/* PREREQUIS : Classe d'acc�s au donn�es en include deja fait                                  */
	/*---------------------------------------------------------------------------------------------*/
	/* Parametre en entree :                                                                       */
	/*	$Name : Nom a donner au SELECT HTML                                                    */
	/*	$Table : Nom de la table                                                               */
	/*	$Idt : Nom de la colonne identifiant (VALUE du tag OPTION)                             */
	/*	$Lbl : Colonne affich�e dans la combo, Tri sur cette colonne                           */
	/*	$Sel : Valeur Selectionnee (vide par defaut)                                           */
	/*	$WithNull : Ajoute un ligne vide a la combo (a FALSE par defaut donc saisie obligatoire*/
	/*			d'un des elements de la liste)                                         */
	/*---------------------------------------------------------------------------------------------*/
	/* Parametre en sortie :                                                                       */
	/*	Aucun                                                                                  */
	/*---------------------------------------------------------------------------------------------*/
	/* Retour :                                                                                    */
	/*	Texte HTML du <SELECT>                                                                 */
	/*---------------------------------------------------------------------------------------------*/
	function AffCombo($Name, $Table, $Idt, $Lbl, $Sel = "", $WithNull = FALSE, $AdditionalAttr = ""){

		// Parametre de connexion � la BD
		include './passwords.php';
		$Cnx = new Connexion();
		if (!$Cnx->Ouvrir($BDName, $BDUser, $BDPwd)){
			$Cnx->Erreur->AffError();
		}
		
		$Rqt = new RequeteResultat();
		
		//Genere le texte SQL en fonction de $Idt, $Lbl, $Table
		$strSQL = "";
		$strSQL = $strSQL . "SELECT	" . $Idt ."," . $Lbl ." ";
		$strSQL = $strSQL . "FROM	" . $Table . " ";
		$strSQL = $strSQL . "ORDER BY	" . $Lbl ;
		
		if (!$Rqt->Ouvrir($strSQL, $Cnx)){
			$Rqt->Erreur->AffError();
		}
		
		echo $strRES;
		$strRES="<SELECT name=\"" . $Name . "\" " . $AdditionalAttr . " >";
		if ($WithNull){
			$strRES = $strRES . "<OPTION value=\"\">&nbsp;</OPTION>";
		}
		
		while (!$Rqt->EOF()){
			$strRES=$strRES . "<OPTION value=\"" . $Rqt->Champ($Idt) . "\"";
			if ($Rqt->Champ($Idt) == $Sel){
				$strRES = $strRES . " SELECTED ";
			}
			$strRES=$strRES . ">" . $Rqt->Champ($Lbl) ."</OPTION>";
			$Rqt->Suivant();
		}
		$Rqt->Fermer();
		$Cnx->Fermer();		
		$strRES=$strRES . "</SELECT>";
		
		return($strRES);
		
	}
	
	/*--MaxValue-----------------------------------------------------------------------------------*/
	/* Se veut etre un equivalent au sequence d'ORACLE                                             */
	/* ATTENTION : Tres rudimentaire, si 2 acces simultan� a la meme table -> plantage             */
	/* PREREQUIS : Classe d'acc�s au donn�es en include deja fait                                  */
	/*---------------------------------------------------------------------------------------------*/
	/* Parametre en entree :                                                                       */
	/*	$Table : Nom de la table sur laquelle on veut la valeur MAX                            */
	/*	$Idt : Nom de la colonne identifiant numerique dont on cherche le MAX                  */
	/*---------------------------------------------------------------------------------------------*/
	/* Parametre en sortie :                                                                       */
	/*	Aucun                                                                                  */
	/*---------------------------------------------------------------------------------------------*/
	/* Retour :                                                                                    */
	/*	Max(Idt)+1                                                                             */
	/*---------------------------------------------------------------------------------------------*/
	function MaxValue($Table, $Idt){

		//Parametre de connexion � la BD
		include './passwords.php';
		$zeCnx = new Connexion();
	
		if (!$zeCnx->Ouvrir($BDName, $BDUser, $BDPwd)){
			$zeCnx->Erreur->AffError();
		}
		$zeRqt = new RequeteResultat();
		
		$strSQL = "";
		$strSQL = $strSQL . "SELECT	max(" . $Idt .")+1 As Maxi ";
		$strSQL = $strSQL . "FROM	" . $Table . " ";
		
		if (!$zeRqt->Ouvrir($strSQL, $zeCnx)){
			$zeRqt->Erreur->AffError();
		}
		if (!$zeRqt->EOF()){
			$Rc = $zeRqt->Champ("Maxi");
		}else{
			$Rc = -1;
		}
		$zeRqt->Fermer();
		$zeCnx->Fermer();
	
		return($Rc);
	}
	


	/*--DoubleQuote--------------------------------------------------------------------------------*/
	/* Gere la presence des quote dans une chaine pour l'acces a la BD                             */
	/* 	SI MySQL : replace par $' sinon remplace par ''                                        */
	/* 	remplace les fin de ligne par des <br>                                                 */
	/*---------------------------------------------------------------------------------------------*/
	/* Parametre en entree :                                                                       */
	/*	$str : chaine a traiter                                                                */
	/*	$Lng : Taille maxi pour la chaine                                                      */
	/*---------------------------------------------------------------------------------------------*/
	/* Parametre en sortie :                                                                       */
	/*	Aucun                                                                                  */
	/*---------------------------------------------------------------------------------------------*/
	/* Retour :                                                                                    */
	/*	Chaine convertie                                                                       */
	/*---------------------------------------------------------------------------------------------*/
	function DoubleQuote($str, $Lng=null){
		global $includeBDMySQL;
	
			if (isset($Lng) && strlen($str)>$Lng){
				$strTMP=substr($str,0, $Lng);
			}else{
				$strTMP=$str;
			}
			$strOUT=ereg_replace("'","''",$strTMP);
			return $strOUT;
	}


	function SQLString($str=null, $Lng=null){
		if ($str === null){
			return "null";
		}else{
			return "'" . DoubleQuote($str, $Lng) . "'";
		}
	}
?>