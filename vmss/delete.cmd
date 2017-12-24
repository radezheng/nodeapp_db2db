call az vmss delete -n nodevmss -g demorg

call az network vnet delete -n nodevmssvnet -g demorg

call az network lb delete -n nodevmsslb -g demorg

call az network public-ip delete -n nodevmsslbpublicip -g demorg
