<?php
class Audentio_UIX_Model_Conversation extends XFCP_Audentio_UIX_Model_Conversation
{
	public function getAndMergeAttachmentsIntoConversationMessages(array $messages)
	{
		$xenOptions = XenForo_Application::getOptions();
		$messages = parent::getAndMergeAttachmentsIntoConversationMessages($messages);

		foreach ($messages as &$message) {
			$message['uix_can_collapse'] = 1;
			if (array_key_exists('display_style_group_id', $message)) {
				if (in_array($message['display_style_group_id'], $xenOptions->uix_disableCollapseUserInfoGroups)) {
					$message['uix_can_collapse'] = 0;
				}
			}
		}

		return $messages;
	}
}

if (false) {
	class XFCP_Audentio_UIX_Model_Conversation extends XenForo_Model_Conversation {}
}