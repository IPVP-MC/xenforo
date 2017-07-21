<?php
class Audentio_UIX_ControllerPublic_Account extends XFCP_Audentio_UIX_ControllerPublic_Account
{
	public function actionPreferencesSave()
	{
		$GLOBALS['uix_sticky_navigation'] = $this->_input->filterSingle('uix_sticky_navigation', XenForo_Input::BOOLEAN);
		$GLOBALS['uix_sticky_userbar'] = $this->_input->filterSingle('uix_sticky_userbar', XenForo_Input::BOOLEAN);
		$GLOBALS['uix_sticky_sidebar'] = $this->_input->filterSingle('uix_sticky_sidebar', XenForo_Input::BOOLEAN);
		$GLOBALS['uix_collapse_user_info'] = $this->_input->filterSingle('uix_collapse_user_info', XenForo_Input::BOOLEAN);
		$GLOBALS['uix_collapse_signature'] = $this->_input->filterSingle('uix_collapse_signature', XenForo_Input::BOOLEAN);
		return parent::actionPreferencesSave();
	}
	public function actionAlertsPopup()
	{
		$xenOptions = XenForo_Application::getOptions();
		if ($xenOptions->uix_visitorTabsAlerts > 0) {
			$alertModel = $this->_getAlertModel();
			$visitor = XenForo_Visitor::getInstance();

			$alertResults = $alertModel->getAlertsForUser(
				$visitor['user_id'],
				Audentio_UIX_Model_Alert::FETCH_MODE_UIX_POPUP
			);

			if ($visitor['alerts_unread'])
			{
				$alertModel->markAllAlertsReadForUser($visitor['user_id']);
			}

			// separate read and unread alerts (for coloring reasons)
			$alertsUnread = array();
			$alertsRead = array();
			foreach ($alertResults['alerts'] AS $alertId => $alert)
			{
				if ($alert['unviewed'])
				{
					$alertsUnread[$alertId] = $alert;
				}
				else
				{
					$alertsRead[$alertId] = $alert;
				}
			}

			$viewParams = array(
				'alertsUnread' => $alertsUnread,
				'alertsRead' => $alertsRead,
				'alertHandlers' => $alertResults['alertHandlers'],
			);

			return $this->responseView(
				'XenForo_ViewPublic_Account_AlertsPopup',
				'account_alerts_popup',
				$viewParams
			);

		} else {
			return parent::actionAlertsPopup();
		}
	}
}