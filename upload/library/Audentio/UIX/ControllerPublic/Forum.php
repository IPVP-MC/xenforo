<?php
class Audentio_UIX_ControllerPublic_Forum extends XFCP_Audentio_UIX_ControllerPublic_Forum
{
	protected function _getThreadFetchElements(array $forum, array $displayConditions)
	{
		$threadModel = $this->_getThreadModel();
		$elements = parent::_getThreadFetchElements($forum, $displayConditions);

		$fetchConditions = $elements['conditions'];
		$fetchOptions = $elements['options'];

		$fetchOptions['join'] |= Audentio_UIX_Model_Thread::FETCH_LAST_POST_AVATAR;

		return array(
			'conditions'	=> $fetchConditions,
			'options'		=> $fetchOptions
		);
	}

	public function actionForum()
	{
		$response = parent::actionForum();
		$visitor = XenForo_Visitor::getInstance();

		if ($response instanceof XenForo_ControllerResponse_View) {
			$collapseStuckThreads = 0;
			$forum = $response->params['forum'];

			if (isset($visitor['uix_collapse_stuck_threads'])) {
				if ($visitor['uix_collapse_stuck_threads'] > $forum['uix_last_sticky_action']) {
					$collapseStuckThreads = 1;
				}
			}

			$response->params['uix_collapseStickyThreads'] = $collapseStuckThreads;
		}

		return $response;
	}
}