# Requirements Document

## Introduction

This document specifies the requirements for improving the athlete performance tracking system. The system is a Laravel-based web application that enables athletes, coaches, and superadmins to manage training programs, track wellness metrics, and generate performance reports. This specification addresses critical issues with photo evidence storage in group training, adds PDF export capabilities for training sessions and microcycles, enhances session recap functionality, and improves overall system UI/UX consistency.

## Glossary

- **System**: The Athlete Performance Tracking Web Application
- **Photo_Storage_Service**: The file storage subsystem responsible for persisting photo evidence
- **Group_Training_Module**: The subsystem managing group training programs and sessions
- **Individual_Training_Module**: The subsystem managing one-on-one training programs and sessions
- **PDF_Generator**: The subsystem responsible for generating PDF reports
- **Session_Recap_Interface**: The user interface component displaying post-training session summaries
- **Microcycle**: A training package consisting of multiple related training sessions (typically 1 week duration)
- **Photo_Evidence**: Digital image files uploaded by athletes as proof of training completion
- **Coach**: A user with permissions to create training programs and view athlete data
- **Superadmin**: A user with full system access and administrative privileges
- **Athlete**: A user who participates in training programs and submits training data
- **UI_Theme**: The visual design system including colors, typography, spacing, and dark/light mode styles
- **Training_Session**: A single training event with exercises, RPE data, and optional photo evidence
- **Database**: The persistent data storage layer (MySQL/PostgreSQL)
- **File_System**: The server storage location for uploaded files

## Requirements

### Requirement 1: Group Training Photo Evidence Storage

**User Story:** As an athlete, I want my photo evidence to be saved and viewable in group training programs, so that I can prove training completion and review my submissions.

#### Acceptance Criteria

1. WHEN an Athlete uploads Photo_Evidence in a group training session, THE Photo_Storage_Service SHALL persist the file to File_System
2. WHEN an Athlete uploads Photo_Evidence in a group training session, THE System SHALL store the file path reference in Database
3. WHEN a Coach views a group training session with Photo_Evidence, THE System SHALL display all uploaded photos
4. WHEN a Superadmin views a group training session with Photo_Evidence, THE System SHALL display all uploaded photos
5. WHEN an Athlete views their own group training session submission, THE System SHALL display their uploaded Photo_Evidence
6. WHEN Photo_Evidence upload fails, THE System SHALL return a descriptive error message to the Athlete
7. THE System SHALL validate Photo_Evidence file format before storage (JPEG, PNG, WEBP)
8. THE System SHALL validate Photo_Evidence file size does not exceed 10MB before storage

### Requirement 2: Per-Session PDF Export

**User Story:** As a coach, I want to download individual training session reports as PDF, so that I can review and share session details offline.

#### Acceptance Criteria

1. WHEN a Coach requests a PDF export for an Individual_Training_Module session, THE PDF_Generator SHALL create a PDF using the individual training format from reference system
2. WHEN a Coach requests a PDF export for a Group_Training_Module session, THE PDF_Generator SHALL create a PDF containing all participant data
3. WHEN an Athlete requests a PDF export for their own session, THE PDF_Generator SHALL create a PDF containing only their personal data
4. THE PDF_Generator SHALL include session date, exercises performed, sets, reps, load, and RPE data in the export
5. WHERE Photo_Evidence exists for the session, THE PDF_Generator SHALL include photo thumbnails in the export
6. THE System SHALL generate the PDF file within 30 seconds for sessions with up to 50 exercises
7. WHEN PDF generation fails, THE System SHALL return a descriptive error message
8. THE System SHALL include multi-language support (Indonesian, English, Portuguese) in PDF exports based on user preference

### Requirement 3: Microcycle Batch PDF Export

**User Story:** As a coach, I want to download batch reports for training microcycles, so that I can analyze training packages holistically.

#### Acceptance Criteria

1. THE System SHALL allow grouping of related Training_Sessions into a Microcycle
2. WHEN a Coach requests a PDF export for a Microcycle, THE PDF_Generator SHALL create a consolidated PDF report for all sessions in that Microcycle
3. THE PDF_Generator SHALL use the microcycle report format from the reference system (REFERENSIISMS/ISMS)
4. THE PDF_Generator SHALL include aggregate metrics (total load, average RPE, session count) in the Microcycle report
5. THE PDF_Generator SHALL include individual session summaries within the Microcycle report
6. WHEN a Microcycle contains more than 20 sessions, THE System SHALL generate the PDF in background and notify the user upon completion
7. THE System SHALL generate Microcycle PDF files within 60 seconds for microcycles with up to 20 sessions
8. WHEN an Athlete requests their own Microcycle PDF, THE PDF_Generator SHALL include only their personal data from that Microcycle

### Requirement 4: Session Recap Interface Enhancement

**User Story:** As an athlete, I want an improved session recap interface with PDF download, so that I can review my training summary and save it for my records.

#### Acceptance Criteria

1. WHEN a Training_Session is completed, THE Session_Recap_Interface SHALL display session summary including exercises, performance metrics, and RPE
2. THE Session_Recap_Interface SHALL provide a PDF download button for Athletes
3. THE Session_Recap_Interface SHALL provide a PDF download button for Coaches viewing any athlete's session
4. WHEN the PDF download button is clicked, THE System SHALL invoke PDF_Generator with the current session data
5. THE Session_Recap_Interface SHALL apply consistent UI_Theme styling matching the rest of the System
6. THE Session_Recap_Interface SHALL support dark mode and light mode themes
7. WHERE Photo_Evidence exists, THE Session_Recap_Interface SHALL display photo thumbnails in the recap
8. THE Session_Recap_Interface SHALL display content in the user's selected language (Indonesian, English, Portuguese)

### Requirement 5: UI/UX Theme Consistency

**User Story:** As a user of any role, I want consistent visual design throughout the system, so that the interface feels cohesive and professional.

#### Acceptance Criteria

1. THE System SHALL use the Shadcn UI component library with slate/zinc/neutral color palette
2. THE System SHALL limit border radius to rounded-sm, rounded-md, rounded-lg, or rounded-xl only
3. THE System SHALL not use tracking-wider or tracking-widest text utilities
4. THE System SHALL not use uppercase text for lengthy content or repeated UI elements
5. THE System SHALL provide dark mode styling using Tailwind dark: prefix for all components
6. WHEN a user switches between light and dark mode, THE System SHALL maintain readable contrast ratios (minimum WCAG AA) for all text
7. THE System SHALL use muted colors for status indicators (success, error, warning)
8. THE System SHALL use CamelCase or Sentence case for UI labels instead of UPPERCASE

### Requirement 6: Multi-Language Support Completeness

**User Story:** As a user, I want the entire interface available in my preferred language, so that I can use the system comfortably in Indonesian, English, or Portuguese.

#### Acceptance Criteria

1. THE System SHALL support three languages: Indonesian (ID), English (EN), and Portuguese (PT)
2. THE System SHALL translate all frontend labels, placeholders, titles, buttons, tooltips, alerts, modals, navigation, and footer text
3. THE System SHALL translate all backend validation messages and API response messages
4. THE System SHALL translate all email templates based on recipient language preference
5. THE System SHALL format dates and numbers according to the selected locale
6. THE System SHALL replace all footer text "Integrated System Monitoring System" with "Olympus Training Surabaya X Unesa"
7. THE System SHALL store user language preference in Database
8. WHEN a user changes language preference, THE System SHALL update all interface text without requiring page reload

### Requirement 7: PDF Format Consistency and Reference

**User Story:** As a coach, I want PDF exports to follow established formatting standards, so that reports are professional and familiar to stakeholders.

#### Acceptance Criteria

1. THE PDF_Generator SHALL parse the individual training PDF format specification from REFERENSIISMS/ISMS reference implementation
2. THE PDF_Generator SHALL parse the microcycle PDF format specification from REFERENSIISMS/ISMS reference implementation
3. THE PDF_Generator SHALL include header branding "Olympus Training Surabaya X Unesa" on all generated PDFs
4. THE PDF_Generator SHALL include page numbers on multi-page PDFs
5. THE PDF_Generator SHALL include generation timestamp on all PDFs
6. THE PDF_Generator SHALL maintain consistent typography, spacing, and table formatting across all PDF types
7. WHERE charts or graphs are included, THE PDF_Generator SHALL render them with print-optimized resolution (minimum 300 DPI)
8. THE PDF_Generator SHALL generate PDFs in portrait orientation with A4 page size

### Requirement 8: Error Handling and System Stability

**User Story:** As a superadmin, I want all existing system errors resolved, so that users have a reliable and stable experience.

#### Acceptance Criteria

1. THE System SHALL log all unhandled exceptions to the application log with stack trace and timestamp
2. WHEN a database query fails, THE System SHALL return a user-friendly error message without exposing database structure
3. WHEN file upload fails due to permission issues, THE System SHALL log the error and return a descriptive message to the user
4. THE System SHALL validate all user input before processing to prevent SQL injection and XSS attacks
5. WHEN the File_System is unavailable, THE System SHALL queue photo uploads for retry and notify the user
6. THE System SHALL handle concurrent photo uploads from multiple Athletes without data corruption
7. WHEN PDF_Generator encounters missing data, THE System SHALL generate partial PDF with clear indication of missing sections
8. THE System SHALL return HTTP 500 errors only when absolutely necessary, preferring specific error codes (400, 403, 404, 422)

### Requirement 9: Performance Optimization

**User Story:** As an athlete, I want fast page loads and responsive interactions, so that I can complete my training logging efficiently.

#### Acceptance Criteria

1. WHEN an Athlete navigates to the Session_Recap_Interface, THE System SHALL render the page within 2 seconds on 3G connection
2. THE System SHALL lazy-load Photo_Evidence thumbnails to improve initial page render time
3. WHEN displaying a list of Training_Sessions, THE System SHALL implement pagination with maximum 50 items per page
4. THE System SHALL cache frequently accessed training data for 5 minutes to reduce Database queries
5. THE PDF_Generator SHALL use asynchronous processing for PDFs expected to take longer than 10 seconds
6. THE System SHALL compress Photo_Evidence to maximum 1920x1080 resolution while maintaining quality above 85%
7. WHEN multiple users request PDF generation simultaneously, THE System SHALL queue requests and process them sequentially
8. THE System SHALL return cached PDF files within 500ms when the same report is requested within 10 minutes

### Requirement 10: Data Integrity and Validation

**User Story:** As a coach, I want accurate and complete training data, so that my analysis and recommendations are based on reliable information.

#### Acceptance Criteria

1. THE System SHALL validate that RPE values are integers between 1 and 10 before storage
2. THE System SHALL validate that training load values are positive numbers before storage
3. WHEN an Athlete submits a Training_Session, THE System SHALL require at least one exercise to be completed
4. THE System SHALL prevent deletion of Training_Sessions that are referenced in Microcycle reports
5. THE System SHALL maintain referential integrity between Training_Session and Photo_Evidence records
6. WHEN Photo_Evidence file is deleted from File_System, THE System SHALL update or remove the corresponding Database reference
7. THE System SHALL validate that session date is not in the future before allowing submission
8. THE System SHALL validate Photo_Evidence file type using both extension and MIME type verification
