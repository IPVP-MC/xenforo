<?php
class Audentio_UIX_ControllerAdmin_Forum extends XFCP_Audentio_UIX_ControllerAdmin_Forum
{
	public function actionEdit()
	{
		$response = parent::actionEdit();

		if ($response->viewName)
		{
			if (array_key_exists('node_id', $response->params['forum']))
			{
				$nodeFields = $this->_getNodeModel()->getUixFieldsForNodeId($response->params['forum']['node_id']);
				if (!$nodeFields && $response->params['forum']['node_id'])
				{
					$this->_getNodeModel()->createEmptyNodeFieldsForNodeId($response->params['forum']['node_id']);
				}
				$response->params['forum']['uix_node_icons'] = @unserialize($nodeFields['uix_node_icons']);
				$response->params['forum']['uix_styling'] = @unserialize($nodeFields['uix_styling']);
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
if (false)
{
	class XFCP_Audentio_UIX_ControllerAdmin_Forum extends XenForo_ControllerAdmin_Forum {}
}