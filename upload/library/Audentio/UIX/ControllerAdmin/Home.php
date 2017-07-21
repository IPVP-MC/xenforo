<?php
class Audentio_UIX_ControllerAdmin_Home extends XFCP_Audentio_UIX_ControllerAdmin_Home
{
	public function actionIndex()
	{
		$response = parent::actionIndex();
		$visitor = XenForo_Visitor::getInstance();
		$xenOptions = XenForo_Application::get('options')->getOptions();
		if ($visitor->hasAdminPermission('uix_styles') && $xenOptions['uix_autoCheckForUpdates'])
		{
			$outdatedStyles = count($this->getModelFromCache('XenForo_Model_Style')->getOutOfDateAudentioStyles());
		}
		else
		{
			$outdatedStyles = 0;
		}

		if ($visitor->hasAdminPermission('addOn') && $xenOptions['uix_automaticallyCheckForAddonUpdates'])
		{
			$uixOutdated = $this->getModelFromCache('Audentio_UIX_Model_Audentio')->isUixOutdated();
		}
		else
		{
			$uixOutdated = 0;
		}

		$viewParams = array(
			'outdatedStyles'	=> $outdatedStyles,
			'uixOutdated'		=> $uixOutdated,
		);

		$viewParams = array_merge($viewParams, $response->params);
		return $this->responseView('XenForo_ViewAdmin_Home', 'home', $viewParams);
	}
}