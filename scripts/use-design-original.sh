#!/usr/bin/env bash
# =============================================================
#  🏛️  use-design-original.sh
#  Restaura COMPLETAMENTE el diseño original de SuperShop:
#    • globals.css  (tokens de color shadcn neutro)
#    • src/app/     (páginas originales desde backup)
#    • src/components/ (componentes originales desde backup)
#  Uso: npm run design:original
# =============================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CSS_DIR="$PROJECT_ROOT/src/app"
STATE_FILE="$PROJECT_ROOT/.design-active"
BACKUP_DIR="$PROJECT_ROOT/src_backup_original"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  🏛️   Restaurando diseño ORIGINAL            ║"
echo "║     SuperShop — shadcn/ui neutro             ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Verificar que el backup existe
if [ ! -d "$BACKUP_DIR" ]; then
  echo "❌  Error: No se encontró el directorio de backup:"
  echo "    $BACKUP_DIR"
  echo ""
  echo "   El backup original no existe. El diseño Stitch"
  echo "   es ahora el único disponible."
  exit 1
fi

echo "  📦  Restaurando archivos desde backup..."
echo ""

# ── 1. Restaurar globals.css ──────────────────────────────
if [ -f "$BACKUP_DIR/app/globals.css" ]; then
  cp "$BACKUP_DIR/app/globals.css" "$CSS_DIR/globals.css"
  echo "  ✅  globals.css restaurado"
elif [ -f "$CSS_DIR/globals-original.css" ]; then
  cp "$CSS_DIR/globals-original.css" "$CSS_DIR/globals.css"
  echo "  ✅  globals.css restaurado (desde globals-original.css)"
else
  echo "  ⚠️   No se encontró globals.css original — manteniendo el actual"
fi

# ── 2. Restaurar src/app/ ─────────────────────────────────
if [ -d "$BACKUP_DIR/app" ]; then
  # Copiar recursivamente preservando estructura
  # Excluir globals-stitch.css y globals-original.css para no sobreescribir
  rsync -a --exclude="globals-stitch.css" --exclude="globals-original.css" \
    "$BACKUP_DIR/app/" "$PROJECT_ROOT/src/app/" 2>/dev/null || \
  cp -r "$BACKUP_DIR/app/." "$PROJECT_ROOT/src/app/"
  echo "  ✅  src/app/ restaurado"
fi

# ── 3. Restaurar src/components/ ─────────────────────────
if [ -d "$BACKUP_DIR/components" ]; then
  cp -r "$BACKUP_DIR/components/." "$PROJECT_ROOT/src/components/"
  echo "  ✅  src/components/ restaurado"
fi

# ── 4. Guardar estado ─────────────────────────────────────
echo "original" > "$STATE_FILE"

echo ""
echo "  🎨  Diseño activo: ORIGINAL"
echo ""
echo "  📦  Características:"
echo "      Colores  : Negro/blanco neutro (shadcn/ui)"
echo "      Dark mode: Sí (soporte completo)"
echo "      Fuente   : Inter / JetBrains Mono"
echo "      Páginas  : Diseño original restaurado"
echo ""
echo "  💡  Reinicia el servidor para ver los cambios:"
echo "      Ctrl+C  →  npm run dev"
echo ""
echo "  🔄  Para volver al diseño Stitch:"
echo "      npm run design:stitch"
echo ""
