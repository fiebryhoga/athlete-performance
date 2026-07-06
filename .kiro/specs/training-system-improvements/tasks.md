# Implementation Plan: Training System Improvements

## Overview

This plan implements four major improvement areas for the Athlete Performance Tracking System (Laravel 12 + Inertia.js + React 18): photo evidence storage fix for group training, PDF export system (per-session and microcycle batch), session recap interface enhancement, and UI/UX theme consistency with multi-language completeness. Tasks are ordered to build incrementally — database and service foundations first, then business logic, then frontend, then wiring.

## Tasks

- [ ] 1. Database migrations and model setup
  - [ ] 1.1 Create `microcycles` table migration
    - Create migration file with `id`, `coach_id`, `name`, `start_date`, `end_date`, `notes`, timestamps
    - Add `FOREIGN KEY (coach_id) REFERENCES users(id) ON DELETE CASCADE`
    - _Requirements: 3.1_

  - [ ] 1.2 Create `microcycle_training_sessions` pivot table migration
    - Create migration with `microcycle_id`, `individual_training_id`, `group_training_id`, `sort_order`
    - Add `ON DELETE RESTRICT` foreign keys to individual_trainings and group_trainings
    - Add `ON DELETE CASCADE` on microcycle_id
    - _Requirements: 3.1, 10.4_

  - [ ] 1.3 Create `pdf_cache` table migration
    - Create migration with `cache_key` (UNIQUE), `file_path`, `expires_at`, timestamps
    - Add indexes on `cache_key` and `expires_at`
    - _Requirements: 9.8_

  - [ ] 1.4 Add `language_preference` column to `users` table migration
    - Add `language_preference VARCHAR(10) NOT NULL DEFAULT 'id'` to users table
    - _Requirements: 6.7_

  - [ ] 1.5 Create Eloquent models: `Microcycle` and `MicrocycleTrainingSession`
    - `Microcycle` model with `coach()`, `sessions()` relationships via pivot
    - `MicrocycleTrainingSession` model with `microcycle()`, `individualTraining()`, `groupTraining()` relationships
    - Add `microcycles()` relationship to `User` model (as coach)
    - _Requirements: 3.1_

  - [ ] 1.6 Create `PdfCache` Eloquent model
    - Implement `isExpired()` helper and `cacheKey` lookup scope
    - _Requirements: 9.8_

- [ ] 2. Photo upload service and fix
  - [ ] 2.1 Create `PhotoUploadService` class
    - Implement `store(UploadedFile $file, int $athleteId): string` method
    - Add MIME type validation using `$file->getMimeType()` — allow only `image/jpeg`, `image/png`, `image/webp`
    - Add file extension validation — allow only `jpg`, `jpeg`, `png`, `webp`
    - Add file size validation — reject files exceeding 10,485,760 bytes
    - Store validated file to `proofs/{athleteId}/{filename}` on `public` disk
    - Implement `delete(string $path, GroupTrainingMember $member): void` method
    - Throw `PhotoValidationException` for type/size failures
    - Throw `PhotoStorageException` for filesystem failures
    - _Requirements: 1.1, 1.2, 1.6, 1.7, 1.8, 10.5, 10.8_

  - [ ]* 2.2 Write property test for `PhotoUploadService` validation (Property 1)
    - **Property 1: Photo upload type validation rejects invalid files**
    - Generate random MIME types and extensions; verify only `{jpeg/png/webp}` combinations pass
    - **Validates: Requirements 1.7, 10.8**

  - [ ]* 2.3 Write property test for `PhotoUploadService` size validation (Property 2)
    - **Property 2: Photo upload size validation is enforced**
    - Generate files of various sizes; verify files > 10MB are always rejected before storage
    - **Validates: Requirements 1.8**

  - [ ] 2.4 Add image compression to `PhotoUploadService` using `Intervention/Image`
    - Resize uploaded image to max 1920×1080 maintaining aspect ratio
    - Encode at quality ≥ 85
    - _Requirements: 9.6_

  - [ ]* 2.5 Write property test for image compression (Property 22)
    - **Property 22: Image compression maintains quality and dimension bounds**
    - Generate images of random dimensions; verify stored image dimensions ≤ 1920×1080
    - **Validates: Requirements 9.6**

  - [ ] 2.6 Fix group training photo upload in `GroupTrainingController`
    - Extract file handling from `completeTraining()` into `PhotoUploadService`
    - Use `updateOrCreate` on `GroupTrainingMember` for concurrent-safe upsert
    - Dispatch `RetryPhotoUploadJob` when `PhotoStorageException` is thrown (filesystem unavailable)
    - Return HTTP 202 with queued message when filesystem is unavailable
    - _Requirements: 1.1, 1.2, 8.3, 8.5, 8.6_

  - [ ]* 2.7 Write property test for concurrent upload isolation (Property 25)
    - **Property 25: Concurrent uploads maintain per-athlete data isolation**
    - Simulate N concurrent uploads from N distinct athletes; verify each member record has only their own file path
    - **Validates: Requirements 8.6**

  - [ ] 2.8 Create `RetryPhotoUploadJob` background job
    - Implement `ShouldQueue` with `$tries = 3` and `$backoff = 60`
    - Re-attempt `PhotoUploadService::store()` using temp file path
    - _Requirements: 8.5_

  - [ ] 2.9 Fix frontend group training completion form
    - In the group training completion Inertia form, ensure `useForm` uses `forceFormData: true`
    - Validate that file input submits correctly as multipart
    - _Requirements: 1.1_

- [ ] 3. Checkpoint — Photo upload working end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. PDF generation service and templates
  - [ ] 4.1 Install and configure `barryvdh/laravel-dompdf`
    - Add to `composer.json` and publish config
    - Configure A4 portrait as default paper size
    - _Requirements: 7.8_

  - [ ] 4.2 Create Blade PDF templates for session reports
    - Create `resources/views/pdf/session-individual.blade.php`
    - Create `resources/views/pdf/session-group.blade.php`
    - Include header: logo + "Olympus Training Surabaya X Unesa" + report title
    - Include sub-header: athlete name, date, session number, coach name
    - Include training blocks table (exercise | sets | reps | load | RPE)
    - Include photo thumbnail grid (3 per row) when photos exist — use "N/A" markers for missing data
    - Include footer: page N of M + generation timestamp
    - _Requirements: 2.1, 2.4, 2.5, 7.3, 7.4, 7.5, 7.6, 7.8, 8.7_

  - [ ] 4.3 Create Blade PDF template for microcycle reports
    - Create `resources/views/pdf/microcycle.blade.php`
    - Include aggregate metrics section (total load, avg RPE, session count)
    - Include individual session summary sections
    - Follow microcycle format from REFERENSIISMS reference implementation
    - _Requirements: 3.3, 3.4, 3.5, 7.3, 7.4, 7.5_

  - [ ] 4.4 Create `PdfGeneratorService` class
    - Implement `generateSessionPdf(session, requestingUser, locale): string` — returns PDF byte string
    - Implement `generateMicyclePdf(microcycle, requestingUser, locale): string`
    - Implement `requiresAsync(sessionCount, photoCount): bool` — true if count > 20 or estimated time > 10s
    - Apply role-based data filtering (athletes get only their own data; coaches get all)
    - Use DomPDF with Blade views; pass translated strings based on `$locale`
    - Throw `PdfGenerationException` on failure, generate partial PDF when data missing
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.6_

  - [ ]* 4.5 Write property test for PDF session fields completeness (Property 5)
    - **Property 5: PDF always contains required session fields**
    - Generate sessions with random exercise combinations; verify PDF byte string always contains date, all exercises, sets, reps, load, RPE
    - **Validates: Requirements 2.4**

  - [ ]* 4.6 Write property test for PDF locale matching (Property 8)
    - **Property 8: PDF locale matches user preference**
    - For each of three locales, generate a PDF and verify all static labels are in the correct language
    - **Validates: Requirements 2.8**

  - [ ]* 4.7 Write property test for PDF branding header (Property 12)
    - **Property 12: PDF branding header is present on all exports**
    - Generate PDFs of all types; verify "Olympus Training Surabaya X Unesa" string is present in each
    - **Validates: Requirements 7.3**

  - [ ]* 4.8 Write property test for PDF page size (Property 14)
    - **Property 14: PDF page size is always A4 portrait**
    - Generate PDFs and verify page dimensions match 210mm × 297mm
    - **Validates: Requirements 7.8**

  - [ ]* 4.9 Write property test for partial PDF generation (Property 26)
    - **Property 26: PDF generation with missing data produces partial PDF**
    - Generate sessions where optional fields are absent; verify PDF generation succeeds and missing sections are marked
    - **Validates: Requirements 8.7**

  - [ ]* 4.10 Write property test for group session PDF participant completeness (Property 6)
    - **Property 6: Group session PDF includes all participant data**
    - Generate group sessions with N participants; verify coach PDF includes data for all N
    - **Validates: Requirements 2.2**

  - [ ]* 4.11 Write property test for athlete PDF data isolation (Property 7)
    - **Property 7: Athlete PDF contains only their own data**
    - Generate group sessions with multiple athletes; verify athlete A PDF does not include athlete B data
    - **Validates: Requirements 2.3, 3.8**

- [ ] 5. Microcycle service and PDF caching
  - [ ] 5.1 Create `MicrocycleService` class
    - Implement `createMicrocycle(array $data, User $coach): Microcycle`
    - Implement `attachSession(Microcycle $microcycle, int $sessionId): void`
    - Implement `detachSession(Microcycle $microcycle, int $sessionId): void`
    - Implement `getAggregateMetrics(Microcycle $microcycle): array` — returns total_load, avg_rpe, session_count
    - _Requirements: 3.1, 3.4_

  - [ ]* 5.2 Write property test for microcycle aggregate metrics (Property 10)
    - **Property 10: Microcycle aggregate metrics are mathematically correct**
    - Generate microcycles with random session load/RPE data; verify computed totals/averages match expected math
    - **Validates: Requirements 3.4**

  - [ ]* 5.3 Write property test for microcycle PDF session inclusion (Property 9)
    - **Property 9: Microcycle PDF includes all sessions**
    - Generate microcycles with N sessions; verify PDF includes a summary for all N sessions
    - **Validates: Requirements 3.2, 3.5**

  - [ ] 5.4 Implement PDF caching logic
    - After generation, store PDF to `storage/app/private/pdfs/` and write entry to `pdf_cache` table
    - On PDF request, check `pdf_cache` for non-expired entry; return cached file if found (< 500ms target)
    - Implement cache key: `pdf:{type}:{resourceId}:{userId}:{locale}`
    - _Requirements: 9.8_

  - [ ] 5.5 Create `GeneratePdfJob` background job
    - Implement `ShouldQueue` with `$tries = 3` and `$timeout = 120`
    - Call `PdfGeneratorService` and store result via caching logic
    - Implement `failed()` to notify user via Inertia flash message and log with stack trace
    - _Requirements: 3.6, 9.5, 8.1_

  - [ ]* 5.6 Write property test for large microcycle async dispatch (Property 11)
    - **Property 11: Large microcycles are processed asynchronously**
    - Generate microcycles with > 20 sessions; verify PDF request dispatches background job and returns job_id without blocking
    - **Validates: Requirements 3.6, 9.5**

- [ ] 6. PDF and Microcycle API controllers
  - [ ] 6.1 Create `PdfController`
    - Implement `POST /pdf/session/{training}` — check cache, serve or dispatch async, return stream or job_id
    - Implement `POST /pdf/microcycle/{microcycle}` — same pattern with microcycle-level async threshold
    - Implement `GET /pdf/status/{job_id}` — return pending/ready/failed status with download_url when ready
    - Apply role-based authorization (HTTP 403 for athletes accessing others' data, HTTP 404 for missing resources)
    - _Requirements: 2.1, 2.2, 2.3, 3.2, 3.6, 9.5, 9.8_

  - [ ] 6.2 Create `MicrocycleController` with full CRUD
    - Implement `GET/POST /admin/microcycles` — index and store
    - Implement `GET/PUT/DELETE /admin/microcycles/{id}` — show, update, destroy (with cascade protection)
    - Implement `POST /admin/microcycles/{id}/sessions` — attach session
    - Implement `DELETE /admin/microcycles/{id}/sessions/{sessionId}` — detach session
    - Return HTTP 422 with business-level message when deleting microcycle-protected sessions
    - _Requirements: 3.1, 10.4_

  - [ ] 6.3 Register new routes in `web.php` and `api.php`
    - Add all microcycle and PDF routes with proper middleware (auth, role guards)
    - _Requirements: 2.1, 3.1_

- [ ] 7. Checkpoint — PDF generation and microcycle API working
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Validation improvements and error handling
  - [ ] 8.1 Add RPE and training load validation to form request classes
    - Validate RPE as integer between 1 and 10 in all relevant `FormRequest` classes
    - Validate training load as positive number (> 0)
    - _Requirements: 10.1, 10.2_

  - [ ]* 8.2 Write property test for RPE validation (Property 18)
    - **Property 18: RPE value validation enforces integer range 1-10**
    - Generate arbitrary RPE values; verify only integers 1–10 pass, all others are rejected with no DB write
    - **Validates: Requirements 10.1**

  - [ ]* 8.3 Write property test for training load validation (Property 19)
    - **Property 19: Training load validation enforces positive numbers**
    - Generate arbitrary load values including zero and negatives; verify they are always rejected
    - **Validates: Requirements 10.2**

  - [ ] 8.4 Add session date validation — reject future dates
    - Add `before_or_equal:today` rule to session submission form requests
    - _Requirements: 10.7_

  - [ ]* 8.5 Write property test for future date rejection (Property 21)
    - **Property 21: Future session dates are rejected**
    - Generate dates relative to today; verify any date after today is always rejected with validation error
    - **Validates: Requirements 10.7**

  - [ ] 8.6 Add minimum exercise requirement validation
    - Validate that at least one exercise is present in training session submissions
    - _Requirements: 10.3_

  - [ ] 8.7 Enhance global exception handler in `app/Exceptions/Handler.php`
    - Override `render()` to catch all exceptions in production; strip SQL/schema details from responses
    - Ensure all exceptions are logged with `context: ['user_id', 'route']` and full stack trace
    - Map known exceptions to appropriate HTTP codes (400, 403, 404, 422) — reserve 500 for truly unexpected
    - _Requirements: 8.1, 8.2, 8.4, 8.8_

  - [ ]* 8.8 Write property test for database error response safety (Property 24)
    - **Property 24: Database error responses do not expose schema**
    - Simulate DB failures; verify response body never contains SQL keywords or schema identifiers
    - **Validates: Requirements 8.2**

  - [ ] 8.9 Add referential integrity enforcement for training session deletion
    - In `IndividualTrainingController` and `GroupTrainingController` destroy methods, check for microcycle references before deletion
    - Return HTTP 422 with user-friendly message if session is referenced
    - _Requirements: 10.4_

  - [ ]* 8.10 Write property test for session deletion protection (Property 20)
    - **Property 20: Sessions referenced in microcycles cannot be deleted**
    - Generate sessions attached to microcycles; verify delete requests are always rejected
    - **Validates: Requirements 10.4**

  - [ ] 8.11 Add pagination to training session list endpoints
    - Ensure all training session list queries use pagination with maximum 50 items per page
    - _Requirements: 9.3_

  - [ ]* 8.12 Write property test for pagination bounds (Property 23)
    - **Property 23: Pagination enforces maximum 50 items per page**
    - Generate lists of arbitrary size; verify each page response contains at most 50 items
    - **Validates: Requirements 9.3**

  - [ ] 8.13 Update `proof_photo` deletion to clean up DB references
    - When a photo is deleted from the filesystem, update or nullify the `proof_photo` column in `group_training_members`
    - _Requirements: 10.6_

- [ ] 9. Multi-language support
  - [ ] 9.1 Create and complete PHP translation files for all three locales
    - Create/update `lang/id/`, `lang/en/`, `lang/pt/` with all keys for: labels, placeholders, titles, buttons, tooltips, alerts, modals, navigation, footer
    - Replace all occurrences of "Integrated System Monitoring System" with "Olympus Training Surabaya X Unesa" in translation files and Blade layouts
    - _Requirements: 6.1, 6.2, 6.6_

  - [ ] 9.2 Create and complete backend validation translation files
    - Add translated validation messages and API response messages to `lang/id/validation.php`, `lang/en/validation.php`, `lang/pt/validation.php`
    - _Requirements: 6.3_

  - [ ] 9.3 Create `LocaleService` class
    - Implement `getUserLocale(User $user): string`
    - Implement `updateUserLocale(User $user, string $locale): void` — updates DB and refreshes Inertia shared props
    - Implement `formatDate(Carbon $date, string $locale): string` — DD/MM/YYYY for id, MM/DD/YYYY for en, DD/MM/YYYY for pt
    - Implement `formatNumber(float $number, string $locale, int $decimals = 2): string`
    - _Requirements: 6.5, 6.7, 6.8_

  - [ ]* 9.4 Write property test for translation completeness (Property 16)
    - **Property 16: Translation completeness across all locales**
    - Enumerate all translation keys used in frontend and backend; verify all three locale files contain non-empty strings for each key
    - **Validates: Requirements 6.2, 6.3**

  - [ ]* 9.5 Write property test for locale formatting (Property 17)
    - **Property 17: Locale formatting produces locale-appropriate output**
    - Generate random dates and numbers; verify formatted output matches expected conventions for each locale
    - **Validates: Requirements 6.5**

  - [ ] 9.6 Create `PATCH /user/language` endpoint
    - Implement controller action to update `language_preference` in DB
    - Refresh Inertia shared props so frontend re-renders with new locale without page reload
    - _Requirements: 6.7, 6.8_

  - [ ] 9.7 Update email templates for multi-language support
    - Create locale-specific email Blade views (id/en/pt variations or locale-aware single templates)
    - _Requirements: 6.4_

- [ ] 10. Frontend: Session recap and PDF download
  - [ ] 10.1 Create shared `PdfDownloadButton` React component
    - Accept `endpoint`, `filename`, `label` props
    - Show loading spinner during PDF request
    - Display error message on failure
    - Open PDF in new tab or trigger file download on success
    - Use Tailwind with `slate`/`zinc`/`neutral` palette, support `dark:` variants
    - _Requirements: 4.2, 4.3, 4.4, 5.1, 5.5_

  - [ ] 10.2 Create/enhance `SessionRecap` component for individual training
    - At `Admin/IndividualTrainings/SessionRecap.jsx`
    - Display summary header (date, location, trainer)
    - Render block/exercise table with sets, reps, load, RPE
    - Render photo thumbnails with `loading="lazy"` when photos exist
    - Include `PdfDownloadButton` when `canDownloadPdf` is true
    - Apply UI_Theme styling: `slate`/`zinc`/`neutral` colors, dark mode `dark:` classes, allowed border-radius only
    - Use `t()` from `useTranslation()` hook for all visible text
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

  - [ ] 10.3 Create/enhance `SessionRecap` component for group training
    - At `Admin/GroupTrainings/SessionRecap.jsx`
    - Same structure as individual; include photo evidence display for athlete's own photo
    - _Requirements: 1.3, 1.4, 1.5, 4.1, 4.2, 4.3, 4.7_

  - [ ] 10.4 Create `MicrocycleManager` React component
    - UI to create/name a microcycle, assign sessions, request batch PDF, view aggregate metrics
    - Wire to microcycle API endpoints
    - Apply theme conventions
    - _Requirements: 3.1, 3.2, 3.4, 5.1, 5.5_

  - [ ] 10.5 Implement `ThemeProvider` and `useTheme()` hook
    - Read/write dark/light preference from `localStorage`
    - Sync with `data-theme` attribute on `<html>` element
    - _Requirements: 5.5, 5.6_

  - [ ] 10.6 Implement `useTranslation()` hook and language switcher UI
    - Consume translation bag from Inertia shared props
    - Language switcher calls `PATCH /user/language` and updates shared props reactively
    - _Requirements: 6.1, 6.2, 6.8_

- [ ] 11. UI/UX theme consistency sweep
  - [ ] 11.1 Audit and update all existing Blade and React components for theme compliance
    - Replace any non-allowed color palettes with `slate`/`zinc`/`neutral`
    - Add `dark:` prefix classes to all background, text, and border utilities
    - Replace disallowed border-radius values with `rounded-sm`, `rounded-md`, `rounded-lg`, or `rounded-xl`
    - Remove all `tracking-wider` and `tracking-widest` utilities
    - Change uppercase labels on repeated/lengthy content to CamelCase or Sentence case
    - Replace muted status colors per design conventions
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.7, 5.8_

  - [ ] 11.2 Update footer text in Blade layouts
    - Replace all occurrences of "Integrated System Monitoring System" with "Olympus Training Surabaya X Unesa"
    - _Requirements: 6.6_

  - [ ]* 11.3 Write snapshot tests for `SessionRecap` in light and dark mode
    - Capture render snapshots for both themes; verify stable rendering
    - _Requirements: 4.5, 4.6, 5.5, 5.6_

  - [ ]* 11.4 Write snapshot tests for `PdfDownloadButton` per role
    - Verify button is visible for coaches and session-owner athletes, hidden otherwise
    - _Requirements: 4.2, 4.3_

- [ ] 12. Authorization — photo visibility for coaches and superadmins
  - [ ] 12.1 Update group training session view responses to include all member photos for coaches/superadmins
    - In the relevant controller/policy, ensure `proof_photo` is included in the response for authorized roles
    - Apply athlete-scoped filtering for athlete role (own photo only)
    - _Requirements: 1.3, 1.4, 1.5_

  - [ ]* 12.2 Write property test for photo visibility authorization (Property 3)
    - **Property 3: All photos are visible to authorized viewers**
    - Generate sessions with N members with photos; verify coach/superadmin API response includes all N photo references
    - **Validates: Requirements 1.3, 1.4**

  - [ ]* 12.3 Write property test for athlete photo isolation (Property 4)
    - **Property 4: Athletes only see their own photo**
    - Generate sessions with athletes A and B; verify A's response contains only A's photo reference
    - **Validates: Requirements 1.5**

- [ ] 13. Performance optimization
  - [ ] 13.1 Add 5-minute caching for frequently accessed training data
    - Wrap frequently accessed queries (session lists, block/item queries) with `Cache::remember()` using 300-second TTL
    - _Requirements: 9.4_

  - [ ] 13.2 Enable lazy-loading for photo thumbnails in all listing views
    - Ensure all `<img>` tags for `proof_photo` thumbnails use `loading="lazy"` attribute
    - _Requirements: 9.2_

- [ ] 14. Final checkpoint — Full integration and all tests passing
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property tests use the [eris/eris](https://github.com/giorgiosironi/eris) PHP property-based testing library
- Property test files should be tagged with comments in the format: `// Feature: training-system-improvements, Property N: [Title]`
- Checkpoints at steps 3, 7, and 14 provide natural validation milestones
- The design uses DomPDF (`barryvdh/laravel-dompdf`) — install via Composer before beginning PDF tasks
- Photo compression uses `Intervention/Image` — ensure it is installed before beginning task 2.4

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4"] },
    { "id": 1, "tasks": ["1.5", "1.6", "4.1"] },
    { "id": 2, "tasks": ["2.1", "5.4", "9.1", "9.2", "9.3"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4", "5.1", "8.1", "8.4", "8.6", "9.4", "9.5", "9.6", "9.7"] },
    { "id": 4, "tasks": ["2.5", "2.6", "2.8", "5.2", "5.3", "8.2", "8.3", "8.5", "8.7", "8.9", "8.11", "4.2", "4.3"] },
    { "id": 5, "tasks": ["2.7", "2.9", "5.5", "8.8", "8.10", "8.12", "8.13", "4.4", "4.5", "4.6", "4.7", "4.8", "4.9", "4.10", "4.11", "9.6"] },
    { "id": 6, "tasks": ["5.6", "6.1", "6.2", "6.3", "10.5", "10.6"] },
    { "id": 7, "tasks": ["10.1", "10.2", "10.3", "10.4", "12.1", "13.1", "13.2"] },
    { "id": 8, "tasks": ["11.1", "11.2", "12.2", "12.3"] },
    { "id": 9, "tasks": ["11.3", "11.4"] }
  ]
}
```
