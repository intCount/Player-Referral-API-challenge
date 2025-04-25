#!/bin/bash
# This script tests all the endpoints of the Player Referral API
# It creates completely new users for a clean demo

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:3001"

# Generate unique phone numbers for testing
TIMESTAMP=$(date +%s)
PRIMARY_PHONE="+1${TIMESTAMP:0:10}"
REFERRED_PHONE="+2${TIMESTAMP:0:10}"

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   Player Referral API Testing Script    ${NC}"
echo -e "${BLUE}   Demo Version with New Test Users      ${NC}"
echo -e "${BLUE}=========================================${NC}"

echo -e "${GREEN}Primary Phone: $PRIMARY_PHONE${NC}"
echo -e "${GREEN}Referred Phone: $REFERRED_PHONE${NC}"

# Test 1: Register first player
echo -e "\n${YELLOW}1. Register Demo Player${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -H "Origin: https://example.com" \
  -d "{
    \"name\": \"Demo Player\",
    \"phoneNumber\": \"$PRIMARY_PHONE\",
    \"password\": \"demo123\"
  }")

echo "$REGISTER_RESPONSE"

# Extract player ID and token
PLAYER_ID=$(echo $REGISTER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
PLAYER_TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
REFERRAL_CODE=$(echo $REGISTER_RESPONSE | grep -o '"referralCode":"[^"]*' | cut -d'"' -f4)

echo -e "${GREEN}Player ID: $PLAYER_ID${NC}"
echo -e "${GREEN}Referral Code: $REFERRAL_CODE${NC}"

# Check if we have a valid player token
if [[ -z "$PLAYER_TOKEN" ]]; then
  echo -e "${RED}Failed to get a valid token. Exiting.${NC}"
  exit 1
fi

echo -e "${GREEN}Successfully obtained token${NC}"

# Test 2: Get player profile
echo -e "\n${YELLOW}2. Get Player Profile${NC}"
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/api/players/profile" \
  -H "Authorization: Bearer $PLAYER_TOKEN")

echo "$PROFILE_RESPONSE"

# Test 3: Get wallet balance
echo -e "\n${YELLOW}3. Get Wallet Balance${NC}"
WALLET_RESPONSE=$(curl -s -X GET "$BASE_URL/api/wallet" \
  -H "Authorization: Bearer $PLAYER_TOKEN")

echo "$WALLET_RESPONSE"

# Test 4: Deposit funds
echo -e "\n${YELLOW}4. Deposit Funds (2000 units)${NC}"
DEPOSIT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/wallet/deposit" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PLAYER_TOKEN" \
  -d '{
    "amount": 2000
  }')

echo "$DEPOSIT_RESPONSE"

# Test 5: Check wallet balance after deposit
echo -e "\n${YELLOW}5. Check Wallet Balance After Deposit${NC}"
WALLET_RESPONSE_AFTER_DEPOSIT=$(curl -s -X GET "$BASE_URL/api/wallet" \
  -H "Authorization: Bearer $PLAYER_TOKEN")

echo "$WALLET_RESPONSE_AFTER_DEPOSIT"

# Test 6: Withdraw funds
echo -e "\n${YELLOW}6. Withdraw Funds (500 units)${NC}"
WITHDRAW_RESPONSE=$(curl -s -X POST "$BASE_URL/api/wallet/withdraw" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PLAYER_TOKEN" \
  -d '{
    "amount": 500
  }')

echo "$WITHDRAW_RESPONSE"

# Test 7: Get transaction history
echo -e "\n${YELLOW}7. Get Transaction History${NC}"
TRANSACTIONS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/wallet/transactions" \
  -H "Authorization: Bearer $PLAYER_TOKEN")

echo "$TRANSACTIONS_RESPONSE"

# Test 8: Generate referral link
echo -e "\n${YELLOW}8. Generate Referral Link${NC}"
REFERRAL_LINK_RESPONSE=$(curl -s -X GET "$BASE_URL/api/referrals/link" \
  -H "Authorization: Bearer $PLAYER_TOKEN")

echo "$REFERRAL_LINK_RESPONSE"

# Test 9: Register second player using referral code
echo -e "\n${YELLOW}9. Register Friend Using Referral Code${NC}"
REGISTER_REFERRED_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -H "Origin: https://example.com" \
  -d "{
    \"name\": \"Friend Player\",
    \"phoneNumber\": \"$REFERRED_PHONE\",
    \"password\": \"friend123\",
    \"referralCode\": \"$REFERRAL_CODE\"
  }")

echo "$REGISTER_REFERRED_RESPONSE"

# Extract the second player's token
REFERRED_PLAYER_TOKEN=$(echo $REGISTER_REFERRED_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
REFERRED_PLAYER_ID=$(echo $REGISTER_REFERRED_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

echo -e "${GREEN}Referred Player ID: $REFERRED_PLAYER_ID${NC}"

# Check if we have a valid referred player token
if [[ -z "$REFERRED_PLAYER_TOKEN" ]]; then
  echo -e "${RED}Failed to register referred player. Exiting.${NC}"
  exit 1
fi

# Test 10: Check if original player received registration bonus
echo -e "\n${YELLOW}10. Check Original Player's Wallet for Registration Bonus${NC}"
WALLET_AFTER_REFERRAL=$(curl -s -X GET "$BASE_URL/api/wallet" \
  -H "Authorization: Bearer $PLAYER_TOKEN")

echo "$WALLET_AFTER_REFERRAL"

# Test 11: Get list of referred players
echo -e "\n${YELLOW}11. Get List of Referred Players${NC}"
REFERRED_PLAYERS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/referrals/players" \
  -H "Authorization: Bearer $PLAYER_TOKEN")

echo "$REFERRED_PLAYERS_RESPONSE"

# Test 12: Get referral stats (Should show registration bonus)
echo -e "\n${YELLOW}12. Get Referral Stats (After Registration)${NC}"
REFERRAL_STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/referrals/stats" \
  -H "Authorization: Bearer $PLAYER_TOKEN")

echo "$REFERRAL_STATS_RESPONSE"

# Test 13: Deposit funds with the referred player
echo -e "\n${YELLOW}13. Friend Deposits Funds (5000 units)${NC}"
REFERRED_DEPOSIT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/wallet/deposit" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $REFERRED_PLAYER_TOKEN" \
  -d '{
    "amount": 5000
  }')

echo "$REFERRED_DEPOSIT_RESPONSE"

# Test 14: Get referral stats again (Should show deposit bonus)
echo -e "\n${YELLOW}14. Get Updated Referral Stats (After Friend's Deposit)${NC}"
UPDATED_REFERRAL_STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/referrals/stats" \
  -H "Authorization: Bearer $PLAYER_TOKEN")

echo "$UPDATED_REFERRAL_STATS_RESPONSE"

# Test 15: Check original player's wallet balance (Should include both bonuses)
echo -e "\n${YELLOW}15. Check Original Player's Wallet (Should Include Both Bonuses)${NC}"
FINAL_WALLET_RESPONSE=$(curl -s -X GET "$BASE_URL/api/wallet" \
  -H "Authorization: Bearer $PLAYER_TOKEN")

echo "$FINAL_WALLET_RESPONSE"

# Test 16: Try to withdraw more than available balance (should fail)
echo -e "\n${YELLOW}16. Try to Withdraw More Than Available Balance (Should Fail)${NC}"
INVALID_WITHDRAW_RESPONSE=$(curl -s -X POST "$BASE_URL/api/wallet/withdraw" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PLAYER_TOKEN" \
  -d '{
    "amount": 10000
  }')

echo "$INVALID_WITHDRAW_RESPONSE"

echo -e "\n${BLUE}=========================================${NC}"
echo -e "${BLUE}          Demo Complete                   ${NC}"
echo -e "${BLUE}=========================================${NC}"