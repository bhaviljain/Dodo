Overview: Built a TypeScript SDK that provides an embeddable payment checkout using an iframe. The SDK loads a hosted checkout page and communicates with it using the postMessage API. A demo merchant website is included to demonstrate the complete payment flow.



Live Demo

- Demo Website: https://dodo-le2j.vercel.app/
- Checkout: https://dodo-sepia-six.vercel.app/

Architecture:
Demo Website  : Merchat website where we use SDK to open the checkout
TypeScript SD K : creates the iframe and here we hndle communication with the checkout app
 Checkout Application  : ui of the payment iframe and fake payment flow switch case are been handled here


 #How to run locally

### 1. Clone the repository

cd Dodo

Start the Checkout application
 cd checkout
npm install
npm run dev

The Checkout application runs on http://localhost:3001

next Start the Demo application
cd dodo-payments/demo
npm install
npm run dev
The Demo application runs on http://localhost:3000

#How piece talk to each other
The demo website uses the SDK to open the checkout application which holds the payment ui and the flows

The SDK and Checkout application communicate using the browsers postMessage API.


Run the Demo application in a separate terminal. Do not run cd dodo-payments/demo after cd checkout, as checkout is not inside the dodo-payments directory.