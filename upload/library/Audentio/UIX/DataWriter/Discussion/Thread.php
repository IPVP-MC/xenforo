<?php
class Audentio_UIX_DataWriter_Discussion_Thread extends XFCP_Audentio_UIX_DataWriter_Discussion_Thread
{
	protected function _discussionPostSave()
	{
		parent::_discussionPostSave();

		$sticky = $this->get('sticky');
		$discussionState = $this->get('discussion_state');

		if ($sticky) {
			$xenOptions = XenForo_Application::getOptions();
			$updateLastStickyAction = false;

			if ($this->isChanged('last_post_date') && $xenOptions->uix_uncollapseSticky_newReply && !$this->isInsert()) {
				$updateLastStickyAction = true;
			}

			if (!$this->isInsert() && $this->isChanged('sticky') && $xenOptions->uix_uncollapseSticky_newSticky) {
				$updateLastStickyAction = true;
			}

			if ($this->isInsert() && $xenOptions->uix_uncollapseSticky_newSticky) {
				$updateLastStickyAction = true;
			}

			if ($this->isChanged('discussion_state') && $discussionState == 'visible') {
				$updateLastStickyAction = true;
			}

			if ($updateLastStickyAction) {
				$forumWriter = XenForo_DataWriter::create('XenForo_DataWriter_Forum');
				$forumId = $this->get('node_id');
				$forumWriter->setExistingData($forumId);
				$forumWriter->set('uix_last_sticky_action', XenForo_Application::$time);
				$forumWriter->save();
			}
		}
	}
}

if (false) {
	class XFCP_Audentio_UIX_DataWriter_Discussion_Thread extends XenForo_DataWriter_Discussion_Thread {}
}