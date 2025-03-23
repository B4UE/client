# [Health Objective Assistant] PRD
**File:** prd_03-23-2025_original.mdc

## Overview
- **Project Description**  
  A Next.js web application with a Flask backend that helps users define and track health objectives and make better day-to-day food choices. It leverages an LLM for interactive guidance and an image recognition service for scanning food items.

## User Requirements
- **User Personas**  
  1. **Health Enthusiast**: Wants general guidance for a healthier lifestyle (e.g., losing weight, building muscle).  
  2. **Diet-Constrained Individual**: Has a specific dietary restriction or allergy (e.g., gluten-free, seafood allergy).  
  3. **Medical Condition Manager**: Needs to track specific metrics (e.g., blood sugar, cholesterol) to comply with medical advice.

- **User Stories**  
  1. *As a Health Enthusiast*, I want to define my weight-loss goals in a simple manner so the app can provide diet recommendations.  
  2. *As a Diet-Constrained Individual*, I want to scan a food item’s image and know immediately if it violates my restrictions.  
  3. *As a Medical Condition Manager*, I want to input my latest lab values (or upload test results) so the system can refine its dietary advice.

## Technical Requirements
- **Architecture**  
  1. **Frontend**: Next.js deployed on Vercel.  
  2. **Backend**: Flask (could be deployed on Heroku or similar).  
  3. **Local Data Storage**: All user objectives, metrics, and scanned items stored in browser storage (no external database).  
  4. **LLM Integration**: A dedicated endpoint in the Flask backend to communicate with an LLM API. The LLM should present pre-written or “canned” answers whenever relevant to speed up the conversation, while still allowing for custom responses when necessary.

- **APIs**  
  1. **POST /api/define-objective**  
     - **Purpose**: Receives user’s draft objective and relevant health metrics.  
     - **Request Body**: `{ objective: string, metrics: array or object }`  
     - **Response**: `{ status: 'success', refinedObjective: string, refinedMetrics: object }`  
  2. **POST /api/scan-food**  
     - **Purpose**: Receives an image or image URL for food identification, and user’s current objectives.  
     - **Request Body**: `{ imageFile: binary or base64, objectives: string }`  
     - **Response**: `{ status: 'success', isAllowed: boolean, reason: string }`  
  3. **POST /api/chat**  
     - **Purpose**: General endpoint for user-LLM interaction (e.g., clarifications, daily usage).  
     - **Request Body**: `{ userMessage: string, context: object }`  
     - **Response**: `{ status: 'success', botResponse: string }`

- **Data Models**  
  1. **Objective**  
     - **Description**: A short statement of the user’s goal or constraint (e.g., “Lose 10 lbs in 3 months”).  
  2. **User Metrics**  
     - **Description**: Various metrics relevant to the objective (e.g., weight, allergies, specific lab values).  
     - **Source**: Free text input, images/PDFs of lab reports.  
  3. **Scanned Food Item**  
     - **Description**: Analyzed result of the image recognition and LLM classification, saved locally for future reference.  
     - **Fields**:  
       - Name/Label (optional if recognized)  
       - Date/Time of scan  
       - Outcome (“Good” or “Bad”)  
       - Reason (e.g., “Contains seafood, violates allergy objective”)

- **Security**  
  1. No centralized database or authentication – user data is stored locally in the browser.  
  2. SSL/TLS (HTTPS) should be enforced for all communications with the backend.  
  3. Minimizing personally identifiable information (PII) storage and ensuring ephemeral handling of uploaded images.

## Design Requirements
- **UI/UX Guidelines**  
  1. **Conversational Flow**: A single-screen interface with a chat box for both day-to-day use and creating new objectives.  
  2. **Visual Feedback**: Playful animations and sounds for scanning results:  
     - “Good Item” → celebratory animation and positive sound.  
     - “Bad Item” → buzzer sound and “X” mark or red overlay.  
  3. **Minimal UI**: Focus on clarity and ease of use, with short instructions or prompts at each step.

- **Single Screen Layout**  
  1. **Objectives List**: A list of current objectives at the top, each with an option to delete.  
  2. **Add Objective Button**: Triggers the new objective flow within the same chat box.  
  3. **Chat Box**: Central area for user-LLM interactions, including:  
     - Creating/refining new objectives.  
     - Daily conversation (e.g., “Can I buy this?”, “Can I eat that?”).  
     - Image scanning interactions.  
  4. **Scanned Items History**:  
     - A section (or list) in the same interface showing previously scanned items, their “good” or “bad” status, and the reason linked to the user’s objectives.  
     - User can review past scans at any time.

## Plan
- **Phases**  
  1. **Definition & Setup**  
  2. **Objective Configuration**  
  3. **Daily Use Features**  
  4. **Deployment & Testing**

### Phase 1: Definition & Setup
- **Step 1**: Project Kickoff
  - [ ] **Task**: Initialize Next.js project  
  - [ ] **Task**: Initialize Flask backend project  
  - [ ] **Task**: Set up local storage utilities for browser

- **Step 2**: Basic Architecture & Endpoints  
  - [ ] **Task**: Create `/api/define-objective` endpoint skeleton in Flask  
  - [ ] **Task**: Create `/api/chat` endpoint skeleton in Flask  
  - [ ] **Task**: Create `/api/scan-food` endpoint skeleton in Flask  

### Phase 2: Objective Configuration
- **Step 1**: LLM Chat Integration  
  - [ ] **Task**: Implement front-end chat UI for the user’s objective definition flow  
  - [ ] **Task**: Connect chat UI to `/api/chat` for LLM guidance  
  - [ ] **Task**: Store refined objectives and metrics in browser storage

- **Step 2**: User Metrics Capture  
  - [ ] **Task**: Create simple UI to manually enter user metrics  
  - [ ] **Task**: Add option to upload files (images/PDFs) for metrics  
  - [ ] **Task**: Ensure these details are passed to LLM for guidance

### Phase 3: Daily Use Features
- **Step 1**: Food Scanning  
  - [ ] **Task**: Implement image upload or camera capture in front-end  
  - [ ] **Task**: Integrate with an image recognition service (via `/api/scan-food`)  
  - [ ] **Task**: Display real-time feedback with animations/sounds based on scanning result  
  - [ ] **Task**: Save scanned item details (name/label if available, date/time, outcome, reason) in local storage

- **Step 2**: Continuous LLM Guidance  
  - [ ] **Task**: Allow the user to chat with the LLM for daily check-ins or meal advice  
  - [ ] **Task**: Provide an option to update objectives or metrics if needed  
  - [ ] **Task**: Display a history of scanned items with their outcomes and reasons

### Phase 4: Deployment & Testing
- **Step 1**: Deployment Setup  
  - [ ] **Task**: Deploy Next.js to Vercel  
  - [ ] **Task**: Deploy Flask backend (e.g., Heroku or similar)  
  - [ ] **Task**: Configure environment variables (API keys, etc.) for LLM integration

- **Step 2**: QA & Feedback Loop  
  - [ ] **Task**: Conduct end-to-end testing on objective definition and food scanning  
  - [ ] **Task**: Iterate on UI/UX improvements based on test feedback  
  - [ ] **Task**: Finalize and release MVP
