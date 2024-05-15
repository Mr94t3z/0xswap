export const zeroxabi = [
    {
      "type": "event",
      "anonymous": false,
      "name": "QuoteSignerUpdated",
      "inputs": [
        {
          "name": "quoteSigner",
          "type": "address",
          "internalType": "address",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "TransformedERC20",
      "inputs": [
        {
          "name": "taker",
          "type": "address",
          "internalType": "address",
          "indexed": true
        },
        {
          "name": "inputToken",
          "type": "address",
          "internalType": "address",
          "indexed": false
        },
        {
          "name": "outputToken",
          "type": "address",
          "internalType": "address",
          "indexed": false
        },
        {
          "name": "inputTokenAmount",
          "type": "uint256",
          "internalType": "uint256",
          "indexed": false
        },
        {
          "name": "outputTokenAmount",
          "type": "uint256",
          "internalType": "uint256",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "TransformerDeployerUpdated",
      "inputs": [
        {
          "name": "transformerDeployer",
          "type": "address",
          "internalType": "address",
          "indexed": false
        }
      ]
    },
    {
      "type": "function",
      "name": "FEATURE_NAME",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "string",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "FEATURE_VERSION",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "_transformERC20",
      "inputs": [
        {
          "name": "args",
          "type": "tuple",
          "internalType": "struct ITransformERC20Feature.TransformERC20Args",
          "components": [
            {
              "name": "taker",
              "type": "address",
              "internalType": "address payable"
            },
            {
              "name": "inputToken",
              "type": "address",
              "internalType": "contract IERC20Token"
            },
            {
              "name": "outputToken",
              "type": "address",
              "internalType": "contract IERC20Token"
            },
            {
              "name": "inputTokenAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "minOutputTokenAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "transformations",
              "type": "tuple[]",
              "internalType": "struct ITransformERC20Feature.Transformation[]",
              "components": [
                {
                  "name": "deploymentNonce",
                  "type": "uint32",
                  "internalType": "uint32"
                },
                {
                  "name": "data",
                  "type": "bytes",
                  "internalType": "bytes"
                }
              ]
            },
            {
              "name": "useSelfBalance",
              "type": "bool",
              "internalType": "bool"
            },
            {
              "name": "recipient",
              "type": "address",
              "internalType": "address payable"
            }
          ]
        }
      ],
      "outputs": [
        {
          "name": "outputTokenAmount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "createTransformWallet",
      "inputs": [],
      "outputs": [
        {
          "name": "wallet",
          "type": "address",
          "internalType": "contract IFlashWallet"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getQuoteSigner",
      "inputs": [],
      "outputs": [
        {
          "name": "signer",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTransformWallet",
      "inputs": [],
      "outputs": [
        {
          "name": "wallet",
          "type": "address",
          "internalType": "contract IFlashWallet"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTransformerDeployer",
      "inputs": [],
      "outputs": [
        {
          "name": "deployer",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "migrate",
      "inputs": [
        {
          "name": "transformerDeployer",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "success",
          "type": "bytes4",
          "internalType": "bytes4"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setQuoteSigner",
      "inputs": [
        {
          "name": "quoteSigner",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setTransformerDeployer",
      "inputs": [
        {
          "name": "transformerDeployer",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transformERC20",
      "inputs": [
        {
          "name": "inputToken",
          "type": "address",
          "internalType": "contract IERC20Token"
        },
        {
          "name": "outputToken",
          "type": "address",
          "internalType": "contract IERC20Token"
        },
        {
          "name": "inputTokenAmount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "minOutputTokenAmount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "transformations",
          "type": "tuple[]",
          "internalType": "struct ITransformERC20Feature.Transformation[]",
          "components": [
            {
              "name": "deploymentNonce",
              "type": "uint32",
              "internalType": "uint32"
            },
            {
              "name": "data",
              "type": "bytes",
              "internalType": "bytes"
            }
          ]
        }
      ],
      "outputs": [
        {
          "name": "outputTokenAmount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "payable"
    }
  ] as const;