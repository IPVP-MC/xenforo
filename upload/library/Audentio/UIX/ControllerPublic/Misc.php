<?php
class Audentio_UIX_ControllerPublic_Misc extends XFCP_Audentio_UIX_ControllerPublic_Misc
{
	public function actionQuickNavigationMenu()
	{
		$response = parent::actionQuickNavigationMenu();
		$viewParams = $response->params;

		foreach ($viewParams['nodes'] as $nodeId=>&$node)
		{
			if ($node['node_type_id'] == 'uix_nodeLayoutSeparator')
			{
				unset($viewParams['nodes'][$nodeId]);
			}
		}


		return $this->responseView($response->viewName, $response->templateName, $viewParams);
	}
}