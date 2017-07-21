<?php
class Audentio_UIX_ControllerAdmin_Option extends XFCP_Audentio_UIX_ControllerAdmin_Option
{
	function actionSave()
	{
		$response = parent::actionSave();

		$category = $this->_input->filterSingle('group_id', XenForo_Input::STRING);
		if ($category == 'uix')
		{
			$options = $this->_input->filterSingle('options', XenForo_Input::ARRAY_SIMPLE);
			$xenOptions = XenForo_Application::getOptions();
			if ($options['uix_defaultWidth'] != $xenOptions->uix_defaultWidth)
			{
				$userModel = $this->getModelFromCache('XenForo_Model_User');
				$userModel->uix_resetUserWidths($options['uix_defaultWidth']);
			}
		}
		return $response;
	}
}

if (false)
{
	class XFCP_Audentio_UIX_ControllerAdmin_Option extends XenForo_ControllerAdmin_Option {}
}