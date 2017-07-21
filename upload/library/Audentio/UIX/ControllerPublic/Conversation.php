<?php
class Audentio_UIX_ControllerPublic_Conversation extends XFCP_Audentio_UIX_ControllerPublic_Conversation
{
	public function actionPopup()
	{
		$xenOptions = XenForo_Application::getOptions();
		if ($xenOptions->uix_visitorTabsConversations > 0) {
			$visitor = XenForo_Visitor::getInstance();
			$conversationModel = $this->_getConversationModel();

			$maxDisplay = $xenOptions->uix_visitorTabsConversations;

			$conversationsUnread = $conversationModel->getConversationsForUser($visitor['user_id'],
				array('is_unread' => true),
				array(
					'join' => XenForo_Model_Conversation::FETCH_LAST_MESSAGE_AVATAR,
					'limit' => $maxDisplay
				)
			);

			$totalUnread = count($conversationsUnread);

			if ($totalUnread < $maxDisplay)
			{
				$cutOff = 0;

				$conversationsRead = $conversationModel->getConversationsForUser($visitor['user_id'],
					array(
						'is_unread' => false,
						'last_message_date' => array('>', $cutOff)
					),
					array(
						'join' => XenForo_Model_Conversation::FETCH_LAST_MESSAGE_AVATAR,
						'limit' => $maxDisplay - $totalUnread
					)
				);

				if ($totalUnread != $visitor['conversations_unread'])
				{
					$dw = XenForo_DataWriter::create('XenForo_DataWriter_User');
					$dw->setExistingData($visitor['user_id']);
					$dw->set('conversations_unread', $totalUnread);
					$dw->save();

					$visitor['conversations_unread'] = $totalUnread;
				}
			}
			else
			{
				$conversationsRead = array();
			}

			$viewParams = array(
				'conversationsUnread' => $conversationModel->prepareConversations($conversationsUnread),
				'conversationsRead' => $conversationModel->prepareConversations($conversationsRead)
			);

			return $this->responseView('XenForo_ViewPublic_Conversation_ListPopup', 'conversation_list_popup', $viewParams);
		} else {
			return parent::actionPopup();
		}
	}
}

if (false) {
	class XFCP_Audentio_UIX_ControllerPublic_Conversation extends XenForo_ControllerPublic_Conversation {}
}