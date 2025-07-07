# Evolving NFT

Evolving NFT generates unique, fully onchain SVG NFTs that evolve over time based on the user’s interactions with the Monad blockchain.

Each NFT starts as a minimal creature and visually mutates through actions like Feed, Train, Pet, and Anger. Traits such as size, wings, spikes, and aura change as the user interacts.

All traits and interaction history are stored directly inside the smart contract — no databases, no offchain storage, and no IPFS.

Every app interaction triggers an onchain transaction that evolves the NFT and builds its permanent, verifiable history.

---

## Features

- Mint fully onchain, generative SVG NFTs without relying on external hosting.
- Each NFT evolves visually and by traits based on real onchain user activity.
- Users can perform actions such as Feed, Train, Pet, and Anger that trigger visual and trait mutations.
- Users can transfer NFTs between wallets, and each transfer is recorded as part of the NFT’s evolution.
- View detailed onchain interaction history including feeds, training, pets, and transfers.
- Copy complete metadata for external use or verification.

---

## Problem & Solutions

1. **Static NFTs**  
   Most NFT collections are static images that do not reflect the owner’s engagement or activity.  
   *Evolving NFT addresses this by creating living NFTs that change over time, making ownership dynamic and meaningful.*

2. **Proof of participation**  
   Evolving NFTs can be utilized as a visual badge that represents a user’s participation and engagement on the Monad chain.

3. **No external storage reliance**  
   All data, including the SVG art and metadata, is generated and stored fully onchain. There is no reliance on IPFS or other external storage solutions.

4. **Gamified identity**  
   The NFTs function as evolving, gamified avatars that turn onchain activity into a personal and interactive experience.

5. **Interaction tracking**  
   The system provides a complete onchain log of user interactions (feeds, training, transfers), which can be used for ranking, scoring, or participation badges.


## Installation

git clone - https://github.com/rustsol/evolving-nft

yarn install

yarn start