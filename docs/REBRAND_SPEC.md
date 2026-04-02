# JaiMentorship — Brand & Public Product UX Specification

> **Status:** Draft specification — do not implement yet  
> **Date:** 2026-04-01  
> **Scope:** Rebrand MentorHub → JaiMentorship, public IA, navigation, HomePage, journey separation, implementation plan

---

## Table of Contents

1. [Brand Direction](#1-brand-direction)
2. [Public Information Architecture](#2-public-information-architecture)
3. [Navigation Proposal](#3-navigation-proposal)
4. [HomePage Block-by-Block Structure](#4-homepage-block-by-block-structure)
5. [Page Visibility Matrix](#5-page-visibility-matrix)
6. [Journey Separation](#6-journey-separation)
7. [Copy Rewrite Priority](#7-copy-rewrite-priority)
8. [Implementation Order](#8-implementation-order)
9. [Recommended Commit Split](#9-recommended-commit-split)

---

## 1. Brand Direction

### 1.1 Wordmark Recommendation

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **JaiMentorship** | Reads as one product name; modern SaaS feel; works as URL (`jaimentorship.kg`); no ambiguity in logos | "Jai" is less visually distinct at small sizes | ✅ **Recommended** |
| JAI Mentorship | "JAI" reads as acronym, creates curiosity; feels institutional | Looks like two separate words; users may Google "JAI" expecting it to stand for something; harder to use as slug | ❌ Rejected |

**Final wordmark:** `JaiMentorship`

- In UI text and code: `JaiMentorship` (one word, PascalCase)
- In marketing/hero copy: `JaiMentorship` (no space)
- Legal footer: `© 2026 JaiMentorship`
- Icon mark: **`J`** in a rounded square (replacing the current `M` mark)
- The letter `J` is set in the brand font (Inter ExtraBold) inside a `rounded-xl` brand-colored container

### 1.2 Brand Personality

| Attribute | Description |
|---|---|
| **Premium calm** | Generous whitespace, no visual noise, large readable type |
| **Trustworthy** | Verified badges, real mentor photos, transparent pricing |
| **Educational** | Warm but professional tone; inspires growth, not urgency |
| **Culturally rooted** | "Jai" (жай) evokes calm/summer in Kyrgyz — peace and growth. Bilingual ky/ru identity |

### 1.3 Color Palette Update

The existing purple palette is solid and trust-oriented. Minor refinements:

| Token | Current | Proposed | Rationale |
|---|---|---|---|
| `--color-brand` | `#5B3FD3` | `#5B3FD3` | Keep — strong, distinctive, already applied consistently |
| `--color-brand-hover` | `#4C31BF` | `#4C31BF` | Keep |
| `--color-brand-soft` | `#EEE9FF` | `#F0EDFF` | Slightly warmer to feel less clinical |
| `--color-bg` | `#F8F8FC` | `#FAFAFE` | Warmer off-white for premium feel |
| `--color-accent` | `#8B7BFF` | `#7C6BF0` | Slightly deeper for better contrast on white |
| `--color-text-secondary` | `#6F6B7D` | `#6E6A80` | Negligible change, fine-tune later |

No drastic color change — the rebrand is about name, IA, and copy polish, not a color overhaul.

### 1.4 Typography

- **Keep** Inter as primary font
- **Increase** hero heading size: `text-[2.75rem]` → `text-5xl` on desktop for more presence
- **Add** `font-display: swap` to font loading for perceived performance
- Consider adding `Inter Display` for headings at 32px+ (future enhancement)

### 1.5 Logo Mark

```
Current:  [M] MentorHub
Proposed: [J] JaiMentorship
```

- The `[J]` container changes from `rounded-xl bg-brand` to the same shape
- The wordmark next to it reads `JaiMentorship` in `font-extrabold tracking-tight`
- Mobile header shows `[J]` icon only (no wordmark) to save space → wordmark is in the footer

---

## 2. Public Information Architecture

### 2.1 Current IA (as-is)

```
/                           → HomePage
/about                      → AboutPage
/mentors                    → MentorDirectoryPage
/mentors/:id                → PublicMentorProfilePage
/mentor/apply               → MentorApplyPage
/mentor/application/status  → MentorApplicationStatusPage
/login                      → LoginPage
/register                   → RegisterPage
/forgot-password            → ForgotPasswordPage
/reset-password             → ResetPasswordPage
/verify-email               → VerifyEmailPage
```

### 2.2 Proposed IA (to-be)

No URL changes needed — the current URL structure is clean and SEO-friendly. Rename only the page meta titles and i18n strings.

```
/                           → HomePage           (title: "JaiMentorship — Найдите ментора")
/about                      → AboutPage          (title: "О платформе — JaiMentorship")
/mentors                    → MentorDirectoryPage (title: "Каталог менторов — JaiMentorship")
/mentors/:id                → PublicMentorProfilePage
/mentor/apply               → MentorApplyPage    (title: "Стать ментором — JaiMentorship")
/mentor/application/status  → MentorApplicationStatusPage
/login                      → LoginPage          (title: "Вход — JaiMentorship")
/register                   → RegisterPage       (title: "Регистрация — JaiMentorship")
/forgot-password            → ForgotPasswordPage
/reset-password             → ResetPasswordPage
/verify-email               → VerifyEmailPage
```

### 2.3 Future IA Additions (not in scope now, but reserve URLs)

| URL | Purpose | Priority |
|---|---|---|
| `/how-it-works` | Standalone "how it works" page (extract from HomePage) | Low |
| `/faq` | Common questions | Medium |
| `/privacy` | Privacy policy (currently `#` placeholder) | Medium |
| `/terms` | Terms of service (currently `#` placeholder) | Medium |

---

## 3. Navigation Proposal

### 3.1 Public Desktop Header (unauthenticated)

```
[J] JaiMentorship     |  О платформе  |  Каталог менторов  |  [🌐 ky/ru]  |  Войти  |  [Регистрация]
                       ↑ link            ↑ link                ↑ switcher    ↑ text    ↑ filled button
```

**Changes from current:**
- Remove "Стать ментором" from main nav → move it to a **homepage CTA** and **footer only**
- Rationale: Main nav serves students (80% of visitors). Mentor application is a secondary path — surfacing it in nav creates confusion about who the product is for.
- Keep nav items ≤ 3 for clarity (About, Mentors, Language)

### 3.2 Public Mobile Header (unauthenticated)

```
[J]                                                   [🌐]  Войти  [Регистрация]
```

**Changes from current:**
- Keep identical to current (already minimal and correct)
- The `[J]` icon links to `/`
- No hamburger menu needed — current approach of showing only auth CTAs on mobile is correct

### 3.3 Public Footer

```
┌─────────────────────────────────────────────────────────────────────┐
│  [J] JaiMentorship                                                  │
│  "Платформа для поиска менторов и записи на занятия"                │
│                                                                     │
│  Платформа          Аккаунт          Менторам          Информация   │
│  ─ О платформе      ─ Войти          ─ Стать ментором  ─ Конфиденц. │
│  ─ Каталог менторов ─ Регистрация    ─ Статус заявки   ─ Условия    │
│                                                                     │
│  © 2026 JaiMentorship. Все права защищены.                          │
└─────────────────────────────────────────────────────────────────────┘
```

**Changes from current:**
- Add a 4th column "Менторам" containing mentor-specific links (Стать ментором, Статус заявки)
- This cleanly separates the mentor journey from the student journey without cluttering main nav

### 3.4 Private Header (authenticated)

No changes except replacing `MentorHub` wordmark with `JaiMentorship`. The private navigation structure (role-based links) stays identical.

---

## 4. HomePage Block-by-Block Structure

### Current Structure (5 blocks)
1. Hero (badge + heading + CTAs + image)
2. Value Props (3 cards)
3. Steps ("How it works" — 3 steps in brand card)
4. Why MentorHub (4 feature cards)
5. Dual-path CTA (student card + mentor card)

### Proposed Structure (7 blocks)

#### Block 1 — Hero
```
┌────────────────────────────────────────────────────────────────┐
│  [badge] JaiMentorship — платформа для менторов и учеников     │
│                                                                │
│  Найдите ментора и начните                 ┌──────────────┐   │
│  обучение в удобном формате                │              │   │
│                                            │  Hero image  │   │
│  Subtitle text...                          │  (3:4 ratio) │   │
│                                            │              │   │
│  [Найти ментора]  [Зарегистрироваться]     └──────────────┘   │
│                                                                │
│  ✓ 50+ менторов   ✓ Онлайн и офлайн   ✓ Бесплатная запись    │
└────────────────────────────────────────────────────────────────┘
```

**Changes:**
- Add **social proof micro-stats** below CTAs (mentor count, formats, free registration) — simple inline text with checkmarks, no cards
- This replaces the separate "Value Props" section which currently floats awkwardly with negative margin

#### Block 2 — Trust Bar (NEW)
```
┌────────────────────────────────────────────────────────────────┐
│  "Проверенные менторы" │ "Прозрачные цены" │ "Гибкий формат"  │
│   icon + 1-liner       │  icon + 1-liner    │  icon + 1-liner  │
└────────────────────────────────────────────────────────────────┘
```

**Replaces:** Current "Value Props" block. Same content, refined into a cleaner horizontal trust bar with Lucide icons instead of plain text blocks.

#### Block 3 — How It Works
```
┌────────────────────────────────────────────────────────────────┐
│  Как это работает                                              │
│                                                                │
│  ① Выберите ментора  ② Выберите время  ③ Начните обучение     │
│     description          description       description         │
└────────────────────────────────────────────────────────────────┘
```

**Changes:**
- Keep the branded card style (purple bg with white text) — it works
- Ensure step icons use Lucide (Search, Calendar, GraduationCap) instead of plain numbers

#### Block 4 — Featured Mentors Preview (NEW)
```
┌────────────────────────────────────────────────────────────────┐
│  Лучшие менторы                              [Все менторы →]   │
│                                                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ Avatar  │  │ Avatar  │  │ Avatar  │  │ Avatar  │          │
│  │ Name    │  │ Name    │  │ Name    │  │ Name    │          │
│  │ Spec    │  │ Spec    │  │ Spec    │  │ Spec    │          │
│  │ Rating  │  │ Rating  │  │ Rating  │  │ Rating  │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
└────────────────────────────────────────────────────────────────┘
```

**New block.** Shows 4 top-rated mentors fetched from the existing `/api/mentors` endpoint with `sort=ratingDesc&limit=4`. This is the most impactful trust signal. On mobile: horizontal scroll or 2-column grid.

#### Block 5 — Why JaiMentorship (Features)
```
┌────────────────────────────────────────────────────────────────┐
│  Почему JaiMentorship                                          │
│  subtitle...                                                   │
│                                                                │
│  [Feature Card] [Feature Card] [Feature Card] [Feature Card]  │
└────────────────────────────────────────────────────────────────┘
```

**Changes:** Rename title. Keep 4-card grid. Add Lucide icons to each FeatureCard (currently icon-less).

#### Block 6 — Dual-Path CTA (Student vs Mentor)
```
┌────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────┐  ┌──────────────────────┐            │
│  │ 🎓 Я ученик         │  │ 🧑‍🏫 Я ментор          │            │
│  │ ...                 │  │ ...                  │            │
│  │ [Создать аккаунт]   │  │ [Подать заявку]      │            │
│  └─────────────────────┘  └──────────────────────┘            │
└────────────────────────────────────────────────────────────────┘
```

**Changes:** Keep as-is. This is already well-structured. The only change is copy refinement (see Section 7).

#### Block 7 — Final CTA (NEW)
```
┌────────────────────────────────────────────────────────────────┐
│  Готовы начать?                                                │
│  Присоединяйтесь к сотням студентов и менторов...              │
│                                                                │
│  [Найти ментора]  [Зарегистрироваться]                         │
└────────────────────────────────────────────────────────────────┘
```

**Moved from:** AboutPage CTA → HomePage bottom. The AboutPage should have its own unique CTA. HomePage needs a closing CTA after the feature blocks.

### Proposed Block Order Summary

| # | Block | Source | Status |
|---|---|---|---|
| 1 | Hero + inline proof | Existing (refined) | ✏️ Edit |
| 2 | Trust Bar | Existing value props (redesigned) | ✏️ Edit |
| 3 | How It Works | Existing (add icons) | ✏️ Edit |
| 4 | Featured Mentors | **NEW** | 🆕 New |
| 5 | Why JaiMentorship | Existing (rename + icons) | ✏️ Edit |
| 6 | Dual-Path CTA | Existing (copy only) | ✏️ Edit |
| 7 | Final CTA | New (extracted pattern from About) | 🆕 New |

---

## 5. Page Visibility Matrix

### In Public Navigation (header)

| Page | Desktop Nav | Mobile Nav | Footer | Rationale |
|---|---|---|---|---|
| HomePage (`/`) | Logo link | Logo link | Logo link | Always accessible |
| AboutPage (`/about`) | ✅ Link | ❌ | ✅ Footer | Core discovery page |
| MentorDirectoryPage (`/mentors`) | ✅ Link | ❌ | ✅ Footer | Core product page |
| LoginPage (`/login`) | ✅ Text button | ✅ Text button | ✅ Footer | Auth entry |
| RegisterPage (`/register`) | ✅ Filled button | ✅ Filled button | ✅ Footer | Primary CTA |

### CTA-Only (not in nav, accessed from context)

| Page | How it's reached | Footer |
|---|---|---|
| MentorApplyPage (`/mentor/apply`) | HomePage dual-path CTA, Footer "Менторам" column, Register page link | ✅ Footer (Менторам column) |
| MentorApplicationStatusPage | MentorApplyPage success screen, Footer "Менторам" column | ✅ Footer (Менторам column) |
| PublicMentorProfilePage (`/mentors/:id`) | MentorDirectoryPage card click, HomePage featured mentors | ❌ |
| ForgotPasswordPage | LoginPage link | ❌ |
| ResetPasswordPage | Email link | ❌ |
| VerifyEmailPage | Register flow redirect | ❌ |

---

## 6. Journey Separation

### 6.1 Student Journey

```
                    ┌─ HomePage ──────┐
                    │  Hero CTA       │
                    │  "Найти ментора"│
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        /mentors       /register        /login
        (browse)       (sign up)        (sign in)
              │              │              │
              │              ▼              ▼
              │        /verify-email   /student/dashboard
              │              │              │
              │              ▼              ├── /student/profile
              │           /login            ├── /student/bookings
              │              │              │
              ▼              ▼              │
        /mentors/:id ──→ Book slot ────────┘
        (view profile     (requires auth)
         + slots)
```

**Key principle:** The student journey is the **default** journey. All main nav links, hero CTAs, and primary Register button lead to student registration. The product assumes you're a student unless you explicitly choose the mentor path.

### 6.2 Mentor Application Journey

```
                    ┌─ HomePage ─────────────┐
                    │  Dual-path CTA          │
                    │  "Я ментор → Подать     │
                    │   заявку"               │
                    └────────────┬────────────┘
                                 │
                    Also from:   │   Footer "Менторам" column
                    RegisterPage │   "Хотите стать ментором?"
                                 │
                                 ▼
                          /mentor/apply
                          (public form, no auth needed)
                                 │
                                 ▼
                     /mentor/application/status
                     (check with email + token)
                                 │
                        Admin approves ──→ Email with credentials
                                 │
                                 ▼
                              /login
                                 │
                                 ▼
                        /mentor/dashboard
                        ├── /mentor/profile
                        ├── /mentor/slots
                        └── /mentor/bookings
```

**Key principle:** The mentor journey is **opt-in and separate**. It's never confused with student registration. The mentor apply form does NOT require auth — it's a standalone public submission. After admin approval, the mentor receives login credentials.

### 6.3 Separation Tactics

| Tactic | Implementation |
|---|---|
| **Nav exclusion** | Remove "Стать ментором" from header nav |
| **Footer column** | Dedicated "Менторам" footer column |
| **Register page hint** | Keep existing "Хотите стать ментором? → Подать заявку" link on RegisterPage |
| **Dual-path block** | HomePage Block 6 — explicit "Я ученик" / "Я ментор" cards |
| **Visual distinction** | Student CTA = brand purple filled button. Mentor CTA = outlined button with accent color |
| **Copy tone** | Student copy = inviting, easy. Mentor copy = professional, respectful |

---

## 7. Copy Rewrite Priority

### Priority 1 — Brand Name Replacement (mechanical)

All occurrences of "MentorHub" must be replaced with "JaiMentorship". This is a find-and-replace operation across:

| File | Occurrences | Type |
|---|---|---|
| `src/shared/constants/app.ts` | 1 | `APP_NAME` constant |
| `src/shared/i18n/ru.ts` | ~18 | i18n strings |
| `src/shared/i18n/ky.ts` | ~18 | i18n strings |
| `src/app/router/index.ts` | ~20 | route `meta.title` |
| `src/widgets/layout/PublicLayout.vue` | 1 | header wordmark |
| `src/widgets/header/PrivateHeader.vue` | 1 | header wordmark |
| `src/shared/ui/AppFooter.vue` | 2 | footer brand + copyright |
| `index.html` | 2 | `<title>` + meta description |
| `public/site.webmanifest` | 2 | PWA name + short_name |
| `package.json` | 1 | package name |

**Total: ~65 string replacements, all mechanical.**

### Priority 2 — HomePage Copy Polish

| Key | Current | Proposed direction |
|---|---|---|
| `home.heroBadge` | "MentorHub — платформа для менторов и учеников" | "JaiMentorship — обучение с проверенными менторами" |
| `home.heroTitle` | Generic "find a mentor" | Sharper: benefit-first, outcome-oriented |
| `home.heroSubtitle` | Lists filter criteria | Rewrite: focus on trust + ease |
| `home.whyTitle` | "Почему MentorHub" | "Почему JaiMentorship" |
| `home.whySubtitle` | Functional description | Emotional: "Мы создали платформу, которой можно доверять" |

### Priority 3 — About Page Copy

| Area | Issue | Fix |
|---|---|---|
| Title | "MentorHub — платформа ментора и студента" | Update with JaiMentorship + stronger positioning |
| Subtitle | Factual, flat | Add warmth, mention Kyrgyzstan/local context |
| CTA subtitle | Mentions "hundreds of students" (likely not true yet) | Use honest phrasing: "растущее сообщество" |

### Priority 4 — Auth Pages Copy

| Area | Issue | Fix |
|---|---|---|
| Login hero badge | "Добро пожаловать в MentorHub" | "Добро пожаловать в JaiMentorship" |
| Register hero | "Начните путь как ученик на MentorHub" | Update brand name + refine tone |
| Mentor application hero | "Присоединяйтесь к команде MentorHub" | "Присоединяйтесь к команде JaiMentorship" |

### Priority 5 — Default Mentor Headlines (in directory/profiles)

| Key | Current | Proposed |
|---|---|---|
| `mentorDirectory.defaultHeadline` | "Ментор MentorHub" | "Ментор JaiMentorship" |
| `publicMentorProfile.defaultHeadline` | "Ментор MentorHub" | "Ментор JaiMentorship" |

---

## 8. Implementation Order

The implementation should be strictly sequenced to avoid broken states and allow progressive QA.

### Phase 1 — Brand Foundation (no visual changes)
1. Rename `APP_NAME` constant
2. Update `package.json` name
3. Update `index.html` title + meta
4. Update `site.webmanifest`
5. Find-replace all "MentorHub" in `ru.ts`, `ky.ts`
6. Find-replace all "MentorHub" in router `meta.title`

**Result:** All text reads "JaiMentorship" but UI layout is unchanged.

### Phase 2 — Logo & Header
1. Update PublicLayout header: `[M]` → `[J]`, "MentorHub" → "JaiMentorship"
2. Update PrivateHeader: same
3. Update AppFooter: brand mark + copyright
4. Remove "Стать ментором" from PublicLayout desktop nav
5. Add "Менторам" column to footer

**Result:** Navigation reflects new brand and cleaner IA.

### Phase 3 — Color Token Refinements
1. Update `main.css` `@theme` tokens (brand-soft, bg, accent)
2. Update `colors.ts` design tokens to match
3. Visual QA across all pages

**Result:** Subtle color warmth improvement.

### Phase 4 — HomePage Redesign
1. Refine hero block: add inline social proof
2. Convert value props to trust bar with icons
3. Add Lucide icons to "How it works" steps
4. Add Featured Mentors block (new API call, new component)
5. Add icons to FeatureCard / "Why" section
6. Add final CTA block
7. Polish copy (Priority 2 from Section 7)

**Result:** HomePage is the new flagship public page.

### Phase 5 — Copy Polish Pass
1. Rewrite About page copy
2. Rewrite auth page hero copy
3. Update default mentor headlines
4. Review all i18n strings for consistency (both ky and ru)

**Result:** All public-facing copy is polished and on-brand.

### Phase 6 — PWA & Metadata
1. Regenerate favicon set with `J` mark
2. Update `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `maskable-512.png`
3. Update `favicon.svg`, `favicon-32x32.png`, `favicon-16x16.png`

**Result:** Complete brand presence in browser tabs, PWA installs, and bookmarks.

---

## 9. Recommended Commit Split

Each commit should be independently deployable and QA-able.

```
feat(brand): rename MentorHub → JaiMentorship in constants and package.json
feat(brand): update index.html meta and site.webmanifest
feat(i18n): replace MentorHub → JaiMentorship in ru.ts
feat(i18n): replace MentorHub → JaiMentorship in ky.ts
feat(router): update all route meta titles to JaiMentorship
feat(layout): rebrand PublicLayout header wordmark and icon
feat(layout): rebrand PrivateHeader wordmark
feat(layout): rebrand AppFooter + add Менторам column
feat(nav): remove "Стать ментором" from public header nav
feat(tokens): refine color tokens (brand-soft, bg, accent)
feat(home): add social proof line to hero block
feat(home): redesign value props as trust bar with icons
feat(home): add Lucide icons to How It Works steps
feat(home): add Featured Mentors preview block
feat(home): add icons to Why section FeatureCards
feat(home): add final CTA block
feat(copy): polish HomePage i18n copy (ru + ky)
feat(copy): polish AboutPage i18n copy (ru + ky)
feat(copy): polish auth pages i18n copy (ru + ky)
feat(copy): update default mentor headlines
feat(pwa): regenerate favicon and icon set with J mark
```

**Total: ~21 atomic commits across 6 phases.**

---

## Appendix A — Files Affected (Complete Inventory)

| File | Phase | Change Type |
|---|---|---|
| `package.json` | 1 | name field |
| `index.html` | 1 | title, meta description |
| `public/site.webmanifest` | 1, 6 | name, short_name, icons |
| `src/shared/constants/app.ts` | 1 | APP_NAME |
| `src/shared/i18n/ru.ts` | 1, 4, 5 | ~65 strings |
| `src/shared/i18n/ky.ts` | 1, 4, 5 | ~65 strings |
| `src/app/router/index.ts` | 1 | ~20 meta.title strings |
| `src/widgets/layout/PublicLayout.vue` | 2 | header brand, nav links |
| `src/widgets/header/PrivateHeader.vue` | 2 | header brand |
| `src/shared/ui/AppFooter.vue` | 2 | brand mark, copyright, new column |
| `src/assets/main.css` | 3 | @theme color tokens |
| `src/shared/design-system/colors.ts` | 3 | token values |
| `src/pages/public/HomePage.vue` | 4 | new blocks, restructure |
| `src/shared/ui/FeatureCard.vue` | 4 | add icon prop |
| `src/shared/ui/FeaturedMentorCard.vue` | 4 | **NEW FILE** |
| `public/favicon.svg` | 6 | new J mark |
| `public/favicon-*.png` | 6 | regenerated |
| `public/icon-*.png` | 6 | regenerated |
| `public/apple-touch-icon.png` | 6 | regenerated |
| `public/maskable-512.png` | 6 | regenerated |

## Appendix B — Strings Containing "MentorHub" (Exhaustive)

### In `ru.ts` (18 occurrences)
- `common.appName`
- `auth.loginHeroBadge`
- `auth.registerSubtitle`
- `auth.registerHeroBadge`
- `auth.registerHeroTitle`
- `auth.verifyHeroTitle`
- `mentorApplication.heroBadge`
- `home.heroBadge`
- `home.whyTitle`
- `forgotPassword.heroTitle`
- `about.title`
- `about.ctaSubtitle`
- `mentorDirectory.defaultHeadline`
- `publicMentorProfile.defaultHeadline`

### In `ky.ts` (18 occurrences — mirrors ru.ts)
- Same keys as above

### In router `meta.title` (~20 occurrences)
- Every route's `meta.title` contains "— MentorHub"

### In Vue templates (4 hardcoded occurrences)
- `PublicLayout.vue` — header wordmark text
- `PrivateHeader.vue` — header wordmark text
- `AppFooter.vue` — footer brand text
- `AppFooter.vue` — copyright line

### In config files (4 occurrences)
- `package.json` — `name` field
- `index.html` — `<title>` and `<meta name="description">`
- `site.webmanifest` — `name` and `short_name`

---

*End of specification.*

