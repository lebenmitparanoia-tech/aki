#!/usr/bin/env bash
set -euo pipefail

# This script removes legacy/unneeded files & folders safely.
# It only deletes known paths. Review before running.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Cleaning legacy assets and features..."

# Remove any old combined SVGs
rm -f "$ROOT_DIR/public/icons/payments/payment-icons/mastercard-visa-google-apple.svg" || true
rm -f "$ROOT_DIR/public/icons/payments/payment-icons/klarna-sepa.svg" || true

# Remove any leftover SVGs in payment-icons (we now use PNGs)
find "$ROOT_DIR/public/icons/payments/payment-icons" -maxdepth 1 -type f -name '*.svg' -exec rm -f {} \; || true

# Remove Dev's Diary related feature
rm -rf "$ROOT_DIR/app/devs-diary" || true
rm -rf "$ROOT_DIR/components/diary" || true
rm -rf "$ROOT_DIR/content/devs-diary" || true

echo "Cleanup complete. You can now run: npm install && npm run build"
