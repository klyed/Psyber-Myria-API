const log = require('fancy-log');
const fs = require('fs');
const Bronze_NFT = require('../data/bronze_nft.json');
const Silver_NFT = require('../data/silver_nft.json');
const Gold_NFT = require('../data/gold_nft.json');

module.exports.Bronze = async(id) => {
  if(!id){
     return null;
   } else {
     Bronze_NFT.id = parseInt(id);
     return Bronze_NFT;
   }
};//END Bronze

module.exports.Silver = async(id) => {
  if(!id){
     return null;
   } else {
     Silver_NFT.id = parseInt(id);
     return Silver_NFT;
   }
};//END Silver

module.exports.Gold = async(id) => {
  if(!id){
     return null;
   } else {
     Gold_NFT.id = parseInt(id);
     return Gold_NFT;
   }
};//END Gold
