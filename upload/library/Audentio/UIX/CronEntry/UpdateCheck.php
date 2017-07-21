<?php
class Audentio_UIX_CronEntry_UpdateCheck
{
	public static function styles()
	{
		$xenOptions = XenForo_Application::get('options')->getOptions();
		if ($xenOptions['uix_autoCheckForUpdates'])
		{
			$styleModel = XenForo_Model::create('XenForo_Model_Style');
			$audentioModel = XenForo_Model::create('Audentio_UIX_Model_Audentio');

			$styles = $styleModel->getAudentioStyles();
			$adStyles = $audentioModel->getStylesFromApi();

			if (!is_array($adStyles)) {
				#XenForo_Error::logError('There was an issue connecting to the Audentio Design API. Please look through the UI.X thread on XenForo.com to see if others are having this issue.');
				return true;
			}

			if (is_array($styles))
			{
				foreach ($styles as $style)
				{
					if (array_key_exists($style['uix_pid'], $adStyles))
					{
						$adStyle = $adStyles[$style['uix_pid']];
						if ($adStyle['product_version'] != $style['uix_version'] && $adStyle['product_version'] != $style['uix_latest_version'])
						{
							$writer = XenForo_DataWriter::create('XenForo_DataWriter_Style');
							$writer->setExistingData($style['style_id']);
							$writer->set('uix_update_available', 1);
							$writer->save();
						}
					}
				}
			}
		}
	}

	public static function addOn()
	{
		$xenOptions = XenForo_Application::get('options')->getOptions();
		if ($xenOptions['uix_automaticallyCheckForAddonUpdates'])
		{
			$audentioModel = XenForo_Model::create('Audentio_UIX_Model_Audentio');
			$audentioModel->checkForUixUpdate();
		}
	}
}