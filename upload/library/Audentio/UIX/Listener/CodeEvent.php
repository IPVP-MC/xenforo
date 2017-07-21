<?php
class Audentio_UIX_Listener_CodeEvent
{

	protected static $_canCollapseSidebar, $_canViewWelcomeBlock, $_layouts, $_nodeCache, $_nodeIconCache, $_nodeClassCache, $_nodeCollapseCache, $_canUseStylerPanel, $_canUseStylerSwatches,$_canUseStylerPresets;

	/**
	 * Extend Classes using XenForo Class Proxy
	 *
	 * @param $class Name of the class being loaded
	 * @param array $extend array of classes to extend $class
	 */
	public static function loadClass($class, array &$extend)
	{
		switch ($class)
		{
			// Controllers (Admin)
			case 'XenForo_ControllerAdmin_Home':
				$extend[] = 'Audentio_UIX_ControllerAdmin_Home';
				break;
			case 'XenForo_ControllerAdmin_Node':
				$extend[] = 'Audentio_UIX_ControllerAdmin_Node';
				break;
			case 'XenForo_ControllerAdmin_Option':
				$extend[] = 'Audentio_UIX_ControllerAdmin_Option';
				break;
			case 'XenForo_ControllerAdmin_Style':
				$extend[] = 'Audentio_UIX_ControllerAdmin_Style';
				break;

			// Controllers (Public)
			case 'XenForo_ControllerPublic_Account':
				$extend[] = 'Audentio_UIX_ControllerPublic_Account';
				break;
			case 'XenForo_ControllerPublic_Conversation':
				$extend[] = 'Audentio_UIX_ControllerPublic_Conversation';
				break;
			case 'XenForo_ControllerPublic_Forum':
				$extend[] = 'Audentio_UIX_ControllerPublic_Forum';
				break;
			case 'XenForo_ControllerPublic_Misc':
				$extend[] = 'Audentio_UIX_ControllerPublic_Misc';
				break;

			// DataWriters
			case 'XenForo_DataWriter_Discussion_Thread':
				$extend[] = 'Audentio_UIX_DataWriter_Discussion_Thread';
				break;
			case 'XenForo_DataWriter_DiscussionMessage_Post':
				$extend[] = 'Audentio_UIX_DataWriter_DiscussionMessage_Post';
				break;
			case 'XenForo_DataWriter_Forum':
				$extend[] = 'Audentio_UIX_DataWriter_Forum';
				break;
			case 'XenForo_DataWriter_Style':
				$extend[] = 'Audentio_UIX_DataWriter_Style';
				break;
			case 'XenForo_DataWriter_User':
				$extend[] = 'Audentio_UIX_DataWriter_User';
				break;

			// Models
			case 'XenForo_Model_Alert':
				$extend[] = 'Audentio_UIX_Model_Alert';
				break;
			case 'XenForo_Model_Conversation':
				$extend[] = 'Audentio_UIX_Model_Conversation';
				break;
			case 'XenForo_Model_Node':
				$extend[] = 'Audentio_UIX_Model_Node';
				break;
			case 'XenForo_Model_Style':
				$extend[] = 'Audentio_UIX_Model_Style';
				break;
			case 'XenForo_Model_Thread':
				$extend[] = 'Audentio_UIX_Model_Thread';
				break;
			case 'XenForo_Model_User':
				$extend[] = 'Audentio_UIX_Model_User';
				break;
			case 'XenForo_Model_Post':
				$extend[] = 'Audentio_UIX_Model_Post';
				break;
		}
	}

	public static function templateHook($hookName, &$contents, array $hookParams, XenForo_Template_Abstract $template)
	{
		if ($hookName == 'uix_copyright')
		{
			try
			{
				$copyright = XenForo_Application::get('adstylecopyright');
			}
			catch (Zend_Exception $e)
			{
				$xenOptions = XenForo_Application::getOptions();

				$affiliateChunk = '';
				if ($xenOptions->uix_affiliateId) {
					$affiliateChunk = '/discount/'.$xenOptions->uix_affiliateId;
				}
				$contents .= '<div class="adCopyrightNoticeStyle">Theme designed by <a href="http://www.audentio.com'.$affiliateChunk.'/shop/xenforo-themes" title="Premium XenForo Themes" rel="nofollow" target="_blank">Audentio Design</a>.</div>';
				XenForo_Application::set('adstylecopyright', true);
			}
		}
	}

	public static function templateCreate($templateName, array &$params, XenForo_Template_Abstract $template)
	{
		if (!array_key_exists('requestPaths', $params) || !strpos($params['requestPaths']['requestUri'], 'admin.php'))
		{
			if (self::$_canCollapseSidebar === null)
			{
				self::$_canCollapseSidebar = XenForo_Visitor::getInstance()->hasPermission('uix', 'canCollapseSidebar');
			}
			if (self::$_canViewWelcomeBlock === null)
			{
				self::$_canViewWelcomeBlock = XenForo_Visitor::getInstance()->hasPermission('uix', 'canViewWelcomeBlock');
			}
			if (self::$_canUseStylerPanel === null)
			{
				self::$_canUseStylerPanel = XenForo_Visitor::getInstance()->hasPermission('uix', 'canUseStylerPanel');
			}
			if (self::$_canUseStylerSwatches === null)
			{
				self::$_canUseStylerSwatches = XenForo_Visitor::getInstance()->hasPermission('uix', 'canUseStylerSwatches');
			}
			if (self::$_canUseStylerPresets === null)
			{
				self::$_canUseStylerPresets = XenForo_Visitor::getInstance()->hasPermission('uix', 'canUseStylerPresets');
			}
			if (self::$_nodeCache === null)
			{
				self::$_nodeCache = self::_getNodeModel()->getUixNodeCache();

				if (!self::$_nodeCache)
				{
					self::$_nodeCache = false;
				}
				$iconCache = false;
				$classCache = false;
				$collapseCache = false;

				if (self::$_nodeCache)
				{
					if (array_key_exists('icon_cache', self::$_nodeCache))
					{
						$iconCache = self::$_nodeCache['icon_cache'];
					}

					if (array_key_exists('class_cache', self::$_nodeCache))
					{
						$classCache = self::$_nodeCache['class_cache'];
					}

					if (array_key_exists('collapse_cache', self::$_nodeCache))
					{
						$collapseCache = self::$_nodeCache['collapse_cache'];
					}
				}

				self::$_nodeIconCache = $iconCache;
				self::$_nodeClassCache = $classCache;
				self::$_nodeCollapseCache = $collapseCache;
			}
			if (self::$_layouts === null)
			{
				$layouts = XenForo_Model::create('Audentio_UIX_Model_NodeLayout')->getLayoutOptions();

				$layoutParams = array();
				foreach($layouts as $layout)
				{
					if($layout['node_id'] == 0)
					{
						$layout['node_id'] = 'default';
					}
					if($layout['node_id'] == 10240)
					{
						$layout['node_id'] = 'category';
					}
					$layout['layout_data'] = @json_decode($layout['layout_data'], true);
					if (array_key_exists('options', $layout['layout_data']) && $layout['layout_data']['options']['use_default'])
					{
						continue;
					}
					if($layout['node_type_id'] = 'uix_nodeLayoutSeparator')
					{
						$layout['layout_data']['separator'] = true;
					}
					else
					{
						$layout['layout_data']['separator'] = false;
					}

					$layoutParams[$layout['node_id']] = $layout['layout_data'];
				}

				$layoutParams = json_encode($layoutParams);

				self::$_layouts = $layoutParams;
			}

			if (!isset($params['uix_isActive']))
			{
				$params['uix_isActive'] = 1;
			}
			if (!isset($params['uix_canCollapseSidebar']))
			{
				$params['uix_canCollapseSidebar'] = self::$_canCollapseSidebar;
			}
			if (!isset($params['uix_canViewWelcomeBlock']))
			{
				$params['uix_canViewWelcomeBlock'] = self::$_canViewWelcomeBlock;
			}
			if (!isset($params['uix_nodeLayouts']))
			{
				$params['uix_nodeLayouts'] = self::$_layouts;
			}
			if (!isset($params['uix_nodeIcons']))
			{
				$params['uix_nodeIcons'] = self::$_nodeIconCache;
			}
			if (!isset($params['uix_nodeClasses']))
			{
				$params['uix_nodeClasses'] = self::$_nodeClassCache;
			}
			if (!isset($params['uix_collapsedNodes']))
			{
				$params['uix_collapsedNodes'] = self::$_nodeCollapseCache;
			}
			if (!isset($params['uix_canUseStylerPanel']))
			{
				$params['uix_canUseStylerPanel'] = self::$_canUseStylerPanel;
			}
			if (!isset($params['uix_canUseStylerSwatches']))
			{
				$params['uix_canUseStylerSwatches'] = self::$_canUseStylerSwatches;
			}
			if (!isset($params['uix_canUseStylerPresets']))
			{
				$params['uix_canUseStylerPresets'] = self::$_canUseStylerPresets;
			}

			$params['uix_currentTimestamp'] = XenForo_Application::$time;

			if ($templateName == 'PAGE_CONTAINER')
			{
				/* @var nodeModel XenForo_Model_Node */
				$nodeModel = XenForo_Model::create('XenForo_Model_Node');
				/* @var stylePropertyModel XenForo_Model_StyleProperty */
				$stylePropertyModel = XenForo_Model::create('XenForo_Model_StyleProperty');

				$nodeFields = $nodeModel->getAllNodesWithFields();

				$nodeCss = array();
				foreach ($nodeFields as $nodeField)
				{
					$original = @unserialize($nodeField['uix_styling']);
					if ($original)
					{
						$output = $original;
						$output = $stylePropertyModel->compileCssProperty_sanitize($output, $original);
						$output = $stylePropertyModel->compileCssProperty_compileRules($output, $original);
						$nodeCss[$nodeField['node_id']] = $output;
					}
				}
				$cssOutput = '';
				foreach ($nodeCss as $nodeId=>$css)
				{
					if (!empty($css))
					{
						$cssOutput .= '.node.node_'.$nodeId.' > .nodeInfo {';
						if (array_key_exists('width', $css)) $cssOutput .= 'width: '.$css['width'].';';
						if (array_key_exists('height', $css)) $cssOutput .= 'height: '.$css['height'].';';
						if (array_key_exists('extra', $css)) $cssOutput .= $css['extra'];
						if (array_key_exists('font', $css)) $cssOutput .= $css['font'];
						if (array_key_exists('background', $css)) $cssOutput .= $css['background'];
						if (array_key_exists('padding', $css)) $cssOutput .= $css['padding'];
						if (array_key_exists('margin', $css)) $cssOutput .= $css['margin'];
						if (array_key_exists('border', $css)) $cssOutput .= $css['border'];
						$cssOutput .= '}';
					}
				}
				$cssOutput = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $cssOutput);
				$cssOutput = str_replace(': ', ':', $cssOutput);
				$cssOutput = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $cssOutput);

				$params['cssOutput'] = $cssOutput;

			}
		}
	}

	public static function visitorSetup(XenForo_Visitor &$visitor)
	{
		if (!$visitor->getUserId()) {
			$xenOptions = XenForo_Application::getOptions();
			try {
				$session = XenForo_Application::getSession();

				$width = $session->get('uix_width');
				$sidebar = $session->get('uix_sidebar');
			} catch (Exception $e) {
				$width = $xenOptions->uix_defaultWidth;
				$sidebar = 0;
			}

			// var_dump($sidebar);die;

			if ($width === false) {
				$visitor['uix_width'] = $xenOptions->uix_defaultWidth;
			} else {
				$visitor['uix_width'] = $width;
			}

			if ($sidebar === false) {
				$visitor['uix_sidebar'] = 1;
			} else {
				$visitor['uix_sidebar'] = $sidebar;
			}

			$visitor->setInstance($visitor);
		}
	}

	public static function initDependencies(XenForo_Dependencies_Abstract $dependencies, array $data)
	{
		XenForo_Template_Helper_Core::$helperCallbacks += array(
			'uix_number'	=> array('Audentio_UIX_Template_Helper_Number', 'superNumber'),
			'uix_stats'	    => array('Audentio_UIX_Template_Helper_Stats', 'stats'),
			'uix_datetime'	=> array('Audentio_UIX_Template_Helper_Date', 'helperDateTimeHtml'),
		);
	}

	protected static function _getNodeModel()
	{
		return XenForo_Model::create('XenForo_Model_Node');
	}
}