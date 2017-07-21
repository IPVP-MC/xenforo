<?php
class Audentio_UIX_Model_Audentio extends XenForo_Model
{
	public $filePath = false;
	protected $_apiUrl = 'https://www.audentio.com/api/';
	//protected $_apiUrl = 'http://localhost:3000/api/';

	protected $_ftp;
	protected $_ftpHost;
	protected $_ftpPort;
	protected $_ftpUser;
	protected $_ftpPass;
	protected $_ftpPath;

	public function rrmdir($dir) {
		foreach(glob($dir . '/*') as $file) {
			if(is_dir($file)) $this->rrmdir($file); else @unlink($file);
		} rmdir($dir);
	}

	public function ftpConnect($host, $port, $user, $pass, $path)
	{
		$this->_ftpHost = $host;
		$this->_ftpPort = $port;
		$this->_ftpUser = $user;
		$this->_ftpPass = $pass;
		$this->_ftpPath = $path;

		$this->_ftp = ftp_connect($host, $port);
		if (!$this->_ftp)
		{
			return false;
		}

		try {
			$result = ftp_login($this->_ftp, $user, $pass);
		}
		catch (Exception $e)
		{
			throw new XenForo_Exception(new XenForo_Phrase('uix_invalid_ftp_details'), true);
		}

		ftp_chdir($this->_ftp, $path);

		// /data/adstyle-1424455006/Upload/styles/reneue/xenforo/smilies.doodle
		$list = ftp_nlist($this->_ftp, $path);
		if (!in_array('index.php', $list) && !in_array('proxy.php', $list) && !in_array('data', $list) && !in_array('internal_data', $list) && !in_array('styles', $list) && !in_array('js', $list))
		{
			return false;
		}

		return $result;
	}

	public function getFtpPath()
	{
		return $this->_ftpPath;
	}

	public function getFtp()
	{
		if ($this->_ftp)
		{
			return $this->_ftp;
		}
		return false;
	}

	public function rmove($dirSource, $dirDest, $ftpRequired=false)
	{
		if(is_dir($dirSource))
		{
			$dirHandle = opendir($dirSource);
		}
		$dirName = substr($dirSource, strrpos($dirSource, DIRECTORY_SEPARATOR) + 1);
		if(!is_dir($dirDest . DIRECTORY_SEPARATOR . $dirName) && !file_exists($dirDest.DIRECTORY_SEPARATOR.$dirName))
		{
			$this->_mkdir($dirDest . DIRECTORY_SEPARATOR . $dirName, $ftpRequired);
		}
		while($file = readdir($dirHandle))
		{
			if ($this->_ftp)
			{
				$ftpRequired = true;
			}
			if($file == 'Thumbs.db')
			{
				@unlink($file);
				continue;
			}
			if($file != '.' && $file != '..')
			{
				if(!is_dir($dirSource . DIRECTORY_SEPARATOR . $file))
				{
					if(file_exists($dirDest . DIRECTORY_SEPARATOR . $dirName . DIRECTORY_SEPARATOR . $file))
					{
						$this->_unlink($dirDest . DIRECTORY_SEPARATOR . $dirName . DIRECTORY_SEPARATOR . $file, $ftpRequired);
					}
					$this->copy($dirSource . DIRECTORY_SEPARATOR . $file, $dirDest . DIRECTORY_SEPARATOR . $dirName . DIRECTORY_SEPARATOR . $file, $ftpRequired);
					$this->_unlink($dirSource . DIRECTORY_SEPARATOR . $file, $ftpRequired);
				}
				else
				{
					$this->rmove($dirSource . DIRECTORY_SEPARATOR . $file, $dirDest . DIRECTORY_SEPARATOR . $dirName, $ftpRequired);
				}
			}
		}

		@closedir($dirHandle);
		@rmdir($dirSource);
	}

	public function mkdir($dirName, $requireFtp)
	{
		$this->_mkdir($dirName, $requireFtp);
	}

	protected function _mkdir($dirName, $requireFtp)
	{
		$dirName = str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $dirName);
		$dirName = str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $dirName);
		$dirName = str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $dirName);
		$dirName = str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $dirName);

		if ($requireFtp)
		{
			$curDir = ftp_pwd($this->_ftp);
			if (!@ftp_chdir($dirName, $this->_ftp))
			{
				$dirName = str_replace(XenForo_Application::getInstance()->getRootDir(), $this->_ftpPath, $dirName);
				if ($dirName == $this->_ftpPath) return true;
				$pwd = ftp_pwd($this->_ftp);
				$chdir = @ftp_chdir($this->_ftp, $dirName);
				if ($chdir)
				{
					ftp_chdir($this->_ftp, $pwd);
				}
				else
				{
					$return = ftp_mkdir($this->_ftp, $dirName);
					ftp_chmod($this->_ftp, 0666, $dirName);
					return $return;
				}
			}
			else
			{
				@ftp_chdir($curDir, $this->_ftp);
			}
		}
		else
		{
			try {
				return XenForo_Helper_File::createDirectory($dirName);
			} catch (Exception $e) {
				return false;
			}
		}
	}

	protected function copy($sourceFile, $destFile, $requireFtp)
	{
		$sourceFile = str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $sourceFile);
		$destFile = str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $destFile);
		$sourceFile = str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $sourceFile);
		$destFile = str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $destFile);
		if ($requireFtp)
		{
			$sourceFile = str_replace(XenForo_Application::getInstance()->getRootDir(), '', $sourceFile);
			$destFile = str_replace($this->_ftpPath, '', $destFile);

			$sourceFile = str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $sourceFile);
			$destFile = str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $destFile);

			$firstCharSource = substr($sourceFile, 0, 1);
			$firstCharDest = substr($destFile, 0, 1);

			if ($firstCharSource != DIRECTORY_SEPARATOR)
			{
				$sourceFile = DIRECTORY_SEPARATOR.$sourceFile;
			}
			if ($firstCharDest != DIRECTORY_SEPARATOR)
			{
				$destFile = DIRECTORY_SEPARATOR.$destFile;
			}

			$sourceFile = XenForo_Application::getInstance()->getRootDir() . $sourceFile;
			$destFile = $this->_ftpPath.$destFile;

			$sourceFile = str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $sourceFile);
			$destFile = str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $destFile);

			$put = ftp_put($this->_ftp, $destFile, $sourceFile, FTP_BINARY);
		}
		else
		{
			$response = @copy($sourceFile, $destFile);
			if (!$response)
			{
				throw new XenForo_Exception(new XenForo_Phrase('uix_not_writable'), 1);
			}
			return $response;
		}
	}

	protected function _unlink($file, $requireFtp)
	{
		return @unlink($file);
	}

	public function getStylesFromApi()
	{
		$extraData['type'] = 'style';
		$return = $this->_apiCall('get-products', $extraData);
		if ($this->_isJson($return))
		{
			return json_decode($return, true);
		}
		return $return;
	}

	public function downloadStyleFromApi($pid)
	{
		$extraData['type'] = 'style';
		$extraData['pid'] = $pid;

		$return = $this->_apiCall('download-product', $extraData);

		if(strlen($return) < 40)
		{
			return $return;
		}

		//$filePath = 'internal_data/temp/style-'.time().'.zip';
		$filePath = XenForo_Helper_File::getTempDir().DIRECTORY_SEPARATOR.'style-'.time().'.zip';
		$fh = fopen($filePath, 'w+');
		fwrite($fh, base64_decode($return));
		$this->filePath = $filePath;
		XenForo_Helper_File::makeWritableByFtpUser($filePath);
		return true;
	}

	public function getStyleFromApi($pid)
	{
		$extraData['type'] = 'style';
		$extraData['pid'] = $pid;
		$return = $this->_apiCall('get-product', $extraData);
		if ($this->_isJson($return))
		{
			return json_decode($return, true);
		}
		return $return;
	}

	protected function _isJson($string)
	{
		$array = json_decode($string);
		if (!$array) {
			return false;
		}
		return true;
	}

	public function isUixOutdated()
	{
		$update = $this->_getDataRegistryModel()->get('uix_update');
		if ($update)
		{
			if ($update['show_notice'])
			{
				$uixAddon = $this->getModelFromCache('XenForo_Model_AddOn')->getAddOnById('uix');
				$latestVersion = (int) $update['latest_version_id'];
				$currentVersion = $uixAddon['version_id'];
				if ($currentVersion < $latestVersion)
					return true;

				$update['show_notice'] = 0;
				$this->_getDataRegistryModel()->set('uix_update', $update);
			}

			return false;
		}
		else
		{
			return 0;
		}
	}

	public function checkForUixUpdate()
	{
		$response = $this->_apiCall('update_check');

		if ($latest = @json_decode($response))
		{
			$requiresUpdate = true;
			$uix = $this->getModelFromCache('XenForo_Model_AddOn')->getAddOnById('uix');

			if ($latest->latest_version_id > $uix['version_id'])
			{
				$updateCheck = $this->_getDataRegistryModel()->get('uix_update');
				if ($updateCheck)
				{
					if ($latest->latest_version_id <= $updateCheck['latest_version_id'])
					{
						$requiresUpdate = false;
					}
				}
				if ($requiresUpdate)
				{
					$update = array(
						'show_notice'		=> 1,
						'latest_version_id'	=> $latest->latest_version_id,
					);

					$this->_getDataRegistryModel()->set('uix_update', $update);
				}
			}
			else if ($latest->latest_version_id <= $uix['version_id'])
			{
				$update = array(
					'show_notice'		=> 0,
					'latest_version_id'	=> $latest->latest_version_id,
				);

				$this->_getDataRegistryModel()->set('uix_update', $update);
			}
		}
	}

	protected function _apiCall($action, array $extraData = array())
	{
		$xenOptions = XenForo_Application::get('options')->getOptions();
		if (empty($xenOptions['uix_apiKey']))
		{
			return 'ERR_INVALID_API_KEY';
		}
		$addOn = $this->getModelFromCache('XenForo_Model_AddOn')->getAddOnById('uix');
		$apiUrl = $this->_apiUrl.$action;
		$data['api_key'] = $xenOptions['uix_apiKey'];
		$data['board_url'] = $xenOptions['boardUrl'];
		$data['software'] = 'XenForo';
		$data['xenVersionId'] = XenForo_Application::$versionId;
		$data['xenVersion'] = XenForo_Application::$version;
		$data['hubVersionId'] = $addOn['version_id'];
		$data['hubVersion'] = $addOn['version_string'];

		if (!empty($extraData))
		{
			$data = array_merge($data, $extraData);
		}

		if (function_exists('curl_version'))
		{
			$ch = @curl_init($apiUrl);
			if (!$ch)
			{
				return 'ERR_NO_CONNECTION';
			}
			@curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			@curl_setopt($ch, CURLOPT_POST, true);
			@curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
			@curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
			@curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
			$return = @curl_exec($ch);
		}
		else
		{
			return 'ERR_NO_CURL';
		}

		return $return;
	}
}