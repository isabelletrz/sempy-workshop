# PROGRESS — NOCTRA STUDIO

> Feuille de route de reprise. Dernière mise à jour : 29 octobre 2026.

## 0ter. Mises à jour du 30 octobre (reprise par Claude)

- **Node figé sur 20** : `.nvmrc` (`20`) + `"engines": { "node": "20.x" }` dans `package.json` → Vercel utilisera Node 20 automatiquement (plus de blocage Node 26).
- **Chatbot** : `/api/chat` accepte maintenant `OPENROUTER_API_KEY` (+ `OPENROUTER_MODEL`, défaut `openai/gpt-4o-mini`), prioritaire sur `OPENAI_API_KEY`. Sans clé : FAQ. **Ne jamais mettre la clé dans le code** : uniquement `.env.local` ou Vercel > Settings > Environment Variables. L'endpoint est public → mettre une limite de crédit sur la clé.
- **Vérifié** : `type-check` OK, `lint` OK, `next build` OK sous Node 22 (45 pages, ~30 s), toutes les pages et APIs répondent 200.
- **Refonte du design (30 oct, soir)** : site noir et blanc (logo « sempy » chrome en gothique, fond damassé, nav ornée), accueil = logo + 2 boutons de même taille + section « The Collection ». Les anciennes arches et le gros titre ont été retirés.
- **Les 20 templates ont été redessinés** : chaque produit a maintenant son propre univers (Luna.exe = ciel étoilé violet, Dark Ritual = noir/rouge « papier déchiré », Cathedral = vitraux, Ghost Signal = VHS, etc.) avec 8 écrans chacun (overlay, webcam, chat, panels, alertes, starting soon, BRB, offline). Les images sont dans `public/templates/<slug>/*.webp` ; les versions `-clear.webp` (transparentes) servent à l'aperçu caméra. Le générateur est dans `tools/template-art/` (voir son README). Les anciens SVG de DeepSeek et leurs scripts ont été supprimés.
- Les téléchargements après commande (`/api/assets/...`) servent maintenant ces fichiers `.webp`.
- **Limite connue (à dire honnêtement dans le pitch)** : le paiement est une démo (aucun vrai débit) et les liens `/api/assets/...` sont publics. Pour une vraie vente : Stripe Checkout + liens de téléchargement signés/protégés.

## 0. Identité du site

Le site est rebrandé **sempy** (logo header/footer en chrome lowercase, metadata, newsletter, chatbot, emails). Les templates Twitch restent indépendants et gardent leurs propres marques (LUNA.EXE, VELVET VOID, etc.). Les noms de produits/collections historiques (`Nocturne`, `Noctra Signature`) et les clés internes (`noctra-cart`, package `noctra-studio`) sont conservés.

## 0bis. Nouveau chemin du projet

Le projet a été **copié hors d’iCloud** :

- **Nouveau dossier de travail : `/Users/isa/Projects/WORKSHOP`**
- Ancien dossier : `/Users/isa/Documents/WORKSHOP` (iCloud, à archiver/supprimer — voir alertes)

Toujours travailler dans le nouveau dossier.

## 1. Objectif global

Auditer et corriger la boutique Next.js 14 « NOCTRA STUDIO », puis la lancer en local pour preview, avant un déploiement.

## 2. État actuel

### Corrections appliquées
- **Types de campagne** : `Campaign`, `CampaignBanner` (`text?`, `link?`), `campaigns` typé → plus d’erreur TS2339.
- **Thème** : conversion hex → HSL (`src/lib/colors.ts`), application de toutes les variables Tailwind, thème actif dès l’état initial, `useLayoutEffect` pour limiter le flash.
- **Prix promo** : `src/lib/pricing.ts` ; remise Halloween -20 % appliquée cartes/fiche/panier/checkout/sous-total.
- **`/shop`** : `<Suspense>` ajouté, `?seasonal=true` pris en compte, filtres resynchronisés avec l’URL.
- **Collections** : `collections` **ou** `seasonalTags` → `valentine` et `summer` remplies.
- **Checkout** : redirection via `useEffect` (plus de `router.push` au rendu).
- **Race condition panier** : ajout de `isLoaded` dans `CartContext` ; `/checkout` attend le chargement de `localStorage` avant de rediriger (bug trouvé et corrigé pendant la QA).
- **Commande** : flag `sessionStorage` + `OrderSuccessGuard` ; accès direct à `/order/success` → `/cart`.
- **Panier** : boutons +/- de quantité.
- **Persistance** : panier/wishlist rechargés depuis le catalogue courant.
- **Footer** : plus de liens 404.
- **Divers** : entités JSX échappées, `.eslintrc.json`, `.env.example` corrigé, décalages horaires des campagnes.

### Vérifications (toutes OK)
- `npm run type-check` → **exit 0**
- `npm run lint` → **0 warning / 0 erreur**
- `next build` (Node 20.11) → **exit 0**, **43 pages** + **4 APIs** générées, `/shop` incluse.
- **Preview locale en production** : serveur démarré sur **http://localhost:3000** (PID 29163).
- APIs testées : newsletter, chatbot, commande gratuite, commande payée (demo), téléchargement SVG.
- QA navigateur :
  - accueil Halloween, bandeau promo, fond sombre, aucune erreur console ;
  - prix promo -20 % corrects (ex. Luna.exe €23.99 / €29.99) ;
  - `/shop?seasonal=true` → 14 produits ;
  - `/collections/valentine` → 2 produits ;
  - panier, quantités, sous-total promo OK ;
  - `/checkout` en accès direct : reste sur la page (race corrigée) ;
  - commande complète → `/order/success` ;
  - accès direct à `/order/success` dans un nouvel onglet → redirection `/cart`.

### Nouvelles fonctionnalités ajoutées (29 octobre)
- **Homepage enrichie** : hero deux colonnes avec visuel de template, section « From the studio » (news/drops), section « What's popular » avec rendus visuels, statistiques, liens vers le kit gratuit.
- **Design system chrome** : utilitaires `chrome-text`, `chrome-surface`, `chrome-edge`, `chrome-grid`, bouton `variant="chrome"`, gradients métal.
- **Templates complets dessinés** : `TemplateVisual` + `src/lib/template-theme.ts` génèrent une composition détaillée (cadre principal, webcam, chat, panneaux RULES/ABOUT/SOCIALS, alertes follower/sub/donation, écrans Starting Soon/BRB/Offline). **20 thèmes produit distincts** : gothic (arches/chauve-souris), coquette (chat, cœurs, pois), cyber (circuit, angles), chrome/Y2K (étoiles), winter (flocons), halloween (citrouille/lune), minimal, signature, cosy (nuages, pêche/ciel). Mascotte/emblème propre à chaque style, cadres et motifs spécifiques.
- **Preview multi-écrans** : onglets Overlay / Webcam / Chat / Panels / Alerts / Starting Soon / BRB / Offline sur chaque fiche produit.
- **Nouveau pack cosy « Cloud Nine »** : produit `cloud-nine-cosy-stream-kit`, collection `cosy`, thème `cozy` (pêche/ciel, cadres très arrondis, nuages, typo Arial Rounded/Chalkboard), fond AI `public/backgrounds/cozy.jpg` (nuages), 8 assets générés.
- **Luna.exe passé en thème spatial** : renommé « Cosmic Horror Starter Kit », thème `space` (lune, nébuleuse, orbites, constellations, étoiles), palette lavande/cyan, tagline « COSMIC HORROR », fond AI `public/backgrounds/space.jpg`, titre dégradé spatial. Régénération ciblée : `node tools/generate-vc-templates.mjs --id=1`.
- **Templates VectorCraft** : 160 SVG vectoriels générés avec le CLI officiel **VectorCraft 0.18.0** (`tools/vectorcraft-cli-0.18.0-macos-universal`), soit **8 assets × 20 produits** dans `public/templates/<slug>/` : overlay, webcam-frame, chat-box, alert, panels, starting-soon, brb, offline. Les cartes, le hero, la section popular et les onglets produit utilisent ces fichiers. Générateur : `tools/generate-vc-templates.mjs` (`node tools/generate-vc-templates.mjs`, ou `--only=overlay`, `--only=webcam`, `--only=overlay,webcam`). La preview caméra reste le rendu CSS dynamique pour permettre l’édition du username en direct.
- **8 structures réellement différentes** (plus seulement des couleurs) :
  - **Gothic** : cadre principal et webcam en arche, panneaux en arche, chat latéral.
  - **Coquette** : cadre/webcam/chat/alerte en **cat ears**, panneaux arrondis, pois, cœurs.
  - **Cyber/HUD** : coins coupés, grand cadre 1080, webcam cut, chat vertical étroit, 4 panneaux, ticker d’alerte.
  - **Y2K/Chrome** : cadres chrome épais, **webcam ovale**, étoiles, barres métal.
  - **Minimal** : grande zone négative, lignes fines, petits modules discrets.
  - **Winter** : arche principale, webcam ovale, flocons, or/vert.
  - **Halloween** : cadre principal et webcam en **cercueil**, panneaux en arche, lune/citrouille.
  - **Signature** : composition éditoriale, **webcam verticale**, chat décalé, chrome.
  - **Cosy / Cloud Nine** : cadres très arrondis, nuages, pêche/ciel, typo ronde, ambiance douce.
  - **Space / Luna.exe** : lune, nébuleuse, orbites, constellations, lavande/cyan, cadre gothique conservé.
- **Inspiration Dribbble** (`dribbble.com/search/twitch-overlay`) intégrée :
  - fonds illustrés plein cadre pour les écrans : lune, nuages, silhouettes de chats, sapins, rayons néon, étoiles ;
  - **titres superposés** avec doublon accent (effet glitch / profondeur), mot d’accent séparé (« STARTING » + « SOON ») ;
  - **minimal/signature** : split brutaliste noir/blanc, typographie géante, code-barres, texte technique ;
  - cyber : rayons diagonaux, grilles, cercles HUD, panneaux coupés, ticker ;
  - gothic/winter : arches, lune, nuages et étoiles ; coquette : cat ears, lune, silhouettes de chats ; halloween : lune, arbres, citrouilles ; Y2K : barres chrome, étoiles, cadre double.
  - Les écrans Starting Soon / BRB / Offline ont été entièrement redessinés (pas seulement recolorés).
- **Textures** ajoutées par univers : grain fin, scanlines, gingham (coquette), métal brossé (Y2K/signature), givre/neige (winter), papier (minimal), barres glitch (cyber), brume et étoiles (gothic/halloween).
- **Typographies par thème** :
  - Gothic : **Bodoni 72** (display), **Copperplate** (labels), Avenir.
  - Coquette : **Arial Rounded MT Bold** + **Snell Roundhand** (script), Avenir.
  - Cyber : **DIN Condensed** + **Menlo**, DIN Alternate.
  - Y2K : **Impact** + **Futura**, Avenir.
  - Minimal : **Helvetica Neue** + Menlo.
  - Winter : **Didot** + Copperplate, Baskerville.
  - Halloween : **Herculanum** + Trattatello, Baskerville.
  - Signature : **Optima** + Copperplate, Avenir.
- **Packs graphiques AI** : **10 badges AI par univers × 10 styles = 100 éléments** dans `public/graphics/<style>/01–10.png` (formats cercle, carré arrondi, hexagone, losange, arche, étoile, blob, bouclier, squircle, orbite). Chaque badge combine un crop du fond AI, un masque vectoriel et des anneaux de couleur.
- **10 éléments réellement composés dans chaque template** : l’overlay utilise 3 badges en filigrane dans le cadre principal + 7 stickers autour (coins, header, footer) ; chaque écran Starting Soon / BRB / Offline utilise les 10 badges en constellation autour du titre. La section « AI graphic pack » de la fiche produit a été retirée : les badges sont uniquement intégrés aux visuels. Script : `tools/generate-graphic-packs.mjs`.
- **Texte converti en courbes** (`outlineText`) dans les 160 SVG : le rendu est identique sur toutes les machines, sans dépendre des polices installées. `public/templates` pèse ~66 Mo (160 SVG, fonds + 10 badges AI par template incorporés) et `public/graphics` ~10 Mo (100 badges + sources).
- **Fonds AI** : génération FLUX.1-schnell via l’espace HF (`black-forest-labs-flux-1-schnell`), sources dans `public/backgrounds/` (`gothic.jpg`, `coquette.jpg`) + 6 variantes recadrées/gradées (`cyber`, `y2k`, `minimal`, `winter`, `halloween`, `signature`). Script : `tools/generate-ai-backgrounds.mjs`. Les images sont **incorporées en base64** dans les SVG (aucun chemin local), avec un voile dégradé propre à chaque thème pour garder le texte lisible. Les quotas gratuits HF/Pollinations ont limité les générations uniques ; les variantes sont dérivées des deux images FLUX.
- **Templates indépendants du site** : les overlays ne portent plus le logo « N » ni les mentions NOCTRA / NOCTRA.STUDIO / STREAM LAYOUT. Chaque template utilise sa propre marque (initiales du produit : LU, VE, GL, CH…), son nom, son handle `@your_name`, sa palette et son dégradé de titre (lavande gothic, rose coquette, cyan/lime cyber, chrome Y2K, or winter, orange halloween, etc.). Le chrome et l’identité NOCTRA restent réservés au site, pas aux templates Twitch.
- **Livraison** : `/api/assets/[slug]/[asset]` sert les SVG VectorCraft générés (fallback sur le générateur SVG interne).
- **Assets téléchargeables stylisés** : 8 SVG par produit (overlay, webcam, chat, alert, panels, starting-soon, brb, offline), avec les couleurs, cadre et wordmark du thème.
- **Preview caméra** : modale `CameraPreview`, accès `getUserMedia`, overlay superposé à la vidéo, username éditable, écrans overlay/alerts/chat, message d'erreur si permission refusée.
- **Compatibilité** : OBS Studio, Streamlabs, StreamElements, Twitch, YouTube et Facebook affichés partout (`platforms`).
- **Produit gratuit** : « Chrome Starter — Free Stream Kit » (`/products/chrome-starter-free-stream-kit`), checkout à 0 €.
- **Checkout complet** : invité ou création de compte, coordonnées, adresse, champs carte (démo), validation, résumé promo, commande gratuite sans paiement.
- **Emails** : API `/api/newsletter` (welcome email), `/api/orders` (notification propriétaire + reçu client avec liens de téléchargement), template HTML chrome. Destinataire propriétaire par défaut : `isabelle.trzopek@mail-ecv.fr`.
- **Téléchargements** : `/api/assets/[slug]/[asset]` génère 8 SVG réels et stylisés (overlay, webcam frame, chat box, alert, panels, starting soon, BRB, offline).
- **Chatbot** : widget `SupportChat` + `/api/chat` (OpenAI si `OPENAI_API_KEY`, sinon fallback FAQ).
- **Newsletter** : formulaire connecté à l'API avec état de succès et mention du mode démo.
- **Page succès** : affiche l'ID de commande, les articles, le total et l'email de livraison.

## 3. Bloquants ou alertes

1. **Cause racine des blocages : iCloud.** `~/Documents` est synchronisé iCloud. `brctl status` montrait des fichiers de `node_modules/next` en téléchargement/éviction ; `node_modules` ne faisait plus que **3 Mo** localement. Les builds/compilations se bloquaient sur des `pread`. **D’où le déplacement vers `~/Projects/WORKSHOP`.**
2. **Node 26.13.0 ne permet pas `next build`** : la collecte des pages timeout (worker Next 14). En revanche `next start` fonctionne sous Node 26. Utiliser **Node 20.11** (ou 22 LTS) pour builder.
3. **Node 20.11 utilisé = binaire temporaire** : `/private/tmp/node-v20.11.0-darwin-arm64/bin/node`. Il peut disparaître au redémarrage. Installer Node 20/22 LTS proprement pour les builds durables.
4. **Ancien dossier `/Users/isa/Documents/WORKSHOP`** : copie stale, `node_modules` évincé. Ne plus l’utiliser ; à archiver/supprimer après accord.
5. **Images produits** : `public/images` vide, placeholders assumés.
6. **Pages légales** : liens footer retirés faute de pages (`/faq`, `/terms`, etc.).
7. **`/order/success`** : flag conservé dans l’onglet ; un refresh dans le même onglet réaffiche la confirmation.
8. **Pas de dépôt Git**.
9. **Disque** : ~7 Go libres (97 % utilisés) — attention aux installs/builds.
10. **Emails non réellement envoyés sans clé** : sans `RESEND_API_KEY`, les emails sont simulés (log serveur). Pour recevoir réellement la notification à `isabelle.trzopek@mail-ecv.fr`, ajouter la clé et un `EMAIL_FROM` vérifié dans Resend.
11. **Chatbot IA optionnel** : sans `OPENAI_API_KEY`, le chatbot utilise un fallback FAQ (pas d'IA générative).
12. **Paiement factice** : les champs carte sont en mode démo. Aucune donnée carte complète n'est envoyée au serveur (seulement les 4 derniers chiffres). Ne jamais saisir une vraie carte. Pour la production : Stripe Checkout / Elements.
13. **Caméra** : la preview nécessite l'autorisation navigateur ; en cas de refus, un message et un bouton « Try again » s'affichent.
14. **Prix homepage** : la section « What's popular » est un composant serveur, donc ses prix promo sont figés au build (rebuilder après la fin d'une campagne).
15. **Aperçus VectorCraft statiques** : les 160 SVG contiennent « YOUR_NAME » et du texte SVG (Helvetica Neue, fallback Arial). La modification du username en direct se fait uniquement dans la preview caméra. Pour changer un design, relancer `node tools/generate-vc-templates.mjs` (ou `--only=overlay`). Les PNG de QA ont été supprimés ; seuls les SVG sont conservés.

## 4. Prochaines étapes

1. **Preview** : le serveur tourne déjà sur http://localhost:3000. Pour le relancer :
   ```bash
   cd /Users/isa/Projects/WORKSHOP
   lsof -ti tcp:3000 | xargs kill 2>/dev/null
   npm start          # fonctionne avec Node 26 (build déjà présent)
   ```
2. **Modifier le code** : utiliser `npm run dev` (à tester sous Node 26 ; sinon Node 20/22). Toujours dans `~/Projects/WORKSHOP`.
3. **Rebuilder** (après modifications) avec Node 20/22 :
   ```bash
   export PATH=/private/tmp/node-v20.11.0-darwin-arm64/bin:$PATH
   npm run type-check && npm run lint
   node node_modules/next/dist/bin/next build
   ```
4. **Installer un Node LTS stable** (20 ou 22) pour ne plus dépendre de `/private/tmp`.
5. **Archiver/supprimer** l’ancien dossier iCloud après validation.
6. **Git** : `git init && git add . && git commit -m "fix: audit + preview setup"`.
7. **Déploiement** : Vercel (choisir **Node 20/22**, pas 26). `npx vercel login` puis `npx vercel --yes`.
8. **Configurer les emails réels** : créer `.env.local` avec `RESEND_API_KEY`, `EMAIL_FROM` (domaine vérifié) et `ORDER_NOTIFICATION_EMAIL=isabelle.trzopek@mail-ecv.fr`, puis redémarrer et tester une commande.
9. **Activer l'IA** : ajouter `OPENAI_API_KEY` (et éventuellement `OPENAI_MODEL`) dans `.env.local`, puis tester le chatbot.
10. **Remplacer le paiement démo** par Stripe (Checkout ou Elements) avant toute mise en production ; ne jamais collecter les numéros de carte sur le serveur.
11. Tester la preview caméra sur un vrai navigateur avec webcam.
12. Optionnel : pages légales, vraies images produits, durcissement du flag commande.

## 5. Contexte technique

### Nouveaux fichiers
| Fichier | Rôle |
|---|---|
| `src/lib/colors.ts` | Hex → HSL + variables CSS de campagne. |
| `src/lib/pricing.ts` | Prix effectif + promo active. |
| `src/lib/accent.ts` | Accent couleur par collection (partagé UI/API). |
| `src/lib/email.ts` | Resend + templates email (welcome, client, propriétaire). |
| `src/lib/template-theme.ts` | 20 thèmes produit (palette, style, motif, wordmark). |
| `src/components/template-visual.tsx` | Rendu CSS dynamique (preview caméra / username). |
| `src/components/vector-template.tsx` | Affiche les SVG VectorCraft (overlay, webcam, chat, panels, alerts, screens). |
| `tools/generate-vc-templates.mjs` | Générateur des 152 templates via le CLI VectorCraft. |
| `public/templates/<slug>/*.svg` | 152 assets vectoriels générés (8 par produit). |
| `src/components/camera-preview.tsx` | Preview webcam + username éditable. |
| `src/components/support-chat.tsx` | Widget chatbot service client. |
| `src/components/brand-news.tsx` | Section news/drops homepage. |
| `src/components/popular-showcase.tsx` | Section visuelle « What's popular ». |
| `src/components/order-success-details.tsx` | Détails de commande sur la page succès. |
| `src/components/order-success-guard.tsx` | Protection de `/order/success`. |
| `src/app/api/newsletter/route.ts` | Inscription + welcome email. |
| `src/app/api/orders/route.ts` | Commande + emails propriétaire/client. |
| `src/app/api/chat/route.ts` | Chatbot OpenAI/fallback. |
| `src/app/api/assets/[slug]/[asset]/route.ts` | Génération des SVG téléchargeables. |
| `.eslintrc.json` | Config `next/core-web-vitals`. |

### Fichiers modifiés notables
- `src/lib/config.ts` — types campagne + dates.
- `src/components/theme-provider.tsx` — thème HSL complet.
- `src/components/cart-provider.tsx` — `isLoaded`, rechargement catalogue, sous-total promo.
- `src/components/checkout-content.tsx` — attente `isLoaded`, `submittedRef`, flag commande.
- `src/components/{product-card,product-detail,cart-content}.tsx` — pricing/quantités.
- `src/components/shop-content.tsx` + `src/app/shop/page.tsx` — seasonal + Suspense.
- `src/app/collections/[slug]/page.tsx` — seasonalTags.
- `src/components/{footer,search-content,categories}.tsx` — liens/lint.
- `src/app/order/success/page.tsx` — guard.

### Repères
- Campagne Halloween active jusqu’au **1er nov. 2026**, promo **20 %** sur la collection `halloween`.
- Variables Tailwind = **triplets HSL** (`hsl(var(--...))`).
- Toujours passer par `getProductPricing(product)` pour les prix.
- `NEXT_PUBLIC_ACTIVE_THEME` doit rester commenté (sélection par dates).
- Serveur actuel : Node 26, port **3000** (`npm start` via nohup, PID 35500). `next start` fonctionne sous Node 26 ; seul `next build` nécessite Node 20/22.
- Pack cosy : `cloud-nine-cosy-stream-kit` / collection `cosy` / thème `cozy` ; régénération ciblée : `node tools/generate-vc-templates.mjs --id=20`.
- Luna.exe spatial : thème `space`, fond `public/backgrounds/space.jpg`, régénération : `node tools/generate-vc-templates.mjs --id=1`.
- VectorCraft CLI : `tools/vectorcraft-cli-0.18.0-macos-universal/vectorcraft-cli`. Le dossier et `tools/vc-cli.zip` sont exclus du déploiement via `.vercelignore` (le générateur reste dans le repo).
- Si le serveur meurt : `cd /Users/isa/Projects/WORKSHOP && lsof -ti tcp:3000 | xargs kill 2>/dev/null; nohup npm start > /tmp/noctra-preview.log 2>&1 &`.
- Logs de build/QA : `/private/var/folders/.../T/opencode/` (temporaires).
