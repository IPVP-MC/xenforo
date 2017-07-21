<?php
class Audentio_UIX_ControllerAdmin_LinkForum extends XFCP_Audentio_UIX_ControllerAdmin_LinkForum
{
	public function actionEdit()
	{
		$response = parent::actionEdit();

		if ($response->viewName)
		{
			if (array_key_exists('node_id', $response->params['link']))
			{
				$nodeFields = $this->_getNodeModel()->getUixFieldsForNodeId($response->params['link']['node_id']);
				if (!$nodeFields && $response->params['link']['node_id'])
				{
					$this->_getNodeModel()->createEmptyNodeFieldsForNodeId($response->params['link']['node_id']);
				}
				$response->params['link']['uix_node_icons'] = @unserialize($nodeFields['uix_node_icons']);
				$response->params['link']['uix_styling'] = @unserialize($nodeFields['uix_styling']);
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