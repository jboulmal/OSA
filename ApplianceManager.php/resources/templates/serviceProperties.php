<div class="row">
	<div class="col-md-12 col-xs-12">
		<div id="tabs">
			<ul>
				<li><a  href="#tabs-general"><?php echo Localization::getString("service.tab.general")?></a></li>
				<li><a  href="#tabs-frontEnd"><?php echo Localization::getString("service.tab.frontend")?></a></li>
				<li><a  href="#tabs-backEnd"><?php echo Localization::getString("service.tab.backend")?></a></li>
				<li><a  href="#tabs-quotas"><?php echo Localization::getString("service.tab.quotas")?></a></li>
				<li><a  href="#tabs-nodes"><?php echo Localization::getString("service.tab.nodes")?></a></li>
				<li><a  href="#tabs-advance"><?php echo Localization::getString("service.tab.advanced")?></a></li>
			</ul>
			<div id="tabs-general">
				<form accept-charset="UTF-8" role="form">
					<fieldset>
						<div class="row">
							<div  class="col-md-6 col-xs-6 ellipsis"  title="<?php echo Localization::getString("service.name.tooltip")?>">
								<label for="serviceName"><?php echo Localization::getString("service.label.name")?></label><br>
								{serviceName}<input type="{serviceNameInputType}" class="form-control"  placeholder="<?php echo Localization::getString("service.name.placeholder")?>"" id="serviceName" value="{serviceName}" onchange="setServiceModified(true)" onkeypress="setServiceModified(true)">
							</div>
							<div class="col-md-6 col-xs-6" title="<?php echo Localization::getString("service.isPublished.tooltip")?>">
								<label for="isPublished"><?php echo Localization::getString("service.label.isPublished")?></label><br>
								<input  type="checkbox" id="isPublished" onClick="setServiceModified(true)"  onchange="setServiceModified(true)" onkeypress="setServiceModified(true)" {cbIsPublished} >
							</div>
						</div>
						<div class="row">
							<div class="col-md-6 col-xs-6" title="<?php echo Localization::getString("service.frontendEndpoint.tooltip")?>">
								<label for="frontEndEndPoint"><?php echo Localization::getString("service.label.frontendEndpoint")?></label>
								<input class="form-control" placeholder="<?php echo Localization::getString("service.frontendEndpoint.placeholder")?>" type="text" id="frontEndEndPoint" value="{frontEndEndPointValue}"  onchange="setServiceModified(true)" onkeypress="setServiceModified(true)">
							</div>
							<div class="col-md-6 col-xs-6" title="<?php echo Localization::getString("service.backendEndpoint.tooltip")?>">
								<label for="backEndEndPoint"><?php echo Localization::getString("service.label.backendEndpoint")?></label>
								<input class="form-control" placeholder="<?php echo Localization::getString("service.backendEndpoint.placeholder")?>"  type="text" id="backEndEndPoint" value="{backEndEndPointValue}"  onchange="setServiceModified(true)" onkeypress="setServiceModified(true)">
							</div>
						</div>
					</fieldset>
				</form>
			</div>
			<div id="tabs-frontEnd">
				<form accept-charset="UTF-8" role="form">
					<fieldset>
						<div class="row">
							<div class="col-md-12 col-xs-12" title="<?php echo Localization::getString("service.isUserAuthenticationEnabled.tooltip")?>">
								<label for="isUserAuthenticationEnabled"><?php echo Localization::getString("service.label.isUserAuthenticationEnabled")?></label>
								<input title="{isUserAuthenticationToolTip}" type="checkbox" id="isUserAuthenticationEnabled" onClick="checkUserAuth()"  onchange="checkUserAuth()" onkeypress="checkUserAuth()"{cbIsUserAuthenticationEnabled}><label for="isUserAuthenticationEnabled"></label>
							</div>
						</div>
						<div id="group" class="row">
							<div class="col-md-12 col-xs-12" title="<?php echo Localization::getString("service.group.tooltip")?>">
								<label><?php echo Localization::getString("service.label.group")?></label>
								<div id='groupList'>
									<select class="form-control" name="groupName" id="groupName"  onchange="setServiceModified(true)" onkeypress="setServiceModified(true)">
										<option name="none" value="" ><?php echo Localization::getString("service.label.chooseOne")?></option>
									</select>
								</div>
							</div>
						</div>
						<div id="loginForm" class="row">
							<div class="col-md-12 col-xs-12" title="<?php echo Localization::getString("service.loginForm.tooltip")?>">
								<label><?php echo Localization::getString("service.label.loginForm")?></label>
								<input class="form-control" placeholder="<?php echo Localization::getString("service.loginForm.placeholder")?>" type="text" id="loginFormUri"  value="{loginFormUri}"  onchange="setServiceModified(true)" onkeypress="setServiceModified(true)">
							</div>
						</div>
						<div id="allowAnonymous" class="row">
							<div class="col-md-12 col-xs-12" title="<?php echo Localization::getString("service.isAnonymousAllowed.tooltip")?>">
								<label><?php echo Localization::getString("service.label.isAnonymousAllowed")?></label>
								<input type="checkbox" id="isAnonymousAllowed" {cbIsAnonymousAllowed} onClick="checkUserAuth()"  onchange="checkUserAuth()" onkeypress="checkUserAuth()"><label for="isAnonymousAllowed"></label>
							</div>
						</div>
					</fieldset>
				</form>
			</div>
			<div id="tabs-backEnd">
				<div class="row" id="idForwarding">
					<div class="col-md-12 col-xs-12" title="<?php echo Localization::getString("service.forwardIdentity.tooltip")?>">
						<label for="isIdentityForwardingEnabled"><?php echo Localization::getString("service.label.forwardIdentity")?></label>
						<input type="checkbox" id="isIdentityForwardingEnabled" onClick="setServiceModified(true)"  onchange="setServiceModified(true)" onkeypress="setServiceModified(true)" {cbIdentFwd}>
					</div>
				</div>
				<div class="row">
					<div class="col-md-6 col-xs-6" title="<?php echo Localization::getString("service.baUsername.tooltip")?>">
						<label><?php echo Localization::getString("service.label.baUsername")?></label>
						<input class="form-control"  placeholder="<?php echo Localization::getString("service.baUsername.placeholder")?>" type="text" id="backEndUsername" value="{backEndUsername}"  onchange="setServiceModified(true)" onkeypress="setServiceModified(true)">
					</div>
					<div class="col-md-6 col-xs-6" title="<?php echo Localization::getString("service.baPassword.tooltip")?>">
						<label><?php echo Localization::getString("service.label.baPassword")?></label>
						<input class="form-control"  type="password" placeholder="<?php echo Localization::getString("service.baPassword.placeholder")?>" id="backEndPassword" value="{backEndPassword}"  onchange="setServiceModified(true)" onkeypress="setServiceModified(true)">
					</div>
				</div>
			</div>
			<div id="tabs-quotas">
				<div class="row">
					<div class="cl-md-12" title="<?php echo Localization::getString("service.isGlobalQuotasEnabled.tooltip")?>">
						<label for="isGlobalQuotasEnabled"><?php echo Localization::getString("service.label.isGlobalQuotasEnabled")?></label>&nbsp;
						<input type="checkbox" id="isGlobalQuotasEnabled" onClick="setQuotasVisibility();setServiceModified(true)"  onchange="setServiceModified(true)" onkeypress="setServiceModified(true)">
					</div>
				</div>
				<div id="quotas">
					<div class="row">
						<div class="col-md-4" id="globalQuotasSec" style="display:none" title="<?php echo Localization::getString("service.reqSec.tooltip")?>">
							<label for="reqSec">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<?php echo Localization::getString("service.label.reqSec")?></label>
							<input class="form-control" placeholder="<?php echo Localization::getString("service.reqSec.placeholder")?>"type="number" id="reqSec" value="{reqSec}"  onchange="setServiceModified(true)" onkeypress="setServiceModified(true)">
						</div>
						<div class="col-md-4"  id="globalQuotasDay" style="display:none" title="<?php echo Localization::getString("service.reqDay.tooltip")?>">
							<label for="reqDay">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<?php echo Localization::getString("service.label.reqDay")?></label>
							<input class="form-control"  placeholder="<?php echo Localization::getString("service.reqDay.placeholder")?>" type="number" id="reqDay"  value="{reqDay}"  onchange="setServiceModified(true)" onkeypress="setServiceModified(true)">
						</div>
						<div class="col-md-4"  id="globalQuotasMonth" style="display:none" title="<?php echo Localization::getString("service.reqMonth.tooltip")?>">
							<label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<?php echo Localization::getString("service.label.reqMonth")?></label>
							<input class="form-control"  placeholder="<?php echo Localization::getString("service.reqMonth.placeholder")?>"  type="number" id="reqMonth"  value="{reqMonth}" onchange="setServiceModified(true)" onkeypress="setServiceModified(true)">
						</div>
					</div>
				</div>
				<div class="row" id="userQuota" style="display:none">
					<div class="col-md-12 col-xs-12" title="<?php echo Localization::getString("service.isUserQuotasEnabled.tooltip")?>">
						<hr>
						<label for="isUserQuotasEnabled"><?php echo Localization::getString("service.label.isUserQuotasEnabled")?></label>
						<input type="checkbox" id="isUserQuotasEnabled"  onchange="setServiceModified(true)" onClick="setServiceModified(true)" {cbUserQuota}>
					</div>
				</div>
			</div>
			<div id="tabs-nodes">
				<div >
					<div class="row">
						<div class="col-md-12 col-xs-12" title="<?php echo Localization::getString("service.onAllNodes.tooltip")?>">
							<label for="onAllNodes"><?php echo Localization::getString("service.label.onAllNodes")?></label>
							<input type="checkbox" id="onAllNodes" onClick="setNodesVisiblility();setServiceModified(true)"  onchange="setServiceModified(true)" onkeypress="setServiceModified(true)" {cbOnAllNodes}>
						</div>
					</div>
					<div  class="row" id="publishedOnNodes">
						<div class="col-md-12 col-xs-12"  title="<?php echo Localization::getString("service.publishedOnNodes.tooltip")?>">
							<hr>
							<label><?php echo Localization::getString("service.label.publishedOnNodes")?></label><br>
							<select name="serviceNodesList" id="serviceNodesList" size="15" multiple  class="form-control" onChange="setServiceModified(true)">
							</select>
						</div>
					</div>
				</div>
			</div>
			<div id="tabs-advance">
				<div class="row">
					<div class="col-md-12 col-xs-12" title="<?php echo Localization::getString("service.logHits.tooltip")?>">
						<label><?php echo Localization::getString("service.label.logHits")?></label>
						<input type="checkbox" id="isHitLoggingEnabled" onClick="setServiceModified(true)"  onchange="setServiceModified(true)" onkeypress="setServiceModified(true)" {cbIsHitLoggingEnabled}>
						<hr>
					</div>
				</div>
				<div id="warnAdditionalConfig" class="row">
					<div class="col-md-12 col-xs-12">
							<p class="errorMessage"><?php echo Localization::getString("service.label.warning.additionalConfiguration")?></p>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12 col-xs-12" title="<?php echo Localization::getString("service.additionalConfiguration.tooltip")?>">
						<label><?php echo Localization::getString("service.label.additionalConfiguration")?></label>
						<textarea class="form-control" rows=10 id="additionalConfiguration" onClick="setServiceModified(true)"  onchange="setServiceModified(true)" onkeypress="setServiceModified(true)">{additionalConfiguration}</textarea>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12 col-xs-12">
						<?php echo Localization::getString("service.label.additionalConfiguration.helpText")?>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
