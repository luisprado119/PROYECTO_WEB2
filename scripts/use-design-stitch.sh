#!/usr/bin/env bash
# =============================================================
#  🎨  use-design-stitch.sh
#  Restaura COMPLETAMENTE el diseño KimiShop (Stitch):
#    • globals.css       → globals-stitch.css
#    • src/app/          → desde src_stitch_design/app/
#    • src/components/   → desde src_stitch_design/components/
#  Uso: npm run design:stitch
# =============================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CSS_DIR="$PROJECT_ROOT/src/app"
STATE_FILE="$PROJECT_ROOT/.design-active"
STITCH_BACKUP="$PROJECT_ROOT/src_stitch_design"

STITCH_CSS="$CSS_DIR/globals-stitch.css"
ACTIVE_CSS="$CSS_DIR/globals.css"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  🎨  Activando diseño STITCH — KimiShop      ║"
echo "║     Precision Commerce — Material You        ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Verificar que el backup Stitch existe
if [ ! -d "$STITCH_BACKUP" ]; then
  echo "❌  Error: No se encontró el directorio de diseño Stitch:"
  echo "    $STITCH_BACKUP"
  echo ""
  echo "   Ejecuta primero el proyecto con el diseño Stitch activo"
  echo "   y crea el backup con: cp -r src/app src_stitch_design/ && cp -r src/components src_stitch_design/"
  exit 1
fi

# Verificar CSS de Stitch
if [ ! -f "$STITCH_CSS" ]; then
  echo "❌  Error: No se encontró '$STITCH_CSS'"
  exit 1
fi

echo "  📦  Restaurando páginas Stitch (KimiShop)..."

# ── 1. Restaurar src/app/ ─────────────────────────────────
if [ -d "$STITCH_BACKUP/app" ]; then
  cp -r "$STITCH_BACKUP/app/." "$PROJECT_ROOT/src/app/"
  echo "  ✅  src/app/ restaurado (diseño Stitch)"
fi

# ── 2. Restaurar src/components/ ─────────────────────────
if [ -d "$STITCH_BACKUP/components" ]; then
  cp -r "$STITCH_BACKUP/components/." "$PROJECT_ROOT/src/components/"
  echo "  ✅  src/components/ restaurado (diseño Stitch)"
fi

# ── 3. Activar CSS de Stitch ──────────────────────────────
cp "$STITCH_CSS" "$ACTIVE_CSS"
echo "  ✅  globals.css → globals-stitch.css"

# ── 4. Guardar estado ─────────────────────────────────────
echo "stitch" > "$STATE_FILE"

echo ""
echo "  🎨  Diseño activo: STITCH (KimiShop)"
echo ""
echo "  📦  Paleta activa:"
echo "      Primary   : #004ac6 (Azul corporativo)"
echo "      CTA       : #fd651e (Naranja acción)"
echo "      Background: #faf8ff (Blanco azulado)"
echo "      Fuente    : Inter (Google Fonts)"
echo ""
echo "  💡  Reinicia el servidor para ver los cambios:"
echo "      Ctrl+C  →  npm run dev"
echo ""
echo "  🔄  Para volver al diseño original:"
echo "      npm run design:original"
echo ""
