<?php
class Audentio_UIX_Model_Alert extends XFCP_Audentio_UIX_Model_Alert
{
	const FETCH_MODE_UIX_POPUP = 'fetchModeUixPopUp';
	protected function _getAlertsFromSource($userId, $fetchMode, array $fetchOptions = array())
	{
		if ($fetchMode == self::FETCH_MODE_UIX_POPUP) {
			$xenOptions = XenForo_Application::getOptions();
			$fetchOptions['page'] = 0;
			$fetchOptions['perPage'] = $xenOptions->uix_visitorTabsAlerts;

			$limitOptions = $this->prepareLimitFetchOptions($fetchOptions);

			return $this->fetchAllKeyed($this->limitQueryResults(
				'
				SELECT
					alert.*,
					user.gender, user.avatar_date, user.gravatar,
					IF (user.user_id IS NULL, alert.username, user.username) AS username
				FROM xf_user_alert AS alert
				LEFT JOIN xf_user AS user ON
					(user.user_id = alert.user_id)
				WHERE alert.alerted_user_id = ?
					AND (alert.view_date = 0 OR alert.view_date > ?)
				ORDER BY event_date DESC
			', $limitOptions['limit'], $limitOptions['offset']
			), 'alert_id', array($userId, 0));
		} else {
			return parent::_getAlertsFromSource($userId, $fetchMode, $fetchOptions);
		}
	}
}

if (false) {
	class XFCP_Audentio_UIX_Model_Alert extends XenForo_Model_Alert {}
}