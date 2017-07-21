<?php
class Audentio_UIX_ControllerAdmin_UIXOptions extends XenForo_ControllerAdmin_Abstract
{
	protected function _preDispatch($action)
	{
		$this->assertAdminPermission('option');
	}

	public function actionIndex()
	{
		$optionModel = $this->_getOptionModel();

		$groups = $optionModel->getOptionGroupList(array('join' => XenForo_Model_Option::FETCH_ADDON));

		foreach ($groups as $groupId=>$group)
		{
			if ($group['addon_id'] != 'uix')
			{
				unset($groups[$groupId]);
			}
		}

		$viewParams = array(
			'groups' => $optionModel->prepareOptionGroups($groups, false),
			'canEditOptionDefinitions' => $optionModel->canEditOptionAndGroupDefinitions()
		);

		return $this->responseView('XenForo_ViewAdmin_Option_ListGroups', 'option_group_list', $viewParams);
	}

	protected function _getOptionModel()
	{
		return $this->getModelFromCache('XenForo_Model_Option');
	}
}