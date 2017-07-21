<?php
class Audentio_UIX_Model_Stats extends XenForo_Model
{
	protected $_validStats = array(
		'numDiscussions',
		'numMessages',
		'numUsers',
		'latestUser',
		'numOnlineVisitors',
		'numOnlineMembers',
		'numOnlineRobots',
		'onlineUsers',
	);
	protected static $_statCache = array();

	public function getStat($stat, array $options)
	{
		if (!in_array($stat, $this->_validStats))
		{
			return false;
		}
		if (!array_key_exists($stat, self::$_statCache))
		{
			switch ($stat)
			{
				case 'numDiscussions':
				case 'numMessages':
				case 'numUsers':
				case 'latestUser':
					$boardTotals = $this->_getDataRegistryModel()->get('boardTotals');
					if (!$boardTotals)
					{
						$boardTotals = $this->getModelFromCache('XenForo_Model_Counters')->rebuildBoardTotalsCounter();
					}
					$newStats = array(
						'numDiscussions'    => $boardTotals['discussions'],
						'numMessages'       => $boardTotals['messages'],
						'numUsers'          => $boardTotals['users'],
						'latestUser'        => $boardTotals['latestUser'],
					);
					self::$_statCache = array_merge(self::$_statCache, $newStats);
					break;

				case 'numOnlineVisitors':
				case 'numOnlineMembers':
				case 'numOnlineRobots':
				case 'onlineUsers':
					$visitor = XenForo_Visitor::getInstance();

					/** @var $sessionModel XenForo_Model_Session */
					$sessionModel = $this->getModelFromCache('XenForo_Model_Session');

					$onlineUsers = $sessionModel->getSessionActivityQuickList(
						$visitor->toArray(),
						array('cutOff' => array('>', $sessionModel->getOnlineStatusTimeout())),
						($visitor['user_id'] ? $visitor->toArray() : null)
					);
					$newStats = array(
						'numOnlineVisitors' => $onlineUsers['total'],
						'numOnlineMembers' => $onlineUsers['members'],
						'numOnlineRobots' => $onlineUsers['robots'],
						'onlineUsers' => $onlineUsers['records'],
					);
					self::$_statCache = array_merge(self::$_statCache, $newStats);
					break;
			}
		}
		return self::$_statCache[$stat];
	}
}