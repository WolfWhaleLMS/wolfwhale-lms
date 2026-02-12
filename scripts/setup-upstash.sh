#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# setup-upstash.sh — Configure Upstash Redis for WolfWhale LMS rate limiting
# ---------------------------------------------------------------------------
set -euo pipefail

ENV_FILE=".env.local"
UPSTASH_CONSOLE="https://console.upstash.com"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}${BOLD}========================================${NC}"
echo -e "${CYAN}${BOLD}  WolfWhale LMS — Upstash Redis Setup${NC}"
echo -e "${CYAN}${BOLD}========================================${NC}"
echo ""

# ---------------------------------------------------------------------------
# Step 0: Check if already configured
# ---------------------------------------------------------------------------
if [ -f "$ENV_FILE" ]; then
  existing_url=$(grep -E '^UPSTASH_REDIS_REST_URL=' "$ENV_FILE" 2>/dev/null | cut -d'=' -f2- || true)
  existing_token=$(grep -E '^UPSTASH_REDIS_REST_TOKEN=' "$ENV_FILE" 2>/dev/null | cut -d'=' -f2- || true)

  if [ -n "$existing_url" ] && [ -n "$existing_token" ]; then
    echo -e "${GREEN}Upstash Redis is already configured in $ENV_FILE${NC}"
    echo "  URL:   ${existing_url:0:40}..."
    echo "  Token: ${existing_token:0:20}..."
    echo ""
    read -rp "Overwrite existing configuration? (y/N): " overwrite
    if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
      echo "Keeping existing configuration. Done."
      exit 0
    fi
    echo ""
  fi
fi

# ---------------------------------------------------------------------------
# Step 1: Guide user to create a Redis database
# ---------------------------------------------------------------------------
echo -e "${BOLD}Step 1: Create a free Upstash Redis database${NC}"
echo ""
echo "  1. Open the Upstash Console:"
echo -e "     ${CYAN}${UPSTASH_CONSOLE}${NC}"
echo ""
echo "  2. Sign up or log in (GitHub / Google / email)"
echo ""
echo "  3. Click ${BOLD}\"Create Database\"${NC}"
echo "     - Name:   ${BOLD}wolfwhale-lms${NC}"
echo "     - Region: ${BOLD}US-East-1${NC} (or closest to your Vercel deployment)"
echo "     - Type:   ${BOLD}Regional${NC} (free tier is fine)"
echo "     - TLS:    ${BOLD}Enabled${NC} (default)"
echo ""
echo "  4. After creation, go to the ${BOLD}\"REST API\"${NC} section"
echo "     Copy the ${BOLD}UPSTASH_REDIS_REST_URL${NC} and ${BOLD}UPSTASH_REDIS_REST_TOKEN${NC}"
echo ""

# Open the console in the browser
if command -v open &>/dev/null; then
  read -rp "Open Upstash Console in browser? (Y/n): " open_browser
  if [[ ! "$open_browser" =~ ^[Nn]$ ]]; then
    open "$UPSTASH_CONSOLE"
    echo -e "${GREEN}Opened ${UPSTASH_CONSOLE} in your browser.${NC}"
    echo ""
  fi
elif command -v xdg-open &>/dev/null; then
  read -rp "Open Upstash Console in browser? (Y/n): " open_browser
  if [[ ! "$open_browser" =~ ^[Nn]$ ]]; then
    xdg-open "$UPSTASH_CONSOLE"
    echo -e "${GREEN}Opened ${UPSTASH_CONSOLE} in your browser.${NC}"
    echo ""
  fi
fi

# ---------------------------------------------------------------------------
# Step 2: Collect credentials
# ---------------------------------------------------------------------------
echo -e "${BOLD}Step 2: Enter your Upstash Redis credentials${NC}"
echo ""

read -rp "UPSTASH_REDIS_REST_URL: " redis_url
echo ""
read -rp "UPSTASH_REDIS_REST_TOKEN: " redis_token
echo ""

# Validate inputs
if [ -z "$redis_url" ] || [ -z "$redis_token" ]; then
  echo -e "${RED}Error: Both URL and token are required.${NC}"
  exit 1
fi

if [[ ! "$redis_url" =~ ^https:// ]]; then
  echo -e "${YELLOW}Warning: URL doesn't start with https:// — are you sure it's correct?${NC}"
  read -rp "Continue anyway? (y/N): " confirm
  if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# Step 3: Write to .env.local
# ---------------------------------------------------------------------------
echo -e "${BOLD}Step 3: Saving to $ENV_FILE${NC}"

if [ -f "$ENV_FILE" ]; then
  # Update existing values (replace empty or existing values)
  if grep -q '^UPSTASH_REDIS_REST_URL=' "$ENV_FILE"; then
    sed -i.bak "s|^UPSTASH_REDIS_REST_URL=.*|UPSTASH_REDIS_REST_URL=${redis_url}|" "$ENV_FILE"
  else
    echo "" >> "$ENV_FILE"
    echo "# Upstash Redis (rate limiting)" >> "$ENV_FILE"
    echo "UPSTASH_REDIS_REST_URL=${redis_url}" >> "$ENV_FILE"
  fi

  if grep -q '^UPSTASH_REDIS_REST_TOKEN=' "$ENV_FILE"; then
    sed -i.bak "s|^UPSTASH_REDIS_REST_TOKEN=.*|UPSTASH_REDIS_REST_TOKEN=${redis_token}|" "$ENV_FILE"
  else
    echo "UPSTASH_REDIS_REST_TOKEN=${redis_token}" >> "$ENV_FILE"
  fi

  # Clean up backup file from sed -i
  rm -f "${ENV_FILE}.bak"
else
  cat > "$ENV_FILE" <<EOF
# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=${redis_url}
UPSTASH_REDIS_REST_TOKEN=${redis_token}
EOF
fi

echo -e "${GREEN}Saved to $ENV_FILE${NC}"
echo ""

# ---------------------------------------------------------------------------
# Step 4: Push to Vercel (optional)
# ---------------------------------------------------------------------------
echo -e "${BOLD}Step 4: Push environment variables to Vercel${NC}"
echo ""

read -rp "Push UPSTASH vars to Vercel for all environments? (Y/n): " push_vercel
if [[ ! "$push_vercel" =~ ^[Nn]$ ]]; then
  echo ""

  # Check if vercel CLI is available
  if ! command -v npx &>/dev/null; then
    echo -e "${YELLOW}npx not found. Please push manually:${NC}"
    echo "  npx vercel env add UPSTASH_REDIS_REST_URL"
    echo "  npx vercel env add UPSTASH_REDIS_REST_TOKEN"
  else
    echo "Pushing UPSTASH_REDIS_REST_URL to Vercel..."
    echo "$redis_url" | npx vercel env add UPSTASH_REDIS_REST_URL production preview development 2>&1 || {
      echo -e "${YELLOW}Failed to push URL. You can add it manually in the Vercel dashboard.${NC}"
    }

    echo ""
    echo "Pushing UPSTASH_REDIS_REST_TOKEN to Vercel..."
    echo "$redis_token" | npx vercel env add UPSTASH_REDIS_REST_TOKEN production preview development 2>&1 || {
      echo -e "${YELLOW}Failed to push token. You can add it manually in the Vercel dashboard.${NC}"
    }

    echo ""
    echo -e "${GREEN}Vercel environment variables updated.${NC}"
    echo -e "${YELLOW}Note: Redeploy your Vercel project for changes to take effect.${NC}"
  fi
else
  echo ""
  echo -e "${YELLOW}Skipped Vercel push. Remember to add these vars in the Vercel dashboard:${NC}"
  echo "  - UPSTASH_REDIS_REST_URL"
  echo "  - UPSTASH_REDIS_REST_TOKEN"
fi

# ---------------------------------------------------------------------------
# Step 5: Verify connection
# ---------------------------------------------------------------------------
echo ""
echo -e "${BOLD}Step 5: Verifying Redis connection...${NC}"

# Quick curl test against the Upstash REST API
response=$(curl -sf -X POST "${redis_url}/ping" \
  -H "Authorization: Bearer ${redis_token}" \
  2>&1) || {
  echo -e "${YELLOW}Could not verify connection. This may be fine if you're behind a firewall.${NC}"
  echo "  The app will attempt to connect at runtime."
  echo ""
  echo -e "${GREEN}${BOLD}Setup complete!${NC} Restart your dev server to use Redis rate limiting."
  exit 0
}

if echo "$response" | grep -qi "PONG"; then
  echo -e "${GREEN}Redis connection successful! PONG received.${NC}"
else
  echo -e "${YELLOW}Unexpected response: ${response}${NC}"
  echo "  The credentials may still work — check the Upstash dashboard."
fi

echo ""
echo -e "${GREEN}${BOLD}Setup complete!${NC} Restart your dev server to use Redis rate limiting."
echo ""
