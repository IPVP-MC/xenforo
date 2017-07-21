<?php
class Audentio_UIX_ControllerAdmin_Category extends XFCP_Audentio_UIX_ControllerAdmin_Category
{
	public function actionEdit()
	{
		$response = parent::actionEdit();

		if ($response->viewName)
		{
			if (array_key_exists('node_id', $response->params['category']))
			{
				$nodeFields = $this->_getNodeModel()->getUixFieldsForNodeId($response->params['category']['node_id']);
				if (!$nodeFields && $response->params['category']['node_id'])
				{
					$this->_getNodeModel()->createEmptyNodeFieldsForNodeId($response->params['category']['node_id']);
				}
				$response->params['category']['uix_node_icons'] = @unserialize($nodeFields['uix_node_icons']);
				$response->params['category']['uix_styling'] = @unserialize($nodeFields['uix_styling']);
			}
		}
		return $response;
	}

	public function actionSave()
	{
		$nodeIcons = $this->_input->filterSingle('uix_node_icons', XenForo_Input::STRING, array('array' => true));
		$styling = $this->_input->filterSingle('uix_styling', XenForo_Input::ARRAY_SIMPLE);
		$GLOBALS['uix_node_icons'] = $nodeIcons;
		$GLOBALS['uix_styling'] = $styling;
		return parent::actionSave();
	}
}