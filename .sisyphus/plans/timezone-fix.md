# Timezone Fix: UTC vs UTC+7 (WIB) Mismatch in Report Summary

## TL;DR

> **Quick Summary**: Backend report menggunakan `new Date()` server (UTC) untuk compute batas awal/akhir hari, sehingga transaksi yang dibuat jam 00:00–06:59 WIB (= T17:00–T23:59Z hari sebelumnya di UTC) tidak terhitung dalam periode report yang benar. Fix dengan membuat semua date range computation timezone-aware menggunakan `Asia/Jakarta`.
>
> **Deliverables**:
> - Konstanta `APP_TIMEZONE = 'Asia/Jakarta'` terpusat
> - `time.ts` refactored — semua helpers timezone-aware (UTC+7)
> - `transaction.repository.ts` date filter diperbaiki
> - Debug `console.log` dihapus dari `report.service.ts`
> - Unit tests TDD untuk semua period types + edge cases
>
> **Estimated Effort**: Short  
> **Parallel Execution**: YES — 2 waves  
> **Critical Path**: Task 1 (setup) → Task 2 (tests merah) → Task 3 (fix time.ts) → Task 4 (fix repository) → Task 5 (cleanup)

---

## Context

### Original Request
FE kirim data transaction menggunakan device timezone (UTC+7 WIB via `toISOString()`). Backend report summary menggunakan `new Date()` server time (UTC) untuk compute `startOfDay`/`endOfDay`, sehingga boundary salah dan transaksi jam 00:00–06:59 WIB tidak masuk ke report hari yang benar.

### Interview Summary
**Key Discussions**:
- FE kirim date sebagai UTC ISO string (`toISOString()`) dari device timezone user
- DB menyimpan sebagai `timestamptz` (UTC absolute) — sudah benar, tidak perlu migration
- Bug utama: `new Date()` di server UTC → `startOfDay` UTC midnight bukan WIB midnight
- Bug secondary: `DATE(timestamptz)` di PostgreSQL pakai DB session UTC timezone

**Research Findings**:
- `date-fns@^4.1.0` digunakan — `date-fns-tz` v3 TIDAK kompatibel, harus pakai `@date-fns/tz`
- `@date-fns/tz` native untuk date-fns v4, gunakan `TZDate` class
- Zero existing tests — perlu setup `bun test` terlebih dahulu
- Debug `console.log` di `report.service.ts:171,187` perlu dihapus

### Metis Review
**Identified Gaps** (addressed):
- Incompatibility `date-fns-tz` v3 + date-fns v4 → Resolved: gunakan `@date-fns/tz` native
- Perlu konstanta terpusat untuk timezone → Resolved: buat `constants/time.ts`
- No test infrastructure → Resolved: Task 1 setup bun test
- `pocket-budget.service.ts` ada bug serupa → Resolved: di-defer ke issue terpisah, di luar scope PR ini

---

## Work Objectives

### Core Objective
Perbaiki semua fungsi date range computation di backend agar menggunakan timezone `Asia/Jakarta` (UTC+7), sehingga boundary hari/bulan/minggu sesuai dengan perspektif user WIB.

### Concrete Deliverables
- `packages/backend/src/utils/constants/time.ts` — timezone constant
- `packages/backend/src/utils/helpers/time.ts` — refactored timezone-aware
- `packages/backend/src/utils/helpers/time.test.ts` — unit tests semua period types
- `packages/backend/src/modules/transaction/transaction.repository.ts` — date filter diperbaiki
- `packages/backend/src/modules/report/report.service.ts` — console.log dihapus

### Definition of Done
- [ ] `bun test` runs and all tests pass
- [ ] Transaksi `2026-04-07T00:30:00Z` (= 07:30 WIB Apr 7) terhitung dalam range "today" ketika today = Apr 7 WIB
- [ ] Transaksi `2026-04-06T16:30:00Z` (= 23:30 WIB Apr 6) terhitung dalam range "today" ketika today = Apr 6 WIB
- [ ] `tsc --noEmit` tanpa error di `packages/backend`
- [ ] Tidak ada `console.log` di `report.service.ts`

### Must Have
- `APP_TIMEZONE = 'Asia/Jakarta'` sebagai konstanta terpusat, tidak hardcode string 'Asia/Jakarta' di mana-mana
- Semua boundary start/end hari dikembalikan sebagai UTC `Date` instants (bukan string, bukan local Date)
- Unit tests membuktikan edge case: transaksi jam 23:30 WIB = hari yang sama, bukan hari berikutnya
- Unit tests TDD: tulis dulu tests yang FAIL, baru fix (TDD RED → GREEN)

### Must NOT Have (Guardrails)
- JANGAN install `date-fns-tz` — tidak kompatibel dengan date-fns v4, gunakan `@date-fns/tz`
- JANGAN modifikasi database schema atau migration apa pun — `timestamptz` sudah benar
- JANGAN ubah `DateRange` / `DateRangeComparison` types — hanya internal values yang berubah
- JANGAN tambahkan per-user timezone support — hardcode `Asia/Jakarta` via konstanta
- JANGAN sentuh `auth.service.ts`, `cron.service.ts`, `transaction.utils.ts` — ketiganya pakai relative time, bukan day-boundary
- JANGAN fix `pocket-budget.service.ts` dalam PR ini — defer ke issue terpisah
- JANGAN ubah frontend code

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO — perlu setup
- **Automated tests**: TDD (RED → GREEN)
- **Framework**: `bun test` (built-in Bun test runner, tidak perlu install)
- **TDD**: Task 2 = RED (failing tests), Task 3 = GREEN (passing tests)

### QA Policy
- Backend-only fix: gunakan `bun test` + `curl` untuk verification
- Unit tests untuk `time.ts` semua period types + edge cases
- Integration QA via `curl` ke running server untuk verify report counts

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - setup + tests merah):
├── Task 1: Setup timezone constant + bun test infrastructure [quick]
└── Task 2: Tulis failing unit tests untuk time.ts (TDD RED) [quick]
    Note: Task 2 depends on Task 1

Wave 2 (After Wave 1 - implementation fixes, dapat berjalan parallel):
├── Task 3: Refactor time.ts — timezone-aware date ranges (TDD GREEN) [quick]
├── Task 4: Fix transaction.repository.ts date filter [quick]
└── Task 5: Hapus console.log dari report.service.ts [quick]

Critical Path: Task 1 → Task 2 → Task 3 → Task 4
Parallel: Task 3, 4, 5 bisa parallel (Task 3 harus selesai dulu untuk verify tests)
Note: Task 4 dan 5 independen, bisa dijalankan parallel
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1 | — | 2, 3, 4, 5 |
| 2 | 1 | 3 |
| 3 | 2 | Final verify |
| 4 | 1 | Final verify |
| 5 | 1 | Final verify |

### Agent Dispatch Summary

- **Wave 1**: Task 1 → `quick`, Task 2 → `quick`
- **Wave 2**: Task 3 → `quick`, Task 4 → `quick`, Task 5 → `quick`

---

## TODOs

- [x] 1. Setup: tambah `APP_TIMEZONE` constant + `bun test` infrastructure + install `@date-fns/tz`

  **What to do**:
  - Tambah `APP_TIMEZONE = 'Asia/Jakarta'` ke `packages/backend/src/utils/constants/time.ts` (file sudah ada, hanya append constant baru)
  - Install `@date-fns/tz` via `bun add @date-fns/tz` di `packages/backend` — ini package terpisah yang bundled dengan date-fns v4, BUKAN `date-fns-tz`
  - Tambah script `"test": "bun test"` ke `packages/backend/package.json` (saat ini tidak ada script test)
  - Verifikasi `@date-fns/tz` tersedia dengan cek: `import { TZDate } from '@date-fns/tz'` harus resolve

  **Must NOT do**:
  - JANGAN install `date-fns-tz` — tidak kompatibel dengan date-fns v4
  - JANGAN modifikasi existing constants di `time.ts` — hanya append
  - JANGAN upgrade/downgrade `date-fns` version

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Setup murni — tambah constant, install dep, tambah script. Tidak ada logic kompleks.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (sequential — Task 2 depends on ini)
  - **Blocks**: Task 2, 3, 4, 5
  - **Blocked By**: None (mulai langsung)

  **References**:
  - `packages/backend/src/utils/constants/time.ts:1-16` — file yang perlu dimodifikasi (append `APP_TIMEZONE`)
  - `packages/backend/package.json:1-26` — tambah `"test"` script di `"scripts"`, `@date-fns/tz` masuk ke `dependencies`
  - `@date-fns/tz` docs: https://date-fns.org/v4/docs/TZDate — `TZDate` adalah class utama yang akan dipakai di Task 3

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Verify @date-fns/tz dapat diimport
    Tool: Bash (bun repl)
    Steps:
      1. cd packages/backend
      2. bun -e "import { TZDate } from '@date-fns/tz'; console.log(new TZDate(new Date(), 'Asia/Jakarta').toISOString())"
    Expected Result: Tidak ada error, output berupa ISO string yang valid
    Evidence: Terminal output (screenshot/paste)

  Scenario: Verify APP_TIMEZONE constant tersedia
    Tool: Bash
    Steps:
      1. cd packages/backend
      2. bun -e "import { APP_TIMEZONE } from './src/utils/constants/time'; console.log(APP_TIMEZONE)"
    Expected Result: Output: "Asia/Jakarta"
    Evidence: Terminal output

  Scenario: Verify bun test runner berjalan
    Tool: Bash
    Steps:
      1. cd packages/backend
      2. bun test (akan kosong / 0 tests ditemukan karena belum ada test file)
    Expected Result: Bun test exits 0 (tidak error fatal — no tests found is OK)
    Evidence: Terminal output
  ```

  **Commit**: YES
  - Message: `feat(backend): add APP_TIMEZONE constant and bun test infrastructure`
  - Files: `packages/backend/src/utils/constants/time.ts`, `packages/backend/package.json`

- [x] 2. TDD RED: Tulis failing unit tests untuk semua timezone-aware date range scenarios

  **What to do**:
  - Buat file baru `packages/backend/src/utils/helpers/time.test.ts`
  - Tulis test suite menggunakan Bun's built-in test runner (`import { describe, it, expect } from 'bun:test'`)
  - Semua test HARUS FAIL dulu — ini adalah TDD RED phase, membuktikan bug ada
  - Test cases yang WAJIB ada:

  **Test Case 1 — Bug reproduction (transaksi jam 07:30 WIB = T00:30Z)**:
  ```
  Input: now = new Date('2026-04-07T00:30:00.000Z')  // 07:30 WIB Apr 7
  getTodayRange(now) should return:
    start = new Date('2026-04-06T17:00:00.000Z')  // 00:00 WIB Apr 7 = T17:00Z Apr 6
    end   = new Date('2026-04-07T16:59:59.999Z')  // 23:59:59 WIB Apr 7
  ```

  **Test Case 2 — Edge case: jam 23:30 WIB = T16:30Z, masih hari yang sama**:
  ```
  Input: now = new Date('2026-04-06T16:30:00.000Z')  // 23:30 WIB Apr 6
  getTodayRange(now) should return:
    start = new Date('2026-04-06T17:00:00.000Z')  // 00:00 WIB Apr 6 ... WAIT
    // Jika now adalah T16:30Z = 23:30 WIB Apr 6
    // maka startOfDay WIB Apr 6 = T17:00Z Apr 5... bukan Apr 6
    // KOREKSI:
    start = new Date('2026-04-05T17:00:00.000Z')  // 00:00 WIB Apr 6
    end   = new Date('2026-04-06T16:59:59.999Z')  // 23:59:59 WIB Apr 6
  ```

  **Test Case 3 — getLast7DaysRange**: Verifikasi period 7 hari pakai WIB boundary

  **Test Case 4 — getLast30DaysRange**: Verifikasi period 30 hari

  **Test Case 5 — getMonthToDateRange**: Start = awal bulan WIB, end = sekarang WIB

  **Test Case 6 — getFullMonthRange**: Full bulan WIB (Jan = T31 Des T17:00Z hingga T31 Jan T16:59:59Z)

  **Test Case 7 — getCustomRange**: startDate dan endDate dikonversi ke WIB boundary

  CATATAN: Karena `getDateRangeComparison` memanggil `new Date()` internal, perlu refactor signature untuk menerima `now` sebagai parameter opsional (untuk testability). Ini sudah ada untuk fungsi internal, tapi BUKAN untuk `getDateRangeComparison` sendiri. Untuk test Task 2, bisa test fungsi internal (`getTodayRange`, etc.) secara langsung dengan mem-export mereka, ATAU perlu modifikasi minimal di `getDateRangeComparison` untuk menerima `now?: Date` param (bukan breaking change). Diskusikan dengan implementor: **export internal functions atau modifikasi signature** — pilih yang lebih clean.

  **Must NOT do**:
  - JANGAN implement fix di task ini — tests harus merah dulu
  - JANGAN hardcode timezone logic di test — import `APP_TIMEZONE` dari constants

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Menulis test cases berdasarkan spec yang sudah jelas, tidak ada ambiguitas logic
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends Task 1)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References**:
  - `packages/backend/src/utils/helpers/time.ts:16-167` — fungsi yang akan di-test (lihat signatures)
  - `packages/backend/src/utils/constants/time.ts` — import `APP_TIMEZONE` dan `DATE_RANGE_PERIOD`
  - Bun test docs: https://bun.sh/docs/cli/test — `describe`, `it`, `expect`, `beforeEach`
  - Contoh: `new Date('2026-04-07T00:30:00.000Z')` sebagai `now` untuk simulate waktu server

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: bun test harus FAIL (membuktikan bug ada)
    Tool: Bash
    Steps:
      1. cd packages/backend
      2. bun test src/utils/helpers/time.test.ts
    Expected Result: Tests FAIL dengan error seperti:
      "Expected: 2026-04-06T17:00:00.000Z, Received: 2026-04-07T00:00:00.000Z"
      (karena current impl pakai UTC midnight bukan WIB midnight)
    Failure Indicators: Jika semua tests PASS di sini, berarti test cases salah
    Evidence: Terminal output (paste the failing test output)
  ```

  **Commit**: YES
  - Message: `test(backend): add failing TDD tests for WIB-timezone date ranges`
  - Files: `packages/backend/src/utils/helpers/time.test.ts`

- [x] 3. TDD GREEN: Refactor `time.ts` — timezone-aware date range computation (Asia/Jakarta)

  **What to do**:
  - Import `TZDate` dari `@date-fns/tz`
  - Import `APP_TIMEZONE` dari `../../utils/constants/time`
  - Ubah semua fungsi helper untuk menggunakan `TZDate` saat membuat/memanipulasi dates:
    ```typescript
    // SEBELUM (UTC-based):
    const start = startOfDay(now);  // midnight UTC
    
    // SESUDAH (WIB-based):
    import { TZDate } from '@date-fns/tz';
    const nowInJakarta = new TZDate(now, APP_TIMEZONE);
    const start = startOfDay(nowInJakarta);  // midnight WIB → returns TZDate UTC instant
    ```
  - Fungsi yang harus diubah (semua di `time.ts`):
    - `getTodayRange` (line 16) — `startOfDay`/`endOfDay` harus WIB-aware
    - `getLast7DaysRange` (line 36) — `endOfDay` + `startOfDay(subDays(...))` harus WIB-aware
    - `getLast30DaysRange` (line 54) — sama
    - `getMonthToDateRange` (line 72) — `startOfMonth` + `endOfDay` harus WIB-aware
    - `getFullMonthRange` (line 90) — `startOfMonth` + `endOfMonth` harus WIB-aware
    - `getCustomRange` (line 108) — `startOfDay`/`endOfDay` harus WIB-aware
  - `getDateRangeComparison` (line 130-167) — `const now = new Date()` harus diganti ke WIB-aware: `new TZDate(new Date(), APP_TIMEZONE)` atau pass `now` sebagai TZDate
  - Return types tetap `DateRange { start: Date, end: Date }` — `TZDate` extends `Date`, sehingga compatible
  - Modifikasi signature `getDateRangeComparison` untuk testability: tambahkan parameter opsional `now?: Date` (default `new Date()`)

  **Must NOT do**:
  - JANGAN menggunakan `toZonedTime`/`fromZonedTime` dari `date-fns-tz` — pakai `TZDate` native v4
  - JANGAN ubah return types `DateRange` / `DateRangeComparison`
  - JANGAN hardcode string `'Asia/Jakarta'` — gunakan `APP_TIMEZONE` constant

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Scope jelas — refactor satu file dengan pattern yang sudah didefinisikan (TZDate wrap). Tests sudah ada sebagai guardrail.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends Task 2 — tests harus ada dulu untuk verify GREEN)
  - **Parallel Group**: Wave 2 (jalankan dulu Task 3, kemudian 4 dan 5 bisa parallel)
  - **Blocks**: Final verification
  - **Blocked By**: Task 2

  **References**:
  - `packages/backend/src/utils/helpers/time.ts:1-167` — file yang dimodifikasi
  - `packages/backend/src/utils/constants/time.ts` — import `APP_TIMEZONE`
  - `packages/backend/src/utils/helpers/time.test.ts` — tests yang harus di-pass (TDD GREEN)
  - `@date-fns/tz` TZDate API: https://date-fns.org/v4/docs/TZDate
    - `new TZDate(date, timezone)` — buat timezone-aware Date
    - `TZDate` extends `Date` natively — return types compatible

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: bun test PASS (TDD GREEN)
    Tool: Bash
    Steps:
      1. cd packages/backend
      2. bun test src/utils/helpers/time.test.ts
    Expected Result: All tests PASS (0 failures)
      Output: "Passed: 7" (atau lebih)
    Failure Indicators: Jika masih ada failure, bug belum terfix
    Evidence: Terminal output (paste the passing test output)

  Scenario: TypeScript tidak ada error
    Tool: Bash
    Steps:
      1. cd packages/backend
      2. bun tsc --noEmit 2>&1
    Expected Result: 0 errors, 0 warnings dari file time.ts
    Evidence: Terminal output

  Scenario: Boundary check manual via bun REPL
    Tool: Bash
    Steps:
      1. cd packages/backend
      2. bun -e "
        import { getDateRangeComparison } from './src/utils/helpers/time';
        import { DATE_RANGE_PERIOD } from './src/utils/constants/time';
        // Simulate: now = 2026-04-07T00:30:00Z (07:30 WIB Apr 7)
        const now = new Date('2026-04-07T00:30:00.000Z');
        const { current } = getDateRangeComparison(DATE_RANGE_PERIOD.today, undefined, undefined, now);
        console.log('start:', current.start.toISOString());
        console.log('end:', current.end.toISOString());
      "
    Expected Result:
      start: 2026-04-06T17:00:00.000Z  (midnight WIB Apr 7 = T17:00Z Apr 6)
      end:   2026-04-07T16:59:59.999Z  (23:59:59 WIB Apr 7)
    Evidence: Terminal output
  ```

  **Commit**: YES
  - Message: `fix(backend): make date range helpers timezone-aware (Asia/Jakarta)`
  - Files: `packages/backend/src/utils/helpers/time.ts`
  - Pre-commit: `cd packages/backend && bun test`

- [x] 4. Fix `transaction.repository.ts` — ganti `DATE()` SQL filter dengan UTC instant comparison

  **What to do**:
  - Di `buildListConditions` (line 110-167), ganti filter `startDate` dan `endDate` (lines 144-160)
  - Hapus `import { format } from 'date-fns'` (line 1) — tidak lagi dipakai setelah fix
  - **SEBELUM** (bug):
    ```typescript
    // Bug: DATE(timestamptz) pakai DB UTC timezone
    // Bug: format() pakai Node.js process timezone
    gte(sql`DATE(${transactionsTable.date})`, format(params.startDate, 'yyyy-MM-dd'))
    lte(sql`DATE(${transactionsTable.date})`, format(params.endDate, 'yyyy-MM-dd'))
    ```
  - **SESUDAH** (fix): Gunakan direct UTC instant comparison — convert startDate/endDate ke WIB day boundaries, lalu compare sebagai timestamptz:
    ```typescript
    import { TZDate } from '@date-fns/tz';
    import { startOfDay, endOfDay } from 'date-fns';
    import { APP_TIMEZONE } from '../../utils/constants/time';

    // startDate yang diterima sudah berupa Date object
    // Konversi ke WIB start-of-day → end-of-day sebagai UTC instants
    if (params.startDate) {
      const startBoundary = startOfDay(new TZDate(params.startDate, APP_TIMEZONE));
      conditions.push(gte(transactionsTable.date, startBoundary));
    }

    if (params.endDate) {
      const endBoundary = endOfDay(new TZDate(params.endDate, APP_TIMEZONE));
      conditions.push(lte(transactionsTable.date, endBoundary));
    }
    ```
  - Ini mengganti string date comparison dengan timestamptz comparison — lebih akurat dan timezone-aware

  **Must NOT do**:
  - JANGAN gunakan `format()` dari `date-fns` untuk date string comparison — sudah deprecated di sini
  - JANGAN gunakan `DATE()` PostgreSQL bare — timezone tidak safe
  - JANGAN ubah signature `buildListConditions` atau `PayloadGetTransactions` types

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Replace 2 SQL conditions dengan pattern yang sudah jelas. Logic sederhana.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (bisa parallel dengan Task 5 setelah Task 1 selesai)
  - **Parallel Group**: Wave 2 (dengan Task 5)
  - **Blocks**: Final verification
  - **Blocked By**: Task 1 (butuh `APP_TIMEZONE` dan `@date-fns/tz`)

  **References**:
  - `packages/backend/src/modules/transaction/transaction.repository.ts:144-160` — kode yang diganti
  - `packages/backend/src/modules/transaction/transaction.repository.ts:1` — hapus `import { format }` jika tidak lagi dipakai
  - `packages/backend/src/utils/constants/time.ts` — import `APP_TIMEZONE`
  - `packages/backend/src/utils/helpers/time.ts:108-113` — lihat `getCustomRange` sebagai referensi pattern TZDate + startOfDay
  - `packages/backend/src/modules/transaction/types.ts` — cek type `PayloadGetTransactions.startDate` / `.endDate` untuk pastikan `Date` bukan `string`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: TypeScript compile OK
    Tool: Bash
    Steps:
      1. cd packages/backend
      2. bun tsc --noEmit 2>&1 | grep transaction.repository
    Expected Result: Tidak ada error di transaction.repository.ts
    Evidence: Terminal output

  Scenario: Query conditions menggunakan timestamptz comparison bukan DATE() string
    Tool: Bash (bun REPL / grep)
    Steps:
      1. grep -n "DATE(" packages/backend/src/modules/transaction/transaction.repository.ts
    Expected Result: Tidak ada hasil (0 matches) — DATE() sudah dihapus
    Evidence: Terminal output (empty)

  Scenario: format() dari date-fns tidak lagi dipakai
    Tool: Bash
    Steps:
      1. grep -n "format" packages/backend/src/modules/transaction/transaction.repository.ts
    Expected Result: Tidak ada hasil — `import { format }` dan usage sudah dihapus
    Evidence: Terminal output (empty)
  ```

  **Commit**: YES
  - Message: `fix(backend): replace DATE() SQL filter with timezone-aware instant comparison`
  - Files: `packages/backend/src/modules/transaction/transaction.repository.ts`

- [x] 5. Hapus `console.log` debug statements dari `report.service.ts`

  **What to do**:
  - Hapus baris 171: `console.log(startDate, endDate);`
  - Hapus baris 187: `console.log('query', query.toSQL());`
  - Tidak ada perubahan logic, hanya hapus debug logs

  **Must NOT do**:
  - JANGAN ubah logic query atau method apapun
  - JANGAN tambahkan kode baru

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Trivial — delete 2 lines
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (parallel dengan Task 4)
  - **Parallel Group**: Wave 2 (dengan Task 4)
  - **Blocks**: Final verification
  - **Blocked By**: Task 1

  **References**:
  - `packages/backend/src/modules/report/report.service.ts:171,187` — dua baris yang dihapus

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Tidak ada console.log di report.service.ts
    Tool: Bash
    Steps:
      1. grep -n "console.log" packages/backend/src/modules/report/report.service.ts
    Expected Result: Tidak ada hasil (0 matches)
    Evidence: Terminal output (empty)
  ```

  **Commit**: YES
  - Message: `chore(backend): remove debug console.log from report.service`
  - Files: `packages/backend/src/modules/report/report.service.ts`

---

## Final Verification Wave

- [x] F1. **Plan Compliance Audit** — `oracle`
  Baca plan end-to-end. Verifikasi: semua "Must Have" ada di code (baca file terkait). Cari "Must NOT have" di codebase — jika `date-fns-tz` (non-`@date-fns/tz`) di-import, reject. Cek `console.log` sudah dihapus dari `report.service.ts`. Verify `APP_TIMEZONE` dipakai konsisten.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `cd packages/backend && bun test`. Run `cd packages/backend && bun tsc --noEmit`. Review semua file yang diubah: tidak ada `as any`, tidak ada `@ts-ignore`, tidak ada `console.log` di production code.
  Output: `Build [PASS/FAIL] | Tests [N pass/N fail] | VERDICT`

- [x] F3. **Functional QA** — `unspecified-high`
  Jalankan backend (`bun dev` atau equivalent). Buat test transaction untuk tanggal hari ini jam 00:30 WIB (= kirim UTC T17:30Z hari sebelumnya). Curl ke report summary endpoint `GET /api/reports/summary?period=today`. Verifikasi transaksi tersebut terhitung. Test juga period `this_month` dan `last_7_days`.
  Output: `Today report [PASS/FAIL] | Monthly [PASS/FAIL] | Weekly [PASS/FAIL] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  Check git diff — hanya file yang disebutkan di plan yang berubah. Tidak ada perubahan di `pocket-budget.service.ts`, `auth.service.ts`, `cron.service.ts`. Tidak ada schema migration. Tidak ada frontend changes.
  Output: `Scope [CLEAN/N violations] | VERDICT`

---

## Commit Strategy

- **Commit 1** (Task 1): `feat(backend): add APP_TIMEZONE constant and bun test setup`
  - `packages/backend/src/utils/constants/time.ts`
  - `packages/backend/package.json` (test script + @date-fns/tz dep)
- **Commit 2** (Task 2): `test(backend): add failing TDD tests for timezone-aware date ranges`
  - `packages/backend/src/utils/helpers/time.test.ts`
- **Commit 3** (Task 3): `fix(backend): make date range helpers timezone-aware (Asia/Jakarta)`
  - `packages/backend/src/utils/helpers/time.ts`
  - Pre-commit: `cd packages/backend && bun test`
- **Commit 4** (Task 4): `fix(backend): replace DATE() SQL filter with UTC instant range comparison`
  - `packages/backend/src/modules/transaction/transaction.repository.ts`
- **Commit 5** (Task 5): `chore(backend): remove debug console.log from report.service`
  - `packages/backend/src/modules/report/report.service.ts`

---

## Success Criteria

### Verification Commands
```bash
# Run in packages/backend
bun test  # Expected: all tests pass (0 failures)
bun tsc --noEmit  # Expected: 0 errors

# API spot check (server harus berjalan)
# Buat transaksi dengan tanggal "today" di WIB tapi dikirim sebagai UTC T17:30Z hari sebelumnya
# Kemudian cek report summary today — harus include transaksi tersebut
```

### Final Checklist
- [ ] `APP_TIMEZONE` constant dipakai di semua date computation
- [ ] `startOfDay` / `endOfDay` menghasilkan WIB-correct UTC instants
- [ ] Transaction repository filter tidak pakai `DATE()` PostgreSQL bare
- [ ] `console.log` di `report.service.ts` sudah dihapus
- [ ] `bun test` 100% pass
- [ ] `tsc --noEmit` 0 errors
