<?php
/**
1. New domain setup (Configuration + SSL).
            ___ [якщо раніше уже була спроба встановити Configuration + SSL для цього домена] Видаліть файли(папки) із назвою цього домена з таких папок: /etc/apache2/sites-enabled, /etc/letsencrypt/archive, /etc/letsencrypt/live, /etc/letsencrypt/renewal
        1.1. (якщо сайт ще не містить папку server_settings) Скопіюйте папку server_settings (з файлами domains_setup.php, domains.txt, ...) на сервер всередину папки, де знаходиться стартовий файл index.php вашого сайту (напр., /var/www/mysite.com/public/)
        1.2. Відкрийте консоль. Перейдіть в папку зі скриптом: ##  cd /var/www/_mysite_index_folder/server_settings . Запустіть скрипт: ##  php domains_setup.php
2. Update SSL on existing domain. Не запускайте цей скрипт, а тільки виконайте команду в консолі: ##  sudo certbot certonly --apache -d mysite.com  || ##  sudo certbot certonly --standalone --preferred-challenges http -d mysite.com

== Якщо ви вручну запускаєте команду в консолі, після цього слід перезапустити Apache: ##  sudo service apache2 restart ==
*/

class ServerSetup
{
    const file_name_with_domains = 'domains.txt';

    public function installSsl($dom)
    {
        echo "встановлюю ssl на домен: ".$dom." \n";
        $cmd = "sudo certbot certonly --apache -d ".$dom;
        // $cmd = "sudo certbot certonly --apache --expand -d ".$dom; // ? for subdomains
        // $cmd = "sudo certbot certonly --standalone --preferred-challenges http -d ".$dom;
        $output = shell_exec($cmd);
        // sleep(5);
        if (strpos($output, 'Congratulations')) return true;
        else return false;
    }


    public function installConfiguration($dom)
    {
        $folder_name = explode("/", $_SERVER["PWD"]);
        array_pop($folder_name);
        $folder_name = implode('/',$folder_name);
        if(!$folder_name) { $folder_name = '/var/www/'.$dom; }

        $config_one = <<<EOT
<VirtualHost *:443>
    ServerName $dom
    ServerAlias www.$dom
    ServerAdmin webmaster@localhost
    DocumentRoot $folder_name
    <Directory "$folder_name">
        Options Indexes FollowSymLinks MultiViews
        DirectoryIndex index.php index.html
        AllowOverride All
        Order allow,deny
        Allow from all
    </Directory>
    ErrorLog /var/log/apache2/error.log
    CustomLog /var/log/apache2/custom_error.log combined
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/$dom/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/$dom/privkey.pem
</VirtualHost>

<VirtualHost *:80>
    ServerName $dom
    ServerAlias www.$dom
    ServerAdmin webmaster@localhost
    DocumentRoot $folder_name
    <Directory "$folder_name">
        DirectoryIndex index.php index.html
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        Order allow,deny
        Allow from all
        FallbackResource /index.php
        SetEnv downgrade-1.0
    </Directory>
    ErrorLog /var/log/apache2/error.log
    CustomLog /var/log/apache2/custom_error.log combined
</VirtualHost>

EOT;

        $new_file = fopen($dom.'.conf', 'w');
        fwrite($new_file, $config_one);
        fclose($new_file);
        $cmd = "mv $dom.conf /etc/apache2/sites-enabled";
        shell_exec($cmd);
        echo "настройки apache2 для домена ".$dom." встановлено \n";
		
		shell_exec("sudo service apache2 restart");
        echo "сервер перезавантажено. домен готовий до роботи. \n\n";
    }


    public function error($dom)
    {
        echo "домен ".$dom." не налаштовано, переходжу до наступного \n";
        $new_file = fopen('domains_error.txt', 'a');
        fwrite($new_file, $dom."\n");
        fclose($new_file);
    }


    public function run()
    {
        $file = file_get_contents(__DIR__.'/'.self::file_name_with_domains, true);
        $domains = explode("\n", $file);
        echo "скрипт запущений \n";
        foreach ($domains as $dom) {
            $dom = trim(strtolower($dom));
            if ($dom != "") {
                $name = '/etc/letsencrypt/live/'.$dom;
                if(!is_dir($name)) {
                    $status = $this->installSsl($dom);
                    if($status) $this->installConfiguration($dom);
                    else $this->error($dom);
                }
                $name_conf = '/etc/apache2/sites-enabled/'.$dom.'.conf';
                if (!is_file($name_conf) and is_dir($name)){
                    $this->installConfiguration($dom);
                }

                if(is_dir($name) and is_file($name_conf)) {
                    $new_file = fopen('domains_ok.txt', 'a');
                    fwrite($new_file, $dom."\n");
                    fclose($new_file);
                }
            }
        }
    }

}

if (php_sapi_name() != 'cli') exit;
else {
    $send = new ServerSetup();
    $send->run();
}
