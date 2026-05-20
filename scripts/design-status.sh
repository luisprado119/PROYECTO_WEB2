#!/usr/bin/env bash
# =============================================================
#  🔍  design-status.sh
#  Muestra qué diseño está activo actualmente
#  Uso: npm run design:status
# =============================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_FILE="$PROJECT_ROOT/.design-active"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  🔍  Estado del diseño activo                ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

if [ -f "$STATE_FILE" ]; then
  ACTIVE=$(cat "$STATE_FILE")
  if [ "$ACTIVE" = "stitch" ]; then
    echo "  🎨  Diseño ACTIVO: STITCH (Precision Commerce)"
    echo "      Azul corporativo + Naranja CTA + Inter"
  else
    echo "  🏛️   Diseño ACTIVO: ORIGINAL (shadcn/ui neutro)"
    echo "      Negro/blanco neutro con soporte dark mode"
  fi
else
  echo "  ⚠️   No hay estado guardado — asumiendo diseño original"
fi

echo ""
echo "  📋  Comandos disponibles:"
echo "      npm run design:stitch    → Activar diseño Stitch"
echo "      npm run design:original  → Restaurar diseño original"
echo "      npm run design:status    → Ver estado actual"
echo ""
