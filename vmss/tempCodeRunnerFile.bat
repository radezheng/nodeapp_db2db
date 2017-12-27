call az network public-ip show ^
    --resource-group demorg ^
    --name nodeVMSSLBPublicIP ^
    --query [ipAddress] ^
    --output tsv
