<?php
class Audentio_UIX_DataWriter_DiscussionMessage_Post extends XFCP_Audentio_UIX_DataWriter_DiscussionMessage_Post
{
	protected function _messagePostSave()
	{
		parent::_messagePostSave();
		$xenOptions = XenForo_Application::getOptions();

		$threadId = $this->get('thread_id');
		$postId = $this->get('post_id');

		if (!$this->isInsert() && $this->isChanged('message') && $xenOptions->uix_uncollapseSticky_firstPostEdit) {
			$thread = $this->_getThreadModel()->getThreadById($threadId);
			if ($thread['first_post_id'] == $postId) {

				$forumWriter = XenForo_DataWriter::create('XenForo_DataWriter_Forum');
				$forumId = $thread['node_id'];
				$forumWriter->setExistingData($forumId);
				$forumWriter->set('uix_last_sticky_action', XenForo_Application::$time);
				$forumWriter->save();
			}
		}
	}
}

if (false) {
	class XFCP_Audentio_UIX_DataWriter_DiscussionMessage_Post extends XenForo_DataWriter_DiscussionMessage_Post {}
}