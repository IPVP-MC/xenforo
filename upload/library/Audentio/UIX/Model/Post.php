<?php
class Audentio_UIX_Model_Post extends XFCP_Audentio_UIX_Model_Post
{
	public function getAndMergeAttachmentsIntoPosts(array $posts)
	{
		$xenOptions = XenForo_Application::getOptions();

		$posts = parent::getAndMergeAttachmentsIntoPosts($posts);

		foreach ($posts as &$post) {
			$post['uix_can_collapse'] = 1;
			if (array_key_exists('display_style_group_id', $post)) {
				if (in_array($post['display_style_group_id'], $xenOptions->uix_disableCollapseUserInfoGroups)) {
					$post['uix_can_collapse'] = 0;
				}
			}
		}

		return $posts;
	}
}