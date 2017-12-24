call az vmss create ^
  --resource-group demorg ^
  --name nodeVMSS ^
  --image UbuntuLTS ^
  --upgrade-policy-mode automatic ^
  --custom-data cloud-init.txt ^
  --admin-username azureuser ^
  --admin-password Azurep@ssw0rd^
  --authentication-type password

call az network lb rule create ^
  --resource-group demorg ^
  --name myLoadBalancerRuleWeb ^
  --lb-name nodeVMSSLB ^
  --backend-pool-name nodeVMSSLBBEPool ^
  --backend-port 80 ^
  --frontend-ip-name loadBalancerFrontEnd ^
  --frontend-port 80 ^
  --protocol tcp

 call az network public-ip show ^
    --resource-group demorg ^
    --name nodeVMSSLBPublicIP ^
    --query [ipAddress] ^
    --output tsv
