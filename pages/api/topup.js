import {TransferTransaction, AccountId,} from "@hashgraph/sdk"
import {client, tokenId, accountId, accountKey} from "../../utils/hedera-treasury";
export default async function topup(req, res) {
    console.log("Request", req.body);
    const {count, account_id} = req.body;
    try{

        const AccId = AccountId.fromString(account_id)
        console.log(AccId)
        const transaction = await new TransferTransaction()

        .addTokenTransfer(tokenId, accountId, -count)
    
        .addTokenTransfer(tokenId, AccId, count)
    
        .freezeWith(client);
    
        //Sign with the sender account private key
    
        const signTx = await transaction.sign(accountKey);
    
        //Sign with the client operator private key and submit to a Hedera network
    
        const txResponse = await signTx.execute(client);
    
        //Request the receipt of the transaction
    
        const receipt = await txResponse.getReceipt(client);
    
        //Obtain the transaction consensus status
    
        const transactionStatus = receipt.status;
    
        console.log("The transaction consensus status " +transactionStatus.toString());
        
        res.status(200).json({ topup: transactionStatus.toString() });
    } catch (error) {
        console.error(error);
        res.status(error.requestResult.statusCode).send(error.message);
    }
}