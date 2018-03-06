# Introduction 
这是一个可以部署在Azure WebApp的前端应用，也可以独立部署，用的Angular 前端 + NodeJS。主要功能是通过一个简单的代办应用，演示如何近实时的同步部署在Azure和其他地方的应用的数据库。

# Getting Started
以在Azure部署两个一样的应用为示例，跨云/地到云原理一样。
1.	创建两个mysql PaaS数据库，如mysqla和mysqlb, 创建一张表:
```SQL
CREATE TABLE `tbltodo` (
  `id` varchar(50) NOT NULL,
  `item` varchar(45) NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  `updatedtime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
2. 创建一个Event Hub，如db2dbhub，创建一个hub实例，如hub01, 并在hub01里创建两个Consumer Group, 如groupa和groupb. 获取其连接串。

3.	创建两个Web App, 如webgroupa和webgroupb, 创建部署为local git. 或使用VSTS. 按需要配置webapp的应用程序设置, 两个webapp对应自己的配置，如对应A的: <br>
```JSON
        dbhost : mysqla.mysql.database.azure.com
        dbuser : youradmin@yourmysqla
        dbpassword : yourpassword
        GROUPID : A
        hubconn : <your event hub connection string>
        ConsumerGroup : groupa
```
4.	部署webapp的代码，手动部署到weba示例, 过程需要输入部署用户的id和password：<br>
```Bash
git clone https://github.com/radezheng/nodeapp_db2db
git remote add weba <your web app git url>
git push weba 
```

详细参考：<br>
https://code.visualstudio.com/tutorials/nodejs-deployment/deploy-website

5.	至此，webapp应该可以访问。并能工作，只是还不能同步。同步需要部署webjob，请参见webjob的Readme

# Contribute
详细架构请参见PPT描述