<?php
class Audentio_UIX_Model_Thread extends XFCP_Audentio_UIX_Model_Thread
{
	const FETCH_LAST_POST_AVATAR = 0x16;

	public function prepareThreadFetchOptions(array $fetchOptions)
	{
		$threadFetchOptions = parent::prepareThreadFetchOptions($fetchOptions);
		$xenOptions = XenForo_Application::getOptions();

		if (!empty($fetchOptions['join']))
		{
			if ($fetchOptions['join'] & self::FETCH_LAST_POST_AVATAR && !$xenOptions->uix_disableLastPostAvatarQueries)
			{
				$threadFetchOptions['selectFields'] .= ',
					uix_last_post_user.avatar_date AS uix_last_post_user_avatar_date,
					uix_last_post_user.username AS uix_last_post_user_username,
					uix_last_post_user.avatar_width AS uix_last_post_user_avatar_width,
					uix_last_post_user.avatar_height AS uix_last_post_user_avatar_height,
					uix_last_post_user.gravatar AS uix_last_post_user_gravatar,
					uix_last_post_user.gender AS uix_last_post_user_gender,
					uix_last_post_user.is_banned AS uix_last_post_user_is_banned';
				$threadFetchOptions['joinTables'] .= 'LEFT JOIN xf_user AS uix_last_post_user ON (uix_last_post_user.user_id = thread.last_post_user_id)';
			}
		}

		return $threadFetchOptions;
	}

	public function prepareThread(array $thread, array $forum, array $nodePermissions = null, array $viewingUser = null)
	{
		$thread = parent::prepareThread($thread, $forum, $nodePermissions, $viewingUser);
		$xenOptions = XenForo_Application::getOptions();

		if (!$xenOptions->uix_disableLastPostAvatarQueries) {
			if (isset($thread['last_post_user_id']))
			{
				$thread['uix_lastPostAvatar']['user_id'] = $thread['last_post_user_id'];
			}
			if (isset($thread['uix_last_post_user_username']))
			{
				$thread['uix_lastPostAvatar']['username'] = $thread['uix_last_post_user_username'];
			}
			if (isset($thread['uix_last_post_user_avatar_date']))
			{
				$thread['uix_lastPostAvatar']['avatar_date'] = $thread['uix_last_post_user_avatar_date'];
			}
			if (isset($thread['uix_last_post_user_gravatar']))
			{
				$thread['uix_lastPostAvatar']['gravatar'] = $thread['uix_last_post_user_gravatar'];
			}
			if (isset($thread['uix_last_post_user_avatar_width']))
			{
				$thread['uix_lastPostAvatar']['avatar_width'] = $thread['uix_last_post_user_avatar_width'];
			}
			if (isset($thread['uix_last_post_user_avatar_height']))
			{
				$thread['uix_lastPostAvatar']['avatar_height'] = $thread['uix_last_post_user_avatar_height'];
			}
			if (isset($thread['uix_last_post_user_gender']))
			{
				$thread['uix_lastPostAvatar']['gender'] = $thread['uix_last_post_user_gender'];
			}
			if (isset($thread['uix_last_post_user_is_banned']))
			{
				$thread['uix_lastPostAvatar']['is_banned'] = $thread['uix_last_post_user_is_banned'];
			}
		}

		return $thread;
	}
}