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
 * File Name   : ApplianceManager/ApplianceManager.php/include/BDMySQL.inc
 *
 * Created     : 2012-02
 * Authors     : Benoit HERARD <benoit.herard(at)orange.com>
 *
 * Description :
 *      Database abstraction layer over MySQL
 *		By rewriting similar clsses over other DBEngine should 
 * 		allow usage of allow usage of an other engine with mimimal
 * 		impact on software
 * 		Old old module: methods in frensh.......... 
 *--------------------------------------------------------
 * History     :
 * 1.0.0 - 2012-10-01 : Release of the file
*/



	//Include de la classe Erreur DB
	include dirname(__FILE__) . '/BDErreurs.inc';
	
	//Include de la gestion des Logs
	//include dirname(__FILE__) . '/Logs.inc';
	
	
	// Classe Connexion : Gestion des connexions � la BD
	class Connexion {
	  var $Serveur, $Bdd, $User, $Password, $Cnx, $Erreur;
	
	  // Constructeur : Initialisation des variables internes de l'objet
	  function Connexion() {
	  	$this->Serveur="";	
	  	$this->User="";
	  	$this->Password="";
	  	$this->Cnx=0;
	  	$this->Erreur= new BdErrors();
	}
	  
	  //Observateur : Retourne l'utilisateur BD utilis�
	  function GetUser(){
	  	return($this->User);
	  }
	  
	  //Observateur : Retourne le mot de passe BD utilis�
	  function GetPassword(){
	  	return($this->Password);
	  }

  	  //Observateur : Retourne le serveur BD attaqu�
	  function GetServeur(){
	  	return($this->Serveur);
	  }
	  
	  //Observateur : Retourne la derniere erreur rencontr�e
	  function GetErreur(){
	  	return($this->Erreur);
	  }
	  

	  //Observateur : Retourne la connexion a la BD active
	  function GetActiveConnexion(){
	  	return($this->Cnx);
	  }
	  
	  //Methode : Ouvrir une connexion vers la BD
	  function Ouvrir($pServeur="", $pUser="", $pPassword=""){
		global $NbCnxOpened;
	
	  	// Le serveur est de la forme base@machine
	  	// Charge dans le tableau en 0 la base en 1 la machine
	  	$TabCnx = explode( "@",$pServeur);
	  	
		//Connexion � la machine
	  	$LocalSrv=mysql_connect($TabCnx[1], $pUser, $pPassword);
	
	  	if ($LocalSrv != 0){
	
		  	$this->Serveur=$pServeur;	
		  	$this->User=$pUser;
		  	$this->Password=$pPassword;
	
	  		//Connexion � la BD
	  		$BddLocale=@mysql_select_db($TabCnx[0]);
	  		if ($BddLocale != 0){
		  		$this->Cnx=$LocalSrv;
				$NbCnxOpened++;
				$Rc = 1;
	
	  		}else{
		  		$this->Erreur->SetNum(1);
		  		$this->Erreur->SetAction("Connexion:Ouvrir.SelBDD");
		  		$this->Erreur->SetTexte("(" . mysql_errno() . ")" . mysql_error());
		  		$Rc = 0;
		  	}
	  	}else{
	  		$this->Erreur->SetNum(1);
	  		$this->Erreur->SetAction("Connexion:Ouvrir.SelSRV");
	  		$this->Erreur->SetTexte("(" . mysql_errno() . ")" . mysql_error() );
	  		$Rc = 0;
	  	}
			
	  	return($Rc);
	  }
	  
	  
	  //MEthode : Fermeture de la connexion
	  function Fermer(){
		global $NbCnxOpened;
	
		//Si plus de connexion ouverte
		$NbCnxOpened--;
		if ($NbCnxOpened==0){
			//Fermeture de la connexion
		  	mysql_close($this->Cnx);
	  		$this->Serveur="";
		  	$this->User="";
	  		$this->Password="";
		  	$this->Cnx=0;
		} 	
	  }
	 }		
	  			
	// Classe RequeteResultat : Gestion des requ�tes sur la BD
	class RequeteResultat {
		var $SqlTexte, $Cnx, $Erreur, $Rqt, $Fin, $CurLine;
		

		// Constructeur : Initialisation des variables internes de l'objet
		function RequeteResultat(){
		}
		
		// Observateur : Retourne TRUE si plus ou pas d'enreg. dans le resultat du SELECT
		function EOF(){
			return($this->Fin);
		}
		
		//Methode : Ouverture d'une requete resultat sur la BD (SELECT)
		//	$pSQL : Texte SQL du SELECT
		//	$pCnx : Object Connexion, cnx ouverte
		function Ouvrir($pSQL, $pCnx){
		
			$this->SqlTexte=$pSQL;
			$this->Cnx=$pCnx->GetActiveConnexion();
			$this->Erreur = new BdErrors();
			$LocalRqt=mysql_query($this->SqlTexte, $this->Cnx);
	  		if ($LocalRqt==FALSE){
	  			$Rc = 0;
	  			$this->Erreur->SetNum(3);
	  			$this->Erreur->SetAction("RequeteResultat:Ouvrir");
		  		$this->Erreur->SetTexte("(" . mysql_errno() . ")" . mysql_error() . " - " . $this->SqlTexte);
		  	}else{
		  		$Rc = 1;
		  		$this->Rqt=$LocalRqt;
		  		$this->Suivant();
		  		/*$this->CurLine = mysql_fetch_array($this->Rqt); 
		  		if ($this->CurLine == FALSE){
		  			$this->Fin=TRUE;
		  		}else{
		  			$this->Fin=FALSE;
		  		}*/
			}
	  		return($Rc);
	  	}
	  	
	  	//Methode : Fermeture de la requete SELECT
	  	function Fermer(){
	  		@mysql_free_result($this->Rqt);
	  	}
	  	
	  	
	  	//Methode : retourne le Nb de ligne du SELECT
	  	function NbLignes(){
	  		return(mysql_num_rows($this->Rqt));
	  	}
	  	
	  	
	  	//Methode : Se positionne sur le 1er Enr. du SELECT
	  	function Premier(){
	  		$Rc = (int)mysql_data_seek($this->Rqt,0) ;
	  		if ($Rc == 0){
	  			$this->Fin=TRUE ;
	  		}else{
	  			$this->Suivant();
	  			//$this->Fin=FALSE;
	  		}
	  	}
	  	
	  	
	  	//Methode : Passe a l'enr. suivant du SELECT
	  	function Suivant(){
		  		$this->CurLine=mysql_fetch_array($this->Rqt);
		  		if ($this->CurLine == FALSE){
		  			$this->Fin=TRUE;
		  		}else{
		  			$this->Fin=FALSE;
		  		}
	  	}
	  	
	  	
	  	//Methode : Retourne la valeur d'un champ
	  	//	$pChp : Nom du champ
	  	function Champ($pChp){
	  		//Le StripSlashes est la car seulon la conf PHP, ce clanpin peu rajouter des "\" devant les quotes.....
	  		return(StripSlashes (($this->CurLine[$pChp])));
	  	}
		
		//Methode : Execute un ordre type INSERT DELETE UPDATE sur la base
		//	$pSQL : Ordre SQL
		//	$pCnx : Objet Connexion, Connexion ouverte
		function Executer($pSQL, $pCnx){
	
			$this->SqlTexte=$pSQL;
			$this->Cnx=$pCnx->GetActiveConnexion();
			$LocalRqt=mysql_query($this->SqlTexte, $this->Cnx);
			if ($LocalRqt==FALSE){
				$this->Erreur = new BdErrors();
				$Rc = 0;
				$this->Erreur->SetNum(3);
				$this->Erreur->SetAction("RequeteResultat:Executer");
		  		$this->Erreur->SetTexte("(" . mysql_errno() . ")" . mysql_error() . " - " . $this->SqlTexte);
		  		$Rc = 0;
		  	}else{
		  		$Rc = 1;
		  	}
		  	return($Rc);
		}
		
	}
 ?>