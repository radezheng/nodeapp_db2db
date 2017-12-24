call az group create -n ExampleARMGroup -l southeastasia

call az group deployment create ^
    --name ExampleDeployment ^
    --resource-group ExampleARMGroup ^
    --template-file ./azuredeploy.json ^
    --parameters @azuredeploy.parameters.json