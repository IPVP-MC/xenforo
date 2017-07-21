<?php
class Audentio_UIX_Listener_Option
{
	public static function uix_apiKey(&$optionValue, XenForo_DataWriter $writer, $optionId)
	{
		if (empty($optionValue))
		{
			$xenOptions = XenForo_Application::getOptions();
			$optionValue = $xenOptions->uix_apiKey;
		}

		$optionValue = str_replace(' ', '', $optionValue);
		return true;
	}

	public static function uix_checkForUnassociatedStyles(&$optionValue, XenForo_DataWriter $writer, $optionId)
	{
		if ($optionValue)
		{
			/** @var XenForo_Model_DataRegistry $registryModel */
			$registryModel = XenForo_Model::create('XenForo_Model_DataRegistry');
			$registryModel->set('uix_checkStylesStart', XenForo_Application::$time);
		}

		return true;
	}

	public static function userGroup(XenForo_View $view, $fieldPrefix, array $preparedOption, $canEdit)
	{
		/** @var XenForo_Model_UserGroup $userGroupModel */
		$userGroupModel = XenForo_Model::create('XenForo_Model_UserGroup');

		$preparedOption['formatParams'] = array();

		foreach ($userGroupModel->getAllUserGroupTitles() AS $userGroupId => $userGroupName) {
			$preparedOption['formatParams'][] = array(
				'name' => "{$fieldPrefix}[{$preparedOption['option_id']}][$userGroupId]",
				'label' => $userGroupName,
				'selected' => !empty($preparedOption['option_value'][$userGroupId])
			);
		}

		return XenForo_ViewAdmin_Helper_Option::renderOptionTemplateInternal(
			'option_list_option_checkbox', $view, $fieldPrefix, $preparedOption, $canEdit,
			array('class' => 'checkboxColumns')
		);
	}
}