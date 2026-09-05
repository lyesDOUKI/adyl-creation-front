#!/usr/bin/env bash
set -euo pipefail

# Usage: ./release.sh <patch|minor|major> [--ci]
BUMP_TYPE="${1:?Usage: ./release.sh <patch|minor|major> [--ci]}"
CI_MODE="${2:-}"

if [[ "$BUMP_TYPE" != "patch" && "$BUMP_TYPE" != "minor" && "$BUMP_TYPE" != "major" ]]; then
    echo "Erreur : le type doit être patch, minor ou major"
    exit 1
fi

# 1. Vérifier que le working tree est propre
if [[ -n "$(git status --porcelain)" ]]; then
    echo "Erreur : des changements non commités sont présents. Committez ou stashez d'abord."
    exit 1
fi

# 2. Lancer les tests et le type-check localement par sécurité
echo "== Lancement des vérifications (tests & type-check) =="
npm run type-check
npm run test

# 3. Incrémenter la version dans le package.json et package-lock.json (version de release)
echo "== Incrémentation de la version ($BUMP_TYPE) =="
NEW_VERSION=$(npm version "$BUMP_TYPE" --no-git-tag-version)
CLEAN_VERSION="${NEW_VERSION#v}"

echo "== Release à créer : $CLEAN_VERSION =="

if [[ "$CI_MODE" != "--ci" ]]; then
    read -rp "Confirmer ? (y/N) " CONFIRM
    [[ "$CONFIRM" == "y" ]] || { git checkout package.json package-lock.json; echo "Annulé."; exit 1; }
fi

# 4. Commit + tag de la release
git add package.json package-lock.json
git commit -m "release: version $CLEAN_VERSION"
git tag -a "v$CLEAN_VERSION" -m "Release $CLEAN_VERSION"

# 5. Passage en version de développement (équivalent SNAPSHOT), même ampleur que la release
echo "== Passage en version de développement =="
NEXT_DEV_VERSION=$(npm version "pre${BUMP_TYPE}" --preid=dev --no-git-tag-version)
CLEAN_NEXT_DEV="${NEXT_DEV_VERSION#v}"

git add package.json package-lock.json
git commit -m "chore: prepare next development version $CLEAN_NEXT_DEV"

# 6. Push (commits + tag)
git push origin HEAD
git push origin "v$CLEAN_VERSION"

echo "Release $CLEAN_VERSION terminée. Développement repris sur $CLEAN_NEXT_DEV."