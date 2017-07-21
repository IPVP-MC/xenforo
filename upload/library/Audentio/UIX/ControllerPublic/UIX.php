<?php
class Audentio_UIX_ControllerPublic_UIX extends XenForo_ControllerPublic_Abstract
{
	public function actionToggleWidth()
	{
		$visitor = XenForo_Visitor::getInstance();
		if ($visitor['uix_width'])
		{
			$width = 0;
		}
		else
		{
			$width = 1;
		}

		if ($visitor['user_id']) {
			$writer = XenForo_DataWriter::create('XenForo_DataWriter_User');
			$writer->setExistingData($visitor['user_id']);
			$writer->set('uix_width', $width);
			$writer->save();
		} else {
			$session = XenForo_Application::getSession();

			$session->set('uix_width', $width);
			$session->save();
		}

		if ($width)
		{
			die('1');
		}
		else
		{
			die('0');
		}
	}

	public function actionToggleStickyThreads()
	{
		$visitor = XenForo_Visitor::getInstance();
		if ($visitor['user_id'])
		{
			if ($visitor['uix_collapse_stuck_threads'])
			{
				$collapseStickyThreads = 0;
			}
			else
			{
				$collapseStickyThreads = XenForo_Application::$time;
			}

			$writer = XenForo_DataWriter::create('XenForo_DataWriter_User');
			$writer->setExistingData($visitor['user_id']);
			$writer->set('uix_collapse_stuck_threads', $collapseStickyThreads);
			$writer->save();

			if ($collapseStickyThreads)
			{
				die(strval(XenForo_Application::$time));
			}
			else
			{
				die('0');
			}
		}
		die('ERR_NO_PERMISSION');
	}

	public function actionCollapseStickyThreads()
	{
		$visitor = XenForo_Visitor::getInstance();
		if ($visitor['user_id'])
		{
			$collapseStickyThreads = XenForo_Application::$time;

			$writer = XenForo_DataWriter::create('XenForo_DataWriter_User');
			$writer->setExistingData($visitor['user_id']);
			$writer->set('uix_collapse_stuck_threads', $collapseStickyThreads);
			$writer->save();

			if ($collapseStickyThreads)
			{
				die(strval(XenForo_Application::$time));
			}
			else
			{
				die('0');
			}
		}
		die('ERR_NO_PERMISSION');
	}

	public function actionExpandStickyThreads()
	{
		$visitor = XenForo_Visitor::getInstance();
		if ($visitor['user_id'])
		{
			$collapseStickyThreads = 0;

			$writer = XenForo_DataWriter::create('XenForo_DataWriter_User');
			$writer->setExistingData($visitor['user_id']);
			$writer->set('uix_collapse_stuck_threads', $collapseStickyThreads);
			$writer->save();

			if ($collapseStickyThreads)
			{
				die(strval(XenForo_Application::$time));
			}
			else
			{
				die('0');
			}
		}
		die('ERR_NO_PERMISSION');
	}

	/*
	public function actionToggleSidebar()
	{
		$visitor = XenForo_Visitor::getInstance();
		if ($visitor['uix_sidebar']) {
			$sidebar = 0;
		} else {
			$xenOptions = XenForo_Application::getOptions();
			$sidebar = 1904747103;
			if ($xenOptions->uix_sidebarCollapseDays)
			{
				$sidebar = XenForo_Application::$time + ((int) $xenOptions->uix_sidebarCollapseDays * 86400);
			}
		}

		if ($visitor['user_id']) {
			$writer = XenForo_DataWriter::create('XenForo_DataWriter_User');
			$writer->setExistingData($visitor['user_id']);
			$writer->set('uix_sidebar', $sidebar);
			$writer->save();
		} else {
			$session = XenForo_Application::getSession();

			$session->set('uix_sidebar', $sidebar);
			$session->save();
		}

		if ($sidebar) {
			die('1');
		} else {
			die('0');
		}
	}
	*/

	public function actionToggleSidebar()
	{
		$visitor = XenForo_Visitor::getInstance();
		if ($visitor['uix_sidebar']) {
			$sidebar = 0;
		} else {
			$xenOptions = XenForo_Application::getOptions();
			$sidebar = 1904747103;
			if ($xenOptions->uix_sidebarCollapseDays) {
				$sidebar = XenForo_Application::$time + ((int) $xenOptions->uix_sidebarCollapseDays * 86400);
			}
		}

		if ($visitor['user_id']) {
			$writer = XenForo_DataWriter::create('XenForo_DataWriter_User');
			$writer->setExistingData($visitor['user_id']);
			$writer->set('uix_sidebar', $sidebar);
			$writer->save();
		} else {
			$session = XenForo_Application::getSession();

			$session->set('uix_sidebar', $sidebar);
			$session->save();
		}

		if ($sidebar) {
			die(strval($sidebar));
		} else {
			die('0');
		}
	}
}